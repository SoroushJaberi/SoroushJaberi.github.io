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
      <a
        href="#intro"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:border focus:border-primary focus:bg-background focus:px-4 focus:py-2 focus:font-syne focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-primary"
      >
        Skip to content
      </a>
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
