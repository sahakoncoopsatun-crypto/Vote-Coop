import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DownloadsPage() {
  // Fetch agendas 1 to 6 if they exist in DB
  const agendas = await prisma.agenda.findMany({ 
    where: { number: { lte: 6 } },
    orderBy: { number: 'asc' } 
  });

  // Mock brief agendas if DB is empty for demo purposes
  const briefAgendas = agendas.length > 0 ? agendas : [
    { id: 1, number: 1, title: 'เรื่องประธานแจ้งให้ที่ประชุมทราบ', result: 'รับทราบ' },
    { id: 2, number: 2, title: 'รับรองรายงานการประชุมใหญ่สามัญประจำปีที่ผ่านมา', result: 'รอการลงมติ' },
    { id: 3, number: 3, title: 'รายงานผลการดำเนินงานในรอบปี', result: 'รับทราบ' },
    { id: 4, number: 4, title: 'พิจารณาอนุมัติงบการเงินและงบดุลประจำปี', result: 'รอการลงมติ' },
    { id: 5, number: 5, title: 'พิจารณาจัดสรรกำไรสุทธิประจำปี', result: 'รอการลงมติ' },
    { id: 6, number: 6, title: 'เลือกตั้งคณะกรรมการดำเนินการและผู้ตรวจสอบกิจการ', result: 'กำลังดำเนินการ' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Page Header (News Style) */}
      <div style={{ borderBottom: '4px solid var(--secondary-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', fontSize: '2rem', textTransform: 'uppercase', margin: 0 }}>
          <span style={{ color: 'var(--secondary-color)', marginRight: '10px' }}>■</span> 
          รายงานกิจการ ประจำปี 2569
        </h1>
        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
          เอกสารประกอบการประชุมใหญ่สามัญประจำปี
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* E-Book Section */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>📖 E-Book: รายงานกิจการ ประจำปี 2569</h3>
            <a href="/mock-report.pdf" target="_blank" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              ดาวน์โหลด PDF
            </a>
          </div>
          
          <div style={{ background: '#f1f5f9', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Embedded PDF Viewer (using standard iframe, fallback to message) */}
            <iframe 
              src="https://mozilla.github.io/pdf.js/web/viewer.html" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="E-Book Viewer"
            ></iframe>
            {/* Note: In production, you'd replace the src with the actual PDF URL or a Flipbook library like turn.js / react-pageflip */}
            
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem' }}>
              สามารถเลื่อนหรือซูมเพื่ออ่านเอกสารได้
            </div>
          </div>
        </div>

        {/* Agenda Section */}
        <div>
          <h2 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            วาระการประชุมคร่าวๆ (วาระที่ 1 - 6)
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {briefAgendas.map((agenda) => {
              let statusColor = '#475569';
              let statusBg = '#f1f5f9';
              
              if (agenda.result === 'รอการลงมติ' || agenda.result === 'กำลังดำเนินการ') {
                statusColor = '#b45309';
                statusBg = '#fef3c7';
              } else if (agenda.result === 'รับทราบ' || agenda.result === 'อนุมัติ') {
                statusColor = '#15803d';
                statusBg = '#dcfce3';
              }

              return (
                <div key={agenda.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'white', 
                  padding: '1.2rem 1.5rem', 
                  borderRadius: '6px',
                  borderLeft: '4px solid var(--primary-color)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '1.1rem' }}>
                      วาระที่ {agenda.number}
                    </h3>
                    <p style={{ margin: 0, color: '#475569' }}>{agenda.title}</p>
                  </div>
                  <div style={{ 
                    whiteSpace: 'nowrap',
                    padding: '0.4rem 1rem', 
                    borderRadius: '50px', 
                    backgroundColor: statusBg,
                    color: statusColor,
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {agenda.result}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>ดูรายละเอียดเชิงลึกของแต่ละวาระได้ใน E-Book ด้านบน</p>
          </div>
        </div>

      </div>
    </div>
  );
}
