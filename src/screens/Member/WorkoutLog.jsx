import React, { useState } from 'react';
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

  // ✅ Added State to Store Selected Exercises
  const [selectedExercises, setSelectedExercises] = useState([]);

  const equipmentIcons = [
    { id: 1, source: require('../../assets/image/eq1.jpg') },
    { id: 2, source: require('../../assets/image/eq2.jpg') },
    { id: 3, source: require('../../assets/image/eq3.jpg') },
    { id: 4, source: require('../../assets/image/eq4.jpg') },
    { id: 5, source: require('../../assets/image/eq5.jpg') },
    { id: 6, source: require('../../assets/image/eq6.jpg') },
  ];

  // ✅ Updated Add Button Handler
  const handleAddExercise = () => {
    navigation.navigate('WorkoutPlanDetail', {
      onSelectExercises: (exercises) => {
        setSelectedExercises(prev => [...prev, ...exercises]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />

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
          {/* Overlay for better text visibility */}
          <View style={styles.videoOverlay} />
          <View style={styles.videoContent}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>
                Hamstrings,{'\n'}Chest, Biceps,{'\n'}Abs, Glutes
              </Text>
              <View style={styles.createdInfo}>
                <Text style={styles.createdText}>🔧 Created for Abhishekh</Text>
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
                <View style={styles.equipmentIconContainer}>
                  <Image source={item.source} style={styles.equipmentIcon} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Exercises Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedExercises.length || 9}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddExercise} // ✅ Updated onPress
            >
              <Text style={styles.addButtonText}>Add</Text>
              <Text style={styles.addButtonIcon}>+</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Render Selected Exercises */}
          {selectedExercises.map((item) => (
            <TouchableOpacity key={item.id} style={styles.exerciseItem}>
              <View style={styles.exerciseImage}>
                <Image
                  source={item.image}
                  style={styles.exerciseImageStyle}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{item.title}</Text>
                <Text style={styles.exerciseDetails}>{item.tag.label}</Text>
              </View>
              <TouchableOpacity style={styles.exerciseMenu}>
                <Text style={styles.exerciseMenuIcon}>⋯</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* ✅ If no selected exercises, show default one */}
          {selectedExercises.length === 0 && (
            <TouchableOpacity style={styles.exerciseItem}>
              <View style={styles.exerciseImage}>
                <Image
                  source={require('../../assets/image/frontraise.jpg')}
                  style={styles.exerciseImageStyle}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>Front raise</Text>
                <Text style={styles.exerciseDetails}>Shoulders</Text>
              </View>
              <TouchableOpacity style={styles.exerciseMenu}>
                <Text style={styles.exerciseMenuIcon}>⋯</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Start Workout Button */}
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => navigation.navigate("StartWorkout")}
      >
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
    backgroundColor: '#001f3f',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for contrast
  },
  videoContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    justifyContent: 'flex-end',
    zIndex: 2,
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
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  createdInfo: {
    marginBottom: 16,
  },
  createdText: {
    color: '#FFC107',
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
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
  },
  badgeText: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#FFC107',
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonIcon: {
    color: '#FFC107',
    fontSize: 18,
    fontWeight: '500',
  },
  equipmentScroll: {
    marginBottom: 8,
  },
  equipmentItem: {
    marginRight: 12,
  },
  equipmentIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  equipmentIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002b5c',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#FFC107',
    fontSize: 14,
  },
  exerciseMenu: {
    padding: 8,
  },
  exerciseMenuIcon: {
    color: '#FFC107',
    fontSize: 18,
  },
  startButton: {
    backgroundColor: '#FFC107',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  startButtonText: {
    color: '#001f3f',
    fontSize: 18,
    fontWeight: '800',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default WorkoutLog;