import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';

const { width } = Dimensions.get('window');

const LocationMain = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [gymsLoading, setGymsLoading] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [showGymDetailsModal, setShowGymDetailsModal] = useState(false);

  const mapRef = useRef(null);

  const initialRegion = {
    latitude: 28.7041,
    longitude: 77.1025,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : initialRegion;

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const restored = await restoreLocationState();
      if (!restored) {
        await checkLocationPermission();
      }
    } catch (error) {
      setError('Failed to initialize location. Please try again.');
      setLoading(false);
    }
  };

  const saveLocationToStorage = async (location, permission) => {
    try {
      const locationData = {
        latitude: location?.latitude,
        longitude: location?.longitude,
        timestamp: Date.now(),
        permission: permission,
      };
      await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
    } catch (error) {
      // ignored
    }
  };

  const restoreLocationState = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('userLocation');
      if (storedLocation) {
        const locationData = JSON.parse(storedLocation);
        const now = Date.now();
        const locationAge = now - locationData.timestamp;
        if (locationAge < 30 * 60 * 1000) {
          setUserLocation({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          });
          setLocationPermission(locationData.permission);

          if (locationData.permission) {
            fetchGyms({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
            });
          }
          setLoading(false);
          return true;
        } else {
          await AsyncStorage.removeItem('userLocation');
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted) {
          await getCurrentLocation();
        } else {
          setError('Location permission denied. Please enable location.');
          setLoading(false);
        }
      } catch {
        setError('Error checking location permission.');
        setLoading(false);
      }
    } else {
      await getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError('');
      const options = {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 600000,
        distanceFilter: 50,
      };

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            setError('Invalid location data received. Please try again.');
            setLoading(false);
            reject(new Error('Invalid coordinates'));
            return;
          }

          const newLocation = { latitude, longitude };
          setUserLocation(newLocation);
          setLocationPermission(true);
          setLoading(false);
          await saveLocationToStorage(newLocation, true);
          fetchGyms(newLocation);
          centerMapOnUser();
          resolve(newLocation);
        },
        (error) => {
          setLocationPermission(false);
          setUserLocation(null);
          let errorMessage = 'Could not get your location. ';
          switch (error.code) {
            case 1:
              errorMessage += 'Permission denied. Enable location access.';
              break;
            case 2:
              errorMessage += 'Location unavailable. Check GPS settings.';
              break;
            case 3:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please check your location settings.';
          }
          setError(errorMessage);
          setLoading(false);
          setGyms([]);
          reject(error);
        },
        options
      );
    });
  };

  const fetchGyms = async (location) => {
    if (!location || !location.latitude || !location.longitude) {
      setGyms([]);
      setError('Location not available.');
      return;
    }
    setGymsLoading(true);
    setError('');

    // Simulate gym fetching here. Replace with actual API call.
    try {
      // Example gyms data - replace or modify as needed
      const exampleGyms = [
        {
          id: '1',
          name: 'Fitness Gym 1',
          latitude: location.latitude + 0.01,
          longitude: location.longitude + 0.01,
          address: '123 Main St',
          image:
            'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=2070&q=80',
          type: 'Gym',
          rating: 4.5,
          dailyPassPrice: 299,
          monthlyPrice: 1999,
          yearlyPrice: 19999,
          distance: 1.2,
        },
        {
          id: '2',
          name: 'Health Club 2',
          latitude: location.latitude - 0.01,
          longitude: location.longitude - 0.01,
          address: '456 Market Rd',
          image:
            'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=2070&q=80',
          type: 'Health Club',
          rating: 4.2,
          dailyPassPrice: 250,
          monthlyPrice: 1799,
          yearlyPrice: 17999,
          distance: 2.3,
        },
      ];

      const formattedGyms = exampleGyms.map((gym) => ({
        ...gym,
        coordinates: { latitude: gym.latitude, longitude: gym.longitude },
      }));

      setGyms(formattedGyms);
      setError('');
    } catch {
      setGyms([]);
      setError('Failed to load gyms');
    } finally {
      setGymsLoading(false);
    }
  };

  const centerMapOnUser = () => {
    if (mapRef.current && userLocation) {
      const region = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const renderGymList = () => {
    if (gymsLoading) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <ActivityIndicator size="small" color="#e74c3c" />
          <Text style={{ marginTop: 10, fontSize: 14 }}>Loading gyms...</Text>
        </View>
      );
    }

    if (gyms.length === 0) {
      return (
        <View style={styles.noGymsContainer}>
          <Icon name="fitness-outline" size={60} color="#ccc" />
          <Text style={styles.noGymsText}>No gyms found</Text>
          <Text style={styles.noGymsSubtext}>
            {locationPermission
              ? 'Try increasing the radius or check back later for new gyms.'
              : 'No gyms available at the moment.'}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ marginTop: 20 }}>
        <View style={styles.listContainer}>
          {gyms.map((gym, index) => (
            <TouchableOpacity
              key={gym.id}
              style={styles.listCard}
              onPress={() => {
                setSelectedGym(gym);
                setShowGymDetailsModal(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.listCardImageContainer}>
                <Image
                  source={{
                    uri:
                      gym.image ||
                      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=2070&q=80',
                  }}
                  style={styles.listCardImage}
                  resizeMode="cover"
                />
                {gym.type && (
                  <View style={styles.listImageOverlay}>
                    <View style={styles.listGymTypeBadge}>
                      <Text style={styles.listGymTypeText}>{gym.type}</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.listCardContent}>
                <View style={styles.listCardHeader}>
                  <Text style={styles.listGymName} numberOfLines={1}>
                    {gym.name}
                  </Text>
                </View>

                <View style={styles.listLocationContainer}>
                  <VectorIcon name="location-on" size={14} color="#666" />
                  <Text style={styles.listLocationText} numberOfLines={1}>
                    {gym.address && gym.address.length > 30
                      ? gym.address.substring(0, 30) + '...'
                      : gym.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
            onMapReady={centerMapOnUser}
          >
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="You are here"
                description="Your current location"
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.userLocationMarker}>
                  <View style={styles.userLocationDot} />
                </View>
              </Marker>
            )}

            {gyms.map((gym) => (
              <Marker
                key={gym.id}
                coordinate={gym.coordinates}
                title={gym.name}
                description={gym.address}
                pinColor="#27ae60"
                onPress={() => {
                  setSelectedGym(gym);
                  setShowGymDetailsModal(true);
                }}
              />
            ))}
          </MapView>
          {userLocation && (
            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={centerMapOnUser}
              activeOpacity={0.8}
            >
              <Icon name="locate" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#e74c3c" />
              <Text style={styles.loadingText}>
                {locationPermission ? 'Getting location...' : 'Requesting permission...'}
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={24} color="#e74c3c" style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.gymListTitle}>
            {userLocation ? `Nearby Gyms (${gyms.length})` : 'Location Required'}
          </Text>

          {!userLocation && !loading && (
            <View style={styles.noLocationContainer}>
              <Icon name="location-outline" size={60} color="#ccc" />
              <Text style={styles.noLocationText}>Location Access Required</Text>
              <Text style={styles.noLocationSubtext}>
                We need your location to show nearby gyms. Please enable location access.
              </Text>
              <TouchableOpacity style={styles.enableLocationButton} onPress={initializeLocation}>
                <Text style={styles.enableLocationText}>Enable Location</Text>
              </TouchableOpacity>
            </View>
          )}

          {userLocation && renderGymList()}
        </View>

        <Modal
          visible={showGymDetailsModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGymDetailsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.gymDetailsModal}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowGymDetailsModal(false)}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>

              <View style={styles.modalImageContainer}>
                <Image
                  source={{
                    uri:
                      selectedGym?.image ||
                      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=2070&q=80',
                  }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                {selectedGym?.type && (
                  <View style={styles.modalImageOverlay}>
                    <View style={styles.modalGymTypeBadge}>
                      <Text style={styles.modalGymTypeText}>{selectedGym.type}</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.modalContent}>
                <Text style={styles.modalGymName}>{selectedGym?.name}</Text>

                <View style={styles.modalAddressContainer}>
                  <Icon name="location-outline" size={16} color="#666" />
                  <Text style={styles.modalAddressText}>{selectedGym?.address}</Text>
                </View>

                {/* Additional gym info, pricing, etc. can be added here if needed */}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: '55%',
  },
  map: {
    flex: 1,
  },
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#27ae60',
    borderWidth: 3,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  loadingOverlay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  errorIcon: {
    marginBottom: 10,
  },
  gymListTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    color: '#1a237e',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  listCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
  },
  listCardImageContainer: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  listCardImage: {
    width: '100%',
    height: '100%',
  },
  listImageOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  listGymTypeBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  listGymTypeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  listCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  listCardHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  listGymName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  listLocationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listLocationText: {
    fontSize: 15,
    color: '#7f8c8d',
    marginLeft: 6,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  myLocationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  noLocationContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noLocationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  noLocationSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  enableLocationButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  enableLocationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymDetailsModal: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    height: 200,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalGymTypeBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalGymTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  modalContent: {
    padding: 20,
  },
  modalGymName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalAddressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  modalAddressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default LocationMain;
