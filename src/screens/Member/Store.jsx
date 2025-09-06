import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2;

// Import local images with require for React Native
const wheyProteinImg = require('../../assets/image/protein-gym.jpg');
const creatineImg = require('../../assets/image/19886.jpg');

const Store = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [likedItems, setLikedItems] = useState(new Set());
  const [selectedEventCategory, setSelectedEventCategory] = useState('all');

  const tabs = [
    { id: 'shop', title: 'Shop', icon: 'bag-handle' },
    { id: 'events', title: 'Events', icon: 'calendar' },
  ];

  const products = [
    {
      id: 1,
      name: "Premium Whey Protein",
      brand: "NutriFit Pro",
      price: "₹1,299",
      originalPrice: "₹1,899",
      image: wheyProteinImg,
      category: "Supplements",
      rating: 4.8,
      reviews: 2847,
      discount: 32,
      badge: "Best Seller",
      badgeColor: ['#F59E0B', '#F97316'],
      isNew: false,
      inStock: true
    },
    {
      id: 2,
      name: "Smart Fitness Watch Pro",
      brand: "TechFit",
      price: "₹4,999",
      originalPrice: "₹7,999",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      category: "Electronics",
      rating: 4.6,
      reviews: 1523,
      discount: 37,
      badge: "Premium",
      badgeColor: ['#8B5CF6', '#4F46E5'],
      isNew: true,
      inStock: true
    },
    {
      id: 3,
      name: "Eco Yoga Mat Deluxe",
      brand: "ZenFlex",
      price: "₹1,599",
      originalPrice: "₹2,299",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      category: "Equipment",
      rating: 4.9,
      reviews: 892,
      discount: 30,
      badge: "Eco",
      badgeColor: ['#10B981', '#059669'],
      isNew: false,
      inStock: true
    },
    {
      id: 4,
      name: "Resistance Band Set Pro",
      brand: "FlexForce",
      price: "₹899",
      originalPrice: "₹1,399",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      category: "Equipment",
      rating: 4.7,
      reviews: 634,
      discount: 36,
      badge: "Popular",
      badgeColor: ['#EC4899', '#BE185D'],
      isNew: false,
      inStock: false
    },
    {
      id: 5,
      name: "Creatine Monohydrate",
      brand: "PowerMax",
      price: "₹799",
      originalPrice: "₹999",
      image: creatineImg,
      category: "Supplements",
      rating: 4.5,
      reviews: 1247,
      discount: 20,
      badge: "Value",
      badgeColor: ['#3B82F6', '#06B6D4'],
      isNew: true,
      inStock: true
    },
    {
      id: 6,
      name: "Wireless Earbuds Sport",
      brand: "AudioFit",
      price: "₹2,499",
      originalPrice: "₹3,999",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
      category: "Electronics",
      rating: 4.4,
      reviews: 756,
      discount: 37,
      badge: "Hot",
      badgeColor: ['#2196F3', '#1976D2'],
      isNew: false,
      inStock: true
    }
  ];

  const events = [
    {
      id: 1,
      name: "Global Fitness Summit 2024",
      description: "Join industry leaders and fitness enthusiasts",
      date: "15 Mar 2024",
      time: "9:00 AM",
      duration: "8 hours",
      location: "Pragati Maidan, Delhi",
      city: "Delhi",
      price: "₹2,499",
      originalPrice: "₹3,999",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
      category: "Conference",
      attendees: 2500,
      speakers: 15,
      rating: 4.9,
      isPopular: true,
      gradient: ['#8B5CF6', '#EC4899'],
      tags: ["Networking", "Workshops", "Certification"]
    },
    {
      id: 2,
      name: "Advanced Yoga Retreat",
      description: "Transform your practice with expert guidance",
      date: "22 Mar 2024",
      time: "6:00 AM",
      duration: "3 days",
      location: "Rishikesh Wellness Center",
      city: "Rishikesh",
      price: "₹8,999",
      originalPrice: "₹12,999",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
      category: "Retreat",
      attendees: 50,
      speakers: 3,
      rating: 4.8,
      isPopular: false,
      gradient: ['#10B981', '#059669'],
      tags: ["Meditation", "Asanas", "Pranayama"]
    },
    {
      id: 3,
      name: "CrossFit Championship",
      description: "Compete with the best athletes nationwide",
      date: "5 Apr 2024",
      time: "7:00 AM",
      duration: "2 days",
      location: "Sports Authority Complex",
      city: "Mumbai",
      price: "₹1,999",
      originalPrice: "₹2,999",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
      category: "Competition",
      attendees: 500,
      speakers: 8,
      rating: 4.7,
      isPopular: true,
      gradient: ['#2196F3', '#1976D2'],
      tags: ["Competition", "Prizes", "Community"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'storefront' },
    { id: 'supplements', name: 'Supplements', icon: 'medical' },
    { id: 'equipment', name: 'Equipment', icon: 'barbell' },
    { id: 'electronics', name: 'Electronics', icon: 'phone-portrait' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt' },
    { id: 'nutrition', name: 'Nutrition', icon: 'leaf' },
  ];

  const eventCategories = [
    { id: 'all', name: 'All Events' },
    { id: 'conference', name: 'Conferences' },
    { id: 'retreat', name: 'Retreats' },
    { id: 'competition', name: 'Competitions' },
    { id: 'workshop', name: 'Workshops' },
  ];

  const toggleLike = (productId) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const renderProductCard = ({ item: product }) => (
    <TouchableOpacity style={[styles.productCard, { width: CARD_WIDTH }]}>
      <View style={styles.productImageContainer}>
        <Image
          source={typeof product.image === 'string' ? { uri: product.image } : product.image}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          style={styles.imageOverlay}
        />

        {/* Badges */}
        <View style={styles.badgeContainer}>
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
          {product.isNew && (
            <View style={[styles.newBadge, { marginTop: product.discount > 0 ? 6 : 0 }]}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Product Badge */}
        <LinearGradient
          colors={product.badgeColor}
          style={styles.productBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.productBadgeText}>{product.badge}</Text>
        </LinearGradient>

        {/* Like Button */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => toggleLike(product.id)}
        >
          <Icon
            name={likedItems.has(product.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={likedItems.has(product.id) ? '#2196F3' : '#6B7280'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.brandText}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviews.toLocaleString()})</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !product.inStock && styles.outOfStockButton
          ]}
          disabled={!product.inStock}
        >
          <View
            style={[
              styles.buttonSolidBlue,
              !product.inStock && styles.outOfStockButton
            ]}
          >
            <Text style={[
              styles.addToCartText,
              !product.inStock && styles.outOfStockText
            ]}>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item: event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          style={styles.eventImageOverlay}
        />

        {event.isPopular && (
          <View style={[styles.popularBadge, { backgroundColor: '#2196F3' }]}>
            <Icon name="trending-up" size={12} color="white" />
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}

        <View style={[styles.eventCategoryBadge, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.eventCategoryText}>{event.category}</Text>
        </View>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventName} numberOfLines={2}>{event.name}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Icon name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.eventDetailText}>{event.date}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Icon name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Icon name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.eventDetailText}>{event.city}</Text>
          </View>
        </View>

        <View style={styles.eventStats}>
          <View style={styles.eventStat}>
            <Icon name="people-outline" size={16} color="#6B7280" />
            <Text style={styles.eventStatText}>{event.attendees}</Text>
          </View>
          <View style={styles.eventStat}>
            <Icon name="mic-outline" size={16} color="#6B7280" />
            <Text style={styles.eventStatText}>{event.speakers} speakers</Text>
          </View>
          <View style={styles.eventStat}>
            <Icon name="star" size={16} color="#F59E0B" />
            <Text style={styles.eventStatText}>{event.rating}</Text>
          </View>
        </View>

        <View style={styles.eventFooter}>
          <View style={styles.eventPricing}>
            <Text style={styles.eventPrice}>{event.price}</Text>
            {event.originalPrice && (
              <Text style={styles.eventOriginalPrice}>{event.originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.bookButton}>
            <View style={styles.buttonSolidBlueRow}>
              <Text style={styles.bookButtonText}>Book Now</Text>
              <Icon name="arrow-forward" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShopTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View
        style={[styles.heroSection, { backgroundColor: '#006258' }]}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Fitness Store</Text>
          <Text style={styles.heroSubtitle}>Transform your fitness journey with premium products</Text>

          <View style={styles.heroFeatures}>
            <View style={styles.heroFeature}>
              <Icon name="shield-checkmark" size={16} color="white" />
              <Text style={styles.heroFeatureText}>Premium Quality</Text>
            </View>
            <View style={styles.heroFeature}>
              <Icon name="flash" size={16} color="white" />
              <Text style={styles.heroFeatureText}>Fast Delivery</Text>
            </View>
            <View style={styles.heroFeature}>
              <Icon name="trending-up" size={16} color="white" />
              <Text style={styles.heroFeatureText}>Best Prices</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <View style={styles.buttonSolidBlue}>
            <Icon name="options" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={styles.categoryButton}
            >
              <View
                style={[
                  styles.categorySolidBackground,
                  selectedCategory === category.id && styles.categorySelectedBackground,
                ]}
              >
                <Icon
                  name={category.icon}
                  size={24}
                  color={selectedCategory === category.id ? 'white' : '#6B7280'}
                />
                <Text style={[
                  styles.categoryName,
                  { color: selectedCategory === category.id ? 'white' : '#6B7280' }
                ]}>
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products */}
      <View style={styles.productsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <Text style={styles.itemCount}>{products.length} items</Text>
        </View>

        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );

  const renderEventsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View
        style={[styles.heroSection, { backgroundColor: '#006258' }]}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Fitness Events</Text>
          <Text style={styles.heroSubtitle}>Join amazing fitness events and workshops</Text>

          <View style={styles.heroFeatures}>
            <View style={styles.heroFeature}>
              <Icon name="people" size={16} color="white" />
              <Text style={styles.heroFeatureText}>Expert Speakers</Text>
            </View>
            <View style={styles.heroFeature}>
              <Icon name="trophy" size={16} color="white" />
              <Text style={styles.heroFeatureText}>Competitions</Text>
            </View>
            <View style={styles.heroFeature}>
              <Icon name="heart" size={16} color="white" />
              <Text style={styles.heroFeatureText}>Community</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Event Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Event Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {eventCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedEventCategory(category.id)}
              style={styles.eventCategoryButton}
            >
              <View
                style={[
                  styles.eventCategorySolidBackground,
                  selectedEventCategory === category.id && styles.eventCategorySelectedBackground,
                ]}
              >
                <Text style={[
                  styles.eventCategoryName,
                  { color: selectedEventCategory === category.id ? 'white' : '#6B7280' }
                ]}>
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events */}
      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.itemCount}>{events.length} events</Text>
        </View>

        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#006258' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#006258" />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && (
              <View style={styles.activeTabBackground} />
            )}
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#2196F3' : 'rgba(255,255,255,0.7)'}
              style={styles.tabIcon}
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.id ? '#2196F3' : 'rgba(255,255,255,0.7)' }
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'shop' && renderShopTab()}
      {activeTab === 'events' && renderEventsTab()}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                {['Popular', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sortOption,
                      selectedSort === option.toLowerCase().replace(/[:\s]/g, '-') && styles.selectedSortOption
                    ]}
                    onPress={() => setSelectedSort(option.toLowerCase().replace(/[:\s]/g, '-'))}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      selectedSort === option.toLowerCase().replace(/[:\s]/g, '-') && styles.selectedSortOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <View style={styles.buttonSolidBlue}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
    backgroundColor: '#006258',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    position: 'relative',
  },
  activeTabBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
  },
  tabIcon: {
    marginBottom: 4,
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    zIndex: 1,
  },

  // Content
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#006258',
  },

  // Hero Section
  heroSection: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    marginTop: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    lineHeight: 24,
  },
  heroFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  heroFeatureText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },

  // Increased filter button size here
  filterButton: {
    borderRadius: 25,
    overflow: 'hidden',
    width: 50,
    height: 50,
  },

  // Buttons solid blue style for all buttons
  buttonSolidBlue: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: '100%',
  },
  buttonSolidBlueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    width: '100%',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 18,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Categories
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemCount: {
    fontSize: 14,
    color: 'white',
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categorySolidBackground: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    minWidth: 100,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categorySelectedBackground: {
    backgroundColor: '#2196F3',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },

  // Event Categories
  eventCategoryButton: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventCategorySolidBackground: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  eventCategorySelectedBackground: {
    backgroundColor: '#2196F3',
  },
  eventCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Products
  productsSection: {
    marginBottom: 24,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
    height: 160,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  discountBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  productBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  likeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 16,
  },
  brandText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    marginTop: 8,
  },
  outOfStockButton: {
    opacity: 0.6,
    width: '100%',
  },
  outOfStockText: {
    color: '#9CA3AF',
  },

  // Events
  eventsSection: {
    marginBottom: 24,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  eventImageContainer: {
    position: 'relative',
    height: 200,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  popularText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  eventCategoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  eventCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventInfo: {
    padding: 20,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 28,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  eventStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventStatText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPricing: {
    flex: 1,
  },
  eventPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  eventOriginalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  sortOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSortOption: {
    backgroundColor: '#F3F4F6',
    borderColor: '#2196F3',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#6B7280',
  },
  selectedSortOptionText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
});

export default Store;
