import { useState } from 'react';
import { Search, Grid, List, Star, ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Badge from '../shared/Badge';

export default function Shop() {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to200' | 'over200'>('all');

  const categories = ['All', ...Array.from(new Set(state.products.map(p => p.category)))];

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    const matchesCategory = state.selectedCategory === 'All' || product.category === state.selectedCategory;
    
    const matchesPrice = 
      priceRange === 'all' ||
      (priceRange === 'under50' && product.price < 50) ||
      (priceRange === '50to200' && product.price >= 50 && product.price <= 200) ||
      (priceRange === 'over200' && product.price > 200);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const featuredProducts = state.products.filter(p => p.featured);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const viewProduct = (product: Product) => {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
    dispatch({ type: 'SET_CLIENT_VIEW', payload: 'product' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-rose-400 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-8 text-white">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Discover Amazing Products</h1>
          <p className="text-white/80 dark:text-blue-200 mb-6">Find everything you need from our curated collection</p>

          <div className="max-w-2xl space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              <Input
                placeholder="Search products..."
                value={state.searchQuery}
                onChange={(value) => dispatch({ type: 'SET_SEARCH_QUERY', payload: value })}
                className="pl-10 bg-white/20 dark:bg-white/10 text-white placeholder-white/70"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button className="rounded-full bg-white text-slate-900 hover:bg-white/90">
                Shop now
              </Button>
              <Button variant="ghost" className="rounded-full ring-1 ring-white/60 text-white hover:bg-white/10">
                Explore categories
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs md:text-sm rounded-full px-3 py-1 bg-white/15 ring-1 ring-white/30">Free shipping over $50</span>
              <span className="text-xs md:text-sm rounded-full px-3 py-1 bg-white/15 ring-1 ring-white/30">Secure checkout</span>
              <span className="text-xs md:text-sm rounded-full px-3 py-1 bg-white/15 ring-1 ring-white/30">24/7 support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onViewProduct={viewProduct}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters and View Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 space-y-6">
          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    state.selectedCategory === category
                      ? 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 dark:text-gray-100 mb-4">Price Range</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Prices' },
                { value: 'under50', label: 'Under $50' },
                { value: '50to200', label: '$50 - $200' },
                { value: 'over200', label: 'Over $200' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPriceRange(option.value as any)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    priceRange === option.value
                      ? 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                Products {state.selectedCategory !== 'All' && `in ${state.selectedCategory}`}
              </h2>
              <p className="text-slate-600 dark:text-gray-400">{filteredProducts.length} products found</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-900'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-900'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-12 animate-fadeIn">
              <Search className="h-12 w-12 text-slate-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-gray-100 mb-2">No products found</h3>
              <p className="text-slate-600 dark:text-gray-400">Try adjusting your filters or search terms.</p>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn'
              : 'space-y-4'
            }>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onViewProduct={viewProduct}
                  listView={viewMode === 'list'}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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
  if (listView) {
    return (
      <Card 
        hover 
        className="p-4 animate-fadeInUp" 
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="flex items-center space-x-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
            onClick={() => onViewProduct(product)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 
                  className="font-semibold text-slate-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => onViewProduct(product)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" size="sm">{product.category}</Badge>
                  {product.featured && <Badge variant="primary" size="sm">Featured</Badge>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 dark:text-gray-100">${product.price}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              size="sm" 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="ghost" size="sm" className="bg-white/60 dark:bg-white/10 backdrop-blur hover:bg-white/80 dark:hover:bg-white/15">
              <Heart className="h-4 w-4 text-slate-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      hover 
      className={`p-0 overflow-hidden hover-tilt animate-fadeInUp`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`relative w-full ${compact ? 'h-40' : 'h-48'}`}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
          onClick={() => onViewProduct(product)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="primary" size="sm">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur shadow-soft hover:scale-110 transition-all duration-200">
          <Heart className="h-4 w-4 text-slate-700 dark:text-gray-300" />
        </button>
        {/* Quick add overlay */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="absolute bottom-3 left-3 right-3 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur text-slate-900 dark:text-gray-100 px-4 py-2 text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
        >
          <span className="inline-flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of stock' : 'Quick add'}
          </span>
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div>
          <h3 
            className={`font-semibold text-slate-900 dark:text-slate-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 ${
              compact ? 'text-sm' : ''
            }`}
            onClick={() => onViewProduct(product)}
          >
            {product.name}
          </h3>
          {!compact && (
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-slate-900 dark:text-gray-100">${product.price}</div>
          <Badge variant="secondary" size="sm">{product.category}</Badge>
        </div>

        <div className="text-sm text-slate-600 dark:text-gray-400">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>

        {/* Fallback button for touch devices */}
        <Button 
          className="w-full md:hidden mt-2" 
          size={compact ? 'sm' : 'md'}
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}