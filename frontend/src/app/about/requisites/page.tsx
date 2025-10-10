import { Container } from '@/components/ui/Container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Реквизиты организации',
  description: 'Полные реквизиты ООО "ЛАБОСФЕРА" - производитель учебного оборудования',
};

export default function RequisitesPage() {
  return (
    <main className="py-16 bg-deep-blue min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-light-grey mb-8">
            Реквизиты организации
          </h1>

          <div className="bg-dark-blue rounded-lg p-8 border border-white/10">
            {/* Основная информация */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Основная информация
              </h2>
              <div className="space-y-3 text-light-grey">
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Полное наименование:</span>
                  <span>Общество с ограниченной ответственностью "ЛАБОСФЕРА"</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Сокращенное наименование:</span>
                  <span>ООО "ЛАБОСФЕРА"</span>
                </div>
              </div>
            </section>

            {/* Юридические данные */}
            <section className="mb-8 pb-8 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Юридические данные
              </h2>
              <div className="space-y-3 text-light-grey">
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">ИНН:</span>
                  <span>5406846548</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">КПП:</span>
                  <span>540601001</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">ОГРН:</span>
                  <span>1255400006344</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Юридический адрес:</span>
                  <span>630132, Россия, Новосибирская область, г. Новосибирск, ул. Сибирская, дом 41, офис 26</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Фактический адрес:</span>
                  <span>630132, Россия, Новосибирская область, г. Новосибирск, ул. Сибирская, дом 41, офис 26</span>
                </div>
              </div>
            </section>

            {/* Банковские реквизиты */}
            <section className="mb-8 pb-8 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Банковские реквизиты
              </h2>
              <div className="space-y-3 text-light-grey">
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Расчетный счет:</span>
                  <span>40702810920000186896</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Наименование банка:</span>
                  <span>ООО "Банк Точка"</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">БИК банка:</span>
                  <span>044525104</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">ИНН банка:</span>
                  <span>9721194461</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Корр. счет:</span>
                  <span>30101810745374525104</span>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Юридический адрес банка:</span>
                  <span>109044, Российская Федерация, г. Москва, вн.тер.г. муниципальный округ Южнопортовый, пер. 3-й Крутицкий, д.11, помещ. 7Н</span>
                </div>
              </div>
            </section>

            {/* Контактная информация */}
            <section className="mb-8 pb-8 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Контактная информация
              </h2>
              <div className="space-y-3 text-light-grey">
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Телефон:</span>
                  <a href="tel:88004564554" className="text-electric-blue hover:underline">
                    8 800 456 4554 (бесплатный звонок по России)
                  </a>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Email:</span>
                  <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">
                    info@labosfera.ru
                  </a>
                </div>
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="font-semibold min-w-[200px]">Сайт:</span>
                  <a href="https://labosfera.ru" className="text-electric-blue hover:underline">
                    www.labosfera.ru
                  </a>
                </div>
              </div>
            </section>

            {/* Режим работы */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Режим работы
              </h2>
              <div className="space-y-2 text-light-grey">
                <div className="flex gap-4">
                  <span className="font-semibold min-w-[120px]">Понедельник - Пятница:</span>
                  <span>09:00 - 18:00 (МСК)</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-semibold min-w-[120px]">Суббота - Воскресенье:</span>
                  <span>Выходной</span>
                </div>
              </div>
            </section>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-8 p-6 bg-dark-blue/50 rounded-lg border border-white/10">
            <p className="text-light-grey/80 text-sm">
              <strong className="text-light-grey">Примечание:</strong> Данная информация предоставляется в соответствии с требованиями 
              Федерального закона от 27.07.2006 № 152-ФЗ "О персональных данных" и 
              Федерального закона от 13.03.2006 № 38-ФЗ "О рекламе".
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
