'use client';

import Link from 'next/link';

// Функция для открытия настроек cookies
const openCookieSettings = () => {
  if (typeof window !== 'undefined') {
    // Удаляем сохраненное согласие, чтобы баннер появился снова
    localStorage.removeItem('cookieConsent');
    // Перезагружаем страницу для показа баннера
    window.location.reload();
  }
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacts" className="bg-dark-blue/30 border-t border-dark-blue scroll-mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Блок с лого и описанием */}
          <div>
            <h3 className="text-xl font-bold text-light-grey">
              ЛАБО<span className="text-electric-blue">СФЕРА</span>
            </h3>
            <p className="mt-2 text-sm text-light-grey/60">
              Производитель учебного оборудования.
            </p>
          </div>

          {/* Блок с навигацией */}
          <div>
            <h4 className="font-semibold text-light-grey">Навигация</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/catalog" className="text-light-grey/80 hover:text-white">Каталог</Link></li>
              <li><Link href="/production" className="text-light-grey/80 hover:text-white">О производстве</Link></li>
              <li><Link href="/certificates" className="text-light-grey/80 hover:text-white">Сертификаты</Link></li>
              <li><Link href="/custom-task" className="text-light-grey/80 hover:text-white">Техническое задание</Link></li>
            </ul>
            
            <h4 className="font-semibold text-light-grey mt-6">Информация</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about/requisites" className="text-light-grey/80 hover:text-white">Реквизиты организации</Link></li>
              <li><Link href="/delivery" className="text-light-grey/80 hover:text-white">Доставка и оплата</Link></li>
              <li><Link href="/privacy-policy" className="text-light-grey/80 hover:text-white">Политика конфиденциальности</Link></li>
              <li><Link href="/offer" className="text-light-grey/80 hover:text-white">Договор оферты</Link></li>
              <li><Link href="/terms" className="text-light-grey/80 hover:text-white">Пользовательское соглашение</Link></li>
              <li>
                <button 
                  onClick={openCookieSettings}
                  className="text-light-grey/80 hover:text-electric-blue transition-colors"
                >
                  Настройки cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Блок с контактами */}
          <div>
            <h4 className="font-semibold text-light-grey">Контакты</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:info@labosfera.ru" 
                  className="text-light-grey/80 hover:text-electric-blue transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@labosfera.ru
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Компактный блок с реквизитами и копирайтом */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-light-grey/60">
            {/* Реквизиты */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
              <span className="font-medium text-light-grey/80">ООО "ЛАБОСФЕРА"</span>
              <span className="hidden md:inline">•</span>
              <span>ИНН 5406846548</span>
              <span className="hidden md:inline">•</span>
              <span>ОГРН 1255400006344</span>
              <span className="hidden md:inline">•</span>
              <span className="text-center md:text-left">г. Новосибирск, ул. Сибирская, 41, офис 26</span>
            </div>
            
            {/* Копирайт */}
            <div className="text-light-grey/50 whitespace-nowrap">
              © {currentYear} Все права защищены
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};