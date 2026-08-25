import { prisma } from '@/lib/prisma';
import { deleteAgenda } from './actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminAgendas() {
  const agendas = await prisma.agenda.findMany({
    orderBy: { number: 'asc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>จัดการวาระการประชุมใหญ่สามัญ</h2>
        <Link href="/admin/agendas/create" style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          + เพิ่มวาระการประชุม
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd', width: '5%' }}>วาระที่</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd', width: '35%' }}>หัวข้อ</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd', width: '25%' }}>ไฟล์แนบ / ภาพ</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd', width: '15%' }}>ผลการพิจารณา</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd', width: '20%' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {agendas.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '1rem', textAlign: 'center' }}>{item.number}</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                {item.title}
                {item.description && <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'normal', fontSize: '0.9rem', color: '#666' }}>{item.description}</p>}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                {item.imageUrl && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <a href={item.imageUrl} download="�͡���" style={{ color: '#007bff' }}>🖼️ ดูรูปภาพ</a>
                  </div>
                )}
                {item.fileUrl && (
                  <div>
                    <a href={item.fileUrl} download="�͡���" style={{ color: '#28a745' }}>📄 ไฟล์เอกสาร</a>
                  </div>
                )}
                {!item.imageUrl && !item.fileUrl && <span style={{ color: '#aaa' }}>- ไม่มี -</span>}
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px', 
                  backgroundColor: item.result === 'รับทราบ' || item.result === 'รอการลงมติ' ? '#cce5ff' : item.result === 'อนุมัติ' || item.result === 'เห็นชอบ' ? '#d4edda' : '#f8f9fa',
                  color: item.result === 'รับทราบ' || item.result === 'รอการลงมติ' ? '#004085' : item.result === 'อนุมัติ' || item.result === 'เห็นชอบ' ? '#155724' : '#333'
                }}>
                  {item.result}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/admin/agendas/${item.id}`} style={{ padding: '0.5rem 1rem', background: '#ffc107', color: '#333', textDecoration: 'none', borderRadius: '4px' }}>
                    แก้ไข
                  </Link>
                  <form action={async () => {
                    'use server';
                    await deleteAgenda(item.id);
                  }}>
                    <button type="submit" style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      ลบ
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {agendas.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>ไม่มีข้อมูลวาระการประชุม</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
