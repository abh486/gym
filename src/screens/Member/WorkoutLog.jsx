import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image,
    TextInput,
    FlatList,
    SafeAreaView,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { getExerciseLibrary, logWorkoutSession } from '../../api/workoutService';

const { width } = Dimensions.get('window');

// --- CONFIGURATION ---
const USE_BACKEND = true; // Set to true to use your backend

// --- MOCK DATA ---
const fetchMockExercises = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', name: 'Bench Press', type: 'Chest', equipment: ['Barbell'], difficulty: 'Intermediate' },
                { id: '2', name: 'Backward Lunge', type: 'Glutes, Quadriceps', equipment: ['Bodyweight'], difficulty: 'Beginner' },
                { id: '3', name: 'Arm Circles', type: 'Shoulders', equipment: ['Bodyweight'], difficulty: 'Beginner' },
                { id: '4', name: 'Pull Up', type: 'Back', equipment: ['Pull-up Bar'], difficulty: 'Advanced' },
                { id: '5', name: 'Pike Push-Up', type: 'Shoulders, Triceps', equipment: ['Mat'], difficulty: 'Intermediate' },
                { id: '6', name: 'Front raise', type: 'Shoulders', equipment: ['Dumbbell'], difficulty: 'Beginner' },
            ]);
        }, 800);
    });
};

// --- UI HELPERS ---
const tagColorMap = {
    default: '#FFC107', chest: '#FF5252', glutes: '#FFA000', quadriceps: '#FFA000',
    shoulders: '#FF6B35', back: '#00C8C8', triceps: '#FF5252', biceps: '#9C27B0',
    core: '#2196F3', cardio: '#4CAF50',
};

const exerciseImageMap = {
    'Bench Press': require('../../assets/image/chest.jpg'),
    'Backward Lunge': require('../../assets/image/gultes.jpg'),
    'Arm Circles': require('../../assets/image/arm.jpg'),
    'Pull Up': require('../../assets/image/pullup.jpg'),
    'Pike Push-Up': require('../../assets/image/pickpush.jpg'),
    'Front raise': require('../../assets/image/frontraise.jpg'),
};

const transformExerciseData = (exercise) => {
    const tagLabel = exercise.type || 'General';
    const tagKey = tagLabel.toLowerCase().split(',')[0];
    return {
        id: exercise.id, title: exercise.name,
        tag: { label: tagLabel, color: tagColorMap[tagKey] || tagColorMap.default },
        image: exerciseImageMap[exercise.name] || require('../../assets/image/boy.jpg'),
        equipment: exercise.equipment || ['N/A'], difficulty: exercise.difficulty || 'Intermediate',
        favorite: false,
    };
};

// --- STATIC DATA ---
const categories = [
    { id: 'all', title: 'All' }, { id: 'favorites', title: 'Favorites' }, { id: 'cardio', title: 'Cardio' },
    { id: 'back', title: 'Back' }, { id: 'chest', title: 'Chest' }, { id: 'shoulders', title: 'Shoulders' },
];

const equipmentIcons = [
    { id: 1, source: require('../../assets/image/eq1.jpg') }, { id: 2, source: require('../../assets/image/eq2.jpg') },
    { id: 3, source: require('../../assets/image/eq3.jpg') }, { id: 4, source: require('../../assets/image/eq4.jpg') },
    { id: 5, source: require('../../assets/image/eq5.jpg') }, { id: 6, source: require('../../assets/image/eq6.jpg') },
];

