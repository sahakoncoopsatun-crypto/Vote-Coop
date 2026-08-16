import { prisma } from '@/lib/prisma';
import { deleteNews } from '../actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminNews() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>จัดการข่าวสารและประกาศ</h2>
        <Link href="/admin/news/create" style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          + เพิ่มข่าวสารใหม่
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>รูป/ไฟล์</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>วันที่ประกาศ</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>หัวข้อข่าวสาร</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {news.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="News Image" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                  {item.fileUrl && (
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.25rem 0.5rem', background: '#e9ecef', borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none', color: '#333' }}>📎 ไฟล์</a>
                  )}
                </div>
              </td>
              <td style={{ padding: '1rem' }}>{item.createdAt.toLocaleDateString('th-TH')}</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.title}</td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/news/${item.id}`} style={{ padding: '0.5rem 1rem', background: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                  แก้ไข
                </Link>
                <form action={async () => {
                  'use server';
                  await deleteNews(item.id);
                }}>
                  <button type="submit" style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    ลบ
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {news.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                ยังไม่มีข่าวสาร
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
