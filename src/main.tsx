import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import LakeApp from './react/lake/App';
import RuiApp from './react/rui/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <LakeApp /> */}
    <RuiApp />
  </StrictMode>,
);
