import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบเลือกตั้ง สหกรณ์ออมทรัพย์สาธารณสุขสตูล 2569",
  description: "ประกาศผลการเลือกตั้ง ตรวจสอบสิทธิ และติดตามข่าวสาร สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <Navbar />
        <main>{children}</main>
        <footer className="footer" style={{ padding: '2rem 1.5rem', background: 'var(--primary-color)', color: '#f8fafc', borderTop: '4px solid var(--secondary-color)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ fontWeight: 'bold', letterSpacing: '1px' }}>&copy; 2569 สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด.</p>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>ผู้พัฒนาระบบ: ดำรงค์ ห. (เจ้าหน้าที่ธุรการ)</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
