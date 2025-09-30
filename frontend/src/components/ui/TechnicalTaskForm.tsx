'use client';

import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Форма отправлена:', formData);
      // Здесь будет логика отправки формы
      alert('Спасибо! Ваш запрос отправлен. Мы свяжемся с вами в течение 1-2 рабочих дней.');
    }
  };

  return (
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
            Я согласен на обработку персональных данных
          </span>
        </label>
        {errors.agreement && (
          <p className="mt-1 text-sm text-red-400">{errors.agreement}</p>
        )}
      </div>

      {/* Кнопка отправки */}
      <div className="pt-4">
        <Button type="submit" className="w-full">
          Отправить запрос
        </Button>
      </div>
    </form>
  );
};