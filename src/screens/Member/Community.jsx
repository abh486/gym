import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, StatusBar, SafeAreaView, TextInput, FlatList, ActivityIndicator, Image, Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth0 } from 'react-native-auth0';
import apiClient from '../../api/apiClient';
import * as trainerService from '../../api/trainerService';

const { width: screenWidth } = Dimensions.get('window');

// Dummy data for posts
const initialPosts = [
  {
    id: '1',
    userName: 'Alex Fitness',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168f328221?q=80&w=2070&auto=format&fit=crop',
    caption: 'Great morning run today! Feeling energized. #running #fitness',
    likes: 124,
    comments: [
      { id: 'c1', userName: 'JaneDoe', text: 'Awesome!' },
      { id: 'c2', userName: 'JohnSmith', text: 'Keep it up!' }
    ],
    liked: false,
  },
  {
    id: '2',
    userName: 'Sara Workout',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop',
    caption: 'Hit a new personal best on my deadlift! 💪 #gym #strength',
    likes: 250,
    comments: [],
    liked: true,
  },
];

const Community = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCredentials } = useAuth0();

  // State for posts
  const [posts, setPosts] = useState(initialPosts);
  const [commentText, setCommentText] = useState('');

  // State for Add Post Modal
  const [isPostModalVisible, setPostModalVisible] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);


  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  const handleComment = (postId, currentCommentText) => {
    if (currentCommentText.trim() === '') return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `c${Date.now()}`,
          userName: 'You', // Replace with actual user name from auth
          text: currentCommentText,
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const handleSelectImage = () => {
    // In a real app, you would use a library like react-native-image-picker
    // For this example, we'll just use a placeholder image.
    setNewPostImage('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop');
  };

  const handleAddPost = () => {
    if (!newPostImage || !newPostCaption.trim()) {
      alert('Please select an image and write a caption.');
      return;
    }
    const newPost = {
      id: `post_${Date.now()}`,
      userName: 'Current User', // Replace with actual user name
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Replace with actual user avatar
      imageUrl: newPostImage,
      caption: newPostCaption,
      likes: 0,
      comments: [],
      liked: false,
    };
    setPosts([newPost, ...posts]);
    setPostModalVisible(false);
    setNewPostImage(null);
    setNewPostCaption('');
  };


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
    if (activeTab === 'trainers') {
      fetchTrainers();
    }
  }, [activeTab, fetchTrainers]);

  const tabs = [
    { id: 'posts', title: 'Community Posts', icon: 'images-outline' },
    { id: 'trainers', title: 'Find Trainers', icon: 'fitness-outline' },
  ];

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

  const PostCard = ({ item }) => {
    const [postComment, setPostComment] = useState('');
    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                <Text style={styles.userName}>{item.userName}</Text>
            </View>
            <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            <View style={styles.postActions}>
                <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
                    <Icon name={item.liked ? 'heart' : 'heart-outline'} size={24} color={item.liked ? '#FF5733' : '#fff'} />
                    <Text style={styles.actionText}>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="chatbubble-outline" size={24} color="#fff" />
                    <Text style={styles.actionText}>{item.comments.length}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.caption}>{item.caption}</Text>
            <View style={styles.commentsSection}>
                {item.comments.slice(0, 2).map(comment => (
                    <Text key={comment.id} style={styles.commentText}>
                        <Text style={{ fontWeight: 'bold' }}>{comment.userName}:</Text> {comment.text}
                    </Text>
                ))}
                <View style={styles.commentInputContainer}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        placeholderTextColor="#aaa"
                        value={postComment}
                        onChangeText={setPostComment}
                    />
                    <TouchableOpacity onPress={() => {
                        handleComment(item.id, postComment);
                        setPostComment('');
                    }}>
                        <Icon name="send-outline" size={24} color="#FFC107" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
  };

  const renderPostsTab = () => (
    <View style={styles.tabContent}>
        <TouchableOpacity style={styles.createPostButton} onPress={() => setPostModalVisible(true)}>
            <Icon name="add" size={24} color="#001f3f" />
            <Text style={styles.createPostButtonText}>Create a Post</Text>
        </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({item}) => <PostCard item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTrainersTab = () => {
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
      <View style={styles.tabContent}>
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
      </View>
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPostModalVisible}
        onRequestClose={() => {
          setPostModalVisible(!isPostModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Post</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handleSelectImage}>
              {newPostImage ? (
                <Image source={{ uri: newPostImage }} style={styles.imagePreview} />
              ) : (
                <>
                  <Icon name="camera" size={40} color="#FFC107" />
                  <Text style={styles.imagePickerText}>Select an Image</Text>
                </>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#aaa"
              value={newPostCaption}
              onChangeText={setNewPostCaption}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setPostModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.postButton]} onPress={handleAddPost}>
                <Text style={styles.modalButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => { setActiveTab(tab.id); setSelectedTrainer(null); }}
          >
            <Icon name={tab.icon} size={22} color={activeTab === tab.id ? '#FFC107' : 'rgba(255, 255, 255, 0.6)'} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'posts' && renderPostsTab()}
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
  content: {
    flex: 1,
    backgroundColor: '#001f3f',
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
  tabContent: {
    padding: 20,
  },
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
  // New styles for the posts tab
  createPostButton: {
    backgroundColor: '#FFC107',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  createPostButtonText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  postCard: {
    backgroundColor: '#002b5c',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: screenWidth - 40, // Adjust height to be responsive
  },
  postActions: {
    flexDirection: 'row',
    padding: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  caption: {
    color: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 14,
  },
  commentsSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  commentText: {
    color: '#fff',
    marginBottom: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 193, 7, 0.2)',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  // Add Post Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#002b5c',
    borderRadius: 16,
    padding: 20,
    width: screenWidth * 0.9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 193, 7, 0.5)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001f3f',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#FFC107',
    marginTop: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  captionInput: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#001f3f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
    padding: 12,
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#FFC107',
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#001f3f',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Community;