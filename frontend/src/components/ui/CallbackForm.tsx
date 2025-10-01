'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Container } from './Container';

interface FormData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  message: string;
}

export const CallbackForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    organization: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Поле обязательно для заполнения';
    } else {
      // Проверяем формат телефона - минимум 10 цифр
      const phoneDigits = formData.phone.replace(/[^\d]/g, '');
      if (phoneDigits.length < 10) {
        newErrors.phone = 'Номер телефона должен содержать минимум 10 цифр';
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
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
      // Подготавливаем данные обращения
      const contactData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        organization: formData.organization,
        message: formData.message,
        request_type: 'callback' // Тип обращения - обратный звонок
      };

      // Отправляем обращение на сервер
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
            name: '',
            phone: '',
            email: '',
            organization: '',
            message: ''
          });
        }, 5000);
      } else {
        // Обрабатываем ошибки валидации от backend
        if (result.errors) {
          setErrors(result.errors);
        } else {
          throw new Error(result.message || 'Ошибка отправки обращения');
        }
      }
    } catch (error) {
      console.error('Ошибка отправки обращения:', error);
      alert('Произошла ошибка при отправке обращения. Попробуйте еще раз или свяжитесь с нами по телефону.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-dark-blue via-deep-blue to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute w-96 h-96 -top-48 -right-48 bg-electric-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 -bottom-40 -left-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-light-grey bg-clip-text text-transparent">
              Получите персональную консультацию
            </h2>
            <p className="text-xl text-light-grey/80 mb-8 leading-relaxed">
              Оставьте заявку, и наш эксперт свяжется с вами для обсуждения 
              оптимального решения для вашей образовательной организации
            </p>

            <div className="space-y-6">
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Перезвоним в течение часа</h3>
                  <p className="text-light-grey/70">В рабочее время отвечаем мгновенно</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Персональная консультация</h3>
                  <p className="text-light-grey/70">Подберем оптимальное решение именно для вас</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Работаем 24/7</h3>
                  <p className="text-light-grey/70">Заявки принимаем круглосуточно</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-deep-blue/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              {/* Form gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-purple-500/5 rounded-3xl" />
              
              <div className="relative z-10">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Имя */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-light-grey/80 mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-light-grey/50 focus:outline-none focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300 ${
                          errors.name ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-electric-blue'
                        }`}
                        placeholder="Введите ваше имя"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                      )}
                    </motion.div>

                    {/* Телефон */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-light-grey/80 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-light-grey/50 focus:outline-none focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300 ${
                          errors.phone ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-electric-blue'
                        }`}
                        placeholder="+7 (999) 123-45-67"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.75 }}
                    >
                      <label className="block text-sm font-medium text-light-grey/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-light-grey/50 focus:outline-none focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300 ${
                          errors.email ? 'border-red-400 focus:border-red-400' : 'border-white/10 focus:border-electric-blue'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                      )}
                    </motion.div>

                    {/* Организация */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-light-grey/80 mb-2">
                        Организация
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-light-grey/50 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300"
                        placeholder="МБОУ СОШ №123"
                      />
                    </motion.div>

                    {/* Сообщение */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <label className="block text-sm font-medium text-light-grey/80 mb-2">
                        Комментарий
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-light-grey/50 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 transition-all duration-300 resize-none"
                        placeholder="Расскажите о ваших потребностях..."
                      />
                    </motion.div>

                    {/* Кнопка отправки */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-electric-blue to-purple-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-electric-blue/90 hover:to-purple-500/90 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Отправляем...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Получить консультацию
                        </span>
                      )}
                    </motion.button>

                    <p className="text-xs text-light-grey/60 text-center">
                      Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Спасибо за обращение!</h3>
                    <p className="text-light-grey/80">
                      Мы получили вашу заявку и свяжемся с вами в течение часа в рабочее время.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};