import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { TechnicalTaskForm } from '@/components/ui/TechnicalTaskForm';

export default function TechnicalTaskPage() {
  return (
    <main>
      {/* === Заголовок страницы === */}
      <AnimatedSection className="py-20 bg-gradient-to-b from-dark-blue to-deep-blue">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Техническое задание
            </h1>
            <p className="text-xl text-light-grey/80 max-w-4xl mx-auto leading-relaxed">
              Планируете закупку оборудования через систему торгов? Мы поможем подготовить техническое задание и рассчитать начальную максимальную цену контракта (НМЦК) для успешного проведения тендера.
            </p>
          </div>
        </Container>
      </AnimatedSection>

      {/* === Основная информация === */}
      <AnimatedSection className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-deep-blue/50 rounded-2xl p-8 mb-12 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 text-electric-blue">
                Что нужно указать в заявке:
              </h2>
              <ul className="space-y-3 text-light-grey/80">
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  Список требуемого оборудования
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  ФИО ответственного лица
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  Номер телефона для связи
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  Адрес электронной почты
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  Дополнительные файлы (если есть)
                </li>
              </ul>
              <div className="mt-6 p-4 bg-electric-blue/10 rounded-lg border border-electric-blue/20">
                <p className="text-electric-blue font-medium">
                  ⏱ Мы ответим на ваш запрос в течение 1-2 рабочих дней
                </p>
              </div>
            </div>

            {/* === Форма === */}
            <div className="bg-deep-blue rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Оставьте заявку на подготовку технического задания
              </h2>
              <TechnicalTaskForm />
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </main>
  );
}