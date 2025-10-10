import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика обработки персональных данных ООО «ЛАБОСФЕРА»',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="py-16 bg-deep-blue min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-light-grey mb-4">
              Политика конфиденциальности
            </h1>
            <p className="text-light-grey/70">
              Последнее обновление: 10 октября 2025 г.
            </p>
          </div>

          <div className="bg-dark-blue/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8 text-light-grey/90">
            {/* 1. Общие положения */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                1. Общие положения
              </h2>
              <div className="space-y-3">
                <p>
                  Настоящая Политика конфиденциальности персональных данных (далее — Политика) действует в отношении всей информации, которую интернет-магазин <strong>ЛАБОСФЕРА</strong>, расположенный на доменном имени <Link href="https://www.labosfera.ru" className="text-electric-blue hover:underline">www.labosfera.ru</Link>, может получить о Пользователе во время использования сайта.
                </p>
                <p>
                  Используя сайт, вы соглашаетесь с условиями настоящей Политики. В случае несогласия прекратите использование сайта.
                </p>
                <div className="bg-deep-blue/50 rounded-lg p-4 mt-4">
                  <p><strong>Оператор персональных данных:</strong></p>
                  <p>Общество с ограниченной ответственностью «ЛАБОСФЕРА» (ООО «ЛАБОСФЕРА»)</p>
                  <p><strong>ИНН:</strong> 5406846548</p>
                  <p><strong>ОГРН:</strong> 1255400006344</p>
                  <p><strong>Адрес:</strong> 630091, Новосибирская обл., г. Новосибирск, ул. Сибирская, д. 41, офис 26</p>
                  <p><strong>Email:</strong> info@labosfera.ru</p>
                </div>
              </div>
            </section>

            {/* 2. Какие данные собираем */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                2. Какие персональные данные мы собираем
              </h2>
              <p>При использовании сайта мы можем собирать следующую информацию:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li><strong>Контактные данные:</strong> имя, фамилия, адрес электронной почты</li>
                <li><strong>Данные о заказах:</strong> адрес доставки, информация о товарах, история покупок</li>
                <li><strong>Данные об организации:</strong> название компании, ИНН, КПП (для юридических лиц)</li>
                <li><strong>Технические данные:</strong> IP-адрес, тип браузера, операционная система</li>
                <li><strong>Cookie-файлы:</strong> данные о предпочтениях, сессиях, аналитике</li>
              </ul>
            </section>

            {/* 3. Цели обработки */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                3. Цели обработки персональных данных
              </h2>
              <p>Мы обрабатываем ваши персональные данные в следующих целях:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Идентификация Пользователя и связь с ним</li>
                <li>Обработка и выполнение заказов</li>
                <li>Предоставление технической поддержки</li>
                <li>Улучшение качества работы сайта</li>
                <li>Проведение статистических исследований</li>
                <li>Соблюдение требований законодательства РФ</li>
              </ul>
            </section>

            {/* 4. Правовые основания */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                4. Правовые основания обработки
              </h2>
              <p>Правовыми основаниями обработки персональных данных являются:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
                <li>Согласие субъекта персональных данных на обработку</li>
                <li>Договор, стороной которого является субъект персональных данных</li>
              </ul>
            </section>

            {/* 5. Защита данных */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                5. Меры по защите персональных данных
              </h2>
              <p>Оператор принимает необходимые организационные и технические меры для защиты персональных данных:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Использование SSL-сертификата для шифрования данных</li>
                <li>Ограничение доступа к персональным данным</li>
                <li>Хранение данных на защищенных серверах с резервным копированием</li>
                <li>Регулярное обновление систем безопасности</li>
              </ul>
            </section>

            {/* 6. Cookie */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                6. Использование файлов cookie
              </h2>
              <p className="mb-4">
                Сайт использует файлы cookie для улучшения работы и анализа посещаемости. 
                <strong> Вы имеете право управлять настройками cookie через специальный баннер на сайте.</strong>
              </p>
              
              <div className="bg-deep-blue/50 rounded-lg p-4 space-y-3">
                <p><strong>Категории используемых cookies:</strong></p>
                
                <div className="ml-4 space-y-3">
                  <div>
                    <p className="font-semibold text-electric-blue">🔧 Необходимые (технические)</p>
                    <p className="text-sm">Обеспечивают работу сайта, безопасность, корзину покупок. Не требуют согласия (ст. 10 ФЗ-152).</p>
                    <p className="text-xs text-light-grey/60">Срок хранения: сессия или 12 месяцев</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-electric-blue">📊 Аналитические</p>
                    <p className="text-sm">Яндекс.Метрика, Google Analytics — анализ поведения пользователей. Требуют вашего согласия.</p>
                    <p className="text-xs text-light-grey/60">Срок хранения: до 24 месяцев</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-electric-blue">📢 Маркетинговые</p>
                    <p className="text-sm">Ретаргетинг, показ рекламы на других сайтах. Требуют вашего согласия.</p>
                    <p className="text-xs text-light-grey/60">Срок хранения: до 12 месяцев</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-electric-blue">⚙️ Персонализация</p>
                    <p className="text-sm">Сохранение языка, региона, избранных товаров. Требуют вашего согласия.</p>
                    <p className="text-xs text-light-grey/60">Срок хранения: до 12 месяцев</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm">
                    <strong>Как управлять cookies:</strong> Используйте кнопку "Настройки cookies" в футере сайта или в настройках браузера. 
                    Отключение некоторых cookies может повлиять на функциональность сайта.
                  </p>
                </div>
              </div>
            </section>

            {/* 6.1 Сроки хранения */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                6.1. Сроки хранения персональных данных
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Данные для выполнения договора:</strong> хранятся до исполнения обязательств + 3 года (в соответствии с налоговым законодательством)</li>
                <li><strong>Данные для рассылок:</strong> до отзыва согласия или 3 года с момента последнего взаимодействия</li>
                <li><strong>Технические данные (логи):</strong> до 6 месяцев</li>
                <li><strong>Cookie-файлы:</strong> от сессии до 24 месяцев (в зависимости от типа)</li>
              </ul>
              <p className="mt-3 text-sm">
                После истечения сроков хранения данные уничтожаются или обезличиваются.
              </p>
            </section>

            {/* 6.2 Трансграничная передача */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                6.2. Трансграничная передача данных
              </h2>
              <p className="mb-3">
                В случае использования сервисов, чьи серверы расположены за пределами РФ (например, Яндекс.Облако, Google Analytics), 
                мы обеспечиваем соответствующий уровень защиты данных:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Использование только проверенных поставщиков с адекватным уровнем защиты</li>
                <li>Заключение договоров с гарантиями защиты данных</li>
                <li>Минимизация объема передаваемых данных</li>
                <li>Получение вашего согласия на трансграничную передачу (при активации аналитических/маркетинговых cookies)</li>
              </ul>
            </section>

            {/* 7. Ваши права */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                7. Ваши права
              </h2>
              <p>В соответствии с законодательством РФ (ФЗ-152) вы имеете следующие права:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li><strong>Право на информацию:</strong> узнать, какие данные мы обрабатываем и для каких целей</li>
                <li><strong>Право на доступ:</strong> получить копию своих персональных данных</li>
                <li><strong>Право на исправление:</strong> внести изменения в неточные или неполные данные</li>
                <li><strong>Право на удаление:</strong> потребовать удаления данных (кроме случаев, когда хранение обязательно по закону)</li>
                <li><strong>Право на ограничение обработки:</strong> приостановить обработку на время проверки или разногласий</li>
                <li><strong>Право на отзыв согласия:</strong> в любой момент отозвать согласие на обработку (не влияет на законность предыдущей обработки)</li>
                <li><strong>Право на возражение:</strong> возражать против обработки в маркетинговых целях</li>
                <li><strong>Право на жалобу:</strong> обратиться в Роскомнадзор при нарушении ваших прав</li>
              </ul>
              <div className="bg-deep-blue/50 rounded-lg p-4 mt-4">
                <p><strong>Как реализовать свои права:</strong></p>
                <p className="mt-2">Направьте запрос на email: <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a></p>
                <p className="text-sm text-light-grey/70 mt-2">
                  <strong>Срок рассмотрения:</strong> не более 30 дней с момента получения запроса (ст. 14 ФЗ-152)
                </p>
                <p className="text-sm text-light-grey/70 mt-1">
                  <strong>Контакты Роскомнадзора:</strong> 
                  <a href="https://rkn.gov.ru" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline ml-1">
                    rkn.gov.ru
                  </a>
                </p>
              </div>
            </section>

            {/* Контакты */}
            <section className="border-t border-white/10 pt-6">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Контактная информация
              </h2>
              <div className="bg-deep-blue/50 rounded-lg p-6 space-y-2">
                <p><strong>ООО «ЛАБОСФЕРА»</strong></p>
                <p><strong>Адрес:</strong> 630091, Новосибирская обл., г. Новосибирск, ул. Сибирская, д. 41, офис 26</p>
                <p><strong>Email:</strong> <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a></p>
                <p><strong>Режим работы:</strong> Пн-Пт: 9:00 - 18:00 (МСК+4)</p>
              </div>
            </section>

            <div className="text-sm text-light-grey/60 text-center pt-4">
              Настоящая Политика разработана в соответствии с ФЗ-152 и вступает в силу с момента публикации на сайте.
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
