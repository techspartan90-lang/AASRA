'use client';

import React from 'react';
import { ManasSurakshaLandingPage } from '@/components/ManasSurakshaLandingPage';

export function PublicLandingPage({
  onSelectAction,
}: {
  onSelectAction: (view: string, roleTarget?: string) => void;
}) {
  return <ManasSurakshaLandingPage onSelectAction={onSelectAction} />;
}
