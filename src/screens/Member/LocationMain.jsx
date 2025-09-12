// LocationMain_Themed.js — Fixed: No Extra Space at Bottom

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
  Animated,
} from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';

const { width, height } = Dimensions.get('window');

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
  const scrollViewRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

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

  // ✅ Map starts at 40% → grows to 70% when scrolling up
  const mapHeight = scrollY.interpolate({
    inputRange: [0, height * 0.7],
    outputRange: [height * 0.4, height * 0.7], // 40% → 70%
    extrapolate: 'clamp',
  });

  // ✅ Card height: starts at 60% → shrinks to 30% as map grows
  const cardHeight = scrollY.interpolate({
    inputRange: [0, height * 0.7],
    outputRange: [height * 0.6, height * 0.3], // 60% → 30%
    extrapolate: 'clamp',
  });

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
    } catch {}
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
    try {
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
        {
          id: '3',
          name: 'PowerFit Studio',
          latitude: location.latitude + 0.02,
          longitude: location.longitude + 0.02,
          address: '789 Fitness Ave',
          image:
            'https://images.unsplash.com/photo-1551434678-e0765915b995?auto=format&fit=crop&w=2070&q=80',
          type: 'Studio',
          rating: 4.8,
          dailyPassPrice: 349,
          monthlyPrice: 2499,
          yearlyPrice: 24999,
          distance: 1.5,
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
          <ActivityIndicator size="small" color="#FFC107" />
          <Text style={{ marginTop: 10, fontSize: 14, color: '#aaa' }}>Loading gyms...</Text>
        </View>
      );
    }
    if (gyms.length === 0) {
      return (
        <View style={styles.noGymsContainer}>
          <Icon name="fitness-outline" size={60} color="#aaa" />
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
      <>
        {gyms.map((gym) => (
          <TouchableOpacity
            key={gym.id}
            style={styles.listCard}
            onPress={() => {
              setSelectedGym(gym);
              setShowGymDetailsModal(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.listCardContentLeft}>
              <Text style={styles.listGymName}>{gym.name}</Text>
              <View style={styles.listRatingRow}>
                <VectorIcon name="star" size={14} color="#FFC107" />
                <Text style={styles.listRatingText}>{gym.rating}</Text>
                <Text style={styles.listDistanceText}>{gym.distance.toFixed(1)} km</Text>
              </View>
              <View style={styles.listAddressRow}>
                <VectorIcon name="location-on" size={14} color="#aaa" />
                <Text style={styles.listAddressText} numberOfLines={1}>
                  {gym.address}
                </Text>
              </View>
              <View style={styles.listPriceRow}>
                <Text style={styles.listPriceText}>₹{gym.dailyPassPrice}/day</Text>
              </View>
            </View>
            <View style={styles.listCardImageContainer}>
              <Image
                source={{ uri: gym.image }}
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
          </TouchableOpacity>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#001f3f' }}>
      <StatusBar backgroundColor="#001f3f" barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#001f3f' }}>
        {/* ✅ Map: Grows from 40% → 70% as you scroll up */}
        <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
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
              <Marker coordinate={userLocation} title="You are here" description="Your current location">
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
                pinColor="#FFC107"
                onPress={() => {
                  setSelectedGym(gym);
                  setShowGymDetailsModal(true);
                }}
              />
            ))}
          </MapView>
          {userLocation && (
            <TouchableOpacity style={styles.myLocationButton} onPress={centerMapOnUser}>
              <Icon name="locate" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFC107" />
            <Text style={styles.loadingText}>
              {locationPermission ? 'Getting location...' : 'Requesting permission...'}
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle-outline" size={24} color="#FFC107" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ✅ Card: Positioned at bottom, height shrinks as map grows */}
        <Animated.View
          style={[
            styles.contentCard,
            {
              height: cardHeight,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
            },
          ]}
        >
          <Animated.ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
              flexGrow: 1,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            bounces={true}
            removeClippedSubviews={true}
          >
            <Text style={styles.gymListTitle}>
              {userLocation ? `Nearby Gyms (${gyms.length})` : 'Location Required'}
            </Text>

            {!userLocation && !loading && (
              <View style={styles.noLocationContainer}>
                <Icon name="location-outline" size={60} color="#aaa" />
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
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

// ---------------------- STYLES (UPDATED CARD) ----------------------
const styles = StyleSheet.create({
  contentCard: {
    backgroundColor: '#002b5c',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  mapContainer: { position: 'relative', zIndex: 5 },
  map: { flex: 1 },
  userLocationMarker: { alignItems: 'center', justifyContent: 'center' },
  userLocationDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFC107',
    borderWidth: 3,
    borderColor: '#001f3f',
  },
  loadingOverlay: { alignItems: 'center', marginBottom: 20 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#aaa' },
  errorContainer: { alignItems: 'center', marginBottom: 20 },
  errorText: { color: '#FFC107', fontSize: 16, textAlign: 'center' },
  errorIcon: { marginBottom: 10 },
  gymListTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: '#002b5c',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    height: 150,
    padding: 10,
  },
  listCardContentLeft: { flex: 1, padding: 12, justifyContent: 'flex-start' },
  listGymName: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  listRatingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  listRatingText: { fontSize: 14, color: '#FFC107', marginLeft: 4, marginRight: 8 },
  listDistanceText: { fontSize: 12, color: '#aaa' },
  listAddressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  listAddressText: { fontSize: 14, color: '#aaa', marginLeft: 4, flex: 1, lineHeight: 20 },
  listPriceRow: { flexDirection: 'row', alignItems: 'center' },
  listPriceText: { fontSize: 14, color: '#FFC107', fontWeight: '600' },
  listCardImageContainer: { width: 200, height: '100%', position: 'relative' },
  listCardImage: { width: '100%', height: '100%', borderRadius: 12 },
  listImageOverlay: { position: 'absolute', top: 6, right: 6 },
  listGymTypeBadge: { backgroundColor: '#FFC107', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  listGymTypeText: { fontSize: 8, fontWeight: 'bold', color: '#001f3f', textTransform: 'uppercase' },
  myLocationButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  noLocationContainer: { alignItems: 'center', marginTop: 50, padding: 20 },
  noLocationText: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginTop: 10 },
  noLocationSubtext: { fontSize: 14, color: '#aaa', marginTop: 5, textAlign: 'center' },
  enableLocationButton: {
    marginTop: 10,
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  enableLocationText: { color: '#001f3f', fontSize: 16, fontWeight: 'bold' },
  noGymsContainer: { alignItems: 'center', marginTop: 50, padding: 20 },
  noGymsText: { fontSize: 20, fontWeight: 'bold', color: '#aaa', marginTop: 10 },
  noGymsSubtext: { fontSize: 14, color: '#aaa', marginTop: 5, textAlign: 'center' },
});

export default LocationMain;