import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const WorkoutLog = () => {
  const navigation = useNavigation();

  const equipmentIcons = [
    { id: 1, source: require('../../assets/image/eq1.jpg') },
    { id: 2, source: require('../../assets/image/eq2.jpg') },
    { id: 3, source: require('../../assets/image/eq3.jpg') },
    { id: 4, source: require('../../assets/image/eq4.jpg') },
    { id: 5, source: require('../../assets/image/eq5.jpg') },
    { id: 6, source: require('../../assets/image/eq6.jpg') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Status Bar */}
      

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Video Background Section */}
        <View style={styles.mainVideoContainer}>
          <Video
            source={require('../../assets/video/2376809-hd_1920_1080_24fps.mp4')}
            style={styles.video}
            resizeMode="cover"
            repeat
            muted
            paused={false}
          />
          <View style={styles.videoOverlay}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>
                Hamstrings,{'\n'}Chest, Biceps,{'\n'}Abs, Glutes
              </Text>
              <View style={styles.createdInfo}>
                <Text style={styles.createdText}>🔧 Created for Abhishekh</Text>
              </View>
              <View style={styles.workoutStats}>
                
                
              
              </View>
            </View>
          </View>
        </View>

        {/* Equipment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Equipment</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>8</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            style={styles.equipmentScroll}
            showsHorizontalScrollIndicator={false}
          >
            {equipmentIcons.map((item) => (
              <TouchableOpacity key={item.id} style={styles.equipmentItem}>
                <Image source={item.source} style={styles.equipmentIcon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercises Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>9</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('WorkoutPlanDetail')}
            >
              <Text style={styles.addButtonText}>Add</Text>
              <Text style={styles.addButtonIcon}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Running Exercise */}
          <TouchableOpacity style={styles.exerciseItem}>
            <View style={styles.exerciseImage}>
              <Image
                source={require('../../assets/image/frontraise.jpg')}
                style={styles.exerciseImageStyle}
                resizeMode="contain"
              />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>Front raise </Text>
              <Text style={styles.exerciseDetails}>sholders</Text>
            </View>
            <TouchableOpacity style={styles.exerciseMenu}>
              <Text style={styles.exerciseMenuIcon}>⋯</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Start Workout Button */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006258',
  },
  scrollView: {
    flex: 1,
  },
  mainVideoContainer: {
    width: '100%',
    height: 420,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  workoutInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  workoutTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 44,
    marginBottom: 16,
  },
  createdInfo: {
    marginBottom: 16,
  },
  createdText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  badge: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonIcon: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '500',
  },
  equipmentScroll: {
    marginBottom: 8,
  },
  equipmentItem: {
    marginRight: 12,
  },
  equipmentIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  exerciseDetails: {
    color: '#aaa',
    fontSize: 14,
  },
  exerciseMenu: {
    padding: 8,
  },
  exerciseMenuIcon: {
    color: '#aaa',
    fontSize: 18,
  },
  startButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default WorkoutLog;