// --- SUB-COMPONENTS ---
const ExerciseItem = React.memo(({ item, isSelected, isFavorite, onSelect, onToggleFavorite }) => (
    <TouchableOpacity
        style={[styles.exerciseItemSelectable, isSelected && styles.selectedItem]}
        onPress={() => onSelect(item)}
    >
        <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.exerciseImage} />
            <View style={styles.difficultyBadge}><Text style={styles.difficultyText}>{item.difficulty.substring(0, 1)}</Text></View>
        </View>
        <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseTitleSelectable} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.tag, { backgroundColor: item.tag.color }]}><Text style={styles.tagText}>{item.tag.label}</Text></View>
            <View style={styles.metaRow}>
                <View style={styles.equipmentRow}>
                    {item.equipment.slice(0, 2).map((eq, idx) => (
                        <Text key={idx} style={styles.equipmentText}>{eq}{idx < item.equipment.length - 1 && idx < 1 ? ', ' : ''}</Text>
                    ))}
                    {item.equipment.length > 2 && (<Text style={styles.equipmentText}>+{item.equipment.length - 2}</Text>)}
                </View>
            </View>
        </View>
        <View style={styles.actionContainer}>
            {isSelected ? (<Icon name="checkmark-circle" size={26} color="#4CAF50" style={styles.actionIcon} />) : (<View style={styles.spacer} />)}
            <TouchableOpacity style={styles.starButton} onPress={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}>
                <Icon name={isFavorite ? "star" : "star-outline"} size={22} color="#FFC107" />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
));

