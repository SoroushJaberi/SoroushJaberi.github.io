'use client';

import { useEffect } from 'react';
import CosmicField from './CosmicField';
import CustomCursor from './CustomCursor';
import Header from './Header';
import Intro from './Intro';
import ScrollProgress from './ScrollProgress';
import SmoothScroll from './SmoothScroll';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Intro />
      <SmoothScroll />
      <CosmicField />
      <ScrollProgress />
      <CustomCursor />
      <Header />
      {children}
    </>
  );
}
