'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Container } from './Container';

const StoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m4.5 0a12.078 12.078 0 0 1-.9-1.978m-3.6 1.978a12.078 12.078 0 0 0 .9-1.978m0 0a12.06 12.06 0 0 1 4.5 0m-4.5 0a12.078 12.078 0 0 1-.9-1.978m3.6 1.978a12.078 12.078 0 0 0-.9-1.978" />
  </svg>
);

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m4.5 0a12.078 12.078 0 0 1-.9-1.978m-3.6 1.978a12.078 12.078 0 0 0 .9-1.978m0 0a12.06 12.06 0 0 1 4.5 0m-4.5 0a12.078 12.078 0 0 1-.9-1.978m3.6 1.978a12.078 12.078 0 0 0-.9-1.978" />
  </svg>
);

const storySteps = [
  {
    icon: StoryIcon,
    title: "Увидели несовершенство",
    description: "Существующие решения на рынке не соответствовали нашим высоким стандартам качества. Учителя и ученики заслуживают лучшего — оборудования мирового уровня",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: HeartIcon,
    title: "Поставили амбициозную цель",
    description: "Создать продукты мирового уровня. Чтобы каждый урок физики и химии превращался в увлекательное открытие, а учеба приносила радость и удовольствие",
    color: "from-orange-500 to-yellow-500"
  },
  {
    icon: LightBulbIcon,
    title: "Воплотили мечту в реальность",
    description: "Родилась «ЛАБОСФЕРА» — бренд, который устанавливает новые стандарты в образовательном оборудовании. Мы не просто производим приборы, мы создаем будущее образования",
    color: "from-electric-blue to-purple-500"
  }
];

export const WhyWeCreatedSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-dark-blue via-deep-blue to-dark-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute w-96 h-96 -top-48 -left-48 bg-electric-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-64 h-64 -bottom-32 -right-32 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
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
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-purple-500 rounded-full flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-electric-blue to-purple-400 bg-clip-text text-transparent">
              Почему мы создали ЛАБОСФЕРУ
            </h2>
          </motion.div>
          <motion.p 
            className="text-xl text-light-grey/70 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            История о том, как стремление к совершенству привело к созданию бренда мирового уровня
          </motion.p>
        </motion.div>

        {/* Story Timeline */}
        <div className="relative">
          {/* Connection line */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric-blue via-purple-500 to-pink-500"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2, delay: 0.6 }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="space-y-16">
            {storySteps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.3 }}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <motion.div
                    className="bg-deep-blue/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(58, 134, 255, 0.15)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`absolute top-1/2 ${index % 2 === 0 ? '-right-3' : '-left-3'} w-6 h-6 bg-gradient-to-r ${step.color} rounded-full transform -translate-y-1/2`} />
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-light-grey/80 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Icon */}
                <motion.div
                  className="relative z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1 + index * 0.3 }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-2xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Pulsing ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full border-2 border-electric-blue/50`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 2 + index * 0.5
                    }}
                  />
                </motion.div>

                {/* Spacer for centering */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-electric-blue/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4">
            <span className="text-2xl">🌟</span>
            <span className="text-lg text-light-grey/90">
              Сегодня «ЛАБОСФЕРА» — это синоним качества и инноваций в образовательном оборудовании
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};