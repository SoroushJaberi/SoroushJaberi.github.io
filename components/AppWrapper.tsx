'use client';

import { useEffect } from 'react';
import CosmicField from './CosmicField';
import CustomCursor from './CustomCursor';
import Header from './Header';
import ScrollProgress from './ScrollProgress';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CosmicField />
      <ScrollProgress />
      <CustomCursor />
      <Header />
      {children}
    </>
  );
}
