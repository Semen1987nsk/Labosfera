'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreement: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Поле обязательно для заполнения';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Поле обязательно для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Поле обязательно для заполнения';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Выберите тему обращения';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Поле обязательно для заполнения';
    }

    if (!formData.agreement) {
      newErrors.agreement = 'Необходимо согласие на обработку персональных данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Имитация отправки формы
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Форма отправлена:', formData);
        alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
        
        // Очищаем форму
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          agreement: false
        });
      } catch (error) {
        alert('Произошла ошибка при отправке. Попробуйте еще раз.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Имя */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Ваше имя <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
          placeholder="Введите ваше имя"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Телефон */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Телефон <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
          placeholder="+7 (999) 123-45-67"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
        )}
      </div>

      {/* Тема обращения */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Тема обращения <span className="text-red-400">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
        >
          <option value="">Выберите тему</option>
          <option value="general">Общие вопросы</option>
          <option value="equipment">Вопросы по оборудованию</option>
          <option value="order">Заказ и доставка</option>
          <option value="technical">Техническая поддержка</option>
          <option value="partnership">Сотрудничество</option>
          <option value="other">Другое</option>
        </select>
        {errors.subject && (
          <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
        )}
      </div>

      {/* Сообщение */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Сообщение <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={5}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors resize-vertical"
          placeholder="Опишите ваш вопрос или запрос..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400">{errors.message}</p>
        )}
      </div>

      {/* Согласие на обработку данных */}
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleInputChange}
            className="w-4 h-4 mt-1 text-electric-blue bg-dark-blue border-white/10 rounded focus:ring-electric-blue"
          />
          <span className="text-sm text-light-grey/80">
            Я согласен на обработку персональных данных и с{' '}
            <a href="/privacy" className="text-electric-blue hover:underline">
              политикой конфиденциальности
            </a>
          </span>
        </label>
        {errors.agreement && (
          <p className="mt-1 text-sm text-red-400">{errors.agreement}</p>
        )}
      </div>

      {/* Кнопка отправки */}
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Отправляем...
            </span>
          ) : (
            'Отправить сообщение'
          )}
        </Button>
      </div>
    </form>
  );
};