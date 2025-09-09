// DietLogEnhanced.js — Updated with Navy & Golden-Yellow Theme

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

const DietLog = () => {
  const [totalCalories, setTotalCalories] = useState(1500);
  const [exerciseCalories, setExerciseCalories] = useState(200);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const remainingCalories = Math.max(dailyCalorieGoal - totalCalories + exerciseCalories, 0);

  const [totalProtein, setTotalProtein] = useState(60);
  const [totalCarbs, setTotalCarbs] = useState(180);
  const [totalFats, setTotalFats] = useState(40);

  const [dailyProteinGoal] = useState(140);
  const [dailyCarbGoal] = useState(250);
  const [dailyFatGoal] = useState(70);

  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFats, setFoodFats] = useState('');
  const [foodPhoto, setFoodPhoto] = useState(null);
  const [editMealId, setEditMealId] = useState(null);

  // Macro row component
  const MacroRow = ({ label, value, goal, color }) => {
    const pct = Math.min(100, Math.round((value / goal) * 100));
    return (
      <View style={styles.macroRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.macroValue}>{value}/{goal}g</Text>
      </View>
    );
  };

  // Permissions for camera (Android)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "We need access to your camera to take meal photos",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const pickPhoto = async (fromCamera = false) => {
    const options = { mediaType: 'photo', quality: 0.7, selectionLimit: 1 };

    try {
      const result = fromCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        setFoodPhoto(result.assets[0].uri);
      } else {
        Alert.alert('Error', 'No photo selected');
      }
    } catch (error) {
      console.log('ImagePicker error:', error);
      Alert.alert('Error', 'Could not access camera or gallery');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) pickPhoto(true);
  };

  // Add or edit meal
  const addOrEditMeal = () => {
    if (!foodName.trim()) return Alert.alert('Validation', 'Please enter meal name');
    const cals = parseInt(foodCalories) || 0;
    const prot = parseInt(foodProtein) || 0;
    const carbs = parseInt(foodCarbs) || 0;
    const fats = parseInt(foodFats) || 0;

    if (editMealId) {
      // Edit meal
      setMeals(prev => {
        const updatedList = prev[selectedMealType].map(item => {
          if (item.id === editMealId) {
            const diffCals = cals - item.calories;
            const diffProt = prot - item.protein;
            const diffCarbs = carbs - item.carbs;
            const diffFats = fats - item.fats;

            setTotalCalories(p => p + diffCals);
            setTotalProtein(p => p + diffProt);
            setTotalCarbs(c => c + diffCarbs);
            setTotalFats(f => f + diffFats);

            return { ...item, name: foodName, calories: cals, protein: prot, carbs, fats, photo: foodPhoto };
          }
          return item;
        });
        return { ...prev, [selectedMealType]: updatedList };
      });
    } else {
      // Add new meal
      const newItem = { id: Date.now().toString(), name: foodName, calories: cals, protein: prot, carbs, fats, photo: foodPhoto };
      setMeals(prev => ({ ...prev, [selectedMealType]: [newItem, ...prev[selectedMealType]] }));
      setTotalCalories(p => p + cals);
      setTotalProtein(p => p + prot);
      setTotalCarbs(c => c + carbs);
      setTotalFats(f => f + fats);
    }

    setFoodName(''); setFoodCalories(''); setFoodProtein(''); setFoodCarbs(''); setFoodFats(''); setFoodPhoto(null); setEditMealId(null);
    setModalVisible(false);
  };

  const deleteMeal = (mealType, id) => {
    const item = meals[mealType].find(m => m.id === id);
    if (!item) return;
    Alert.alert('Delete meal', `Delete ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          setMeals(prev => ({ ...prev, [mealType]: prev[mealType].filter(m => m.id !== id) }));
          setTotalCalories(p => p - item.calories);
          setTotalProtein(p => p - item.protein);
          setTotalCarbs(c => c - item.carbs);
          setTotalFats(f => f - item.fats);
        }
      }
    ]);
  };

  const editMeal = (mealType, meal) => {
    setSelectedMealType(mealType);
    setFoodName(meal.name);
    setFoodCalories(meal.calories.toString());
    setFoodProtein(meal.protein.toString());
    setFoodCarbs(meal.carbs.toString());
    setFoodFats(meal.fats.toString());
    setFoodPhoto(meal.photo);
    setEditMealId(meal.id);
    setModalVisible(true);
  };

  const mockSyncMeals = () => {
    const sample = {
      id: Date.now().toString(),
      name: 'Avocado Toast',
      calories: 220,
      protein: 6,
      carbs: 30,
      fats: 10,
      photo: 'https://images.unsplash.com/photo-1617196030513-ecbf44f2e17a?auto=format&fit=crop&w=400&q=80',
    };
    setMeals(prev => ({ ...prev, Snacks: [sample, ...prev.Snacks] }));
    setTotalCalories(p => p + sample.calories);
    setTotalProtein(p => p + sample.protein);
    setTotalCarbs(c => c + sample.carbs);
    setTotalFats(f => f + sample.fats);
    Alert.alert('Sync complete', 'Imported 1 item from connected app');
  };

  const mockSyncWorkout = () => {
    const burned = 320; setExerciseCalories(p => p + burned);
    Alert.alert('Workout synced', `${burned} kcal added to exercise`);
  };

  const MealItem = ({ item, mealType }) => (
    <View style={styles.mealListItem}>
      <View style={styles.mealThumb}>
        {item.photo ? <Image source={{ uri: item.photo }} style={styles.mealImage} /> : <Text style={styles.mealPlaceholderIcon}>🍽️</Text>}
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealStats}>{item.calories} kcal · {item.protein}P · {item.carbs}C · {item.fats}F</Text>
      </View>
      <View style={styles.mealActionIcons}>
        <TouchableOpacity onPress={() => editMeal(mealType, item)} style={{ marginRight: 6 }}>
          <Icon name="pencil" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteMeal(mealType, item.id)}>
          <Icon name="delete" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Video Header */}
        <View style={styles.mainVideoContainer}>
          <Video source={require('../../assets/video/854082-hd_1920_1080_25fps.mp4')} style={styles.video} resizeMode="cover" repeat muted />
          <View style={styles.videoOverlay}>
            <Text style={styles.workoutTitle}>Fuel Your Gains</Text>
            <Text style={styles.workoutSubtitle}>Track calories & macros to achieve your goals</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRowWrapper}>
          <View style={styles.statsRow}>
            <View style={styles.caloriesCard}>
              <Text style={styles.cardHeading}>Calories</Text>
              <View style={styles.caloriesNumRow}>
                <View style={styles.caloriesNumCol}>
                  <Text style={styles.caloriesValue}>{totalCalories}</Text>
                  <Text style={styles.caloriesLabel}>Food</Text>
                </View>
                <View style={styles.caloriesNumCol}>
                  <Text style={styles.caloriesValue}>{exerciseCalories}</Text>
                  <Text style={styles.caloriesLabel}>Exercise</Text>
                </View>
                <View style={styles.caloriesNumCol}>
                  <Text style={styles.caloriesValueRemaining}>{remainingCalories}</Text>
                  <Text style={styles.caloriesLabel}>Remaining</Text>
                </View>
              </View>
              <View style={styles.calorieProgressTrack}>
                <View style={[styles.calorieProgressFill, { width: `${Math.min(100, Math.round((totalCalories / dailyCalorieGoal) * 100))}%` }]} />
              </View>
              <Text style={styles.calorieGoalText}>Goal {dailyCalorieGoal} kcal · Consumed {totalCalories} kcal</Text>
            </View>

            <View style={styles.macrosCard}>
              <Text style={styles.cardHeading}>Macros</Text>
              <MacroRow label="Carbs" value={totalCarbs} goal={dailyCarbGoal} color="#FFC107" />
              <MacroRow label="Protein" value={totalProtein} goal={dailyProteinGoal} color="#FFA000" />
              <MacroRow label="Fats" value={totalFats} goal={dailyFatGoal} color="#FF5722" />
            </View>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setModalVisible(true)}><Text style={styles.primaryBtnText}>+ Add Meal</Text></TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={mockSyncMeals}><Text style={styles.ghostBtnText}>Sync Meals</Text></TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={mockSyncWorkout}><Text style={styles.ghostBtnText}>Sync Workout</Text></TouchableOpacity>
        </View>

        {/* Meals Lists */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meals</Text>
          {Object.keys(meals).map(mealType => (
            <View key={mealType} style={{ marginBottom: 12 }}>
              <View style={styles.mealHeaderRow}>
                <Text style={styles.mealHeaderTitle}>{mealType}</Text>
                <Text style={styles.mealHeaderCount}>{meals[mealType].length} items</Text>
              </View>
              {meals[mealType].length === 0 ? (
                <View style={styles.emptyMealRow}><Text style={styles.emptyMealText}>No items yet — add or sync a meal</Text></View>
              ) : (
                <FlatList data={meals[mealType]} keyExtractor={i => i.id} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => <MealItem item={item} mealType={mealType} />} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editMealId ? 'Edit Meal' : 'Add Meal'}</Text>
            <View style={styles.mealTypeRow}>
              {['Breakfast','Lunch','Dinner','Snacks'].map(t => (
                <TouchableOpacity key={t} style={[styles.mealTypeBtn, selectedMealType===t && styles.mealTypeBtnActive]} onPress={()=>setSelectedMealType(t)}>
                  <Text style={[styles.mealTypeBtnText, selectedMealType===t && styles.mealTypeBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput placeholder="Food name" placeholderTextColor="#ccc" style={styles.input} value={foodName} onChangeText={setFoodName} />

            <View style={styles.rowInputs}>
              <TextInput placeholder="Calories" placeholderTextColor="#ccc" style={[styles.input,styles.smallInput]} value={foodCalories} onChangeText={setFoodCalories} keyboardType="numeric" />
              <TextInput placeholder="Protein (g)" placeholderTextColor="#ccc" style={[styles.input,styles.smallInput]} value={foodProtein} onChangeText={setFoodProtein} keyboardType="numeric" />
            </View>
            <View style={styles.rowInputs}>
              <TextInput placeholder="Carbs (g)" placeholderTextColor="#ccc" style={[styles.input,styles.smallInput]} value={foodCarbs} onChangeText={setFoodCarbs} keyboardType="numeric" />
              <TextInput placeholder="Fats (g)" placeholderTextColor="#ccc" style={[styles.input,styles.smallInput]} value={foodFats} onChangeText={setFoodFats} keyboardType="numeric" />
            </View>

            <View style={styles.photoRow}>
              <TouchableOpacity onPress={() => pickPhoto(false)} style={styles.photoBtn}><Text style={styles.photoBtnText}>Upload Photo</Text></TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={styles.photoBtn}><Text style={styles.photoBtnText}>Take Photo</Text></TouchableOpacity>
              {foodPhoto ? <Image source={{uri:foodPhoto}} style={styles.photoPreview} /> : <View style={styles.photoPreviewPlaceholder}><Text style={{color:'#ccc'}}>No photo</Text></View>}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={()=>{setModalVisible(false); setEditMealId(null);}}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addOrEditMeal}><Text style={styles.saveBtnText}>{editMealId ? 'Save Changes' : 'Add Meal'}</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default DietLog;


// ---------------------- UPDATED STYLES ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#001f3f' },
  mainVideoContainer: { width: '100%', height: 250 },
  video: { ...StyleSheet.absoluteFillObject },
  videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,31,57,0.5)', padding: 20, justifyContent: 'flex-end' },
  workoutTitle: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 6 },
  workoutSubtitle: { color: '#FFC107', fontSize: 14, fontWeight: '500' },
  statsRowWrapper: { paddingHorizontal: 16, marginTop: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  caloriesCard: { 
    flex: 1, 
    backgroundColor: '#002b5c', 
    borderRadius: 16, 
    padding: 12, 
    marginRight: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 3 }, 
    elevation: 4 
  },
  cardHeading: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  caloriesNumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  caloriesNumCol: { alignItems: 'center' },
  caloriesValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  caloriesValueRemaining: { color: '#FFC107', fontSize: 18, fontWeight: 'bold' },
  caloriesLabel: { color: '#aaa', fontSize: 12 },
  calorieProgressTrack: { backgroundColor: '#002b5c', height: 6, borderRadius: 3, marginVertical: 8 },
  calorieProgressFill: { height: 6, borderRadius: 3, backgroundColor: '#FFC107' },
  calorieGoalText: { color: '#aaa', fontSize: 10, marginTop: 2 },
  macrosCard: { 
    flex: 1, 
    backgroundColor: '#002b5c', 
    borderRadius: 16, 
    padding: 12, 
    marginLeft: 8 
  },
  macroRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  macroLabel: { color: '#aaa', fontSize: 14, width: 60 },
  progressBarBackground: { flex: 1, height: 6, backgroundColor: '#002b5c', borderRadius: 3, marginHorizontal: 8 },
  progressBarFill: { height: 6, borderRadius: 3 },
  macroValue: { color: '#aaa', fontSize: 12, width: 50, textAlign: 'right' },
  actionRow: { 
    paddingHorizontal: 16, 
    marginTop: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  primaryBtn: { 
    backgroundColor: '#FFC107', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    minWidth: 120, 
    alignItems: 'center' 
  },
  primaryBtnText: { color: '#001f3f', fontWeight: '800' },
  ghostBtn: { 
    backgroundColor: '#002b5c', 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#001f3f', 
    marginLeft: 8, 
    alignItems: 'center' 
  },
  ghostBtnText: { color: '#aaa', fontWeight: '700' },
  section: { marginTop: 18, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 10 },
  mealHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mealHeaderTitle: { color: '#ffffff', fontWeight: '800' },
  mealHeaderCount: { color: '#aaa', fontWeight: '700' },
  emptyMealRow: { backgroundColor: '#002b5c', padding: 12, borderRadius: 10 },
  emptyMealText: { color: '#aaa' },
  mealListItem: { 
    backgroundColor: '#002b5c', 
    borderRadius: 12, 
    padding: 10, 
    marginRight: 12, 
    width: Math.min(320, width * 0.8), 
    flexDirection: 'row', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.12, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 3 }, 
    elevation: 4 
  },
  mealThumb: { 
    width: 70, 
    height: 70, 
    borderRadius: 14, 
    overflow: 'hidden', 
    backgroundColor: '#002b5c', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  mealImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mealPlaceholderIcon: { fontSize: 26, color: '#aaa' },
  mealInfo: { flex: 1 },
  mealName: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  mealStats: { color: '#aaa', marginTop: 4, fontSize: 12, fontWeight: '600' },
  modalWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalContent: { backgroundColor: '#002b5c', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  mealTypeRow: { flexDirection: 'row', marginBottom: 10 },
  mealTypeBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#002b5c', 
    marginRight: 8 
  },
  mealTypeBtnActive: { backgroundColor: '#FFC107' },
  mealTypeBtnText: { color: '#aaa', fontWeight: '700', fontSize: 12 },
  mealTypeBtnTextActive: { color: '#001f3f' },
  input: { 
    backgroundColor: '#002b5c', 
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderRadius: 10, 
    color: '#ffffff', 
    marginBottom: 8 
  },
  smallInput: { flex: 1, marginRight: 8 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  photoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  photoBtn: { 
    backgroundColor: '#FFC107', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 10, 
    marginRight: 10 
  },
  photoBtnText: { color: '#001f3f', fontWeight: '800' },
  photoPreview: { width: 56, height: 56, borderRadius: 10 },
  photoPreviewPlaceholder: { 
    width: 56, 
    height: 56, 
    borderRadius: 10, 
    backgroundColor: '#002b5c', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 10, 
    backgroundColor: '#002b5c', 
    marginTop: 6 
  },
  cancelBtnText: { color: '#ffffff', fontWeight: '700' },
  saveBtn: { 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 10, 
    backgroundColor: '#FFC107', 
    marginTop: 6 
  },
  saveBtnText: { color: '#001f3f', fontWeight: '800' },
});