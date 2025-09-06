import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
  Easing,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');



const QuickMealCard = ({ meal, onPress, style }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.quickMealCard,
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.quickMealButton}>
        <Text style={styles.quickMealIcon}>{meal.icon}</Text>
        <Text style={styles.quickMealName}>{meal.name}</Text>
        <Text style={styles.quickMealCalories}>{meal.calories} kcal</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MealCard = ({ item, index, onDelete }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 100;

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(translateX, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onDelete(item.id));
  };

  return (
    <Animated.View
      style={[
        styles.mealCard,
        {
          transform: [{ scale }, { translateX }],
          opacity,
        },
      ]}
    >
      <View style={styles.mealCardContent}>
        {/* Meal Photo */}
        {item.photo && (
          <Image source={{ uri: item.photo }} style={styles.mealCardPhoto} />
        )}
        
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{item.mealName}</Text>
          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesText}>{item.calories} kcal</Text>
          </View>
        </View>
        
        {/* Meal Type Badge */}
        {item.mealType && (
          <View style={styles.mealTypeBadge}>
            <Text style={styles.mealTypeBadgeText}>
              {item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1)}
            </Text>
          </View>
        )}
        
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{item.protein || 0}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{item.carbs || 0}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{item.fats || 0}g</Text>
          </View>
        </View>
        
        {/* Notes */}
        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <Text style={styles.timeStamp}>{item.timestamp}</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const StatCard = ({ title, value, subtitle, color, delay = 0 }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setTimeout(() => {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, delay);
  }, [value]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  return (
    <Animated.View
      style={[
        styles.statCard,
        { borderLeftColor: color },
        {
          transform: [{ scale }, { rotate: rotateInterpolate }],
        },
      ]}
    >
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </Animated.View>
  );
};

