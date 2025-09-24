import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-blue/30 border-t border-dark-blue">
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
            <ul className="mt-4 space-y-2 text-sm text-light-grey/80">
              <li>+7 (800) 555-35-35</li>
              <li>contact@labosfera.ru</li>
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