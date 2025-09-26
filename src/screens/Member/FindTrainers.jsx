import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, FlatList, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth0 } from 'react-native-auth0';
import apiClient from '../../api/apiClient'; // Adjust path if necessary
import * as trainerService from '../../api/trainerService'; // Adjust path if necessary

const FindTrainers = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCredentials } = useAuth0();

  const fetchTrainers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await trainerService.browseTrainers({ page: 1, limit: 10 });
      const formattedTrainers = result.trainers.map(profile => ({
        id: profile.user.id,
        name: profile.user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
        specialty: 'Fitness Expert',
        experience: `${profile.experience || 0} years`,
        rating: 4.8,
        price: '$50/session',
        location: 'Online',
        description: profile.bio || 'No biography available.',
        isOnline: true,
      }));
      setTrainers(formattedTrainers);
    } catch (err) {
      setError('Failed to load trainers. Please try again later.');
      console.error("Fetch Trainers Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const startConversation = async (trainerId) => {
    try {
      const creds = await getCredentials();
      const res = await apiClient.post('/chat/conversations', { recipientId: trainerId }, { headers: { Authorization: `Bearer ${creds.accessToken}` } });
      return res.data.data;
    } catch (err) {
      console.error('Start conversation error:', err.response?.data || err.message);
      return null;
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const creds = await getCredentials();
      const res = await apiClient.get(`/chat/conversations/${conversationId}/messages`, { headers: { Authorization: `Bearer ${creds.accessToken}` } });
      return res.data.data || [];
    } catch (err) {
      console.error('Fetch messages error:', err.response?.data || err.message);
      return [];
    }
  };

  const sendMessageToBackend = async (conversationId, content) => {
    try {
      const creds = await getCredentials();
      const res = await apiClient.post(`/chat/conversations/${conversationId}/messages`, { content }, { headers: { Authorization: `Bearer ${creds.accessToken}` } });
      return res.data.data;
    } catch (err) {
      console.error('Send message error:', err.response?.data || err.message);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!chatMessage.trim() || !selectedTrainer) return;
    const newMsg = await sendMessageToBackend(selectedTrainer.conversationId, chatMessage);
    if (newMsg) {
      setChatMessages(prev => ({ ...prev, [selectedTrainer.id]: [...(prev[selectedTrainer.id] || []), newMsg] }));
    }
    setChatMessage('');
  };

  const renderTrainerChat = () => {
    const messages = chatMessages[selectedTrainer.id] || [];
    return (
      <View style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedTrainer(null)}>
            <Icon name="arrow-back" size={24} color="#FFC107" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatTrainerName}>{selectedTrainer.name}</Text>
            <View style={styles.chatOnlineStatus}>
              <View style={[styles.statusDot, { backgroundColor: selectedTrainer.isOnline ? '#4CAF50' : '#999' }]} />
              <Text style={styles.chatStatusText}>{selectedTrainer.isOnline ? 'Online' : 'Offline'}</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => item._id?.toString() || index.toString()}
          style={styles.messagesList}
          renderItem={({ item }) => (
            <View style={[styles.messageContainer, item.senderId === 'user' ? styles.userMessage : styles.trainerMessage]}>
              <Text style={[styles.messageText, item.senderId === 'user' ? styles.userMessageText : styles.trainerMessageText]}>
                {item.content || item.text}
              </Text>
              <Text style={styles.messageTime}>
                {new Date(item.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            value={chatMessage}
            onChangeText={setChatMessage}
            multiline
            maxLength={500}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={!chatMessage.trim()}>
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (selectedTrainer) return renderTrainerChat();
  
  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.infoText}>{error}</Text>
        <TouchableOpacity onPress={fetchTrainers} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (trainers.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.infoText}>No trainers found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.trainersList}>
      {trainers.map(trainer => (
        <TouchableOpacity
          key={trainer.id}
          style={styles.trainerCard}
          onPress={async () => {
            const conversation = await startConversation(trainer.id);
            if (conversation) {
              const msgs = await fetchMessages(conversation._id);
              setChatMessages(prev => ({ ...prev, [trainer.id]: msgs }));
              setSelectedTrainer({ ...trainer, conversationId: conversation._id });
            }
          }}
        >
          <View style={styles.trainerHeader}>
            <View style={styles.trainerInfo}>
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <View style={styles.onlineStatus}>
                <View style={[styles.statusDot, { backgroundColor: trainer.isOnline ? '#4CAF50' : '#999' }]} />
                <Text style={styles.statusText}>{trainer.isOnline ? 'Online' : 'Offline'}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFC107" />
              <Text style={styles.rating}>{trainer.rating}</Text>
            </View>
          </View>
          <Text style={styles.specialty}>{trainer.specialty}</Text>
          <View style={styles.trainerDetails}>
            <View style={styles.detailItem}>
              <Icon name="time-outline" size={16} color="#FFC107" />
              <Text style={styles.detailText}>{trainer.experience}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="card-outline" size={16} color="#FFC107" />
              <Text style={styles.detailText}>{trainer.price}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="location-outline" size={16} color="#FFC107" />
              <Text style={styles.detailText}>{trainer.location}</Text>
            </View>
          </View>
          <Text style={styles.trainerDescription}>{trainer.description}</Text>
          <TouchableOpacity style={styles.chatButton}>
            <Icon name="chatbubble-outline" size={18} color="#001f3f" />
            <Text style={styles.chatButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainersList: {
    gap: 15,
  },
  trainerCard: {
    backgroundColor: '#002b5c',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  trainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#FFC107',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC107',
    marginLeft: 4,
  },
  specialty: {
    fontSize: 16,
    color: '#FFC107',
    fontWeight: '600',
    marginBottom: 12,
  },
  trainerDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#FFC107',
    marginLeft: 8,
  },
  trainerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
    lineHeight: 20,
  },
  chatButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#002b5c',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 193, 7, 0.3)',
  },
  backButton: {
    marginRight: 15,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatTrainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  chatOnlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatStatusText: {
    fontSize: 12,
    color: '#FFC107',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFC107',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  trainerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#002b5c',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#001f3f',
    fontWeight: '600',
  },
  trainerMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#002b5c',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 193, 7, 0.2)',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#001f3f',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#FFC107',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FindTrainers;