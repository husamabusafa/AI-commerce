import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  [key: string]: any;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  error,
  required,
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-luxury-gray-700 dark:text-luxury-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left bg-white dark:bg-luxury-dark border rounded-xl flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary ${
          error
            ? 'border-red-300 dark:border-red-600'
            : isOpen
            ? 'border-luxury-gold-primary dark:border-luxury-gold-primary'
            : 'border-luxury-gray-300 dark:border-luxury-gray-600 hover:border-luxury-gray-400 dark:hover:border-luxury-gray-500'
        }`}
      >
        <span className={selectedOption ? 'text-luxury-text-light dark:text-luxury-text-dark' : 'text-luxury-gray-400'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-luxury-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-luxury-dark border border-luxury-gray-300 dark:border-luxury-gray-600 rounded-xl shadow-luxury overflow-hidden animate-fadeIn">
          {/* Search Input */}
          {options.length > 5 && (
            <div className="p-3 border-b border-luxury-gray-200 dark:border-luxury-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-luxury-gray-50 dark:bg-luxury-gray-800 border border-luxury-gray-200 dark:border-luxury-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold-primary text-sm text-luxury-text-light dark:text-luxury-text-dark placeholder-luxury-gray-400"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm text-luxury-gray-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors duration-150 ${
                    option.id === value
                      ? 'bg-luxury-gold-primary/10 text-luxury-gold-primary'
                      : 'text-luxury-text-light dark:text-luxury-text-dark hover:bg-luxury-gray-100 dark:hover:bg-luxury-gray-800'
                  }`}
                >
                  <span className="text-sm">{option.name}</span>
                  {option.id === value && (
                    <Check className="h-4 w-4 text-luxury-gold-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2 animate-fadeIn flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