const PulsingButton = ({ onPress, children, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(onPress, 100);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const DietLog = () => {
  const { colors } = useTheme();
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalMeals: 0,
  });
  
  // Custom meal form state
  const [dietForm, setDietForm] = useState({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
    sugar: '',
    mealType: 'breakfast',
    notes: '',
    photo: null,
  });

  const headerScale = useRef(new Animated.Value(1)).current;
  const modalSlide = useRef(new Animated.Value(height)).current;

  // Quick meal options with more variety and better categorization
  const quickMeals = [
    // Breakfast
    { name: 'Oatmeal Bowl', calories: 150, icon: '🥣', protein: 6, carbs: 27, fats: 3, category: 'breakfast' },
    { name: 'Greek Yogurt', calories: 59, icon: '🥛', protein: 10, carbs: 3.6, fats: 0.4, category: 'breakfast' },
    { name: 'Eggs & Toast', calories: 155, icon: '🥚', protein: 13, carbs: 1.1, fats: 11, category: 'breakfast' },
    { name: 'Smoothie Bowl', calories: 180, icon: '🍓', protein: 8, carbs: 25, fats: 5, category: 'breakfast' },
    
    // Lunch
    { name: 'Chicken Salad', calories: 165, icon: '🍗', protein: 31, carbs: 0, fats: 3.6, category: 'lunch' },
    { name: 'Tuna Sandwich', calories: 220, icon: '🥪', protein: 18, carbs: 25, fats: 8, category: 'lunch' },
    { name: 'Quinoa Bowl', calories: 185, icon: '🥗', protein: 12, carbs: 28, fats: 6, category: 'lunch' },
    { name: 'Turkey Wrap', calories: 195, icon: '🌯', protein: 22, carbs: 18, fats: 7, category: 'lunch' },
    
    // Dinner
    { name: 'Salmon Fillet', calories: 208, icon: '🐟', protein: 25, carbs: 0, fats: 12, category: 'dinner' },
    { name: 'Beef Steak', calories: 250, icon: '🥩', protein: 26, carbs: 0, fats: 15, category: 'dinner' },
    { name: 'Pasta Primavera', calories: 320, icon: '🍝', protein: 12, carbs: 45, fats: 10, category: 'dinner' },
    { name: 'Stir Fry', calories: 280, icon: '🥘', protein: 18, carbs: 22, fats: 12, category: 'dinner' },
    
    // Snacks
    { name: 'Banana', calories: 89, icon: '🍌', protein: 1.1, carbs: 23, fats: 0.3, category: 'snack' },
    { name: 'Almonds', calories: 164, icon: '🥜', protein: 6, carbs: 6, fats: 14, category: 'snack' },
    { name: 'Apple', calories: 52, icon: '🍎', protein: 0.3, carbs: 14, fats: 0.2, category: 'snack' },
    { name: 'Protein Bar', calories: 200, icon: '🍫', protein: 20, carbs: 15, fats: 8, category: 'snack' },
  ];

  const mealCategories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { id: 'lunch', name: 'Lunch', icon: '☀️' },
    { id: 'dinner', name: 'Dinner', icon: '🌙' },
    { id: 'snack', name: 'Snacks', icon: '🍿' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMeals = selectedCategory === 'all' 
    ? quickMeals 
    : quickMeals.filter(meal => meal.category === selectedCategory);

  useEffect(() => {
    const totalCalories = logs.reduce((sum, log) => sum + parseInt(log.calories || 0), 0);
    const totalProtein = logs.reduce((sum, log) => sum + parseInt(log.protein || 0), 0);
    setStats({
      totalCalories,
      totalProtein,
      totalMeals: logs.length,
    });
  }, [logs]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logs.length]);

  const handleQuickMeal = async (meal) => {
    try {
      const response = await saveDietEntry({
        mealName: meal.name,
        calories: meal.calories.toString(),
        protein: meal.protein.toString(),
        carbs: meal.carbs.toString(),
        fats: meal.fats.toString(),
        mealType: meal.category
      });

      if (response.success) {
        // Add to local state with enhanced data
        const newLog = {
          ...meal,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        };
        setLogs([newLog, ...logs]);
        
        // Show success animation
        Animated.sequence([
          Animated.timing(headerScale, {
            toValue: 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(headerScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        Alert.alert('Success', `${meal.name} logged successfully! 🎉`);
      } else {
        Alert.alert('Error', response.message || 'Failed to log meal');
      }
    } catch (error) {
      console.error('Quick meal error:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    }
  };

  const handleCustomMeal = async () => {
    if (!dietForm.mealName.trim() || !dietForm.calories.trim()) {
      Alert.alert('Validation Error', 'Please enter at least a meal name and calories.');
      return;
    }
    
    console.log('Saving meal with data:', dietForm);
    setLoading(true);
    try {
      const response = await saveDietEntry(dietForm);
      console.log('API response:', response);

      // Always add the meal locally for immediate feedback
      const newLog = {
        ...dietForm,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };
      console.log('Adding new log:', newLog);
      setLogs([newLog, ...logs]);
      
      if (response.success) {
        closeModal();
        resetDietForm();
        Alert.alert('Success', 'Custom meal logged successfully! 🎉');
      } else {
        console.log('API call failed:', response.message);
        Alert.alert('Warning', 'Meal added locally but failed to sync with server. ' + (response.message || 'Please try again later.'));
      }
    } catch (error) {
      console.error('Save diet error:', error);
      
      // Add meal locally even if API fails
      const newLog = {
        ...dietForm,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };
      console.log('Adding meal locally due to API error:', newLog);
      setLogs([newLog, ...logs]);
      
      Alert.alert('Warning', 'Meal added locally but failed to sync with server. Please check your internet connection and try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetDietForm = () => {
    setDietForm({
      mealName: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      fiber: '',
      sugar: '',
      mealType: 'breakfast',
      notes: '',
      photo: null,
    });
  };

  const handleDietInput = (key, value) => {
    setDietForm(prev => ({ ...prev, [key]: value }));
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // User cancelled image picker
      } else if (response.error) {
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setDietForm(prev => ({ ...prev, photo: imageUri }));
      }
    });
  };

  const removePhoto = () => {
    setDietForm(prev => ({ ...prev, photo: null }));
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(modalSlide, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalSlide, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      resetDietForm();
    });
  };

  const deleteMeal = (id) => {
    setLogs(logs.filter(log => log.id !== id));
  };



    // ---- NORMAL UI ----
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#0f0f23' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Nutrition Tracker</Text>
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Icon name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIconContainer}>
              <Icon name="flame" size={24} color="#FF6B6B" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalCalories}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIconContainer}>
              <Icon name="fitness" size={24} color="#4ECDC4" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalProtein}g</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Protein</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statIconContainer}>
              <Icon name="restaurant" size={24} color="#45B7D1" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalMeals}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Meals</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {mealCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.quickActionIcon}>{category.icon}</Text>
              <Text style={[styles.quickActionText, { color: colors.text }]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Meals */}
      <View style={styles.mealsSection}>
        <View style={styles.mealsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Meals</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {logs.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface }]}>
            <Icon name="restaurant-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No meals logged yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Start tracking your nutrition journey</Text>
            <TouchableOpacity style={[styles.addFirstMealButton, { backgroundColor: colors.primary }]} onPress={openModal}>
              <Text style={styles.addFirstMealButtonText}>Add Your First Meal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={logs.slice(0, 3)}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MealCard item={item} index={index} onDelete={deleteMeal} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <PulsingButton style={styles.fab} onPress={openModal}>
        <Icon name="add" size={32} color="#fff" />
      </PulsingButton>

      {/* Custom Meal Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalSlide }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Meal</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Photo Section */}
              <View style={styles.photoSection}>
                <Text style={styles.sectionLabel}>📸 Meal Photo (Optional)</Text>
                {dietForm.photo ? (
                  <View style={styles.photoContainer}>
                    <Image source={{ uri: dietForm.photo }} style={styles.mealPhoto} />
                    <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                      <Text style={styles.removePhotoText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addPhotoButton} onPress={selectImage}>
                    <Icon name="camera" size={32} color="#4ecdc4" />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Basic Info */}
              <Text style={styles.sectionLabel}>🍽️ Meal Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Meal Name"
                placeholderTextColor="#888"
                value={dietForm.mealName}
                onChangeText={(text) => handleDietInput('mealName', text)}
              />

              {/* Meal Type Selector */}
              <View style={styles.mealTypeContainer}>
                <Text style={styles.mealTypeLabel}>Meal Type:</Text>
                <View style={styles.mealTypeButtons}>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.mealTypeButton,
                        dietForm.mealType === type && styles.selectedMealTypeButton
                      ]}
                      onPress={() => handleDietInput('mealType', type)}
                    >
                      <Text style={[
                        styles.mealTypeText,
                        dietForm.mealType === type && styles.selectedMealTypeText
                      ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Calories */}
              <Text style={styles.sectionLabel}>🔥 Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="Calories"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={dietForm.calories}
                onChangeText={(text) => handleDietInput('calories', text)}
              />

              {/* Macronutrients */}
              <Text style={styles.sectionLabel}>🥗 Macronutrients</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Protein (g)"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={dietForm.protein}
                  onChangeText={(text) => handleDietInput('protein', text)}
                />
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Carbs (g)"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={dietForm.carbs}
                  onChangeText={(text) => handleDietInput('carbs', text)}
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Fats (g)"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={dietForm.fats}
                  onChangeText={(text) => handleDietInput('fats', text)}
                />
                <TextInput
                  style={styles.inputHalf}
                  placeholder="Fiber (g)"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={dietForm.fiber}
                  onChangeText={(text) => handleDietInput('fiber', text)}
                />
              </View>

              {/* Notes */}
              <Text style={styles.sectionLabel}>📝 Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Add any notes about your meal..."
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
                value={dietForm.notes}
                onChangeText={(text) => handleDietInput('notes', text)}
              />

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={handleCustomMeal}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Meal</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },

  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'System',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#bbb',
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: 'System',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'System',
    fontWeight: '400',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  mealCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 18,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },
  mealCardContent: {},
  mealCardPhoto: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealTypeBadge: {
    backgroundColor: '#4ecdc4',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  mealTypeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  notesContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  notesText: {
    color: '#bbb',
    fontSize: 13,
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  caloriesBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  caloriesText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'System',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    color: '#bbb',
    fontSize: 13,
    marginBottom: 2,
    fontFamily: 'System',
    fontWeight: '500',
  },
  macroValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'System',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeStamp: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'System',
    fontWeight: '400',
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'System',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 34,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ecdc4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: -2,
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#202040',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 32,
    minHeight: 380,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#282850',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '400',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#282850',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    marginRight: 8,
    fontFamily: 'System',
    fontWeight: '400',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#282850',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: 'System',
    fontWeight: '400',
  },
  addFirstMealButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addFirstMealButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  quickMealsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  quickMealsScroll: {
    paddingVertical: 5,
  },
  quickMealCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginRight: 10,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickMealButton: {
    alignItems: 'center',
  },
  quickMealIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickMealName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'System',
    textAlign: 'center',
  },
  quickMealCalories: {
    fontSize: 12,
    color: '#4ecdc4',
    fontWeight: '600',
    fontFamily: 'System',
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#202040',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '90%',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'System',
  },
  
  // Photo Section Styles
  photoSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'System',
  },
  addPhotoButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ecdc4',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'System',
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  mealPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Meal Type Styles
  mealTypeContainer: {
    marginBottom: 20,
  },
  mealTypeLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'System',
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTypeButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  selectedMealTypeButton: {
    backgroundColor: '#4ecdc4',
    borderColor: '#4ecdc4',
  },
  mealTypeText: {
    color: '#bbb',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
  selectedMealTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Input Styles
  input: {
    backgroundColor: '#282850',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '400',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputHalf: {
    flex: 1,
    backgroundColor: '#282850',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    marginRight: 8,
    fontFamily: 'System',
    fontWeight: '400',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  // New UI Styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  mealsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstMealButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addFirstMealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Action Buttons
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  cancelButton: {
    backgroundColor: '#282850',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
});

export default DietLog;
