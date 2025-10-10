'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Типы для cookie-настроек (соответствие ФЗ-152)
interface CookiePreferences {
  necessary: boolean;    // Необходимые (технические) - всегда включены
  analytics: boolean;    // Аналитические (Яндекс.Метрика, Google Analytics)
  marketing: boolean;    // Маркетинговые (реклама, ретаргетинг)
  preferences: boolean;  // Персонализация (сохранение настроек)
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Состояние согласий с cookie (гранулярный контроль - требование Роскомнадзора 2024+)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,     // Всегда true, нельзя отключить (безопасность, корзина)
    analytics: false,    // По умолчанию выключены - требуется согласие!
    marketing: false,    // По умолчанию выключены - требуется согласие!
    preferences: false,  // По умолчанию выключены - требуется согласие!
  });

  useEffect(() => {
    // Проверяем, дал ли пользователь согласие на cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Показываем баннер через небольшую задержку
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      // Загружаем сохраненные предпочтения
      try {
        const savedPrefs = JSON.parse(cookieConsent);
        setPreferences(savedPrefs);
      } catch (e) {
        console.error('Ошибка загрузки настроек cookies');
      }
    }
  }, []);

  // Принять все cookies
  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  // Отклонить все (кроме необходимых)
  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(onlyNecessary);
  };

  // Сохранить выбранные настройки
  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  // Общая функция сохранения
  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Применяем настройки (здесь можно добавить инициализацию аналитики)
    if (prefs.analytics) {
      // Инициализация Яндекс.Метрики/Google Analytics
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Инициализация маркетинговых скриптов
      console.log('Marketing enabled');
    }
    
    closeBanner();
  };

  const closeBanner = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setShowSettings(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${showSettings ? 'max-w-lg' : 'max-w-md'}`}
    >
      <div className="bg-dark-blue/95 backdrop-blur-lg rounded-xl border border-electric-blue/30 shadow-2xl overflow-hidden">
        <div className="p-5">
          {!showSettings ? (
            // Основной баннер
            <div className="flex items-start gap-3">
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-light-grey mb-2">
                  Мы используем cookie
                </h3>
                <p className="text-light-grey/80 text-sm mb-4 leading-relaxed">
                  Для работы сайта и улучшения вашего опыта. Вы можете выбрать категории cookie. 
                  Подробнее в{' '}
                  <Link 
                    href="/privacy-policy" 
                    className="text-electric-blue hover:underline"
                  >
                    Политике конфиденциальности
                  </Link>.
                </p>

                {/* Кнопки действий */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={acceptAll}
                      className="flex-1 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/80 transition-colors text-sm font-medium"
                    >
                      Принять все
                    </button>
                    <button
                      onClick={rejectAll}
                      className="px-4 py-2 bg-dark-blue border border-white/20 text-light-grey rounded-lg hover:bg-dark-blue/50 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Только необходимые
                    </button>
                  </div>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="w-full px-4 py-2 bg-dark-blue border border-electric-blue/50 text-electric-blue rounded-lg hover:bg-electric-blue/10 transition-colors text-sm font-medium"
                  >
                    Настроить cookies
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Детальные настройки (требование ФЗ-152 + позиция Роскомнадзора)
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-light-grey">
                  Настройки cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-light-grey/60 hover:text-light-grey transition-colors"
                  aria-label="Назад"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2">
                {/* Необходимые cookies (всегда включены) */}
                <div className="bg-dark-blue/50 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <h4 className="text-light-grey font-semibold text-sm mb-1">
                        Необходимые cookies
                      </h4>
                      <p className="text-light-grey/70 text-xs leading-relaxed">
                        Обеспечивают базовую функциональность и безопасность сайта. Не могут быть отключены.
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <div className="w-10 h-6 bg-electric-blue rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Аналитические cookies */}
                <div className="bg-dark-blue/50 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <h4 className="text-light-grey font-semibold text-sm mb-1">
                        Аналитические cookies
                      </h4>
                      <p className="text-light-grey/70 text-xs leading-relaxed">
                        Помогают понять, как посетители используют сайт (Яндекс.Метрика). Не содержат личных данных.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className="ml-3 flex-shrink-0"
                    >
                      <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-electric-blue' : 'bg-white/20'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.analytics ? 'ml-auto' : ''
                        }`}></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Маркетинговые cookies */}
                <div className="bg-dark-blue/50 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <h4 className="text-light-grey font-semibold text-sm mb-1">
                        Маркетинговые cookies
                      </h4>
                      <p className="text-light-grey/70 text-xs leading-relaxed">
                        Используются для показа релевантной рекламы и ретаргетинга на других сайтах.
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className="ml-3 flex-shrink-0"
                    >
                      <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? 'bg-electric-blue' : 'bg-white/20'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.marketing ? 'ml-auto' : ''
                        }`}></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Персонализация */}
                <div className="bg-dark-blue/50 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-grow">
                      <h4 className="text-light-grey font-semibold text-sm mb-1">
                        Персонализация
                      </h4>
                      <p className="text-light-grey/70 text-xs leading-relaxed">
                        Сохраняют ваши предпочтения (язык, регион, избранные товары).
                      </p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, preferences: !prev.preferences }))}
                      className="ml-3 flex-shrink-0"
                    >
                      <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.preferences ? 'bg-electric-blue' : 'bg-white/20'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          preferences.preferences ? 'ml-auto' : ''
                        }`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Кнопки сохранения */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={saveCustomPreferences}
                  className="flex-1 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/80 transition-colors text-sm font-medium"
                >
                  Сохранить настройки
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 bg-dark-blue border border-white/20 text-light-grey rounded-lg hover:bg-dark-blue/50 transition-colors text-sm font-medium"
                >
                  Отклонить все
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
