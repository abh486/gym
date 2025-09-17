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
import apiClient from '../../api/apiClient'; // Import the API client

const colors = {
  background: '#001f3f',
  primary: '#FFC107',
  primaryText: '#001f3f',
  surface: '#002b5c',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  border: 'rgba(255, 193, 7, 0.3)',
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
  const { logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);

  const tabs = [
    { id: 'profile', title: 'Profile', icon: 'person' },
    { id: 'community', title: 'Community', icon: 'group' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' },
  ];

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data from the backend in parallel
      const [profileResult, notificationsResult, postsResult] = await Promise.allSettled([
        apiClient.get('/users/auth0/profile'),
         apiClient.get('/notifications'), // Example endpoint
        apiClient.get('/community/posts')
        // Assumed endpoint
      ]);

      if (profileResult.status === 'fulfilled' && profileResult.value.data.success) {
        setUserProfile(profileResult.value.data.data);
      } else {
        const errorMessage = profileResult.reason?.response?.data?.message || 'Failed to load profile.';
        setError(errorMessage);
        console.warn('Profile fetch failed:', errorMessage);
        setLoading(false); // Stop loading if profile fails, as it's critical
        return;
      }

      if (notificationsResult.status === 'fulfilled' && notificationsResult.value.data.success) {
        setNotifications(notificationsResult.value.data.data);
      } else {
        console.warn('Notifications fetch failed:', notificationsResult.reason?.response?.data?.message);
      }

      if (postsResult.status === 'fulfilled' && postsResult.value.data.success) {
        setCommunityPosts(postsResult.value.data.data);
      } else {
        console.warn('Community posts fetch failed:', postsResult.reason?.response?.data?.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Mock function for updating settings, can be replaced with a real API call
  const updateNotificationSettings = async ({ enabled }) => {
    try {
      // Example: await apiClient.put('/users/auth0/settings', { notifications: enabled });
      console.log(`Notification settings updated to: ${enabled}`);
    } catch (error) {
      throw new Error('Failed to update settings on the server.');
    }
  };

  const handleNotificationToggle = async (value) => {
    setNotificationsEnabled(value); // Optimistic UI update
    try {
      await updateNotificationSettings({ enabled: value });
    } catch (error) {
      console.error('Update notification settings error:', error);
      Alert.alert('Error', 'Failed to update notification settings');
      setNotificationsEnabled(!value); // Revert on failure
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfileData();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 15, fontSize: 16, color: colors.textSecondary }}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: colors.error, marginBottom: 20, fontSize: 16, textAlign: 'center' }}>{error}</Text>
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
    avatar: null, // Default to null, so the fallback can be used
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
        {/* --- FIXED --- Correctly handles remote URI or local fallback */}
        <Image 
          source={safeUserProfile.avatar ? { uri: safeUserProfile.avatar } : boyAvatar} 
          style={styles.profileAvatar} 
        />
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
                  source={post.avatar ? { uri: post.avatar } : boyAvatar} 
                  style={styles.postAvatar}
                />
                <View style={styles.postUserInfo}>
                  <Text style={[styles.postUserName, { color: colors.text }]}>{post.user}</Text>
                  <Text style={[styles.postTime, { color: colors.textSecondary }]}>{post.time}</Text>
                </View>
              </View>

              <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="favorite-border" size={18} color={colors.textSecondary} style={styles.postActionIcon} />
                  <Text style={[styles.postActionText, { color: colors.text }]}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="chat-bubble-outline" size={18} color={colors.textSecondary} style={styles.postActionIcon} />
                  <Text style={[styles.postActionText, { color: colors.text }]}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postAction}>
                  <Icon name="share" size={18} color={colors.textSecondary} style={styles.postActionIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No community posts yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Be the first to share your journey!</Text>
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
            thumbColor={'#fff'}
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
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
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
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'community' && renderCommunityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    marginBottom: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tabContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
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
    borderRadius: 20,
    marginLeft: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  actionsCard: {
    borderRadius: 16,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
    paddingHorizontal: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  actionIcon: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {},
  createPostCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postActionIcon: {
    marginRight: 6,
  },
  postActionText: {
    fontSize: 14,
  },
  settingsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderColor: colors.border,
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  emptyState: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
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
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  retryButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;