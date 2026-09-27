'use client';

import { AppProvider } from '@/lib/store';
import { MainApp } from '@/components/MainApp';

export default function HomePage() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
