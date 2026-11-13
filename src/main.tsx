import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ExerciseTracker from './pages/ExerciseTracker.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.MODE === 'ios' ? <ExerciseTracker nativeApp /> : <App />}
  </StrictMode>,
);