// --- MAIN COMPONENT ---
const WorkoutLog = ({ navigation }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [tempSelectedExercises, setTempSelectedExercises] = useState(new Set());
    // --- MODIFICATION 2: Add saving state for API call ---
    const [isSaving, setIsSaving] = useState(false);

   // In your WorkoutLog component, replace the existing loadExercises function

const loadExercises = useCallback(async () => {
    setLoading(true);
    console.log('[DEBUG] Starting to load exercises...'); // Log start

    try {
        const data = USE_BACKEND
            ? await getExerciseLibrary()
            // This mock data part will be skipped if USE_BACKEND is true
            : await fetchMockExercises();

        // --- IMPORTANT LOGGING ---
        // This will show us exactly what the API returned.
        console.log('[DEBUG] Raw data received from API:', data);

        // Check if the data is valid before trying to map it
        if (!Array.isArray(data)) {
            console.error('[DEBUG] ERROR: Data received is not an array!', data);
            // Handle the case where the backend might return an error object
            throw new Error('Invalid data format from server.');
        }

        if (data.length === 0) {
            console.warn('[DEBUG] WARNING: API returned an empty array. The database might be empty.');
        }
        // --- END IMPORTANT LOGGING ---

        const transformedData = data.map(transformExerciseData);
        setExercises(transformedData);

    } catch (error) {
        // --- CRITICAL ERROR LOGGING ---
        // This will show us if the API call itself failed (e.g., network error)
        console.error("[DEBUG] CRITICAL ERROR fetching exercises:", error);
        Alert.alert(
            'Loading Error',
            'Failed to load exercises. Please check your connection and try again.'
        );
    } finally {
        setLoading(false);
        console.log('[DEBUG] Finished loading exercises.'); // Log end
    }
}, []);

    useEffect(() => {
        if (isSelecting && exercises.length === 0) {
            loadExercises();
        }
    }, [isSelecting, exercises.length, loadExercises]);

    useEffect(() => {
        let result = exercises;
        if (selectedCategory !== 'all') {
            result = result.filter(ex =>
                selectedCategory === 'favorites' ? ex.favorite : ex.tag?.label?.toLowerCase().includes(selectedCategory)
            );
        }
        if (searchText.trim()) {
            const term = searchText.toLowerCase();
            result = result.filter(ex =>
                ex.title?.toLowerCase().includes(term) ||
                ex.tag?.label?.toLowerCase().includes(term) ||
                ex.equipment?.some(eq => eq.toLowerCase().includes(term))
            );
        }
        setFilteredExercises(result);
    }, [searchText, selectedCategory, exercises]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadExercises();
        setRefreshing(false);
    }, [loadExercises]);

    const toggleSelectExercise = (exercise) => {
        const newSelection = new Set(tempSelectedExercises);
        if (newSelection.has(exercise.id)) {
            newSelection.delete(exercise.id);
        } else {
            newSelection.add(exercise.id);
        }
        setTempSelectedExercises(newSelection);
    };

    const toggleFavorite = (id) => {
        setExercises(prev =>
            prev.map(ex => (ex.id === id ? { ...ex, favorite: !ex.favorite } : ex))
        );
    };
    
    // --- MODIFICATION 3: REWRITE THIS ENTIRE FUNCTION ---
    const handleDoneSelecting = async () => {
        if (isSaving) return; // Prevent double clicks

        // Find the full exercise objects based on the selected IDs
        const finalSelectedList = exercises.filter(ex => tempSelectedExercises.has(ex.id));

        // If nothing was selected, just close the screen
        if (finalSelectedList.length === 0) {
            setIsSelecting(false);
            return;
        }

        setIsSaving(true);

        // Prepare the data payload for the backend API
        const sessionData = {
            workoutName: 'Custom Workout', // You can make this dynamic later
            exercises: finalSelectedList.map(exercise => ({
                exerciseId: exercise.id,
                // Add default values for sets, reps, weight if needed.
                // Otherwise, the backend will use its defaults (e.g., null)
            })),
            date: new Date().toISOString(),
            // You can derive other data from the selected exercises
            muscleGroups: [...new Set(finalSelectedList.flatMap(ex => ex.tag.label.split(', ')))],
            equipment: [...new Set(finalSelectedList.flatMap(ex => ex.equipment))],
        };

        try {
            // Send the request to the backend
            console.log('Sending workout data to backend:', JSON.stringify(sessionData, null, 2));
            await logWorkoutSession(sessionData);

            // If successful, update the UI and show a success message
            setSelectedExercises(finalSelectedList);
            Alert.alert('Success', 'Exercises have been added to your workout!');
            setIsSelecting(false);

        } catch (error) {
            // If it fails, log the error and show an error message
            console.error("Failed to save workout session:", error);
            Alert.alert('Error', 'Could not save your workout. Please try again.');
        } finally {
            // Stop the loading indicator
            setIsSaving(false);
        }
    };

    const handleAddExercise = () => {
        setTempSelectedExercises(new Set(selectedExercises.map(e => e.id)));
        setIsSelecting(true);
    };

    const renderExerciseListItem = ({ item }) => (
        <ExerciseItem
            item={item}
            isSelected={tempSelectedExercises.has(item.id)}
            isFavorite={item.favorite}
            onSelect={toggleSelectExercise}
            onToggleFavorite={toggleFavorite}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Icon name="fitness-outline" size={64} color="#FFC107" />
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filter criteria.</Text>
            <TouchableOpacity style={styles.resetButton} onPress={() => { setSearchText(''); setSelectedCategory('all'); }}>
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

    if (isSelecting) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#001f3f" />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setIsSelecting(false)} disabled={isSaving}>
                        <Icon name="arrow-back" size={24} color="#FFC107" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Select Exercises</Text>
                    {/* --- MODIFICATION 4: Update the "Done" button --- */}
                    <TouchableOpacity style={styles.doneButton} onPress={handleDoneSelecting} disabled={isSaving}>
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#001f3f" />
                        ) : (
                            <Text style={styles.doneButtonText}>Done</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#FFC107" />
                    <TextInput
                        style={styles.searchInput} placeholder="Search exercises, equipment..." placeholderTextColor="#aaa"
                        value={searchText} onChangeText={setSearchText}
                    />
                    {searchText ? (<TouchableOpacity onPress={() => setSearchText('')}><Icon name="close-circle" size={20} color="#aaa" /></TouchableOpacity>) : null}
                </View>
                <View style={styles.stickyCategories}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map((cat) => (
                            <TouchableOpacity key={cat.id} style={styles.categoryTab} onPress={() => setSelectedCategory(cat.id)}>
                                <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.title}</Text>
                                {selectedCategory === cat.id && <View style={styles.underline} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                {loading ? renderLoading() : (
                    <FlatList
                        data={filteredExercises} keyExtractor={(item) => item.id.toString()} renderItem={renderExerciseListItem}
                        contentContainerStyle={styles.listContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FFC107']} tintColor="#FFC107" />}
                        ListEmptyComponent={renderEmptyState} ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    />
                )}
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#001f3f" />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.mainVideoContainer}>
                    <Video source={require('../../assets/video/2376809-hd_1920_1080_24fps.mp4')} style={styles.video} resizeMode="cover" repeat muted />
                    <View style={styles.videoOverlay} />
                    <View style={styles.videoContent}>
                        <View style={styles.workoutInfo}>
                            <Text style={styles.workoutTitle}>Hamstrings,{'\n'}Chest, Biceps</Text>
                            <View style={styles.createdInfo}><Text style={styles.createdText}>🔧 Custom Workout</Text></View>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Equipment</Text>
                        <View style={styles.badge}><Text style={styles.badgeText}>6</Text></View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {equipmentIcons.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.equipmentItem}>
                                <View style={styles.equipmentIconContainer}><Image source={item.source} style={styles.equipmentIcon} /></View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Exercises</Text>
                        <View style={styles.badge}><Text style={styles.badgeText}>{selectedExercises.length}</Text></View>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
                            <Text style={styles.addButtonText}>Add</Text>
                            <Text style={styles.addButtonIcon}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {selectedExercises.length === 0 ? (
                        <View style={styles.emptyExerciseContainer}>
                            <Icon name="barbell-outline" size={40} color="#FFC107" />
                            <Text style={styles.emptyExerciseText}>No exercises added yet.</Text>
                            <Text style={styles.emptyExerciseSubtext}>Tap 'Add' to build your workout.</Text>
                        </View>
                    ) : (
                        selectedExercises.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.exerciseItem}>
                                <View style={styles.exerciseImageContainer}><Image source={item.image} style={styles.exerciseImageStyle} /></View>
                                <View style={styles.exerciseInfo}>
                                    <Text style={styles.exerciseName}>{item.title}</Text>
                                    <Text style={styles.exerciseDetails}>{item.tag.label}</Text>
                                </View>
                                <TouchableOpacity style={styles.exerciseMenu}><Text style={styles.exerciseMenuIcon}>⋯</Text></TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={[styles.startButton, selectedExercises.length === 0 && styles.disabledStartButton]}
                onPress={() => navigation.navigate('StartWorkout')}
                disabled={selectedExercises.length === 0}
            >
                <Text style={styles.startButtonText}>Start Workout</Text>
            </TouchableOpacity>
            <View style={styles.homeIndicator} />
        </View>
    );
};

// --- STYLES (NO CHANGES, OMITTED FOR BREVITY) ---
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    videoContent: {
        ...StyleSheet.absoluteFillObject,
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
        elevation: 3,
    },
    exerciseImageContainer: {
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
        elevation: 5,
    },
    disabledStartButton: {
        backgroundColor: '#555',
        elevation: 0,
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
        textAlign: 'center',
        marginHorizontal: 16
    },
    doneButton: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 70, // Added for consistent size during loading
        alignItems: 'center', // Added for centering activity indicator
        justifyContent: 'center', // Added for centering activity indicator
    },
    doneButtonText: {
        color: '#001f3f',
        fontWeight: '700',
        fontSize: 16,
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
        paddingLeft: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    categoryTab: {
        marginRight: 24,
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
        paddingVertical: 16,
    },
    exerciseItemSelectable: {
        flexDirection: 'row',
        backgroundColor: '#002b5c',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
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
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 16,
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
    },
    difficultyBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    difficultyText: {
        color: '#FFC107',
        fontSize: 12,
        fontWeight: '700',
    },
    exerciseTitleSelectable: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 17,
        marginBottom: 6,
    },
    tag: {
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    tagText: {
        fontSize: 12,
        color: '#001f3f',
        fontWeight: '700',
    },
    metaRow: {
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
        marginLeft: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
    },
    actionIcon: {
        marginBottom: 8,
    },
    spacer: {
        height: 34, // Matches the size of the checkmark icon + margin
    },
    starButton: {
        padding: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    emptyExerciseContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#002b5c',
        borderRadius: 16,
    },
    emptyExerciseText: {
        marginTop: 16,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    },
    emptyExerciseSubtext: {
        marginTop: 4,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
});

export default WorkoutLog;