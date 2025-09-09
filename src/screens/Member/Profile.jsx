import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
const colors = {
  background: '#006258',
  primary: '#2196F3',
  primaryText: '#ffffff',
  surface: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  border: '#ddd',
  error: '#ff4d4d',
};

// Import the local boy.jpg image using require
const boyAvatar = require('../../assets/image/boy.jpg');

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);

  const tabs = [
    { id: 'profile', title: 'Profile', icon: 'person' },
    { id: 'community', title: 'Community', icon: 'group' },
  
    { id: 'notifications', title: 'Notifications', icon: 'notifications' },
  ];

  // Dummy fetch functions with fixed local avatar image
  const getUserProfile = async () => {
    return {
      data: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '123-456-7890',
        membership: 'Premium',
        memberSince: 'January 2023',
        avatar: boyAvatar, // Assign require image here
      },
    };
  };
  const getUserNotifications = async () => {
    return {
      data: [
        {
          id: 1,
          title: 'Welcome!',
          message: 'Thanks for joining the app.',
          read: false,
          icon: '🔔',
          createdAt: '2025-09-01 10:00',
        },
      ],
    };
  };
  const getCommunityPosts = async () => {
    return {
      data: [
        {
          id: 1,
          avatar: 'https://randomuser.me/api/portraits/women/64.jpg',
          user: 'Alice',
          time: '2 hours ago',
          content: 'Just finished a 5k run!',
          likes: 10,
          comments: 2,
        },
      ],
    };
  };
  const updateNotificationSettings = async ({ enabled }) => {
    // Mock API update call here
  };
  const { logout, isAuthenticated } = useAuth();
  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileResult, notificationsResult, postsResult] = await Promise.allSettled([
        getUserProfile(),
        getUserNotifications(),
        getCommunityPosts(),
      ]);

      if (profileResult.status === 'fulfilled') {
        const pr = profileResult.value;
        setUserProfile(pr.data || pr);
      } else {
        console.warn('Profile fetch failed:', profileResult.reason?.message || profileResult.reason);
        setError('Failed to load profile. Please try again.');
      }

      if (notificationsResult.status === 'fulfilled') {
        const nr = notificationsResult.value;
        setNotifications(nr.data || nr);
      } else {
        console.warn('Notifications fetch failed:', notificationsResult.reason?.message || notificationsResult.reason);
      }

      if (postsResult.status === 'fulfilled') {
        const cr = postsResult.value;
        setCommunityPosts(cr.data || cr);
      } else {
        console.warn('Community posts fetch failed:', postsResult.reason?.message || postsResult.reason);
      }
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (value) => {
    try {
      setNotificationsEnabled(value);
      await updateNotificationSettings({ enabled: value });
    } catch (error) {
      console.error('Update notification settings error:', error);
      Alert.alert('Error', 'Failed to update notification settings');
      setNotificationsEnabled(!value);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 15, fontSize: 16, color: colors.textSecondary }}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          },
        ]}>
        <Text
          style={{
            color: colors.error,
            marginBottom: 20,
            fontSize: 16,
            textAlign: 'center',
          }}>
          {error}
        </Text>
        <TouchableOpacity onPress={fetchProfileData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const safeUserProfile = userProfile || {
    name: 'User',
    email: 'user@example.com',
    phone: '',
    membership: 'Basic',
    memberSince: 'Recently',
    avatar: require('../../assets/image/boyy.jpg'), // fallback local image
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
        {/* Image source directly supports local require */}
        <Image source={safeUserProfile.avatar} style={styles.profileAvatar} />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>{safeUserProfile.name}</Text>
          <Text style={[styles.profileMembership, { color: colors.primary }]}>
            {safeUserProfile.membership} Member
          </Text>
          <Text style={[styles.profileSince, { color: colors.textSecondary }]}>
            Member since {safeUserProfile.memberSince}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('MemberProfile')}>
          <Text style={[styles.editButtonText, { color: colors.primaryText }]}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.detailsTitle, { color: colors.text }]}>Personal Information</Text>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{safeUserProfile.email}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Phone</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {safeUserProfile.phone || 'Not provided'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Membership</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{safeUserProfile.membership}</Text>
        </View>
      </View>

      <View style={[styles.actionsCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.actionsTitle, { color: colors.text }]}>Quick Actions</Text>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="settings" size={24} color={colors.textSecondary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="security" size={24} color={colors.textSecondary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="help" size={24} color={colors.textSecondary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="info" size={24} color={colors.textSecondary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>About App</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.signupButton]}
          onPress={() => {
            logout();
          }}>
          <Icon name="logout" size={24} color="white" style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: 'white' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommunityTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.createPostCard}>
        <TouchableOpacity style={styles.createPostButton}>
          <Icon name="edit" size={20} color="#666" style={styles.createPostIcon} />
          <Text style={styles.createPostText}>Share your fitness journey...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        {communityPosts && communityPosts.length > 0 ? (
          communityPosts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar || post.userAvatar }} style={styles.postAvatar} />
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>{post.user || post.userName}</Text>
                  <Text style={styles.postTime}>{post.time || post.createdAt}</Text>
                </View>
              </View>

              <Text style={styles.postContent}>{post.content || post.message}</Text>

              {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="favorite" size={18} color="#2196F3" style={styles.postActionIcon} />
                  <Text style={styles.postActionText}>{post.likes || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="chat-bubble" size={18} color="#666" style={styles.postActionIcon} />
                  <Text style={styles.postActionText}>{post.comments || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="share" size={18} color="#666" style={styles.postActionIcon} />
                  <Text style={styles.postActionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No community posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share your fitness journey!</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingsCard}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications" size={20} color="#666" style={styles.settingIcon} />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#767577', true: '#2196F3' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.notificationsContainer}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[styles.notificationCard, !notification.read && styles.unreadNotification]}>
              <View style={styles.notificationIcon}>
                <Text style={styles.notificationIconText}>{notification.icon || '🔔'}</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time || notification.createdAt}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}>
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? colors.primaryText : colors.primaryText}
              style={styles.tabIcon}
              onPress={() => setActiveTab(tab.id)}
            />
            <Text
              style={[
                styles.tabText,
                { color: colors.primaryText },
                activeTab === tab.id && styles.activeTabText,
              ]}
              onPress={() => setActiveTab(tab.id)}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'community' && renderCommunityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabIcon: {
    marginBottom: 5,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileMembership: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileSince: {
    fontSize: 12,
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionsCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
  },
  createPostCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  createPostIcon: {
    marginRight: 10,
  },
  createPostText: {
    fontSize: 16,
    color: '#666',
  },
  postsContainer: {
    gap: 15,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionIcon: {
    marginRight: 5,
  },
  postActionText: {
    fontSize: 14,
    color: '#666',
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  notificationsContainer: {
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationIconText: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    alignSelf: 'center',
  },
  signupButton: {
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
