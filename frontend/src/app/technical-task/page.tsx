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
              Если Вас заинтересовало наше оборудование и Вы планируете приобрести его через объявление торгов, 
              то мы можем оказать содействие в составлении технического задания, определить начальную максимальную 
              цену контракта (НМЦК).
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
                Для составления технического задания необходимо указать:
              </h2>
              <ul className="space-y-3 text-light-grey/80">
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  перечень необходимого оборудования
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  контактное лицо
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  телефон
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  e-mail (электронная почта)
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-3">•</span>
                  подгрузить файл (при необходимости)
                </li>
              </ul>
              <div className="mt-6 p-4 bg-electric-blue/10 rounded-lg border border-electric-blue/20">
                <p className="text-electric-blue font-medium">
                  ⏱ Стандартный срок ответа на запрос – 1-2 рабочих дня
                </p>
              </div>
            </div>

            {/* === Форма === */}
            <div className="bg-deep-blue rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Заполните форму для получения технического задания
              </h2>
              <TechnicalTaskForm />
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </main>
  );
}