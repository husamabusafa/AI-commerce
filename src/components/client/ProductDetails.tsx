import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus, Shield, Truck, RefreshCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Badge from '../shared/Badge';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductDetails() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = state.selectedProduct || state.products.find(p => p.id === id) || null;

  if (!product) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <h2 className="text-lg font-medium text-slate-900 mb-2">Product not found</h2>
          <p className="text-slate-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Shop</Button>
        </Card>
      </div>
    );
  }

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Mock additional images for demo
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const features = [
    { icon: Shield, title: 'Quality Guarantee', description: '30-day money back guarantee' },
    { icon: Truck, title: 'Free Shipping', description: 'Free shipping on orders over $50' },
    { icon: RefreshCcw, title: 'Easy Returns', description: 'Hassle-free returns within 30 days' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Button variant="ghost" onClick={goBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden relative">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden ring-2 transition-all ${
                  selectedImage === index 
                    ? 'ring-blue-500' 
                    : 'ring-white/60 hover:ring-white/80 dark:ring-white/10'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.featured && (
                <Badge variant="primary">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-3xl font-bold text-slate-900">${product.price}</div>
              <div className="flex items-center text-sm text-slate-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-2">(128 reviews)</span>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-white/60 dark:bg-white/10 ring-1 ring-white/60 dark:ring-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center py-2 rounded-lg bg-white/60 dark:bg-white/10 ring-1 ring-white/60 dark:ring-white/10 font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 rounded-lg bg-white/60 dark:bg-white/10 ring-1 ring-white/60 dark:ring-white/10 hover:bg-white/80 dark:hover:bg-white/15 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={addToCart} className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Button variant="outline" className="p-3">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Product Features */}
          <Card>
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/60 dark:bg-white/10 ring-1 ring-white/60 dark:ring-white/10">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-gray-100">{feature.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card>
        <div className="border-b border-slate-200/70 dark:border-white/10 mb-6">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 py-2 px-1 text-sm font-medium">
              Description
            </button>
            <button className="border-b-2 border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 py-2 px-1 text-sm font-medium">
              Specifications
            </button>
            <button className="border-b-2 border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 py-2 px-1 text-sm font-medium">
              Reviews (128)
            </button>
          </nav>
        </div>
        
        <div className="space-y-4 text-slate-600 dark:text-gray-300 leading-relaxed">
          <p>
            {product.description} This product is designed with attention to detail and built to last. 
            It features premium materials and craftsmanship that ensure durability and performance. 
            Whether you're using it for everyday tasks or special occasions, this product delivers 
            exceptional value and satisfaction.
          </p>
          
          <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>• Premium quality materials and construction</li>
            <li>• Ergonomic design for comfort and ease of use</li>
            <li>• Durable and long-lasting performance</li>
            <li>• Compatible with modern standards and requirements</li>
            <li>• Backed by our comprehensive warranty</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}