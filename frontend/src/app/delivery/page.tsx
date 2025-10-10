import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Доставка и оплата',
  description: 'Информация о способах доставки и оплаты заказов в интернет-магазине ЛАБОСФЕРА',
};

export default function DeliveryPage() {
  return (
    <main className="py-16 bg-deep-blue min-h-screen">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-light-grey mb-4">
              Доставка и оплата
            </h1>
            <p className="text-xl text-light-grey/70">
              Удобные способы получения и оплаты вашего заказа
            </p>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-dark-blue/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center hover:border-electric-blue/50 transition-all">
              <div className="flex justify-center mb-4 text-5xl">
                🚚
              </div>
              <h3 className="text-xl font-semibold text-light-grey mb-2">
                Доставка по России
              </h3>
              <p className="text-light-grey/70">
                Отправляем заказы во все регионы РФ
              </p>
            </div>

            <div className="bg-dark-blue/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center hover:border-electric-blue/50 transition-all">
              <div className="flex justify-center mb-4 text-5xl">
                💳
              </div>
              <h3 className="text-xl font-semibold text-light-grey mb-2">
                Удобная оплата
              </h3>
              <p className="text-light-grey/70">
                Наличный и безналичный расчет
              </p>
            </div>

            <div className="bg-dark-blue/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center hover:border-electric-blue/50 transition-all">
              <div className="flex justify-center mb-4 text-5xl">
                ✅
              </div>
              <h3 className="text-xl font-semibold text-light-grey mb-2">
                Гарантия качества
              </h3>
              <p className="text-light-grey/70">
                Проверяем каждый заказ перед отправкой
              </p>
            </div>
          </div>

          {/* Способы доставки */}
          <section className="bg-dark-blue/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12 mb-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">🚚</span>
              <h2 className="text-3xl font-bold text-light-grey">
                Способы доставки
              </h2>
            </div>

            <div className="space-y-8 text-light-grey/90">
              {/* Курьерская доставка */}
              <div className="border-b border-white/10 pb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center text-2xl">
                      📍
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-electric-blue mb-3">
                      Курьерская доставка
                    </h3>
                    <p><strong>Регион:</strong> г. Новосибирск и Новосибирская область</p>
                    <p className="mt-2"><strong>Срок:</strong> 1-2 рабочих дня</p>
                    <p className="mt-2"><strong>Стоимость:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                      <li>Новосибирск (в черте города) — от 300 руб.</li>
                      <li>Пригород (до 30 км) — от 500 руб.</li>
                      <li className="text-electric-blue">Бесплатно при заказе от 30 000 руб.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Транспортные компании */}
              <div className="border-b border-white/10 pb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center text-2xl">
                      🚛
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-electric-blue mb-3">
                      Транспортные компании
                    </h3>
                    <p><strong>Регион:</strong> вся территория Российской Федерации</p>
                    <p className="mt-2"><strong>Компании:</strong> СДЭК, ПЭК, Деловые линии, Boxberry, КИТ</p>
                    <p className="mt-2"><strong>Срок:</strong> 3-14 рабочих дней в зависимости от региона</p>
                    <p className="mt-2"><strong>Стоимость:</strong> рассчитывается индивидуально</p>
                  </div>
                </div>
              </div>

              {/* Почта России */}
              <div className="border-b border-white/10 pb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-electric-blue mb-3">
                      Почта России
                    </h3>
                    <p><strong>Регион:</strong> любой населенный пункт России</p>
                    <p className="mt-2"><strong>Срок:</strong> 7-21 рабочий день</p>
                    <p className="mt-2"><strong>Стоимость:</strong> от 350 руб.</p>
                  </div>
                </div>
              </div>

              {/* Самовывоз */}
              <div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center text-2xl">
                      🕐
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-electric-blue mb-3">
                      Самовывоз
                    </h3>
                    <p><strong>Адрес:</strong> г. Новосибирск, ул. Сибирская, д. 41, офис 26</p>
                    <p className="mt-2"><strong>Режим работы:</strong> Понедельник-Пятница: 9:00 - 18:00 (МСК+4)</p>
                    <p className="mt-2 text-electric-blue font-semibold">Стоимость: БЕСПЛАТНО</p>
                    <p className="mt-3 text-orange-400">
                      ⚠️ Самовывоз осуществляется по предварительному согласованию!
                    </p>
                    <p className="mt-2">Email: <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Способы оплаты */}
          <section className="bg-dark-blue/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12 mb-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">💳</span>
              <h2 className="text-3xl font-bold text-light-grey">
                Способы оплаты
              </h2>
            </div>

            <div className="space-y-8">
              {/* Для физических лиц */}
              <div className="border-b border-white/10 pb-8">
                <h3 className="text-2xl font-semibold text-electric-blue mb-4">
                  Для физических лиц
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-deep-blue/50 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-light-grey mb-3">
                      💳 Банковские карты
                    </h4>
                    <ul className="text-light-grey/90 space-y-2">
                      <li>✓ Visa, MasterCard, МИР</li>
                      <li>✓ Оплата онлайн на сайте</li>
                      <li>✓ Защищенная транзакция</li>
                    </ul>
                  </div>

                  <div className="bg-deep-blue/50 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-light-grey mb-3">
                      💵 Наличные
                    </h4>
                    <ul className="text-light-grey/90 space-y-2">
                      <li>✓ Оплата при получении</li>
                      <li>✓ Курьеру или в пункте выдачи</li>
                      <li>✓ Выдается кассовый чек</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Для юридических лиц */}
              <div>
                <h3 className="text-2xl font-semibold text-electric-blue mb-4">
                  Для юридических лиц и ИП
                </h3>
                <div className="bg-deep-blue/50 rounded-lg p-6 border border-white/10 text-light-grey/90">
                  <p className="mb-3">
                    <strong>Безналичный расчет</strong> — оплата по счету с НДС или без НДС
                  </p>
                  <p><strong>Порядок работы:</strong></p>
                  <ol className="list-decimal list-inside ml-4 space-y-2 mt-2">
                    <li>Оформляете заказ на сайте или через менеджера</li>
                    <li>Получаете счет на оплату</li>
                    <li>Производите оплату по счету</li>
                    <li>После зачисления средств отправляем товар</li>
                    <li>Получаете полный пакет документов (УПД, ТОРГ-12)</li>
                  </ol>
                  <div className="mt-4 p-4 bg-deep-blue rounded-lg">
                    <p className="text-sm"><strong>Реквизиты:</strong></p>
                    <p className="text-sm mt-2">ООО «ЛАБОСФЕРА»</p>
                    <p className="text-sm">ИНН: 5406846548 / КПП: 540601001</p>
                    <p className="text-sm">Р/с: 40702810920000186896</p>
                    <p className="text-sm">Банк: ООО "Банк Точка"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Важная информация */}
          <section className="bg-gradient-to-r from-electric-blue/10 to-purple-500/10 rounded-2xl border border-white/10 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-light-grey mb-6">
              Важная информация
            </h2>
            <div className="space-y-4 text-light-grey/90">
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <p>
                  <strong>Проверка товара:</strong> при получении проверьте комплектность и целостность в присутствии курьера
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <p>
                  <strong>Гарантия:</strong> на все товары предоставляется гарантия производителя
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <p>
                  <strong>Возврат:</strong> возможен в течение 7 дней при сохранении товарного вида
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✓</span>
                <p>
                  <strong>Отслеживание:</strong> после отправки вы получите трек-номер для отслеживания
                </p>
              </div>
            </div>
          </section>

          {/* Контакты */}
          <section className="mt-12 text-center bg-dark-blue/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-light-grey mb-4">
              Остались вопросы?
            </h2>
            <p className="text-light-grey/70 mb-6">
              Свяжитесь с нами, и мы ответим на все ваши вопросы
            </p>
            <a
              href="mailto:info@labosfera.ru"
              className="inline-flex items-center px-6 py-3 bg-electric-blue text-white rounded-lg hover:bg-electric-blue/80 transition-colors"
            >
              <span className="mr-2">✉️</span>
              info@labosfera.ru
            </a>
            <p className="text-sm text-light-grey/60 mt-4">
              Режим работы: Пн-Пт, 9:00 - 18:00 (МСК+4)
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
