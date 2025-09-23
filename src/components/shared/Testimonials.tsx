import React from 'react';
import { Star, Quote } from 'lucide-react';
import Card from './Card';
import { useLanguage } from '../../context/LanguageContext';

const getTestimonials = (language: string) => [
  {
    id: 1,
    name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
    location: language === 'ar' ? 'الرياض' : 'Riyadh',
    rating: 5,
    text: language === 'ar' 
      ? 'تجربة تسوق ممتازة! المنتجات عالية الجودة والتوصيل سريع جداً. أنصح الجميع بالتعامل مع هذا المتجر.'
      : 'Excellent shopping experience! High-quality products and very fast delivery. I recommend everyone to deal with this store.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    name: language === 'ar' ? 'سعد الأحمدي' : 'Saad Al-Ahmadi',
    location: language === 'ar' ? 'جدة' : 'Jeddah',
    rating: 5,
    text: language === 'ar'
      ? 'خدمة عملاء رائعة ومتابعة ممتازة للطلبات. المنتجات وصلت في حالة مثالية.'
      : 'Great customer service and excellent order tracking. Products arrived in perfect condition.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    name: language === 'ar' ? 'خالد العتيبي' : 'Khalid Al-Otaibi',
    location: language === 'ar' ? 'الدمام' : 'Dammam',
    rating: 5,
    text: language === 'ar'
      ? 'أسعار تنافسية وجودة عالية. الشحن المجاني سريع والمنتجات أصلية 100%.'
      : 'Competitive prices and high quality. Free shipping is fast and products are 100% authentic.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

export default function Testimonials() {
  const { t, state } = useLanguage();
  const testimonials = getTestimonials(state.currentLanguage);
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="arabic-heading text-2xl sm:text-3xl font-bold text-luxury-text-light dark:text-luxury-text-dark mb-3 sm:mb-4">
          {t('testimonials.title')}
        </h2>
        <p className="arabic-text text-base sm:text-lg text-luxury-gray-600 dark:text-luxury-gray-400 max-w-2xl mx-auto px-4">
          {t('testimonials.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <Card 
            key={testimonial.id} 
            className="p-4 sm:p-6 animate-fadeIn hover-lift"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-luxury-gold-primary fill-current' : 'text-luxury-gray-300'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="relative mb-6">
              <Quote className="absolute -top-2 -right-2 h-8 w-8 text-luxury-gold-primary/20" />
              <p className="arabic-text text-luxury-gray-700 dark:text-luxury-gray-300 leading-relaxed">
                {testimonial.text}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-luxury-gold-primary/20"
              />
              <div>
                <h4 className="arabic-text font-semibold text-luxury-text-light dark:text-luxury-text-dark">
                  {testimonial.name}
                </h4>
                <p className="arabic-text text-sm text-luxury-gray-500 dark:text-luxury-gray-400">
                  {testimonial.location}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
