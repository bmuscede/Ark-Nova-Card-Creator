import React, { ReactNode } from 'react';

interface CardListProps {
  children: ReactNode;
}

const CardList: React.FC<CardListProps> = ({ children }) => (
  <div className='-pt-1 grid w-full max-w-7xl grid-cols-2 justify-items-center gap-3 px-2 sm:gap-4 sm:px-4 lg:grid-cols-3 lg:px-0 xl:grid-cols-4 2xl:grid-cols-5'>
    {children}
  </div>
);

export default CardList;
