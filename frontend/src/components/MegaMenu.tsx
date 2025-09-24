'use client';

import { Popover, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment } from 'react';

// Временные данные. Позже будем получать их с API.
const categories = [
  { name: 'Физика', slug: 'fizika', description: 'Оборудование для кабинета физики' },
  { name: 'Химия', slug: 'himiya', description: 'Все для лабораторных по химии' },
  { name: 'Биология', slug: 'biologiya', description: 'Микроскопы и наглядные пособия' },
  { name: 'IT и Робототехника', slug: 'it-robotics', description: 'Современные IT-полигоны' },
];

export const MegaMenu = () => {
  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-base font-semibold leading-6 text-light-grey/80 hover:text-white outline-none focus:outline-none ring-0">
        <span>Каталог</span>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-dark-blue text-sm leading-6 shadow-lg ring-1 ring-white/5">
            <div className="p-4">
              {categories.map((item) => (
                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-deep-blue">
                  <div>
                    <Link href={`/catalog/${item.slug}`} className="font-semibold text-light-grey">
                      {item.name}
                      <span className="absolute inset-0" />
                    </Link>
                    <p className="mt-1 text-light-grey/60">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x divide-white/10 bg-deep-blue">
              <Link href="/catalog" className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-light-grey hover:bg-dark-blue">
                Весь каталог
              </Link>
              <Link href="/contacts" className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-light-grey hover:bg-dark-blue">
                Связаться с нами
              </Link>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};