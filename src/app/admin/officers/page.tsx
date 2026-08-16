import { prisma } from '@/lib/prisma';
import { updateDistrictQuota, updateApplicationStatus, deleteApplication } from './actions';
import ActionButton from '@/components/admin/ActionButton';

export const dynamic = 'force-dynamic';

export default async function AdminOfficers() {
  const districts = await prisma.district.findMany({
    include: {
      applications: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>จัดการรับสมัครเจ้าหน้าที่ดำเนินการเลือกตั้ง</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/api/admin/officers/export" style={{ 
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
          <a href="/admin/officers/print" target="_blank" style={{ 
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
        {districts.map(district => {
          const approvedCount = district.applications.filter(a => a.status === 'approved').length;
          
          return (
            <div key={district.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#007bff' }}>{district.name}</h3>
                
                <form action={async (formData) => {
                  'use server';
                  const quota = parseInt(formData.get('quota') as string);
                  await updateDistrictQuota(district.id, quota);
                }} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem' }}>โควตา (คน):</label>
                  <input type="number" name="quota" defaultValue={district.quota} style={{ width: '80px', padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                  <button type="submit" style={{ padding: '0.25rem 0.75rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>บันทึก</button>
                </form>
              </div>

              <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                สถานะโควตา: รับ {district.quota} คน / อนุมัติแล้ว {approvedCount} คน / เหลือว่าง {Math.max(0, district.quota - approvedCount)} ที่
              </div>

              {district.applications.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>วันที่สมัคร</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>เลขสมาชิก</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>ชื่อ-สกุล</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>เบอร์โทร</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>สถานะ</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {district.applications.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem' }}>{app.createdAt.toLocaleString('th-TH')}</td>
                        <td style={{ padding: '0.75rem' }}>{app.memberId}</td>
                        <td style={{ padding: '0.75rem' }}>{app.name}</td>
                        <td style={{ padding: '0.75rem' }}>{app.phone}</td>
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
                                  await updateApplicationStatus(app.id, 'approved');
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
                                  await updateApplicationStatus(app.id, 'rejected');
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
                                await deleteApplication(app.id);
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
                <p style={{ color: '#888', fontSize: '0.9rem' }}>ยังไม่มีผู้สมัครในอำเภอนี้</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
