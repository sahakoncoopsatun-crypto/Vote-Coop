'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ menuConfig = {} }: { menuConfig?: Record<string, boolean> }) {
  const pathname = usePathname();

  // ไม่แสดง Navbar ในหน้าแอดมิน
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const links = [
    { href: '/', label: 'หน้าแรก', key: 'home' },
    { href: '/check-eligibility', label: 'ตรวจสอบสิทธิ', key: 'check-eligibility' },
    { href: '/candidates', label: 'ทำเนียบผู้สมัคร', key: 'candidates' },
    { href: '/results', label: 'ผลการเลือกตั้ง', key: 'results' },
    { href: '/apply-candidate', label: 'สมัครรับเลือกตั้ง', key: 'apply-candidate' },
    { href: '/apply-officer', label: 'รับสมัครเจ้าหน้าที่ กกต.', key: 'apply-officer' },
    { href: '/admin', label: 'ระบบหลังบ้าน (Admin)', key: 'admin' },
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
            
            // Check if this menu is disabled in settings (default true if not set)
            // 'menu_admin' or 'menu_home' might not exist, so default is true
            const settingKey = `menu_${link.key}`;
            const isEnabled = menuConfig[settingKey] !== false; // if it's undefined, we treat it as enabled
            
            const targetHref = isEnabled ? link.href : '/maintenance';

            return (
              <Link 
                key={link.href} 
                href={targetHref}
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
