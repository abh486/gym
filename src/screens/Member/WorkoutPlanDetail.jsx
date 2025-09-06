import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // For search and star icons

const categories = [
  { id: '1', title: 'Favorites', color: '#cbd5e1' },
  { id: '2', title: 'Cardio', color: '#cbd5e1' },
  { id: '3', title: 'Back', color: '#cbd5e1' },
  { id: '4', title: 'Chest', color: '#cbd5e1' },
  { id: '5', title: 'Hamstrings', color: '#cbd5e1' },
];

const exercises = [
  {
    id: '1',
    title: 'Bench press ',
    tag: { label: 'Chest', },
    image: require('../../assets/image/chest.jpg'),
  },
  {
    id: '2',
    title: 'Backward Lunge',
    tag: { label: 'Glutes, Quadriceps', },
    image: require('../../assets/image/gultes.jpg'),
  },
  {
    id: '3',
    title: 'Arm Circles',
    tag: { label: 'Sholders',  },
    image: require('../../assets/image/arm.jpg'),
  },
  {
    id: '4',
    title: 'Pull up ',
    tag: { label: 'Back',  },
    image: require('../../assets/image/pullup.jpg'),
  },
  {
    id: '5',
    title: 'Pike Push-Up',
    tag: { label: 'Shoilders,Triceps',  },
    image: require('../../assets/image/pickpush.jpg'),
  },
];

const ExerciseItem = ({ item }) => (
  <View style={styles.exerciseItem}>
    <Image source={item.image} style={styles.exerciseImage} />
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseTitle}>{item.title}</Text>
      <View style={[styles.tag, { backgroundColor: item.tag.color }]}>
        <Text style={styles.tagText}>{item.tag.label}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.starIcon}>
      <Icon name="star-outline" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

export default function WorkoutPlanDetail () {
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Exercises</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for right side */}
      </View>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, { backgroundColor: cat.color }]}
          >
            <Text style={styles.categoryText}>{cat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercises List */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExerciseItem item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#006258' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    
  },
  headerText: { fontSize: 20, fontWeight: '600', color: 'white' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#008872', // Lighter shade of the background
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 8,
    color: 'white',
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white', // Changed from empty string to 'white'
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: '#006258', // Changed to match main container background
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    padding: 18,
    borderWidth: 1, // Added subtle border for visual separation
    borderColor: '#008872', // Lighter green for border
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  exerciseTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 12,
    color: 'white', // Changed from '#111' to 'white'
    fontWeight: '600',
  },
  starIcon: {
    padding: 8,
  },
});