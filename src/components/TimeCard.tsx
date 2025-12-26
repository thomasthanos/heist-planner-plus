import { ReactNode } from 'react';

interface TimeCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

export const TimeCard = ({ icon, title, children, className = '' }: TimeCardProps) => {
  return (
    <div className={`glass rounded-xl overflow-hidden animate-fade-in ${className}`}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
        <span className="text-xl">{icon}</span>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};
