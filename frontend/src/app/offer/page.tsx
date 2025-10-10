import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Публичная оферта',
  description: 'Договор купли-продажи (публичная оферта) интернет-магазина ЛАБОСФЕРА',
};

export default function OfferPage() {
  return (
    <main className="py-16 bg-deep-blue min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-light-grey mb-4">
              Публичная оферта
            </h1>
            <p className="text-light-grey/70">
              Договор купли-продажи товаров дистанционным способом
            </p>
            <p className="text-sm text-light-grey/60 mt-2">
              Дата публикации: 10 октября 2025 г.
            </p>
          </div>

          <div className="bg-dark-blue/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8 text-light-grey/90">
            {/* Преамбула */}
            <section>
              <p>
                Настоящий документ является официальным предложением (публичной офертой) Общества с ограниченной ответственностью «ЛАБОСФЕРА» (далее — «Продавец») заключить договор купли-продажи товаров дистанционным способом на условиях, изложенных ниже.
              </p>
              <p className="mt-3">
                <strong>Акцептом настоящей оферты является:</strong> оформление заказа на сайте www.labosfera.ru и/или оплата товара.
              </p>
            </section>

            {/* 1. Предмет договора */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                1. Предмет договора
              </h2>
              <p>
                Продавец обязуется передать в собственность Покупателю Товар, а Покупатель обязуется принять Товар и оплатить его на условиях настоящего Договора.
              </p>
              <p className="mt-3">
                Договор считается заключенным с момента оформления Заказа Покупателем на Сайте и получения подтверждения от Продавца.
              </p>
            </section>

            {/* 2. Оформление заказа */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                2. Порядок оформления заказа
              </h2>
              <p>Заказ оформляется Покупателем через Сайт. При оформлении Покупатель обязан предоставить:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Для физических лиц: ФИО, email, адрес доставки</li>
                <li>Для юридических лиц: название организации, ИНН, КПП, юридический адрес, контакты</li>
              </ul>
            </section>

            {/* 3. Цена */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                3. Цена товара
              </h2>
              <p>
                Цены на Товары указаны на Сайте в рублях РФ. Продавец имеет право изменить цену на любой Товар в одностороннем порядке. Изменение цены не распространяется на уже оформленные и подтвержденные Заказы.
              </p>
            </section>

            {/* 4. Оплата */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                4. Порядок оплаты
              </h2>
              <p>Оплата Товара производится одним из следующих способов:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li><strong>Безналичный расчет</strong> — оплата по счету (для юридических лиц и ИП)</li>
                <li><strong>Банковские карты</strong> — онлайн-оплата на сайте (Visa, MasterCard, МИР)</li>
                <li><strong>Наличными</strong> — оплата при получении товара</li>
              </ul>
            </section>

            {/* 5. Доставка */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                5. Доставка товара
              </h2>
              <p>Доставка осуществляется по адресу, указанному Покупателем. Способы доставки:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Курьерская доставка (Новосибирск и область)</li>
                <li>Транспортные компании (по всей России)</li>
                <li>Почта России</li>
                <li>Самовывоз (г. Новосибирск, ул. Сибирская, д. 41, офис 26)</li>
              </ul>
              <p className="mt-3">
                Подробнее о доставке: <Link href="/delivery" className="text-electric-blue hover:underline">страница «Доставка и оплата»</Link>
              </p>
            </section>

            {/* 6. Возврат */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                6. Возврат и обмен товара
              </h2>
              <div className="space-y-3">
                <p>
                  В соответствии со <strong>ст. 26.1 Закона РФ «О защите прав потребителей» (ФЗ-2300)</strong> Покупатель имеет право:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Отказаться от товара в любое время до его передачи</strong></li>
                  <li><strong>Отказаться от товара в течение 7 дней после получения</strong> (без объяснения причин)</li>
                  <li>Вернуть товар надлежащего качества, если сохранены его товарный вид, потребительские свойства, документы</li>
                </ul>
                
                <div className="bg-deep-blue/50 rounded-lg p-4 mt-3">
                  <p className="font-semibold text-electric-blue mb-2">Важные условия возврата:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>Товар не был в употреблении</li>
                    <li>Сохранена упаковка, этикетки, пломбы (если были)</li>
                    <li>Сохранены потребительские свойства</li>
                    <li>Есть документ, подтверждающий покупку</li>
                  </ul>
                </div>

                <p className="mt-3">
                  <strong>Возврат денежных средств</strong> осуществляется в течение 10 дней с момента получения Продавцом письменного заявления Покупателя (ст. 22 Закона о ЗПП).
                </p>
                
                <p className="mt-3">
                  Для оформления возврата или обмена обращайтесь по email: <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a>
                </p>
              </div>
            </section>

            {/* 7. Гарантии */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                7. Гарантийные обязательства
              </h2>
              <p>
                На Товары предоставляется гарантия производителя или Продавца. Срок гарантии указывается в гарантийном талоне, прилагаемом к Товару.
              </p>
            </section>

            {/* 8. Конфиденциальность */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                8. Конфиденциальность и защита данных
              </h2>
              <p>
                Принимая условия настоящей оферты, Покупатель дает согласие на обработку своих персональных данных в соответствии с <Link href="/privacy-policy" className="text-electric-blue hover:underline">Политикой конфиденциальности</Link>.
              </p>
            </section>

            {/* Реквизиты */}
            <section className="border-t border-white/10 pt-6">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Реквизиты продавца
              </h2>
              <div className="bg-deep-blue/50 rounded-lg p-6 space-y-2">
                <p><strong>Общество с ограниченной ответственностью «ЛАБОСФЕРА»</strong></p>
                <p><strong>Сокращенное наименование:</strong> ООО «ЛАБОСФЕРА»</p>
                <p><strong>ИНН:</strong> 5406846548</p>
                <p><strong>КПП:</strong> 540601001</p>
                <p><strong>ОГРН:</strong> 1255400006344</p>
                <p><strong>Юридический адрес:</strong> 630091, Новосибирская обл., г. Новосибирск, ул. Сибирская, д. 41, офис 26</p>
                <p className="pt-3 border-t border-white/10"><strong>Банковские реквизиты:</strong></p>
                <p><strong>Расчетный счет:</strong> 40702810920000186896</p>
                <p><strong>Банк:</strong> ООО "Банк Точка"</p>
                <p><strong>К/с:</strong> 30101810745374525104</p>
                <p><strong>БИК:</strong> 044525104</p>
                <p className="pt-3 border-t border-white/10"><strong>Контакты:</strong></p>
                <p><strong>Email:</strong> <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a></p>
                <p><strong>Сайт:</strong> <Link href="https://www.labosfera.ru" className="text-electric-blue hover:underline">www.labosfera.ru</Link></p>
                <p><strong>Режим работы:</strong> Понедельник-Пятница: 9:00 - 18:00 (МСК+4)</p>
              </div>
            </section>

            <div className="text-sm text-light-grey/60 text-center pt-4">
              Настоящая публичная оферта действительна с момента размещения на сайте.
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
