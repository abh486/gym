// src/screens/LocationMain.jsx
import React, { useState, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Animated } from 'react-native';

// Import your actual API service
import * as gymService from '../../api/gymService'; 

// Import our new hooks and the main UI component
import { useLocationManager } from '../../hooks/useLocationManager';
import { useGymData } from '../../hooks/useGymData';
import { LocationContent } from '../../components/LocationContent';

export const LocationMain = () => {
  const mapRef = useRef(null);
  
  // State for the details modal, holds the FULL gym object with plans
  const [selectedGymDetails, setSelectedGymDetails] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  const { 
    userLocation, 
    permissionGranted, 
    isLoading: isLocationLoading, 
    error: locationError, 
    showPermissionModal, // We will use this to drive the permission overlay
    actions: locationActions 
  } = useLocationManager();

  // This hook now only fetches the list of gyms without plans, which is faster
  const { 
    gyms, 
    isLoading: areGymsLoading, 
    error: gymError, 
    hasMore,
    actions: gymActions 
  } = useGymData(userLocation, permissionGranted);

  // State for search/filter modals
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filterOptions = [{label: 'All', value: 'all'}, {label: 'Premium', value: 'premium'}];
  const sortOptions = [{label: 'Distance', value: 'distance'}, {label: 'Rating', value: 'rating'}];
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('distance');

  const onMyLocation = () => {
    if (mapRef.current && userLocation) {
        mapRef.current.animateToRegion({ ...userLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }, 1000);
    }
  };

  // This is the new, robust handler for opening the modal
  const handleOpenGymDetails = async (gymFromList) => {
    // Immediately set the basic gym info so the modal can open with a name/image
    setSelectedGymDetails(gymFromList);
    setIsModalLoading(true);

    try {
      // Fetch the complete, fresh details from the API
      const response = await gymService.getGymDetails(gymFromList.id);
      if (response.success) {
        // Replace the basic info with the full data, including plans
        setSelectedGymDetails(response.data);
      } else {
        // Handle case where details couldn't be fetched
        console.error("Failed to fetch gym details:", response.message);
      }
    } catch (error) {
      console.error("API error fetching gym details:", error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedGymDetails(null);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />
      
      <LocationContent
        // Data
        gyms={gyms}
        userLocation={userLocation}
        permissionGranted={permissionGranted}
        selectedGym={selectedGymDetails}
        isModalLoading={isModalLoading}
        
        // State
        isLoading={areGymsLoading}
        isLoadingLocation={isLocationLoading}
        error={locationError || gymError}
        
        // Refs and Animations
        mapRef={mapRef}
        pulseAnim={useRef(new Animated.Value(1)).current}
        
        // Callbacks
        onGymPress={handleOpenGymDetails}
        onMapMarkerPress={handleOpenGymDetails}
        onCloseGymModal={handleCloseModal}
        onMyLocation={onMyLocation}
        onCameraPress={() => console.log('Camera pressed')}
        onRequestLocationPermission={locationActions.requestPermission}
        onSkipPermission={locationActions.skipPermission}
        
        // Modals
        showSearchModal={showSearchModal}
        onSearchPress={() => setShowSearchModal(true)}
        onSearchModalClose={() => setShowSearchModal(false)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        
        showFilterModal={showFilterModal}
        onFilterPress={() => setShowFilterModal(true)}
        onFilterModalClose={() => setShowFilterModal(false)}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#001f3f' },
});

export default LocationMain;