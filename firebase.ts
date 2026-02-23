// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // สำหรับ Database
import { getStorage } from "firebase/storage";     // สำหรับอัปโหลดรูป
import { getAuth } from "firebase/auth";           // สำหรับระบบ Login
import { getAnalytics } from "firebase/analytics";

// ค่า Config จากที่คุณส่งมา
const firebaseConfig = {
  apiKey: "AIzaSyAV26GQ3wFsMzkfHTxuQIuDRm_liWmr0nE",
  authDomain: "donut-brand-foods.firebaseapp.com",
  projectId: "donut-brand-foods",
  storageBucket: "donut-brand-foods.firebasestorage.app",
  messagingSenderId: "442965941188",
  appId: "1:442965941188:web:35eec68c4e0e581a486291",
  measurementId: "G-JW97HQ6344"
};

// 1. เริ่มต้นแอป
const app = initializeApp(firebaseConfig);

// 2. Export service ออกไปให้ไฟล์อื่นใช้
export const db = getFirestore(app);   // เอาไว้เก็บข้อมูลสินค้า (Text)
export const storage = getStorage(app); // เอาไว้เก็บรูปภาพ (File)
export const auth = getAuth(app);       // เอาไว้เช็คสิทธิ์ Admin