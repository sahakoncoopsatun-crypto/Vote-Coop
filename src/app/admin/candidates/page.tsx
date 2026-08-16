import { prisma } from '@/lib/prisma';
import { toggleWinner, deleteCandidate } from '../actions';
import Link from 'next/link';
import ActionButton from '@/components/admin/ActionButton';

export const dynamic = 'force-dynamic';

export default async function AdminCandidates() {
  const candidates = await prisma.candidate.findMany({
    orderBy: [{ position: 'asc' }, { number: 'asc' }]
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>จัดการผู้สมัครและผลการเลือกตั้ง</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/admin/results/print" target="_blank" style={{ padding: '0.75rem 1.5rem', background: '#0f172a', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            🖨️ พิมพ์สรุปผลคะแนน
          </a>
          <Link href="/admin/candidates/create" style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
            + เพิ่มผู้สมัครใหม่
          </Link>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>รูปภาพ</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>เบอร์</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>ชื่อ-สกุล</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>ตำแหน่ง</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>คะแนน</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>สถานะ (ผู้ชนะ)</th>
            <th style={{ padding: '1rem', borderBottom: '2px solid #ddd' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '1rem' }}>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', background: '#ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                )}
              </td>
              <td style={{ padding: '1rem' }}>{c.number}</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.name}</td>
              <td style={{ padding: '1rem' }}>{c.position}</td>
              <td style={{ padding: '1rem', color: '#007bff', fontWeight: 'bold' }}>{c.votes.toLocaleString()}</td>
              <td style={{ padding: '1rem' }}>
                <ActionButton
                  action={async () => {
                    'use server';
                    await toggleWinner(c.id, !c.isWinner);
                  }}
                  label={c.isWinner ? '✅ ชนะเลือกตั้ง' : 'ไม่ได้ตำแหน่ง'}
                  color={c.isWinner ? '#28a745' : '#e9ecef'}
                  confirmTitle={c.isWinner ? 'ยกเลิกตำแหน่งผู้ชนะ' : 'ตั้งเป็นผู้ชนะเลือกตั้ง'}
                  confirmText={`คุณต้องการเปลี่ยนสถานะของ ${c.name} ใช่หรือไม่?`}
                  successText="บันทึกสถานะเรียบร้อยแล้ว"
                  icon="question"
                />
              </td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/candidates/${c.id}`} style={{ padding: '0.5rem 1rem', background: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                  แก้ไข
                </Link>
                <ActionButton
                  action={async () => {
                    'use server';
                    await deleteCandidate(c.id);
                  }}
                  label="ลบ"
                  color="#dc3545"
                  confirmTitle="ยืนยันการลบข้อมูล"
                  confirmText={`คุณต้องการลบข้อมูลของ ${c.name} อย่างถาวรใช่หรือไม่?`}
                  successText="ลบข้อมูลเรียบร้อยแล้ว"
                  icon="warning"
                />
              </td>
            </tr>
          ))}
          {candidates.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                ยังไม่มีข้อมูลผู้สมัคร
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
