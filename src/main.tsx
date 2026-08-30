import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '../app/globals.css';
import { PracticeStudio } from '@/components/practice-studio';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PracticeStudio />
  </StrictMode>,
);
