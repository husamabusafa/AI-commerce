import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Package, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Badge from '../shared/Badge';

export default function Products() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600">Manage your product inventory</p>
        </div>
        <Button onClick={() => dispatch({ type: 'SET_ADMIN_VIEW', payload: 'add-product' })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>Total: {state.products.length}</span>
            <span>|</span>
            <span>Low Stock: {state.products.filter(p => p.stock < 10).length}</span>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-4">
            {searchQuery ? 'No products match your search criteria.' : 'Start by adding your first product.'}
          </p>
          <Button onClick={() => dispatch({ type: 'SET_ADMIN_VIEW', payload: 'add-product' })}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover className="relative group animate-slideUp">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                  {product.featured && (
                    <Badge variant="primary" size="sm">Featured</Badge>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">${product.price}</span>
                  <Badge 
                    variant={product.stock < 10 ? 'danger' : 'success'} 
                    size="sm"
                  >
                    {product.stock} in stock
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{product.category}</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    dispatch({ type: 'SET_EDITING_PRODUCT', payload: product });
                    dispatch({ type: 'SET_ADMIN_VIEW', payload: 'edit-product' });
                  }}
                  className="p-2"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}