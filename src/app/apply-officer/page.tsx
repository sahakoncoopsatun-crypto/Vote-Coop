import { prisma } from '@/lib/prisma';
import ApplicationForm from './ApplicationForm';

export const dynamic = 'force-dynamic';

export default async function ApplyOfficerPage() {
  const districts = await prisma.district.findMany({
    include: {
      applications: true
    }
  });

  const districtsWithStats = districts.map(d => {
    const approvedCount = d.applications.filter(a => a.status === 'approved').length;
    return {
      id: d.id,
      name: d.name,
      quota: d.quota,
      approvedCount
    };
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#007bff' }}>
        ระบบรับสมัครเจ้าหน้าที่ดำเนินการเลือกตั้ง
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
        ตรวจสอบจำนวนโควตาว่างของแต่ละอำเภอ และกรอกข้อมูลเพื่อสมัครเป็นเจ้าหน้าที่
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {districtsWithStats.map(d => {
          const remaining = Math.max(0, d.quota - d.approvedCount);
          const isFull = d.quota > 0 && remaining === 0;
          const percentage = d.quota > 0 ? Math.min(100, (d.approvedCount / d.quota) * 100) : 0;
          
          return (
            <div key={d.id} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: `1px solid ${isFull ? '#f5c6cb' : '#c3e6cb'}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: isFull ? '#721c24' : '#155724' }}>{d.name}</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  <span>รับ {d.quota} คน</span>
                  <span>อนุมัติแล้ว {d.approvedCount} คน</span>
                </div>
                <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${percentage}%`, 
                    background: isFull ? '#dc3545' : percentage > 80 ? '#ffc107' : '#28a745',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontWeight: 'bold', color: isFull ? '#dc3545' : '#007bff' }}>
                {isFull ? '🔴 โควตาเต็มแล้ว' : `🟢 ว่าง ${remaining} ที่`}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <ApplicationForm districts={districtsWithStats} />
      </div>
    </div>
  );
}
