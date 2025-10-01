'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { api, type ContactData } from '@/lib/api';

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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    } else {
      // Проверяем формат телефона - минимум 10 цифр
      const phoneDigits = formData.phone.replace(/[^\d]/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Номер телефона должен содержать минимум 10 цифр';
      }
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
        // Подготавливаем данные для API
        const contactData: ContactData = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          request_type: 'general', // Можно сделать динамическим на основе subject
          message: `Тема: ${formData.subject}\n\n${formData.message}`
        };

        // Отправляем через API
        const response = await api.createContactRequest(contactData);
        
        if (response && response.success) {
          setIsSubmitted(true);
          
          // Сбрасываем форму через 5 секунд
          setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
              agreement: false
            });
          }, 5000);
        } else {
          // Обрабатываем ошибки валидации от backend
          if (response?.errors) {
            setErrors(response.errors);
          } else {
            throw new Error(response?.message || 'Ошибка отправки');
          }
        }
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        
        // Если это не ошибка валидации, показываем общее сообщение
        if (!errors || Object.keys(errors).length === 0) {
          console.error('Произошла ошибка при отправке. Попробуйте еще раз.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      {!isSubmitted ? (
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
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-purple-500/10 rounded-3xl" />
          
          <div className="relative bg-deep-blue/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0">
              <motion.div 
                className="absolute w-32 h-32 -top-16 -right-16 bg-electric-blue/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute w-24 h-24 -bottom-12 -left-12 bg-green-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25"
              >
                <motion.svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </motion.div>
              
              <motion.h3 
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-light-grey bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Сообщение отправлено!
              </motion.h3>
              
              <motion.p 
                className="text-lg text-light-grey/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-electric-blue font-semibold">Спасибо!</span> Ваше сообщение получено.<br />
                Мы свяжемся с вами в <span className="text-green-400 font-semibold">ближайшее время</span>.
              </motion.p>

              <motion.div
                className="mt-6 p-4 bg-electric-blue/10 rounded-xl border border-electric-blue/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm text-electric-blue font-medium">
                  📧 Ваше обращение передано соответствующему специалисту
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};