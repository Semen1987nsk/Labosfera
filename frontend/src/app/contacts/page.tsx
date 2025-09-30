import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ContactForm } from '@/components/ui/ContactForm';
import { ContactInfo } from '@/components/ui/ContactInfo';
import { ContactMap } from '@/components/ui/ContactMap';

export default function ContactsPage() {
  return (
    <main>
      {/* === Hero секция === */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-dark-blue to-deep-blue">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-light-grey/80 leading-relaxed">
              Готовы ответить на ваши вопросы и помочь с выбором учебного оборудования. 
              Свяжитесь с нами удобным для вас способом.
            </p>
          </div>
        </Container>
      </AnimatedSection>

      {/* === Основная секция контактов === */}
      <AnimatedSection className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Левая колонка - Контактная информация */}
            <div className="space-y-8">
              <ContactInfo />
              
              {/* Карта */}
              <div className="bg-deep-blue rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-semibold mb-6">Как нас найти</h3>
                <ContactMap />
              </div>
            </div>

            {/* Правая колонка - Форма обратной связи */}
            <div className="bg-deep-blue rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold mb-6">Напишите нам</h3>
              <ContactForm />
            </div>
          </div>
        </Container>
      </AnimatedSection>

      {/* === Дополнительная информация === */}
      <AnimatedSection className="py-16 bg-dark-blue/30">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Быстрый ответ</h4>
              <p className="text-light-grey/70">
                Отвечаем на все обращения в течение 24 часов в рабочие дни
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Доставка по России</h4>
              <p className="text-light-grey/70">
                Осуществляем доставку оборудования во все регионы РФ
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Гарантия качества</h4>
              <p className="text-light-grey/70">
                Предоставляем полную гарантию на всё производимое оборудование
              </p>
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </main>
  );
}