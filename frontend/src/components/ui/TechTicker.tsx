'use client';

export const TechTicker = ({ items }: { items: string[] }) => {
  return (
    <div className="relative w-full overflow-hidden bg-deep-blue py-4">
      <div className="animate-marquee whitespace-nowrap text-light-grey/50">
        {items.map((item, index) => (
          <span key={index} className="mx-4 text-lg font-semibold">{item}</span>
        ))}
        {/* Дублируем для бесшовной анимации */}
        {items.map((item, index) => (
          <span key={`duplicate-${index}`} className="mx-4 text-lg font-semibold">{item}</span>
        ))}
      </div>
    </div>
  );
};