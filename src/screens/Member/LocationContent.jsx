// LocationContent_Themed.js — Updated with Navy & Golden-Yellow Theme

import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Modal, Platform, Animated, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LocationContent = ({
  gyms,
  loading,
  error,
  selectedGym,
  mapSelectedGym,
  userLocation,
  pulseAnim,
  locationPermission,
  isLoadingLocation,
  searchQuery,
  showSearchModal,
  showFilterModal,
  selectedFilter,
  selectedSort,
  filterOptions,
  sortOptions,
  onGymPress,
  onMapMarkerPress,
  onMyLocation,
  onCameraPress,
  onSearchPress,
  onFilterPress,
  onSearchQueryChange,
  onSearchModalClose,
  onFilterModalClose,
  onFilterChange,
  onSortChange,
  onRequestLocationPermission
}) => {
  // Safety check for required props
  if (!onGymPress || !onMapMarkerPress || !onMyLocation || !onCameraPress) {
    console.error('LocationContent: Missing required callback props');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: Missing required props</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: 28.7041,
    longitude: 77.1025,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRegion = userLocation ? { ...userLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } : initialRegion;

  const renderGymList = () => {
    if (loading) {
      return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#FFC107" />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (!gyms || gyms.length === 0) {
      return <Text style={styles.emptyText}>No gyms found. Try expanding your search area or adjusting filters.</Text>;
    }
    return (
      <ScrollView style={styles.gymList} showsVerticalScrollIndicator={false}>
        {gyms.map((gym) => {
          if (!gym || !gym.id) return null;
          
          return (
            <TouchableOpacity
              key={gym.id}
              style={[styles.gymCard, gym.isNearest && styles.nearestGymCard]}
              onPress={() => onGymPress(gym)}
            >
              <View style={[styles.gymImageContainer, gym.isNearest && styles.nearestGymImageContainer]}>
                <Image
                  source={{ uri: gym.photos?.[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }}
                  style={[styles.gymImage, gym.isNearest && styles.nearestGymImage]}
                  resizeMode="cover"
                />
                {gym.isNearest && (
                  <View style={[styles.nearestBadge, styles.nearestGymBadge]}>
                    <Text style={[styles.nearestText, styles.nearestGymText]}>Nearest</Text>
                  </View>
                )}
                <View style={styles.gymLogo}>
                  <Text style={styles.gymLogoText}>{gym.name ? gym.name.charAt(0) : 'G'}</Text>
                </View>
              </View>
              
              <View style={styles.gymInfo}>
                <View style={styles.gymHeader}>
                  <Text style={styles.gymName} numberOfLines={1}>{gym.name || 'Unknown Gym'}</Text>
                  <View style={styles.gymType}>
                    <Text style={styles.gymTypeText}>{gym.type || 'Standard'}</Text>
                  </View>
                </View>
                
                <View style={styles.gymLocationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.gymLocation} numberOfLines={1}>{gym.address || 'Address not available'}</Text>
                </View>
                
                <View style={styles.gymStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Distance</Text>
                    <Text style={styles.statValue}>{gym.distance ? `${gym.distance.toFixed(2)} km` : 'N/A'}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Rating</Text>
                    <Text style={styles.statValue}>⭐ {gym.rating || '4.5'}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Price</Text>
                    <Text style={styles.statValue}>{gym.dailyPassPrice ? `₹${gym.dailyPassPrice}/day` : 'N/A'}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.gymArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  try {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
            <Icon name="search" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={onCameraPress} activeOpacity={0.8}>
            <Icon name="camera" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          {!locationPermission && (
            <View style={styles.locationPermissionOverlay}>
              <View style={styles.permissionCard}>
                <Icon name="location" size={48} color="#FFC107" />
                <Text style={styles.permissionTitle}>Find Gyms Near You</Text>
                <Text style={styles.permissionMessage}>Enable location access to discover nearby gyms.</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={onRequestLocationPermission} activeOpacity={0.8}>
                  <Text style={styles.permissionButtonText}>Enable Location Access</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipButton} onPress={() => { console.log('User skipped location'); }}>
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {isLoadingLocation && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="small" color="#e74c3c" />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          </View>
        )}

          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
          >
            {userLocation && (
              <Marker coordinate={userLocation} title="You are here">
                <View style={styles.userLocationMarker}>
                  <Animated.View style={[styles.userLocationPulse, { transform: [{ scale: pulseAnim }] }]} />
                  <View style={styles.userLocationDot} />
                </View>
              </Marker>
            )}
            {gyms && gyms.map((gym) => {
              if (!gym || !gym.id || !gym.coordinates) return null;
              
              return (
                <Marker
                  key={gym.id}
                  coordinate={gym.coordinates}
                  title={gym.name || 'Gym'}
                  description={gym.address || 'Address not available'}
                  pinColor={mapSelectedGym?.id === gym.id ? "#e74c3c" : "#FFC107"}
                  onPress={() => onMapMarkerPress(gym)}
                />
              );
            })}
          </MapView>

          <View style={styles.myLocationButtonContainer}>
            <TouchableOpacity style={styles.myLocationButton} onPress={onMyLocation} activeOpacity={0.8}>
              <Icon name="locate" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapFilterContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
              <Icon name="filter" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <View>
                <Text style={styles.bottomSheetTitle}>Gyms Near You</Text>
                <Text style={styles.subtitleText}>{gyms ? gyms.length : 0} fitness centers found</Text>
              </View>
            </View>
            
            {renderGymList()}
          </View>
        </View>

        <Modal visible={showSearchModal} animationType="slide" transparent={true} onRequestClose={onSearchModalClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.searchModal}>
              <View style={styles.searchModalHeader}>
                <Text style={styles.searchModalTitle}>Search Gyms</Text>
                <TouchableOpacity onPress={onSearchModalClose}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={20} color="#ccc" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name, location..."
                  value={searchQuery}
                  onChangeText={onSearchQueryChange}
                  autoFocus={true}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showFilterModal} animationType="slide" transparent={true} onRequestClose={onFilterModalClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.filterModal}>
              <View style={styles.filterModalHeader}>
                <Text style={styles.filterModalTitle}>Filter & Sort</Text>
                <TouchableOpacity onPress={onFilterModalClose}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Filter by Type</Text>
                <View style={styles.filterOptions}>
                  {filterOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.filterOption, selectedFilter === option.value && styles.filterOptionSelected]}
                      onPress={() => onFilterChange(option.value)}
                    >
                      <Text style={[styles.filterOptionText, selectedFilter === option.value && styles.filterOptionTextSelected]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort by</Text>
                <View style={styles.sortOptions}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.sortOption, selectedSort === option.value && styles.sortOptionSelected]}
                      onPress={() => onSortChange(option.value)}
                    >
                      <Text style={[styles.sortOptionText, selectedSort === option.value && styles.sortOptionTextSelected]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity style={styles.applyFilterButton} onPress={onFilterModalClose}>
                <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  } catch (error) {
    console.error('LocationContent render error:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Something went wrong. Please try again.</Text>
      </View>
    );
  }
};

// ---------------------- UPDATED STYLES ----------------------
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#001f3f',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mainContent: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject, height: '45%' },
  userLocationMarker: { alignItems: 'center', justifyContent: 'center' },
  userLocationDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFC107',
    borderWidth: 3,
    borderColor: '#001f3f',
  },
  userLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
  },
  myLocationButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: '58%',
    zIndex: 10,
  },
  myLocationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mapFilterContainer: {
    position: 'absolute',
    left: 20,
    bottom: '58%',
    zIndex: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#002b5c',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#002b5c',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 10,
    height: '60%',
    elevation: 10,
  },
  bottomSheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#FFC107',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 8,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#001f3f',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitleText: {
    fontSize: 14,
    color: '#FFC107',
    marginTop: 2,
  },
  gymList: { paddingHorizontal: 20, paddingTop: 10 },
  gymCard: {
    backgroundColor: '#002b5c',
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  nearestGymCard: { borderColor: '#FFC107', borderWidth: 2 },
  gymImageContainer: { width: 100, height: '100%' },
  gymImage: { width: '100%', height: '100%' },
  gymInfo: { flex: 1, padding: 15 },
  gymHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  gymName: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  gymLocationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationIcon: { fontSize: 12, color: '#FFC107' },
  gymLocation: { fontSize: 12, color: '#aaa', marginLeft: 4 },
  gymStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#aaa' },
  statValue: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  gymArrow: { justifyContent: 'center', paddingHorizontal: 10 },
  arrowText: { fontSize: 24, color: '#aaa' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  searchModal: {
    backgroundColor: '#002b5c',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  filterModal: {
    backgroundColor: '#002b5c',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  searchModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  filterModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  searchModalTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  filterModalTitle: { fontSize: 20, fontWeight: '800', color: '#ffffff' },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001f3f',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    paddingVertical: 12,
    color: '#ffffff',
  },
  filterSection: { marginBottom: 20 },
  filterSectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#ffffff' },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#001f3f',
  },
  filterOptionSelected: { backgroundColor: '#FFC107' },
  filterOptionText: { color: '#aaa' },
  filterOptionTextSelected: { color: '#001f3f', fontWeight: '700' },
  sortOptions: { gap: 10 },
  sortOption: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#001f3f',
    alignItems: 'center',
    backgroundColor: '#001f3f',
  },
  sortOptionSelected: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  sortOptionText: { color: '#aaa' },
  sortOptionTextSelected: { color: '#001f3f', fontWeight: '700' },
  applyFilterButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  applyFilterButtonText: { color: '#001f3f', fontSize: 16, fontWeight: '700' },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#FFC107',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#aaa',
    fontSize: 16,
  },
  locationPermissionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 31, 57, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  permissionCard: {
    backgroundColor: '#002b5c',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  permissionButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: { color: '#001f3f', fontSize: 16, fontWeight: '700' },
  skipButton: { marginTop: 15 },
  skipButtonText: { color: '#aaa', fontSize: 14, textDecorationLine: 'underline' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1500,
  },
  loadingCard: {
    backgroundColor: '#002b5c',
    borderRadius: 15,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 15,
    fontWeight: '600',
  },
  nearestGymImageContainer: { borderColor: '#FFC107', borderWidth: 2 },
  nearestGymImage: { borderColor: '#FFC107', borderWidth: 2 },
  nearestGymBadge: { backgroundColor: '#FFC107' },
  nearestGymText: { color: '#001f3f' },
  gymLogo: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gymLogoText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  gymType: {
    backgroundColor: '#001f3f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gymTypeText: { fontSize: 10, color: '#FFC107', fontWeight: '600' },
  nearestBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nearestText: { color: '#001f3f', fontSize: 10, fontWeight: 'bold' },
});

export default LocationContent;