import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '2rem' }}>
      <AdminHeader />
      <main>
        {children}
      </main>
    </div>
  );
}
