import React from 'react';

const AdminPageHeader = ({ subtitle, titlePart1, titlePart2 }) => {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-0.5 w-8 bg-[var(--color-primary2)]"></div>
        <h3 className="text-[var(--color-primary2)] font-bold tracking-[0.1em] uppercase text-xs">
          {subtitle}
        </h3>
      </div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-none tracking-tight text-black mb-6">
        {titlePart1} <span className="text-[var(--color-primary)]">{titlePart2}</span>
      </h2>
    </div>
  );
};

export default AdminPageHeader;
