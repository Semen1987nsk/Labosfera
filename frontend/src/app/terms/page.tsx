import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Пользовательское соглашение',
  description: 'Условия использования интернет-магазина ЛАБОСФЕРА',
};

export default function TermsPage() {
  return (
    <main className="py-16 bg-deep-blue min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-light-grey mb-4">
              Пользовательское соглашение
            </h1>
            <p className="text-light-grey/70">
              Правила использования сайта www.labosfera.ru
            </p>
            <p className="text-sm text-light-grey/60 mt-2">
              Дата публикации: 10 октября 2025 г.
            </p>
          </div>

          <div className="bg-dark-blue/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-8 text-light-grey/90">
            {/* Преамбула */}
            <section>
              <p>
                Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между ООО «ЛАБОСФЕРА» (далее — «Администрация сайта») и пользователями интернет-магазина <Link href="https://www.labosfera.ru" className="text-electric-blue hover:underline">www.labosfera.ru</Link>.
              </p>
              <p className="mt-3">
                Используя Сайт, вы соглашаетесь с условиями настоящего Соглашения. Если вы не согласны с какими-либо положениями, пожалуйста, прекратите использование Сайта.
              </p>
            </section>

            {/* 1. Общие условия */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                1. Общие условия использования
              </h2>
              <p>
                Администрация сайта оставляет за собой право в любое время изменять условия настоящего Соглашения без предварительного уведомления. Изменения вступают в силу с момента их публикации на Сайте.
              </p>
              <p className="mt-3">
                Действующая версия размещена по адресу: <Link href="https://www.labosfera.ru/terms" className="text-electric-blue hover:underline">www.labosfera.ru/terms</Link>
              </p>
            </section>

            {/* 2. Права и обязанности Пользователя */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                2. Права и обязанности Пользователя
              </h2>
              <p><strong>Пользователь имеет право:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Использовать все доступные функции и сервисы Сайта</li>
                <li>Получать информацию о товарах и услугах</li>
                <li>Оформлять заказы на условиях, указанных на Сайте</li>
                <li>Требовать защиты своих персональных данных</li>
              </ul>
              <p className="mt-4"><strong>Пользователь обязуется:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Соблюдать условия настоящего Соглашения</li>
                <li>Предоставлять достоверную информацию</li>
                <li>Не использовать Сайт в противоправных целях</li>
                <li>Не нарушать работу Сайта</li>
                <li>Уважать права интеллектуальной собственности</li>
              </ul>
            </section>

            {/* 3. Интеллектуальная собственность */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                3. Интеллектуальная собственность
              </h2>
              <p>
                Все материалы Сайта (тексты, изображения, видео, графика, логотипы) являются объектами интеллектуальной собственности и охраняются законодательством РФ.
              </p>
              <p className="mt-3">
                Использование материалов Сайта допускается только с письменного разрешения Администрации.
              </p>
            </section>

            {/* 4. Персональные данные */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                4. Обработка персональных данных
              </h2>
              <p>
                Используя Сайт, Пользователь дает согласие на обработку своих персональных данных в соответствии с <Link href="/privacy-policy" className="text-electric-blue hover:underline">Политикой конфиденциальности</Link>.
              </p>
            </section>

            {/* 5. Ответственность */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                5. Ответственность сторон
              </h2>
              <p>Администрация сайта не несет ответственности за:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Временные технические сбои в работе Сайта</li>
                <li>Неправомерные действия третьих лиц</li>
                <li>Содержание внешних сайтов, на которые ведут ссылки</li>
                <li>Недостоверность информации, предоставленной Пользователем</li>
              </ul>
            </section>

            {/* 6. Разрешение споров */}
            <section>
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                6. Порядок разрешения споров
              </h2>
              <p>
                Все споры и разногласия разрешаются путем переговоров. В случае невозможности достижения согласия споры разрешаются в судебном порядке в соответствии с законодательством РФ.
              </p>
              <p className="mt-3">
                Претензии направляются на email: <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a>
              </p>
            </section>

            {/* Контакты */}
            <section className="border-t border-white/10 pt-6">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">
                Контактная информация
              </h2>
              <div className="bg-deep-blue/50 rounded-lg p-6 space-y-2">
                <p><strong>ООО «ЛАБОСФЕРА»</strong></p>
                <p><strong>ИНН:</strong> 5406846548</p>
                <p><strong>ОГРН:</strong> 1255400006344</p>
                <p><strong>Адрес:</strong> 630091, Новосибирская обл., г. Новосибирск, ул. Сибирская, д. 41, офис 26</p>
                <p><strong>Email:</strong> <a href="mailto:info@labosfera.ru" className="text-electric-blue hover:underline">info@labosfera.ru</a></p>
                <p><strong>Сайт:</strong> <Link href="https://www.labosfera.ru" className="text-electric-blue hover:underline">www.labosfera.ru</Link></p>
                <p><strong>Режим работы:</strong> Понедельник-Пятница: 9:00 - 18:00 (МСК+4)</p>
              </div>
            </section>

            <div className="text-sm text-light-grey/60 text-center pt-4">
              Настоящее Пользовательское соглашение вступает в силу с момента начала использования Сайта.
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
