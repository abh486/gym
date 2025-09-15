// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useAuth } from '../../context/AuthContext';
// import dietService from '../../api/dietService';

// const colors = {
//   background: '#ffffff',
//   primary: '#10B981',
//   primaryText: '#ffffff',
//   text: '#333333',
//   textSecondary: '#6b7280',
//   error: '#d32f2f',
//   border: '#ddd',
// };

// const DietLog = () => {
//   const { token } = useAuth();
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newLog, setNewLog] = useState({ meal: '', calories: '' });
//   const [updatingLogId, setUpdatingLogId] = useState(null);
//   const [updatingLogData, setUpdatingLogData] = useState({ meal: '', calories: '' });

//   // Fetch diet logs
//   const fetchLogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
//       const res = await dietService.getDietLogsByDate(token, today);
//       setLogs(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load diet logs.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add new log
//   const addLog = async () => {
//     if (!newLog.meal || !newLog.calories) {
//       Alert.alert('Validation Error', 'Please provide meal and calories.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await dietService.addLog(token, newLog);
//       setNewLog({ meal: '', calories: '' });
//       await fetchLogs();
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to add diet log.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update existing log
//   const updateLog = async () => {
//     if (!updatingLogData.meal || !updatingLogData.calories) {
//       Alert.alert('Validation Error', 'Please provide meal and calories.');
//       return;
//     }
//     setLoading(true);
//     try {
//       await dietService.updateLog(token, updatingLogId, updatingLogData);
//       setUpdatingLogId(null);
//       setUpdatingLogData({ meal: '', calories: '' });
//       await fetchLogs();
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to update diet log.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete log
//   const deleteLog = async (id) => {
//     Alert.alert('Confirm Delete', 'Are you sure you want to delete this entry?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           setLoading(true);
//           try {
//             await dietService.deleteLog(token, id);
//             await fetchLogs();
//           } catch (err) {
//             console.error(err);
//             Alert.alert('Error', 'Failed to delete diet log.');
//           } finally {
//             setLoading(false);
//           }
//         },
//       },
//     ]);
//   };

