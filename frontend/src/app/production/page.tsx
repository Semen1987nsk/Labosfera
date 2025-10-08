import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import Link from 'next/link';
import { Button } from '@/components/Button';

// Иконки для блоков
const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingOfficeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l.75 18H3.75L4.5 3z" />
  </svg>
);

export default function ProductionPage() {
  return (
    <main>
      {/* Hero секция */}
      <div className="relative text-center py-32 md:py-48 flex items-center justify-center overflow-hidden">
        <AnimatedBackground />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-electric-blue/20 rounded-full blur-3xl animate-pulse" />
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold">
            О нашем <span className="text-electric-blue">производстве</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-light-grey/80">
            Современное высокотехнологичное производство учебного оборудования с полным циклом — от идеи до готового продукта.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog"><Button>Смотреть продукцию</Button></Link>
            <Link href="/"><Button variant="secondary">На главную</Button></Link>
          </div>
        </Container>
      </div>

      {/* Основной контент - заглушка */}
      <AnimatedSection className="py-20 bg-dark-blue">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-light-grey/80 bg-clip-text text-transparent mb-8">
              Раздел обновляется
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Заглушка 1 */}
                <div className="bg-gradient-to-br from-deep-blue to-dark-blue p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <CogIcon className="w-12 h-12 text-electric-blue mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-4">Современное оборудование</h3>
                  <p className="text-light-grey/70">
                    Подробная информация о нашем производственном оборудовании, станках с ЧПУ и технологиях 3D-печати будет добавлена в ближайшее время.
                  </p>
                </div>

                {/* Заглушка 2 */}
                <div className="bg-gradient-to-br from-deep-blue to-dark-blue p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <BuildingOfficeIcon className="w-12 h-12 text-electric-blue mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-4">Производственные мощности</h3>
                  <p className="text-light-grey/70">
                    Информация о площадях, цехах, производственных линиях и мощностях нашего завода будет представлена здесь.
                  </p>
                </div>
              </div>

              {/* Уведомление о разработке */}
              <div className="bg-electric-blue/10 border border-electric-blue/30 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚧</span>
                  </div>
                  <h3 className="text-xl font-semibold text-electric-blue mb-2">Контент готовится</h3>
                  <p className="text-light-grey/70 max-w-2xl mx-auto">
                    Мы дополняем информацию о производстве новыми фотографиями, видео и подробным описанием технологических процессов. Следите за обновлениями!
                  </p>
                  <div className="mt-6">
                    <Link href="/catalog">
                      <Button>
                        Посмотреть готовую продукцию
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </AnimatedSection>

      {/* Призыв к действию */}
      <AnimatedSection className="py-16">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Есть вопросы о производстве?</h2>
            <p className="text-light-grey/70 mb-8 max-w-2xl mx-auto">
              Свяжитесь с нами для получения дополнительной информации о наших производственных возможностях и технологиях.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/custom-task"><Button>Заказать по ТЗ</Button></Link>
              <Link href="/certificates"><Button variant="secondary">Сертификаты</Button></Link>
            </div>
          </div>
        </Container>
      </AnimatedSection>
    </main>
  );
}