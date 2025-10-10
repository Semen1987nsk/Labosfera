'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';

export const TechnicalTaskForm = () => {
  const [formData, setFormData] = useState({
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    equipment: '',
    file: null as File | null,
    recaptcha: false,
    agreement: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Поле обязательно для заполнения';
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

    if (!formData.email.trim()) {
      newErrors.email = 'Поле обязательно для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Поле обязательно для заполнения';
    }

    if (!formData.recaptcha) {
      newErrors.recaptcha = 'Подтвердите, что вы не робот';
    }

    if (!formData.agreement) {
      newErrors.agreement = 'Необходимо согласие на обработку персональных данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Подготавливаем данные для отправки
      const contactData = {
        name: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        organization: `Город: ${formData.city}`,
        message: `Техническое задание\n\nОборудование: ${formData.equipment || 'Не указано'}`,
        request_type: 'custom_order' // Тип обращения - заказ по техническому заданию
      };

      // Отправляем на сервер
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/contacts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        
        // Сбрасываем форму через 5 секунд
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            contactPerson: '',
            phone: '',
            email: '',
            city: '',
            equipment: '',
            file: null,
            recaptcha: false,
            agreement: false
          });
        }, 5000);
      } else {
        // Обрабатываем ошибки валидации от backend
        if (result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Ошибка отправки заявки');
        }
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
      {/* Контактное лицо */}
      <div>
        <label htmlFor="contactPerson" className="block text-sm font-medium mb-2">
          Контактное лицо <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="contactPerson"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
          placeholder="Введите ФИО"
        />
        {errors.contactPerson && (
          <p className="mt-1 text-sm text-red-400">{errors.contactPerson}</p>
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

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          E-mail <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
          placeholder="mail@domain.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Город */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-2">
          Город или местоположение <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors"
          placeholder="Введите город"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-400">{errors.city}</p>
        )}
      </div>

      {/* Перечень оборудования */}
      <div>
        <label htmlFor="equipment" className="block text-sm font-medium mb-2">
          Перечень необходимого оборудования
        </label>
        <textarea
          id="equipment"
          name="equipment"
          value={formData.equipment}
          onChange={handleInputChange}
          rows={5}
          className="w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg focus:border-electric-blue focus:outline-none transition-colors resize-vertical"
          placeholder="Опишите какое оборудование вам необходимо..."
        />
      </div>

      {/* Файл */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium mb-2">
          Подгрузить файл
        </label>
        <div className="relative">
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
          />
          <label
            htmlFor="file"
            className="flex items-center justify-center w-full px-4 py-3 bg-dark-blue border border-white/10 rounded-lg cursor-pointer hover:border-electric-blue transition-colors"
          >
            <span className="text-light-grey/60">
              {formData.file ? formData.file.name : 'Файл не выбран'}
            </span>
          </label>
        </div>
      </div>

      {/* Recaptcha */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="recaptcha"
            checked={formData.recaptcha}
            onChange={handleInputChange}
            className="w-4 h-4 text-electric-blue bg-dark-blue border-white/10 rounded focus:ring-electric-blue"
          />
          <span className="text-sm">
            Подтвердите, что вы не робот <span className="text-red-400">*</span>
          </span>
        </label>
        {errors.recaptcha && (
          <p className="mt-1 text-sm text-red-400">{errors.recaptcha}</p>
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
            Я согласен на обработку персональных данных и принимаю условия{' '}
            <a href="/privacy-policy" target="_blank" className="text-electric-blue hover:underline">
              политики конфиденциальности
            </a>
            {' '}и{' '}
            <a href="/terms" target="_blank" className="text-electric-blue hover:underline">
              пользовательского соглашения
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
            'Отправить запрос'
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
                Запрос отправлен!
              </motion.h3>
              
              <motion.p 
                className="text-lg text-light-grey/80 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-electric-blue font-semibold">Спасибо!</span> Ваш запрос на техническое задание получен.<br />
                Мы свяжемся с вами в течение <span className="text-green-400 font-semibold">1-2 рабочих дней</span>.
              </motion.p>

              <motion.div
                className="mt-6 p-4 bg-electric-blue/10 rounded-xl border border-electric-blue/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm text-electric-blue font-medium">
                  💼 Ваш запрос обрабатывается нашими специалистами
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};