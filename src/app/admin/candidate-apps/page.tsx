import { prisma } from '@/lib/prisma';
import { updateCandidateStatus, deleteCandidateApplication } from './actions';
import ActionButton from '@/components/admin/ActionButton';

export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  'President': 'ประธานกรรมการ',
  'Committee-Hospital': 'กรรมการ (หน่วยโรงพยาบาลสตูล)',
  'Committee-SSJ': 'กรรมการ (หน่วยสำนักงานสาธารณสุขจังหวัดสตูล)',
  'Auditor': 'ผู้ตรวจสอบกิจการ'
};

export default async function AdminCandidateApps() {
  const applications = await prisma.candidateApplication.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const groupedApps = applications.reduce((acc, app) => {
    if (!acc[app.position]) acc[app.position] = [];
    acc[app.position].push(app);
    return acc;
  }, {} as Record<string, typeof applications>);

  const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>จัดการใบสมัครรับเลือกตั้ง</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/api/admin/candidate-apps/export" style={{ 
            padding: '0.5rem 1rem', 
            background: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📊 ดาวน์โหลด Excel
          </a>
          <a href="/api/admin/candidate-apps/export-word" style={{ 
            padding: '0.5rem 1rem', 
            background: '#0d6efd', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📝 ดาวน์โหลด Word
          </a>
          <a href="/admin/candidate-apps/print" target="_blank" style={{ 
            padding: '0.5rem 1rem', 
            background: '#0f172a', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🖨️ พิมพ์รายงาน
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {positions.map(pos => {
          const apps = groupedApps[pos] || [];
          const approvedCount = apps.filter(a => a.status === 'approved').length;
          
          return (
            <div key={pos} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{POSITION_LABELS[pos]}</h3>
              </div>

              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                สถานะ: ยื่นสมัคร {apps.length} คน / อนุมัติแล้ว {approvedCount} คน
              </div>

              {apps.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>วันที่สมัคร</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>เลขสมาชิก</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>ชื่อ-สกุล</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>สถานที่ทำงาน</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>สถานะ</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem' }}>{app.createdAt.toLocaleString('th-TH')}</td>
                        <td style={{ padding: '0.75rem' }}>{app.memberId}</td>
                        <td style={{ padding: '0.75rem' }}>{app.title || ''} {app.name}</td>
                        <td style={{ padding: '0.75rem' }}>{app.workplace || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: app.status === 'approved' ? '#d4edda' : app.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                            color: app.status === 'approved' ? '#155724' : app.status === 'rejected' ? '#721c24' : '#856404'
                          }}>
                            {app.status === 'approved' ? 'อนุมัติ' : app.status === 'rejected' ? 'ไม่อนุมัติ' : 'รอตรวจสอบ'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {app.status !== 'approved' && (
                              <ActionButton
                                action={async () => {
                                  'use server';
                                  await updateCandidateStatus(app.id, 'approved');
                                }}
                                label="อนุมัติ"
                                color="#28a745"
                                confirmTitle="ยืนยันการอนุมัติ"
                                confirmText={`คุณต้องการอนุมัติใบสมัครของ ${app.name} ใช่หรือไม่?`}
                                successText="อนุมัติใบสมัครเรียบร้อยแล้ว"
                                icon="question"
                              />
                            )}
                            {app.status !== 'rejected' && (
                              <ActionButton
                                action={async () => {
                                  'use server';
                                  await updateCandidateStatus(app.id, 'rejected');
                                }}
                                label="ไม่อนุมัติ"
                                color="#ffc107"
                                confirmTitle="ยืนยันการไม่อนุมัติ"
                                confirmText={`คุณต้องการปฏิเสธใบสมัครของ ${app.name} ใช่หรือไม่?`}
                                successText="บันทึกสถานะไม่อนุมัติเรียบร้อยแล้ว"
                                icon="warning"
                              />
                            )}
                            <ActionButton
                              action={async () => {
                                'use server';
                                await deleteCandidateApplication(app.id);
                              }}
                              label="ลบ"
                              color="#dc3545"
                              confirmTitle="ยืนยันการลบข้อมูล"
                              confirmText={`คุณต้องการลบใบสมัครของ ${app.name} อย่างถาวรใช่หรือไม่?`}
                              successText="ลบข้อมูลเรียบร้อยแล้ว"
                              icon="warning"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#888', fontSize: '0.9rem' }}>ยังไม่มีผู้สมัครในตำแหน่งนี้</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
