import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const fetchExercises = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Bench Press',
          tag: { label: 'Chest', color: '#FFC107' },
          image: require('../../assets/image/chest.jpg'),
          equipment: ['Barbell'],
          difficulty: 'Intermediate',
          favorite: false,
        },
        {
          id: '2',
          title: 'Backward Lunge',
          tag: { label: 'Glutes, Quadriceps', color: '#FFA000' },
          image: require('../../assets/image/gultes.jpg'),
          equipment: ['Bodyweight'],
          difficulty: 'Beginner',
          favorite: true,
        },
        {
          id: '3',
          title: 'Arm Circles',
          tag: { label: 'Shoulders', color: '#FF6B35' },
          image: require('../../assets/image/arm.jpg'),
          equipment: ['Bodyweight'],
          difficulty: 'Beginner',
          favorite: false,
        },
        {
          id: '4',
          title: 'Pull Up',
          tag: { label: 'Back', color: '#00C8C8' },
          image: require('../../assets/image/pullup.jpg'),
          equipment: ['Pull-up Bar'],
          difficulty: 'Advanced',
          favorite: false,
        },
        {
          id: '5',
          title: 'Pike Push-Up',
          tag: { label: 'Shoulders, Triceps', color: '#FF5252' },
          image: require('../../assets/image/pickpush.jpg'),
          equipment: ['Mat'],
          difficulty: 'Intermediate',
          favorite: true,
        },
      ]);
    }, 800);
  });
};

const categories = [
  { id: 'all', title: 'All' },
  { id: 'favorites', title: 'Favorites' },
  { id: 'cardio', title: 'Cardio' },
  { id: 'back', title: 'Back' },
  { id: 'chest', title: 'Chest' },
  { id: 'hamstrings', title: 'Hamstrings' },
  { id: 'shoulders', title: 'Shoulders' },
];

const tagMap = {
  Chest: 'chest',
  'Glutes, Quadriceps': 'glutes',
  Shoulders: 'shoulders',
  Back: 'back',
  'Shoulders, Triceps': 'shoulders',
};

const ExerciseItem = ({ item, isSelected, isFavorite, onSelect, onToggleFavorite }) => (
  <TouchableOpacity style={[styles.exerciseItem, isSelected && styles.selectedItem]} onPress={() => onSelect(item)}>
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.exerciseImage} />
      <View style={styles.difficultyBadge}>
        <Text style={styles.difficultyText}>{item.difficulty.substring(0, 1)}</Text>
      </View>
    </View>
    <View style={styles.exerciseInfo}>
      <Text style={styles.exerciseTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={[styles.tag, { backgroundColor: item.tag.color }]}>
        <Text style={styles.tagText}>{item.tag.label}</Text>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.equipmentRow}>
          {item.equipment.slice(0, 2).map((eq, idx) => (
            <Text key={idx} style={styles.equipmentText}>
              {eq}
              {idx < item.equipment.length - 1 && idx < 1 ? ', ' : ''}
            </Text>
          ))}
          {item.equipment.length > 2 && (
            <Text style={styles.equipmentText}>+{item.equipment.length - 2}</Text>
          )}
        </View>
      </View>
    </View>
    <View style={styles.actionContainer}>
      {isSelected ? (
        <Icon name="checkmark-circle" size={26} color="#4CAF50" style={styles.actionIcon} />
      ) : (
        <View style={styles.spacer} />
      )}
      <TouchableOpacity
        style={styles.starButton}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite(item.id);
        }}
      >
        <Icon name={isFavorite ? "star" : "star-outline"} size={22} color="#FFC107" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function WorkoutPlanDetail() {
  const navigation = useNavigation();
  const route = useRoute();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState(new Set());

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    let result = exercises;

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        result = result.filter((ex) => ex.favorite);
      } else {
        result = result.filter((ex) => tagMap[ex.tag.label]?.includes(selectedCategory));
      }
    }

    if (searchText.trim()) {
      const term = searchText.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.title.toLowerCase().includes(term) ||
          ex.tag.label.toLowerCase().includes(term) ||
          ex.equipment.some((eq) => eq.toLowerCase().includes(term))
      );
    }

    setFilteredExercises(result);
  }, [searchText, selectedCategory, exercises]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await fetchExercises();
      setExercises(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  }, []);

  const toggleSelectExercise = (exercise) => {
    const newSelection = new Set(selectedExercises);
    if (newSelection.has(exercise.id)) {
      newSelection.delete(exercise.id);
    } else {
      newSelection.add(exercise.id);
    }
    setSelectedExercises(newSelection);
  };

  const toggleFavorite = (id) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, favorite: !ex.favorite } : ex))
    );
  };

  const handleBack = () => {
    const selectedList = exercises.filter(ex => selectedExercises.has(ex.id));
    if (route.params?.onSelectExercises) {
      route.params.onSelectExercises(selectedList);
    }
    navigation.goBack();
  };

  const renderExerciseItem = ({ item }) => (
    <ExerciseItem
      item={item}
      isSelected={selectedExercises.has(item.id)}
      isFavorite={item.favorite}
      onSelect={toggleSelectExercise}
      onToggleFavorite={toggleFavorite}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="fitness-outline" size={64} color="#FFC107" />
      <Text style={styles.emptyTitle}>No exercises found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filter criteria
      </Text>
      <TouchableOpacity style={styles.resetButton} onPress={() => {
        setSearchText('');
        setSelectedCategory('all');
      }}>
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFC107" />
      <Text style={styles.loadingText}>Loading exercises...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color="#FFC107" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Select Exercises</Text>
        <View style={styles.selectionBadge}>
          <Text style={styles.selectionText}>{selectedExercises.size} Selected</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#FFC107" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises, equipment..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoComplete="off"
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Icon name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Sticky Categories */}
      <View style={styles.stickyCategories}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryTab}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.title}
              </Text>
              {selectedCategory === cat.id && <View style={styles.underline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Exercises List */}
      {loading ? (
        renderLoading()
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FFC107']}
              tintColor="#FFC107"
            />
          }
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 193, 7, 0.2)',
   
  },
  iconButton: {
    padding: 6,
    
  },
  headerText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  selectionBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectionText: {
    color: '#FFC107',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#002b5c',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 16,
    color: '#fff',
  },
  stickyCategories: {
    backgroundColor: '#001f3f',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTab: {
    marginRight: 24,
    alignItems: 'center',
    paddingBottom: 10,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  categoryTextActive: {
    color: '#FFC107',
  },
  underline: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFC107',
    marginTop: 6,
    borderRadius: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: '#002b5c',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.15)',
  },
  selectedItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#00334d',
  },
  imageContainer: {
    width: 70,
    height: 70,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  difficultyText: {
    color: '#FFC107',
    fontSize: 12,
    fontWeight: '700',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  exerciseTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 6,
    lineHeight: 22,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#001f3f',
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginRight: 4,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  actionIcon: {
    marginBottom: 8,
  },
  spacer: {
    height: 26,
    marginBottom: 8,
  },
  starButton: {
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#001f3f',
    fontWeight: '700',
    fontSize: 16,
  },
});