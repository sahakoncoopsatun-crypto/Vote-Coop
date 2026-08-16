'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/admin/logoutAction';

export default function AdminHeader() {
  const pathname = usePathname();
  
  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#333', color: 'white', padding: '1rem', borderRadius: '8px' }}>
      <h2>ระบบหลังบ้าน (Admin Panel)</h2>
      <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/candidates">ข้อมูลผู้ลงสมัคร</Link>
        <Link href="/admin/candidate-apps">ใบสมัครรับเลือกตั้ง</Link>
        <Link href="/admin/officers">ใบสมัครเจ้าหน้าที่</Link>
        <Link href="/admin/news">จัดการข่าวสาร</Link>
        <Link href="/admin/agendas">จัดการวาระประชุม</Link>
        <Link href="/admin/settings">⚙️ ตั้งค่า</Link>
        <Link href="/">กลับหน้าหลัก</Link>
        <form action={logoutAction}>
          <button type="submit" style={{ 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ออกจากระบบ
          </button>
        </form>
      </nav>
    </header>
  );
}
