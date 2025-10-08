import Link from 'next/link';

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
          </div>

          {/* Блок с контактами */}
          <div>
            <h4 className="font-semibold text-light-grey">Контакты</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a 
                  href="tel:88004564554" 
                  className="text-light-grey/80 hover:text-electric-blue transition-colors flex items-center justify-center md:justify-start gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  8 800 456 4554
                </a>
              </li>
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
        <div className="mt-8 pt-8 border-t border-dark-blue text-center text-xs text-light-grey/50">
          <p>&copy; {currentYear} ООО "ЛАБОСФЕРА". Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};