import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Product } from './types';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// ข้อมูลสินค้าที่ฝังมากับ HTML ตอน prerender (scripts/prerender.mjs)
const initialProducts: Product[] = (window as any).__INITIAL_PRODUCTS__ || [];

const app = (
  <React.StrictMode>
    <App path={window.location.pathname} initialProducts={initialProducts} />
  </React.StrictMode>
);

if (rootElement.firstElementChild) {
  // หน้านี้ถูก prerender ไว้แล้ว -> ต่อ React เข้ากับ HTML เดิม (ไม่วาดใหม่ทั้งหน้า)
  ReactDOM.hydrateRoot(rootElement, app, {
    onRecoverableError: (error) => console.warn('[hydrate]', error),
  });
} else {
  // โหมด dev (npm run dev) หรือหน้า /admin/ ที่ไม่ได้ prerender
  ReactDOM.createRoot(rootElement).render(app);
}
