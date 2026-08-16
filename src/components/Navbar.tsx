'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // ไม่แสดง Navbar ในหน้าแอดมิน
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const links = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/check-eligibility', label: 'ตรวจสอบสิทธิ' },
    { href: '/candidates', label: 'ทำเนียบผู้สมัคร' },
    { href: '/results', label: 'ผลการเลือกตั้ง' },
    { href: '/apply-candidate', label: 'สมัครรับเลือกตั้ง' },
    { href: '/apply-officer', label: 'สมัครเจ้าหน้าที่' },
    { href: '/admin', label: 'ระบบหลังบ้าน (Admin)' },
  ];

  return (
    <nav style={{ 
      background: 'var(--primary-color)', 
      color: 'white',
      padding: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🗳️ Vote-Coop</span>
        </Link>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'background 0.2s'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
