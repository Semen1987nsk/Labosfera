import React from 'react';
import clsx from 'clsx';
interface ContainerProps { children: React.ReactNode; className?: string; }
export const Container = ({ children, className }: ContainerProps) => (
  <div className={clsx('container mx-auto px-4', className)}>{children}</div>
);