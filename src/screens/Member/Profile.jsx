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
import apiClient from '../../api/apiClient';

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

  // Only 'profile' and 'notifications' tab remain
  const tabs = [
    { id: 'profile', title: 'Profile', icon: 'person' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' },
  ];

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResult, notificationsResult] = await Promise.allSettled([
        apiClient.get('/users/auth0/profile'),
        apiClient.get('/notifications'),
      ]);
      if (profileResult.status === 'fulfilled' && profileResult.value.data.success) {
        setUserProfile(profileResult.value.data.data);
      } else {
        const errorMessage = profileResult.reason?.response?.data?.message || 'Failed to load profile.';
        setError(errorMessage);
        setLoading(false);
        return;
      }
      if (notificationsResult.status === 'fulfilled' && notificationsResult.value.data.success) {
        setNotifications(notificationsResult.value.data.data);
      } else {
        console.warn('Notifications fetch failed:', notificationsResult.reason?.response?.data?.message);
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
    setNotificationsEnabled(value);
    try {
      await updateNotificationSettings({ enabled: value });
    } catch (error) {
      console.error('Update notification settings error:', error);
      Alert.alert('Error', 'Failed to update notification settings');
      setNotificationsEnabled(!value);
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
    avatar: null,
  };

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
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
