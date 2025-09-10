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
  background: '#001f3f',
  primary: '#FFC107', // Golden Yellow
  primaryText: '#001f3f', // Dark blue for contrast on yellow
  surface: '#002b5c', // Card background
  text: '#ffffff', // White text for dark background
  textSecondary: 'rgba(255, 255, 255, 0.8)', // Lighter white
  border: 'rgba(255, 193, 7, 0.3)', // Golden border
  error: '#ff5252',
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
        name: 'Abhishekh',
        email: 'abhishekh@example.com',
        phone: '987-654-3210',
        membership: 'Premium',
        memberSince: 'January 2025',
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
          createdAt: '2025-09-01 10:00',
        },
        {
          id: 2,
          title: 'New Workout Plan',
          message: 'Your custom plan is ready!',
          read: true,
          createdAt: '2025-09-02 08:30',
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
        {
          id: 2,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          user: 'John',
          time: '1 day ago',
          content: 'New PR on bench press!',
          likes: 24,
          comments: 5,
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
    avatar: boyAvatar, // fallback local image
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
          <Icon name="settings" size={24} color={colors.primary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="security" size={24} color={colors.primary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="help" size={24} color={colors.primary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { borderBottomColor: colors.border }]}>
          <Icon name="info" size={24} color={colors.primary} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.text }]}>About App</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={logout}>
          <Icon name="logout" size={24} color={colors.error} style={styles.actionIcon} />
          <Text style={[styles.actionText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommunityTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.createPostCard, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.createPostButton}>
          <Icon name="edit" size={20} color={colors.primary} style={styles.createPostIcon} />
          <Text style={[styles.createPostText, { color: colors.textSecondary }]}>Share your fitness journey...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        {communityPosts && communityPosts.length > 0 ? (
          communityPosts.map((post) => (
            <View key={post.id} style={[styles.postCard, { backgroundColor: colors.surface }]}>
              <View style={styles.postHeader}>
                <Image 
                  source={{ uri: post.avatar }} 
                  style={styles.postAvatar} 
                  defaultSource={boyAvatar} // Fallback image
                />
                <View style={styles.postUserInfo}>
                  <Text style={[styles.postUserName, { color: colors.text }]}>{post.user}</Text>
                  <Text style={[styles.postTime, { color: colors.textSecondary }]}>{post.time}</Text>
                </View>
              </View>

              <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="favorite" size={18} color="#FF6B35" style={styles.postActionIcon} />
                  <Text style={[styles.postActionText, { color: colors.text }]}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="chat-bubble" size={18} color={colors.primary} style={styles.postActionIcon} />
                  <Text style={[styles.postActionText, { color: colors.text }]}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="share" size={18} color={colors.textSecondary} style={styles.postActionIcon} />
                  <Text style={[styles.postActionText, { color: colors.text }]}>{'Share'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No community posts yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Be the first to share your fitness journey!</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications" size={20} color={colors.primary} style={styles.settingIcon} />
            <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.notificationsContainer}>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard, 
                { backgroundColor: colors.surface },
                !notification.read && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationIcon}>
                <Text style={[styles.notificationIconText, { color: colors.primary }]}>{notification.icon || '🔔'}</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>{notification.title}</Text>
                <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>{notification.message}</Text>
                <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>{notification.createdAt}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No notifications yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>You're all caught up!</Text>
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
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={activeTab === tab.id ? colors.primary : colors.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? colors.primary : colors.textSecondary },
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 193, 7, 0.2)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  tabIcon: {
    marginBottom: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFC107',
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFC107',
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
    marginLeft: 10,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 193, 7, 0.2)',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  createPostCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
  },
  createPostIcon: {
    marginRight: 10,
  },
  createPostText: {
    fontSize: 16,
  },
  postsContainer: {
    gap: 15,
  },
  postCard: {
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.5)',
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
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
    borderTopColor: 'rgba(255, 193, 7, 0.2)',
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
  },
  settingsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
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
    fontWeight: '500',
  },
  notificationsContainer: {
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  unreadNotification: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
    alignSelf: 'center',
    marginLeft: 8,
  },
  emptyState: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  retryButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});