//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading diet logs...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <Text style={{ color: colors.error, marginBottom: 10 }}>{error}</Text>
//         <TouchableOpacity onPress={fetchLogs} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const renderLogItem = ({ item }) => (
//     <View style={styles.logCard}>
//       {updatingLogId === item.id ? (
//         <View style={styles.editContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Meal"
//             value={updatingLogData.meal}
//             onChangeText={(text) => setUpdatingLogData({ ...updatingLogData, meal: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Calories"
//             keyboardType="numeric"
//             value={updatingLogData.calories}
//             onChangeText={(text) => setUpdatingLogData({ ...updatingLogData, calories: text })}
//           />
//           <View style={styles.editActions}>
//             <TouchableOpacity style={styles.saveButton} onPress={updateLog}>
//               <Text style={styles.saveButtonText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setUpdatingLogId(null)}>
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : (
//         <>
//           <Text style={styles.logText}>{item.meal}</Text>
//           <Text style={styles.logTextSecondary}>{item.calories} kcal</Text>
//           <View style={styles.logActions}>
//             <TouchableOpacity
//               onPress={() => {
//                 setUpdatingLogId(item.id);
//                 setUpdatingLogData({ meal: item.meal, calories: String(item.calories) });
//               }}>
//               <Icon name="edit" size={20} color={colors.primary} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => deleteLog(item.id)}>
//               <Icon name="delete" size={20} color={colors.error} />
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.addLogContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Meal"
//           value={newLog.meal}
//           onChangeText={(text) => setNewLog({ ...newLog, meal: text })}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Calories"
//           keyboardType="numeric"
//           value={newLog.calories}
//           onChangeText={(text) => setNewLog({ ...newLog, calories: text })}
//         />
//         <TouchableOpacity style={styles.addButton} onPress={addLog}>
//           <Text style={styles.addButtonText}>Add</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={logs}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderLogItem}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: colors.background, padding: 16 },
//   center: { justifyContent: 'center', alignItems: 'center' },
//   retryButton: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 20,
//   },
//   retryButtonText: { color: colors.primaryText, fontWeight: 'bold' },
//   addLogContainer: {
//     marginBottom: 20,
//     borderRadius: 10,
//     backgroundColor: '#f8f8f8',
//     padding: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//   },
//   addButton: {
//     backgroundColor: colors.primary,
//     padding: 12,
//     borderRadius: 25,
//     alignItems: 'center',
//   },
//   addButtonText: { color: colors.primaryText, fontWeight: 'bold' },
//   logCard: {
//     padding: 15,
//     marginBottom: 12,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//   },
//   logText: { fontSize: 16, color: colors.text, fontWeight: 'bold' },
//   logTextSecondary: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
//   logActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
//   editContainer: {},
//   editActions: { flexDirection: 'row', justifyContent: 'space-between' },
//   saveButton: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 20,
//     flex: 1,
//     marginRight: 5,
//     alignItems: 'center',
//   },
//   saveButtonText: { color: colors.primaryText, fontWeight: 'bold' },
//   cancelButton: {
//     backgroundColor: colors.error,
//     padding: 10,
//     borderRadius: 20,
//     flex: 1,
//     marginLeft: 5,
//     alignItems: 'center',
//   },
//   cancelButtonText: { color: colors.primaryText, fontWeight: 'bold' },
// });

// export default DietLog;


// src/components/DietLog.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import the API functions that now handle the ngrok token workaround
import {
  getDietLogsByDate,
  createDietLog,
  updateDietLog,
  deleteDietLog,
} from '../../api/dietService'; // Adjust this path if your file structure is different

// Centralized color theme for the component
const colors = {
  background: '#f7f8fc',
  primary: '#10B981',
  primaryText: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  error: '#ef4444',
  border: '#d1d5db',
  cardBackground: '#ffffff',
  shadow: '#000000',
};

const DietLog = () => {
  // --- STATE MANAGEMENT ---
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLog, setNewLog] = useState({ mealName: '', calories: '' });
  
  // State for inline editing
  const [updatingLogId, setUpdatingLogId] = useState(null);
  const [updatingLogData, setUpdatingLogData] = useState({ mealName: '', calories: '' });

  // --- API DATA FETCHING ---
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await getDietLogsByDate(today);
      if (data && Array.isArray(data.logs)) {
        setLogs(data.logs);
      } else {
        console.warn("API did not return a valid 'logs' array. Received:", data);
        setLogs([]);
      }
    } catch (err) {
      console.error("Fetch Logs Error:", JSON.stringify(err, null, 2));
      let detailedError = 'An unknown error occurred.';
      if (err.response) {
        detailedError = `Server Error ${err.response.status}: ${err.response.data?.message || 'Please check server logs.'}`;
      } else if (err.request) {
        detailedError = 'No Response From Server. Check your internet and ngrok tunnel.';
      } else {
        detailedError = `Request Error: ${err.message}`;
      }
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD OPERATIONS ---
  const addLog = async () => {
    if (!newLog.mealName.trim() || !newLog.calories.trim()) {
      Alert.alert('Missing Information', 'Please provide both a meal name and calories.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      await createDietLog({
        mealName: newLog.mealName.trim(),
        calories: parseInt(newLog.calories, 10),
        mealType: 'snack', // Send the required 'mealType' with a default value
      });
      setNewLog({ mealName: '', calories: '' });
      await fetchLogs(); // This will reset loading to false upon completion
    } catch (err) {
      console.error("Add Log Error:", JSON.stringify(err, null, 2));
      const serverMessage = err.response?.data?.message || 'Could not add the diet log. Please try again.';
      Alert.alert('Error', serverMessage);
      // --- FIX: Ensure loading is stopped even if fetchLogs isn't called ---
      setLoading(false); 
    }
    // Note: A 'finally' block is not strictly needed here because fetchLogs() has one.
    // But we keep setLoading(false) in the catch block as a safeguard.
  };

  const updateLog = async () => {
    if (!updatingLogData.mealName.trim() || !updatingLogData.calories) {
      Alert.alert('Missing Information', 'Meal name and calories cannot be empty.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      await updateDietLog(updatingLogId, {
        mealName: updatingLogData.mealName.trim(),
        calories: parseInt(updatingLogData.calories, 10),
      });
      setUpdatingLogId(null);
      await fetchLogs(); // This will reset loading to false upon completion
    } catch (err) {
      console.error("Update Log Error:", JSON.stringify(err, null, 2));
      Alert.alert('Error', 'Could not update the diet log. Please try again.');
      setLoading(false);
    }
  };

  const deleteLog = (id) => {
    Alert.alert(
      'Confirm Deletion', 'Are you sure you want to permanently delete this log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            setLoading(true);
            try {
              await deleteDietLog(id);
              await fetchLogs(); // This will reset loading to false upon completion
            } catch (err) {
              console.error("Delete Log Error:", JSON.stringify(err, null, 2));
              Alert.alert('Error', 'Could not delete the diet log.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchLogs();
  }, []);

  // --- RENDER LOGIC ---
  if (loading) {
    return (<View style={[styles.container, styles.center]}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.loadingText}>Loading...</Text></View>);
  }
  if (error) {
    return (<View style={[styles.container, styles.center]}><Icon name="error-outline" size={60} color={colors.error} /><Text style={styles.errorTitle}>Failed to Load Data</Text><Text style={styles.errorText}>{error}</Text><TouchableOpacity onPress={fetchLogs} style={styles.retryButton}><Text style={styles.buttonText}>Try Again</Text></TouchableOpacity></View>);
  }

  const renderLogItem = ({ item }) => {
    if (!item || !item.id) return null;
    const isEditing = updatingLogId === item.id;
    return (
      <View style={styles.logCard}>
        {isEditing ? (
          <View>
            <TextInput style={styles.input} placeholder="Meal" value={updatingLogData.mealName} onChangeText={(text) => setUpdatingLogData({ ...updatingLogData, mealName: text })} />
            <TextInput style={styles.input} placeholder="Calories" keyboardType="number-pad" value={String(updatingLogData.calories)} onChangeText={(text) => setUpdatingLogData({ ...updatingLogData, calories: text.replace(/[^0-9]/g, '')})} />
            <View style={styles.editActions}>
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => setUpdatingLogId(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={updateLog}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.logDisplay}>
            <View style={styles.logInfo}>
              <Text style={styles.logText}>{item.mealName || 'Unnamed Meal'}</Text>
              <Text style={styles.logTextSecondary}>{item.calories || 0} kcal</Text>
            </View>
            <View style={styles.logActions}>
              <TouchableOpacity onPress={() => { setUpdatingLogId(item.id); setUpdatingLogData({ mealName: item.mealName, calories: String(item.calories) }); }}>
                <Icon name="edit" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteLog(item.id)}>
                <Icon name="delete-outline" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.addLogContainer}>
          <Text style={styles.formTitle}>Add New Log</Text>
          <TextInput style={styles.input} placeholder="Meal (e.g., Apple)" placeholderTextColor={colors.textSecondary} value={newLog.mealName} onChangeText={(text) => setNewLog({ ...newLog, mealName: text })} />
          <TextInput style={styles.input} placeholder="Calories (e.g., 95)" placeholderTextColor={colors.textSecondary} keyboardType="number-pad" value={newLog.calories} onChangeText={(text) => setNewLog({ ...newLog, calories: text.replace(/[^0-9]/g, '')})} />
          <TouchableOpacity style={styles.addButton} onPress={addLog}>
            <Text style={styles.buttonText}>Add to Diary</Text>
          </TouchableOpacity>
        </View>

        <FlatList data={logs} keyExtractor={(item) => item?.id?.toString()} renderItem={renderLogItem} ListEmptyComponent={<View style={styles.emptyListContainer}><Text style={styles.emptyListText}>No logs for today.</Text><Text style={styles.emptyListSubText}>Add your first meal above to get started!</Text></View>} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} />
      </View>
    </TouchableWithoutFeedback>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { marginTop: 10, color: colors.textSecondary, fontSize: 16 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
  errorText: { color: colors.textSecondary, marginBottom: 20, textAlign: 'center', fontSize: 16, },
  retryButton: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  addLogContainer: { marginBottom: 24, borderRadius: 12, backgroundColor: colors.cardBackground, padding: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fdfdff', fontSize: 16, color: colors.text, },
  addButton: { backgroundColor: colors.primary, padding: 14, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: colors.primaryText, fontWeight: 'bold', fontSize: 16 },
  logCard: { padding: 16, marginBottom: 12, backgroundColor: colors.cardBackground, borderRadius: 12, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, },
  logDisplay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logInfo: { flex: 1 },
  logText: { fontSize: 16, color: colors.text, fontWeight: '600' },
  logTextSecondary: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  logActions: { flexDirection: 'row', gap: 20, marginLeft: 16 },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 10 },
  actionButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignItems: 'center', flex: 1 },
  saveButton: { backgroundColor: colors.primary },
  cancelButton: { backgroundColor: colors.textSecondary },
  emptyListContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyListText: { fontSize: 18, fontWeight: '600', color: colors.textSecondary },
  emptyListSubText: { fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center'},
});

export default DietLog;