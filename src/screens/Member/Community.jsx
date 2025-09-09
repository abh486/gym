import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, StatusBar, SafeAreaView, TextInput, FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const Community = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});

  // ✅ Updated Icons — using Ionicons
  const tabs = [
    { id: 'groups', title: 'Fitness Groups', icon: 'people-outline' },
    { id: 'trainers', title: 'Find Trainers', icon: 'fitness-outline' },
  ];

  const fitnessGroups = [
    {
      id: 1,
      name: "Morning Runners Club",
      members: 128,
      activity: "Running",
      meetingTime: "6:00 AM Daily",
      location: "Central Park",
      description: "Join our morning running group for daily cardio workouts and social fitness fun!"
    },
    {
      id: 2,
      name: "Weightlifting Warriors",
      members: 89,
      activity: "Strength Training",
      meetingTime: "7:00 PM Mon/Wed/Fri",
      location: "Downtown Fitness",
      description: "Serious lifters supporting each other in strength training goals."
    },
    {
      id: 3,
      name: "Yoga Flow Community",
      members: 156,
      activity: "Yoga",
      meetingTime: "6:30 PM Tue/Thu",
      location: "Zen Studio",
      description: "Mindful yoga sessions for all levels in a supportive environment."
    }
  ];

  const trainers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Weight Loss & Cardio",
      experience: "5 years",
      rating: 4.9,
      price: "$50/session",
      location: "Downtown Gym",
      description: "Certified personal trainer specializing in weight loss and cardiovascular fitness.",
      isOnline: true
    },
    {
      id: 2,
      name: "Mike Chen",
      specialty: "Strength Training",
      experience: "8 years",
      rating: 4.8,
      price: "$60/session",
      location: "Iron Paradise Gym",
      description: "Former powerlifter turned trainer. Expert in building strength and muscle mass.",
      isOnline: false
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      specialty: "Yoga & Flexibility",
      experience: "6 years",
      rating: 4.9,
      price: "$45/session",
      location: "Zen Wellness Center",
      description: "Certified yoga instructor and flexibility coach for all levels.",
      isOnline: true
    },
    {
      id: 4,
      name: "David Kim",
      specialty: "HIIT & CrossFit",
      experience: "4 years",
      rating: 4.7,
      price: "$55/session",
      location: "CrossFit Box",
      description: "High-intensity interval training specialist and CrossFit Level 2 trainer.",
      isOnline: true
    }
  ];

  const sendMessage = () => {
    if (chatMessage.trim() && selectedTrainer) {
      const newMessage = {
        id: Date.now(),
        text: chatMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedTrainer.id]: [
          ...(prev[selectedTrainer.id] || []),
          newMessage
        ]
      }));

      setChatMessage('');

      // Simulate trainer response
      setTimeout(() => {
        const trainerResponse = {
          id: Date.now() + 1,
          text: "Thanks for your message! I'll get back to you with a detailed response shortly.",
          sender: 'trainer',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => ({
          ...prev,
          [selectedTrainer.id]: [
            ...(prev[selectedTrainer.id] || []),
            trainerResponse
          ]
        }));
      }, 1000);
    }
  };

  const renderGroupsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.groupsList}>
        {fitnessGroups.map((group) => (
          <TouchableOpacity key={group.id} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMembers}>{group.members} members</Text>
            </View>
            <Text style={styles.groupActivity}>{group.activity}</Text>
            <View style={styles.groupDetails}>
              <View style={styles.detailItem}>
                <Icon name="time-outline" size={16} color="#FFC107" />
                <Text style={styles.detailText}>{group.meetingTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="location-outline" size={16} color="#FFC107" />
                <Text style={styles.detailText}>{group.location}</Text>
              </View>
            </View>
            <Text style={styles.groupDescription}>{group.description}</Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Group</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTrainersTab = () => {
    if (selectedTrainer) {
      return renderTrainerChat();
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.trainersList}>
          {trainers.map((trainer) => (
            <TouchableOpacity 
              key={trainer.id} 
              style={styles.trainerCard}
              onPress={() => setSelectedTrainer(trainer)}
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
                  <Text style={styles.detailText}>{trainer.experience} experience</Text>
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
                <Icon name="chatbubble-outline" size={18} color="white" />
                <Text style={styles.chatButtonText}>Start Chat</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderTrainerChat = () => {
    const messages = chatMessages[selectedTrainer.id] || [];

    return (
      <View style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedTrainer(null)}
          >
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

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.trainerMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.sender === 'user' ? styles.userMessageText : styles.trainerMessageText
              ]}>
                {item.text}
              </Text>
              <Text style={styles.messageTime}>{item.timestamp}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
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
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!chatMessage.trim()}
          >
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />

      {/* Header */}
      <LinearGradient
        colors={['#001f3f', '#002b5c']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with fitness enthusiasts</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab.id);
              setSelectedTrainer(null); // Reset trainer selection when switching tabs
            }}
          >
            <Icon name={tab.icon} size={22} color={activeTab === tab.id ? '#FFC107' : 'rgba(255, 255, 255, 0.6)'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'groups' && renderGroupsTab()}
        {activeTab === 'trainers' && renderTrainersTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 193, 7, 0.2)',
    backgroundColor: '#001f3f',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 6,
  },
  activeTabText: {
    color: '#FFC107',
  },
  content: {
    flex: 1,
    backgroundColor: '#001f3f',
  },
  tabContent: {
    padding: 20,
  },
  groupsList: {
    gap: 15,
  },
  groupCard: {
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
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  groupMembers: {
    fontSize: 14,
    color: '#FFC107',
  },
  groupActivity: {
    fontSize: 16,
    color: '#FFC107',
    fontWeight: '600',
    marginBottom: 12,
  },
  groupDetails: {
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
  groupDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: '600',
  },
  // Trainer styles
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
  // Chat styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#001f3f',
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
    padding: 20,
    backgroundColor: '#001f3f',
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

export default Community;