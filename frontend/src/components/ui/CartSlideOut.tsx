// Компонент slide-out корзины
'use client';

import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { useState } from 'react';
import Link from 'next/link';
import { api, type OrderData } from '@/lib/api';

// Иконки
const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MinusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const ShoppingBagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

// Компонент заказа
const OrderForm = ({ onClose }: { onClose: () => void }) => {
  const { state, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
    consent: false, // Согласие на обработку ПД (требование ФЗ-152)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка согласия (критично по ФЗ-152!)
    if (!formData.consent) {
      alert('Необходимо согласие на обработку персональных данных');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Подготавливаем данные заявки
      const orderData: OrderData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        organization: formData.organization,
        items: state.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      // Отправляем заявку через API клиент
      const response = await api.createOrder(orderData);

      if (response && response.success) {
        setIsSubmitted(true);
        
        // Очищаем корзину и закрываем через 3 секунды
        setTimeout(() => {
          clearCart();
          onClose();
          setIsSubmitted(false);
        }, 3000);
      } else {
        throw new Error(response?.message || 'Ошибка отправки заявки');
      }

    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз или свяжитесь с нами по телефону.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold text-green-400 mb-2">Заявка отправлена!</h3>
        <p className="text-light-grey/70">
          Наш менеджер свяжется с вами в течение рабочего дня для уточнения деталей и расчета стоимости.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Отправить заявку</h3>
      
      <div>
        <input
          type="text"
          placeholder="Ваше имя *"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-4 py-3 bg-deep-blue border border-white/20 rounded-lg text-white placeholder-light-grey/50 focus:border-electric-blue focus:outline-none"
        />
      </div>

      <div>
        <input
          type="tel"
          placeholder="Телефон *"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-4 py-3 bg-deep-blue border border-white/20 rounded-lg text-white placeholder-light-grey/50 focus:border-electric-blue focus:outline-none"
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="Email *"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-3 bg-deep-blue border border-white/20 rounded-lg text-white placeholder-light-grey/50 focus:border-electric-blue focus:outline-none"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Организация"
          value={formData.organization}
          onChange={(e) => setFormData({...formData, organization: e.target.value})}
          className="w-full px-4 py-3 bg-deep-blue border border-white/20 rounded-lg text-white placeholder-light-grey/50 focus:border-electric-blue focus:outline-none"
        />
      </div>

      <div>
        <textarea
          placeholder="Комментарий к заказу"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full px-4 py-3 bg-deep-blue border border-white/20 rounded-lg text-white placeholder-light-grey/50 focus:border-electric-blue focus:outline-none resize-none"
        />
      </div>

      {/* Согласие на обработку персональных данных (ФЗ-152) */}
      <div className="flex items-start gap-2 pt-2">
        <input
          type="checkbox"
          id="cart-consent"
          checked={formData.consent}
          onChange={(e) => setFormData({...formData, consent: e.target.checked})}
          className="mt-1 w-4 h-4 rounded border-white/20 bg-deep-blue text-electric-blue focus:ring-electric-blue focus:ring-offset-0"
        />
        <label htmlFor="cart-consent" className="text-sm text-light-grey/80">
          Я согласен на обработку персональных данных в соответствии с{' '}
          <Link 
            href="/privacy-policy" 
            target="_blank"
            className="text-electric-blue hover:underline"
          >
            политикой конфиденциальности
          </Link>
          {' '}и{' '}
          <Link 
            href="/offer" 
            target="_blank"
            className="text-electric-blue hover:underline"
          >
            договором оферты
          </Link>
          {' *'}
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Назад
        </Button>
      </div>
    </form>
  );
};

export const CartSlideOut = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Slide-out панель */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-blue border-l border-white/10 z-50 flex flex-col"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6 text-electric-blue" />
                Корзина ({state.totalItems})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-light-grey/60 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Содержимое */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {state.items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <ShoppingBagIcon className="w-16 h-16 text-light-grey/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-light-grey/60 mb-2">Корзина пуста</h3>
                    <p className="text-light-grey/40 mb-6">Добавьте товары из каталога</p>
                    <Link href="/catalog">
                      <Button onClick={closeCart}>
                        Перейти в каталог
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : showOrderForm ? (
                <div className="p-6">
                  <OrderForm onClose={() => setShowOrderForm(false)} />
                </div>
              ) : (
                <>
                  {/* Список товаров */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="bg-gradient-to-br from-deep-blue/80 to-deep-blue/40 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                        <div className="flex gap-4">
                          {/* Изображение */}
                          <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {item.product.images?.[0] ? (
                              <img 
                                src={item.product.images[0].image} 
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <div className="text-2xl">📦</div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white leading-tight mb-2 line-clamp-2">
                              {item.product.name}
                            </h4>
                            
                            {/* Артикул */}
                            <p className="text-xs text-light-grey/50 mb-2">
                              Артикул: LBS-{item.product.id.toString().padStart(6, '0')}
                            </p>
                            
                            {/* Цена */}
                            {item.product.price && (
                              <p className="text-electric-blue font-bold text-lg mb-3">
                                {parseFloat(item.product.price).toLocaleString('ru-RU')} ₽
                              </p>
                            )}

                            {/* Количество и управление */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-light-grey/70">Количество:</span>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                                  >
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  <span className="w-10 text-center font-semibold text-white">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                                title="Удалить из корзины"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Сумма за позицию */}
                            {item.product.price && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-light-grey/70">Сумма:</span>
                                  <span className="font-bold text-electric-blue">
                                    {(parseFloat(item.product.price) * item.quantity).toLocaleString('ru-RU')} ₽
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Нижняя панель с кнопкой заказа */}
                  <div className="p-6 border-t border-white/10 bg-gradient-to-r from-dark-blue to-deep-blue">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-light-grey/70">Товаров в корзине:</span>
                        <span className="font-semibold text-white">{state.totalItems} шт.</span>
                      </div>
                      
                      {/* Подсчет общей стоимости */}
                      {(() => {
                        const totalPrice = state.items.reduce((sum, item) => {
                          if (item.product.price) {
                            return sum + (parseFloat(item.product.price) * item.quantity);
                          }
                          return sum;
                        }, 0);
                        
                        return totalPrice > 0 ? (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-light-grey/70">Примерная стоимость:</span>
                            <span className="font-bold text-electric-blue text-lg">
                              {totalPrice.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        ) : null;
                      })()}
                      
                      <p className="text-light-grey/50 text-xs mt-2">
                        * Точная стоимость с учетом скидок и доставки будет рассчитана менеджером
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full py-3 text-lg font-semibold"
                      onClick={() => setShowOrderForm(true)}
                    >
                      Оформить заявку
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};