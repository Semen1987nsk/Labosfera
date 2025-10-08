'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Container } from './Container';

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const values = [
  {
    title: "Оборудование мирового класса",
    subtitle: "Без компромиссов",
    description: "Наше лабораторное оборудование соответствует самым высоким международным стандартам качества",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    title: "Учеба с удовольствием",
    subtitle: "Вдохновляем на открытия",
    description: "Превращаем каждый урок в захватывающее путешествие в мир науки",
    gradient: "from-green-400 to-blue-500"
  },
  {
    title: "Новые стандарты",
    subtitle: "Революция в образовании",
    description: "Устанавливаем планку качества, которой будут следовать другие",
    gradient: "from-purple-400 to-pink-500"
  }
];

export const ValuesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-dark-blue to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute w-[800px] h-[800px] -top-1/2 -right-1/2 bg-gradient-radial from-electric-blue/10 to-transparent rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ scale: 0.8 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Наша миссия —
            </span>
            <br />
            <span className="bg-gradient-to-r from-electric-blue via-purple-500 to-pink-500 bg-clip-text text-transparent">
              вдохновлять на открытия
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-light-grey/80 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Мы верим, что качественное оборудование может навсегда изменить отношение к учебе
          </motion.p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
            >
              <motion.div
                className="bg-deep-blue/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 30px 60px rgba(58, 134, 255, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Background gradient overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />

                {/* Star icon */}
                <motion.div
                  className="mb-6"
                  initial={{ rotate: -180, scale: 0 }}
                  animate={isInView ? { rotate: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center relative`}>
                    <StarIcon className="w-8 h-8 text-white" />
                    
                    {/* Animated sparkles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          top: `${20 + i * 10}%`,
                          right: `${10 + i * 15}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.5 + index * 0.3
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.h3 
                  className={`text-2xl font-bold mb-2 bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                >
                  {value.title}
                </motion.h3>
                
                <motion.p 
                  className="text-light-grey/60 text-sm mb-4 font-medium"
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.2 }}
                >
                  {value.subtitle}
                </motion.p>
                
                <motion.p 
                  className="text-light-grey/80 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                >
                  {value.description}
                </motion.p>

                {/* Decorative element */}
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-electric-blue/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-electric-blue/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 max-w-4xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Присоединяйтесь к революции в образовании
            </h3>
            <p className="text-light-grey/80 text-lg mb-6">
              Станьте частью движения за качественное образование. 
              Вместе мы создаем будущее, где каждый урок — это открытие.
            </p>
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <span className="text-2xl">🎯</span>
              <span className="text-electric-blue font-bold">Качество • Инновации • Результат</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};