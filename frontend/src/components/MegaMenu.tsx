'use client';

import { Popover, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Физика', slug: 'fizika', description: 'Оборудование для ОГЭ по физике', icon: '⚛️' },
  { name: 'Химия', slug: 'himiya', description: 'Оборудование для ОГЭ по химии', icon: '🧪' },
  { name: 'Программное обеспечение', slug: 'software', description: 'Интерактивные ОГЭ-лаборатории по физике и химии', icon: '💻' },
];

export const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Popover className="relative">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Popover.Button 
            as={Link} 
            href="/catalog" 
            className="group inline-flex items-center gap-x-2 text-base font-semibold leading-6 text-light-grey/80 hover:text-white outline-none focus:outline-none ring-0 transition-all duration-300"
          >
            <span className="relative">
              Каталог
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-electric-blue to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </span>
            <motion.svg
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </Popover.Button>
        </motion.div>

        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95 translate-y-2"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100 translate-y-0"
          leaveTo="opacity-0 scale-95 translate-y-2"
        >
          <Popover.Panel 
            static 
            className="absolute left-1/2 z-20 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-screen max-w-lg flex-auto overflow-hidden rounded-2xl bg-dark-blue/95 backdrop-blur-lg text-sm leading-6 shadow-2xl ring-1 ring-white/10 border border-white/20"
            >
              {/* Градиентная полоса сверху */}
              <div className="h-1 bg-gradient-to-r from-electric-blue via-purple-500 to-pink-500"></div>
              
              <div className="p-6">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg font-bold text-white mb-4 bg-gradient-to-r from-electric-blue to-purple-400 bg-clip-text text-transparent"
                >
                  Категории товаров
                </motion.h3>
                
                <div className="space-y-2">
                  {categories.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      onMouseEnter={() => setHoveredCategory(item.slug)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="group relative"
                    >
                      <Link 
                        href={`/catalog/${item.slug}`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-x-4 rounded-xl p-4 hover:bg-gradient-to-r hover:from-deep-blue/50 hover:to-electric-blue/10 transition-all duration-300 group"
                      >
                        <motion.div
                          animate={{ 
                            scale: hoveredCategory === item.slug ? 1.2 : 1,
                            rotate: hoveredCategory === item.slug ? 10 : 0
                          }}
                          transition={{ duration: 0.2 }}
                          className="text-2xl"
                        >
                          {item.icon}
                        </motion.div>
                        
                        <div className="flex-1">
                          <div className="font-semibold text-light-grey group-hover:text-white transition-colors duration-300">
                            {item.name}
                          </div>
                          <p className="mt-1 text-light-grey/60 group-hover:text-light-grey/80 transition-colors duration-300 text-sm">
                            {item.description}
                          </p>
                        </div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: hoveredCategory === item.slug ? 1 : 0,
                            x: hoveredCategory === item.slug ? 0 : -10
                          }}
                          transition={{ duration: 0.2 }}
                          className="text-electric-blue"
                        >
                          →
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 divide-x divide-white/10 bg-deep-blue/50 backdrop-blur-sm"
              >
                <Link 
                  href="/catalog" 
                  onClick={() => setIsOpen(false)} 
                  className="group flex items-center justify-center gap-x-2 p-4 font-semibold text-light-grey hover:text-white hover:bg-electric-blue/20 transition-all duration-300"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">📚</span>
                  Весь каталог
                </Link>
                <a 
                  href="#contacts" 
                  onClick={() => setIsOpen(false)} 
                  className="group flex items-center justify-center gap-x-2 p-4 font-semibold text-light-grey hover:text-white hover:bg-electric-blue/20 transition-all duration-300"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">📞</span>
                  Связаться с нами
                </a>
              </motion.div>
            </motion.div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};