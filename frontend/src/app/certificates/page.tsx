import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { CertificateGallery } from '@/components/ui/CertificateGallery';

// Данные сертификатов (извлечены из реальных PDF документов)
const certificates = [
  {
    id: 1,
    title: 'Сертификат соответствия на комплекты (наборы) для ОГЭ/ГИА по физике',
    description: 'Комплекты (наборы) для ОГЭ/ГИА по физике, торговой марки ЛАБОСФЕРА. Серийный выпуск. Соответствует требованиям ТУ 32.99.53-001-53461735-2025',
    image: '/images/certificates/Оборудование ОГЭ Физика.pdf',
    issueDate: '2025-04-09',
    validUntil: '2028-04-08',
    issuer: 'Система добровольной сертификации «ПРОМТЕХСТАНДАРТ»',
    category: 'physics'
  },
  {
    id: 2,
    title: 'Сертификат соответствия на комплекты оборудования для ОГЭ/ГИА по химии',
    description: 'Комплекты (наборы) оборудования для ОГЭ/ГИА по химии, торговой марки ЛАБОСФЕРА. Набор оборудования для ГИА(ОГЭ) по химии. Соответствует требованиям ТУ 32.99.53-002-53461735-2025',
    image: '/images/certificates/Оборудованпие ОГЭ Химия.pdf',
    issueDate: '2025-04-09',
    validUntil: '2028-04-08',
    issuer: 'Система добровольной сертификации «ПРОМТЕХСТАНДАРТ»',
    category: 'chemistry'
  },
  {
    id: 3,
    title: 'Сертификат соответствия на комплекты реактивов для ОГЭ/ГИА по химии',
    description: 'Комплекты (наборы) реактивов для ОГЭ/ГИА по химии, торговой марки ЛАБОСФЕРА. Серийный выпуск. Соответствует требованиям ТУ 32.99.53-003-53461735-2025',
    image: '/images/certificates/Реактивы ОГЭ Химия.pdf',
    issueDate: '2025-04-09',
    validUntil: '2028-04-08',
    issuer: 'Система добровольной сертификации «ПРОМТЕХСТАНДАРТ»',
    category: 'chemistry'
  }
];

export default function CertificatesPage() {
  return (
    <main>
      {/* === Hero секция === */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-dark-blue to-deep-blue">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Сертификаты и лицензии
            </h1>
            <p className="text-xl text-light-grey/80 leading-relaxed">
              Вся наша продукция сертифицирована и соответствует государственным стандартам качества, 
              безопасности и образовательным требованиям.
            </p>
          </div>
        </Container>
      </AnimatedSection>

      {/* === Информация о сертификации === */}
      <AnimatedSection className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">ISO 9001</h3>
              <p className="text-light-grey/70 text-sm">Система менеджмента качества</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Безопасность</h3>
              <p className="text-light-grey/70 text-sm">Сертификаты безопасности продукции</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">ФГОС</h3>
              <p className="text-light-grey/70 text-sm">Соответствие образовательным стандартам</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Экология</h3>
              <p className="text-light-grey/70 text-sm">Экологические сертификаты</p>
            </div>
          </div>
        </Container>
      </AnimatedSection>

      {/* === Галерея сертификатов === */}
      <AnimatedSection className="py-16 bg-dark-blue/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши сертификаты</h2>
            <p className="text-light-grey/70 max-w-2xl mx-auto">
              Ознакомьтесь с документами, подтверждающими качество нашей продукции и соответствие 
              всем необходимым стандартам.
            </p>
          </div>
          
          <CertificateGallery certificates={certificates} />
        </Container>
      </AnimatedSection>

      {/* === Дополнительная информация === */}
      <AnimatedSection className="py-16">
        <Container>
          <div className="bg-deep-blue rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Гарантии качества</h3>
                <ul className="space-y-3 text-light-grey/80">
                  <li className="flex items-start">
                    <span className="text-electric-blue mr-3">✓</span>
                    Все сертификаты действительны и актуальны
                  </li>
                  <li className="flex items-start">
                    <span className="text-electric-blue mr-3">✓</span>
                    Регулярное обновление и продление документов
                  </li>
                  <li className="flex items-start">
                    <span className="text-electric-blue mr-3">✓</span>
                    Соответствие международным стандартам
                  </li>
                  <li className="flex items-start">
                    <span className="text-electric-blue mr-3">✓</span>
                    Полная документация на каждое изделие
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4">Контроль качества</h3>
                <p className="text-light-grey/80 leading-relaxed mb-4">
                  Мы осуществляем строгий контроль качества на всех этапах производства. 
                  Каждое изделие проходит обязательную сертификацию и тестирование.
                </p>
                <div className="flex items-center text-electric-blue">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Запросить копии сертификатов</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </main>
  );
}