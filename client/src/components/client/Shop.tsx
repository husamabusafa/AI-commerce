import { useState } from 'react';
import { Search, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types/index';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import Testimonials from '../shared/Testimonials';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const { state, dispatch } = useApp();
  const { t, translateProduct } = useLanguage();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to200' | 'over200'>('all');
  const navigate = useNavigate();

  const categories: string[] = [t('category.all') as string, ...Array.from(new Set((products || []).map((p: Product) => translateProduct(p).category?.name || 'No Category')))];

  const filteredProducts = (products || []).filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    const matchesCategory = state.selectedCategory === 'All' || product.category?.id === state.selectedCategory;
    
    const matchesPrice = 
      priceRange === 'all' ||
      (priceRange === 'under50' && product.price < 50) ||
      (priceRange === '50to200' && product.price >= 50 && product.price <= 200) ||
      (priceRange === 'over200' && product.price > 200);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const featuredProducts = (products || []).filter((p: Product) => p.featured);

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, 1);
  };

  const viewProduct = (product: Product) => {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Section - Simplified Luxury Design */}
      <div className="relative overflow-hidden bg-luxury-light dark:bg-luxury-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="arabic-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-luxury-text-light dark:text-luxury-text-dark">
            {t('hero.title')}
          </h1>
          <p className="arabic-text text-base sm:text-lg text-luxury-gray-600 dark:text-luxury-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover-lift w-full sm:w-auto">
              {t('hero.cta')}
            </button>
            <button className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover-lift w-full sm:w-auto">
              {t('common.browse')}
            </button>
          </div>

          {/* Benefits Bar */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold-primary rounded-full"></div>
              <span>{t('benefits.freeShipping')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold-primary rounded-full"></div>
              <span>{t('benefits.returns')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold-primary rounded-full"></div>
              <span>{t('benefits.support')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <h2 className="arabic-heading text-lg sm:text-xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-3 sm:mb-4">{t('featured.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.slice(0, 4).map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewProduct={viewProduct}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Filter Chips and Controls */}
      <div className="space-y-4 sm:space-y-6">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-luxury-text-light dark:text-luxury-text-dark mb-2 sm:mb-0 w-full sm:w-auto">{t('filters.label')}</span>
          
          {/* Category Chips */}
          {categories.slice(0, 4).map((category: string) => (
            <button
              key={category}
              onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                state.selectedCategory === category
                  ? 'bg-luxury-gold-primary text-white shadow-glow'
                  : 'bg-luxury-gray-100 dark:bg-luxury-gray-700 text-luxury-text-light dark:text-luxury-text-dark hover:bg-luxury-gray-200 dark:hover:bg-luxury-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
          
          {/* Price Range Chips - Show fewer on mobile */}
          {[
            { value: 'all', label: t('price.all') },
            { value: 'under50', label: t('price.under50') },
            { value: '50to200', label: t('price.50to200') },
            { value: 'over200', label: t('price.over200') }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPriceRange(option.value as any)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                priceRange === option.value
                  ? 'bg-luxury-gold-primary text-white shadow-glow'
                  : 'bg-luxury-gray-100 dark:bg-luxury-gray-700 text-luxury-text-light dark:text-luxury-text-dark hover:bg-luxury-gray-200 dark:hover:bg-luxury-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Results Header and Controls */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="arabic-heading text-lg sm:text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-1">
                المنتجات {state.selectedCategory !== 'All' && `في ${state.selectedCategory}`}
              </h2>
              <p className="arabic-text text-sm sm:text-base text-luxury-gray-600 dark:text-luxury-gray-400">
                {filteredProducts.length} منتج متوفر
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Sort Dropdown */}
              <select className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-luxury-gray-200 dark:border-luxury-gray-600 bg-white dark:bg-luxury-gray-800 text-luxury-text-light dark:text-luxury-text-dark text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary/50">
                <option>{t('filters.newest')}</option>
                <option>{t('filters.bestSelling')}</option>
                <option>{t('filters.priceLowHigh')}</option>
                <option>{t('filters.priceHighLow')}</option>
                <option>{t('product.rating')}</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex items-center bg-luxury-gray-100 dark:bg-luxury-gray-700 rounded-xl sm:rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-luxury-gray-600 text-luxury-gold-primary shadow-soft' 
                      : 'text-luxury-gray-500 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark'
                  }`}
                >
                  <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-luxury-gray-600 text-luxury-gold-primary shadow-soft' 
                      : 'text-luxury-gray-500 dark:text-luxury-gray-400 hover:text-luxury-text-light dark:hover:text-luxury-text-dark'
                  }`}
                >
                  <List className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-16 animate-fadeIn">
            <Search className="h-16 w-16 text-luxury-gray-400 dark:text-luxury-gray-500 mx-auto mb-6" />
            <h3 className="arabic-heading text-xl font-semibold text-luxury-text-light dark:text-luxury-text-dark mb-3">
              {t('shop.noProductsTitle')}
            </h3>
            <p className="arabic-text text-luxury-gray-600 dark:text-luxury-gray-400 mb-6">
              {t('shop.noProductsDesc')}
            </p>
            <button 
              onClick={() => {
                dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
                dispatch({ type: 'SET_SELECTED_CATEGORY', payload: 'All' });
                setPriceRange('all');
              }}
              className="btn-primary"
            >
              {t('shop.resetFilters')}
            </button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 animate-fadeIn'
            : 'space-y-3 sm:space-y-4'
          }>
            {filteredProducts.map((product: Product, index: number) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewProduct={viewProduct}
                listView={viewMode === 'list'}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  listView?: boolean;
  compact?: boolean;
  index?: number;
}

function ProductCard({ product, onAddToCart, onViewProduct, listView, compact, index = 0 }: ProductCardProps) {
  const { t, translateProduct, formatNumber } = useLanguage();
  const translatedProduct = translateProduct(product);
  
  // Format price in SAR without decimals
  const formatPrice = (price: number) => {
    return `${formatNumber(Math.round(price * 3.75))} ${t('currency.sar')}`;
  };

  // Generate random rating for demo
  const rating = Math.random() * 2 + 3; // 3-5 stars
  const reviewCount = Math.floor(Math.random() * 100) + 10;

  if (listView) {
    return (
      <Card 
        hover 
        className="p-3 sm:p-4 md:p-6 animate-fadeIn" 
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 space-x-reverse">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => onViewProduct(product)}
            />
            {product.featured && (
              <div className="absolute top-1 sm:top-2 ltr:left-1 rtl:right-1 sm:ltr:left-2 sm:rtl:right-2">
                <span className="bg-luxury-gold-primary text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  {t('product.new')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
            <h3 
              className="arabic-heading text-sm sm:text-base md:text-lg font-semibold text-luxury-text-light dark:text-luxury-text-dark cursor-pointer hover:text-luxury-gold-primary transition-colors mb-1 sm:mb-2 line-clamp-2"
              onClick={() => onViewProduct(product)}
            >
              {translatedProduct.name}
            </h3>
            <p className="arabic-text text-xs sm:text-sm text-luxury-gray-600 dark:text-luxury-gray-400 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{translatedProduct.description}</p>
                
                {/* Star Rating */}
                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(rating) ? 'text-luxury-gold-primary fill-current' : 'text-luxury-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-luxury-gray-500 dark:text-luxury-gray-400 hidden sm:inline">
                    ({formatNumber(reviewCount)} {t('product.reviews')})
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge variant="secondary" size="sm">{translatedProduct.category?.name || t('category.uncategorized')}</Badge>
                  {product.featured && <Badge variant="primary" size="sm">{t('product.featured')}</Badge>}
                </div>
              </div>
              
              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-1 sm:mb-2">
                  {formatPrice(product.price)}
                </div>
                <div className="text-xs sm:text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
                              {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 sm:space-y-3 space-y-reverse">
            <Button 
              size="sm" 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="btn-primary text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('product.addToCart')}</span>
              <span className="sm:hidden">{t('common.add')}</span>
            </Button>
            <Button variant="ghost" size="sm" className="btn-secondary p-1.5 sm:p-2">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-luxury-gray-600 dark:text-luxury-gray-300" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      hover 
      className={`p-0 overflow-hidden hover-lift animate-fadeIn`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`relative w-full ${compact ? 'h-32 sm:h-40 md:h-48' : 'h-40 sm:h-48 md:h-64'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onViewProduct(product)}
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2">
          {product.featured && (
            <span className="bg-luxury-gold-primary text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
              {t('product.new')}
            </span>
          )}
          <button className="p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur shadow-soft hover:scale-110 transition-all duration-200">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-luxury-gray-700 dark:text-luxury-gray-300" />
          </button>
        </div>
        
        {/* Quick add button - Hidden on mobile */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur text-luxury-text-light dark:text-luxury-text-dark px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50 hidden sm:block"
        >
          <span className="inline-flex items-center justify-center gap-1 sm:gap-2">
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                        {product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
          </span>
        </button>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
        <div>
        <h3 
          className={`arabic-heading font-semibold text-luxury-text-light dark:text-luxury-text-dark cursor-pointer hover:text-luxury-gold-primary transition-colors line-clamp-2 mb-1 sm:mb-2 ${
            compact ? 'text-xs sm:text-sm md:text-base' : 'text-sm sm:text-base md:text-lg'
          }`}
          onClick={() => onViewProduct(product)}
        >
          {translatedProduct.name}
        </h3>
        {!compact && (
          <p className="arabic-text text-xs sm:text-sm text-luxury-gray-600 dark:text-luxury-gray-400 line-clamp-2 mb-2 sm:mb-3 hidden sm:block">{translatedProduct.description}</p>
        )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(rating) ? 'text-luxury-gold-primary fill-current' : 'text-luxury-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-luxury-gray-500 dark:text-luxury-gray-400 hidden sm:inline">
            ({formatNumber(reviewCount)})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-base sm:text-lg md:text-2xl font-bold text-luxury-text-light dark:text-luxury-text-dark">
            {formatPrice(product.price)}
          </div>
          <Badge variant="secondary" size="sm" className="text-xs">{translatedProduct.category?.name || t('category.uncategorized')}</Badge>
        </div>

        <div className="text-xs sm:text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
                              {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
        </div>

        {/* Mobile button - Always visible on mobile */}
        <Button 
          className="w-full sm:hidden mt-2 flex items-center justify-center gap-1" 
          size="sm"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-3 w-3" />
          {t('common.add')}
        </Button>
      </div>
    </Card>
  );
}