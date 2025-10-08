'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Container } from './Container';

const AcademicCapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443a55.381 55.381 0 0 1 5.25 2.882V15" />
  </svg>
);

const BeakerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5a2.25 2.25 0 0 0-.659 1.591V19.5a2.25 2.25 0 0 0 2.25 2.25h10.818a2.25 2.25 0 0 0 2.25-2.25v-3.409a2.25 2.25 0 0 0-.659-1.591L15 10.409a2.25 2.25 0 0 1-.659-1.591V3.104a48.554 48.554 0 0 0-4.682 0Z" />
  </svg>
);

const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const expertiseAreas = [
  {
    icon: AcademicCapIcon,
    title: "Образовательная экспертиза",
    description: "15+ лет опыта в образовательной сфере",
    details: [
      "Глубокое понимание требований ФИПИ",
      "Знание методик преподавания физики и химии",
      "Опыт работы с образовательными учреждениями",
      "Понимание потребностей учителей и учеников"
    ],
    color: "from-blue-500 to-purple-600",
    progress: 95
  },
  {
    icon: BeakerIcon,
    title: "Научно-техническая база",
    description: "Команда инженеров и методистов",
    details: [
      "Инженеры с опытом разработки приборов",
      "Методисты-предметники",
      "Специалисты по метрологии",
      "Эксперты по стандартизации"
    ],
    color: "from-green-500 to-blue-500",
    progress: 90
  },
  {
    icon: CogIcon,
    title: "Производственные технологии",
    description: "Современное оборудование и процессы",
    details: [
      "Станки с ЧПУ высокой точности",
      "3D-моделирование и прототипирование",
      "Контроль качества на каждом этапе",
      "Автоматизированные процессы"
    ],
    color: "from-orange-500 to-red-500",
    progress: 88
  },
  {
    icon: UsersIcon,
    title: "Клиентоориентированность",
    description: "Индивидуальный подход к каждому заказу",
    details: [
      "Персональные консультации",
      "Адаптация под конкретные потребности",
      "Быстрое реагирование на запросы",
      "Поддержка на всех этапах"
    ],
    color: "from-purple-500 to-pink-500",
    progress: 92
  }
];

export const ExpertiseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-slate-900 via-dark-blue to-slate-900 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-electric-blue/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-electric-blue to-purple-500 rounded-full flex items-center justify-center"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <CogIcon className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-electric-blue to-green-400 bg-clip-text text-transparent">
              Наша экспертиза
            </h2>
          </motion.div>
          <motion.p 
            className="text-xl text-light-grey/70 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Мы объединили знания педагогов, опыт инженеров и достижения современных технологий
          </motion.p>
        </motion.div>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <motion.div
                className="bg-deep-blue/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(58, 134, 255, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Background gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon with animation */}
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ x: -20 }}
                  animate={isInView ? { x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${area.color} rounded-2xl flex items-center justify-center relative`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <area.icon className="w-8 h-8 text-white" />
                    
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-white/30"
                      animate={activeCard === index ? {
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-electric-blue transition-colors duration-300">
                      {area.title}
                    </h3>
                    <p className="text-light-grey/70 text-sm">
                      {area.description}
                    </p>
                  </div>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-light-grey/80 text-sm">Уровень экспертизы</span>
                    <span className="text-electric-blue font-bold">{area.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${area.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${area.progress}%` } : {}}
                      transition={{ duration: 1.5, delay: 1.2 + index * 0.2 }}
                    />
                  </div>
                </motion.div>

                {/* Details list */}
                <motion.ul
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                >
                  {area.details.map((detail, detailIndex) => (
                    <motion.li
                      key={detailIndex}
                      className="flex items-center gap-3 text-light-grey/80"
                      initial={{ x: -20, opacity: 0 }}
                      animate={isInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: 1.6 + index * 0.2 + detailIndex * 0.1 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-electric-blue rounded-full flex-shrink-0"
                        animate={{
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: detailIndex * 0.2
                        }}
                      />
                      <span className="text-sm">{detail}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
      </Container>
    </section>
  );
};