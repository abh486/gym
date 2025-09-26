import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  StatusBar,
  FlatList,
  Dimensions,
  ActivityIndicator, // To show a loading spinner
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import Events from './Events'; // Import the Events.js component
import { fetchProducts } from '../../api/shopService'; // ✅ IMPORT THE NEW SERVICE

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 60) / 2;

const tabs = [
  { id: 'shop', title: 'Shop', icon: 'bag-handle' },
  { id: 'events', title: 'Events', icon: 'calendar' },
];

const categories = [
  { id: 'all', name: 'All', icon: 'storefront' },
  { id: 'supplements', name: 'Supplements', icon: 'medical' },
  { id: 'equipment', name: 'Equipment', icon: 'barbell' },
  { id: 'electronics', name: 'Electronics', icon: 'phone-portrait' },
  { id: 'clothing', name: 'Clothing', icon: 'shirt' },
  { id: 'nutrition', name: 'Nutrition', icon: 'leaf' },
];

// ❌ Hardcoded products array is removed. Data will now come from the API.

const Store = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [likedItems, setLikedItems] = useState(new Set());

  // ✅ NEW STATE FOR HANDLING BACKEND DATA
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ USEEFFECT TO FETCH PRODUCTS ON COMPONENT MOUNT
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call the service to get data. The service returns the response object.
        const response = await fetchProducts(); 
        // The actual list of products is inside the `data` property of the response
        setProducts(response.data || []); 
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error("Error in Store component:", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch products if the 'shop' tab is active
    if (activeTab === 'shop') {
      loadProducts();
    }
  }, [activeTab]); // Dependency array ensures this runs when the tab changes

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
        {/* ✅ Use the first image from the backend `images` array */}
        <Image
          source={{ uri: product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/160' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          style={styles.imageOverlay}
        />
        {/* Badges can be customized based on data you might add to your backend later */}
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => toggleLike(product.id)}
        >
          <Icon
            name={likedItems.has(product.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={likedItems.has(product.id) ? '#FFC107' : '#aaa'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        {/* ✅ Use seller's store name from backend */}
        <Text style={styles.brandText}>{product.seller?.storeName || 'GymFlex Store'}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>

        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFC107" />
          {/* Mock rating, as it's not in the backend schema yet */}
          <Text style={styles.ratingText}>4.7</Text>
          <Text style={styles.reviewsText}>({Math.floor(Math.random() * 2000)})</Text>
        </View>

        <View style={styles.priceContainer}>
          {/* ✅ Format the price from the backend number */}
          <Text style={styles.currentPrice}>₹{product.price.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            product.stock <= 0 && styles.outOfStockButton // Use `stock` from backend
          ]}
          disabled={product.stock <= 0}
        >
          <View
            style={[
              styles.buttonSolidBlue,
              product.stock <= 0 && styles.outOfStockButton
            ]}
          >
            <Text style={[
              styles.addToCartText,
              product.stock <= 0 && styles.outOfStockText
            ]}>
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ✅ A NEW RENDER FUNCTION FOR THE MAIN CONTENT AREA
  const renderProductList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#FFC107" style={{ marginTop: 50 }} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (products.length === 0) {
      return <Text style={styles.errorText}>No products found.</Text>;
    }

    return (
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        scrollEnabled={false} // Important for nesting in ScrollView
        showsVerticalScrollIndicator={false}
      />
    );
  };


  const renderShopTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={[styles.heroSection, { backgroundColor: '#001f3f' }]}>
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

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#FFC107" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#aaa"
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
                  color={selectedCategory === category.id ? 'white' : '#FFC107'}
                />
                <Text
                  style={[
                    styles.categoryName,
                    { color: selectedCategory === category.id ? 'white' : '#FFC107' }
                  ]}
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.productsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          {!loading && !error && <Text style={styles.itemCount}>{products.length} items</Text>}
        </View>

        {/* ✅ USE THE NEW RENDER FUNCTION HERE */}
        {renderProductList()}
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#001f3f' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#001f3f" />

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            {activeTab === tab.id && <View style={styles.activeTabBackground} />}
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#FFC107' : 'rgba(255,255,255,0.7)'}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#FFC107' : 'rgba(255,255,255,0.7)' },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'shop' && renderShopTab()}
      {activeTab === 'events' && <Events />}

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
                <Icon name="close" size={24} color="#FFC107" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                {['Popular', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'].map(
                  (option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.sortOption,
                        selectedSort === option.toLowerCase().replace(/[:\s]/g, '-') &&
                          styles.selectedSortOption,
                      ]}
                      onPress={() =>
                        setSelectedSort(option.toLowerCase().replace(/[:\s]/g, '-'))
                      }
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          selectedSort === option.toLowerCase().replace(/[:\s]/g, '-') &&
                            styles.selectedSortOptionText,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
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

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
    backgroundColor: '#001f3f',
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
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
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
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#001f3f',
  },
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
    backgroundColor: '#002b5c',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  filterButton: {
    borderRadius: 25,
    overflow: 'hidden',
    width: 50,
    height: 50,
  },
  buttonSolidBlue: {
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: '100%',
  },
  addToCartText: {
    color: '#001f3f',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    width: '100%',
  },
  applyButtonText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
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
    color: '#FFC107',
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
    backgroundColor: '#002b5c',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  categorySelectedBackground: {
    backgroundColor: '#FFC107',
    borderColor: '#FFA000',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  productsSection: {
    marginBottom: 24,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#002b5c',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
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
  likeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#FFC107',
    fontWeight: '500',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 20,
    height: 40, // Set a fixed height to ensure alignment
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC107',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    marginTop: 8,
  },
  outOfStockButton: {
    backgroundColor: '#333',
    opacity: 0.7,
    width: '100%',
  },
  outOfStockText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#002b5c',
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
    color: 'white',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 16,
  },
  sortOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#002b5c',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSortOption: {
    backgroundColor: '#00334d',
    borderColor: '#FFC107',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#FFC107',
  },
  selectedSortOptionText: {
    color: '#FFC107',
    fontWeight: '600',
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  errorText: {
    color: '#FFa000',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    paddingHorizontal: 20,
  },
});

export default Store;