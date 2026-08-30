import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AgmReportPage() {
  const [agendas, settings] = await Promise.all([
    prisma.agenda.findMany({ orderBy: { number: 'asc' } }),
    prisma.setting.findMany()
  ]);

  const agmTotalAttendees = parseInt(settings?.find(s => s.key === 'stat_agm_total')?.value || '0');
  const agmEligibleAttendees = parseInt(settings?.find(s => s.key === 'stat_agm_eligible')?.value || '0');
  
  const showAgmReport = settings?.find(s => s.key === 'agm_report_enabled')?.value === 'true';

  const attendancePercent = agmEligibleAttendees > 0 
    ? (agmTotalAttendees / agmEligibleAttendees) * 100 
    : 0;

  if (!showAgmReport) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 style={{ color: '#007bff', marginBottom: '1rem' }}>รายงานผลการประชุมใหญ่สามัญประจำปี 2569</h1>
        <div style={{ background: '#f8f9fa', padding: '3rem', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h2 style={{ color: '#666' }}>🔒 ข้อมูลยังไม่เปิดให้เข้าชมในขณะนี้</h2>
          <p style={{ color: '#888', marginTop: '1rem' }}>กรุณารอการประกาศผลการประชุมอย่างเป็นทางการจากผู้ดูแลระบบ</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#007bff' }}>
        รายงานผลการประชุมใหญ่สามัญประจำปี 2569
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
        สรุปผลการพิจารณาตามวาระการประชุมต่างๆ ของสหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด
      </p>
      
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem', border: '1px solid #dee2e6', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>สถิติผู้เข้าร่วมประชุม</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>{agmTotalAttendees.toLocaleString()}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>ผู้เข้าร่วมประชุม (คน)</div>
          </div>
          <div style={{ fontSize: '2rem', color: '#ccc' }}>/</div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{agmEligibleAttendees.toLocaleString()}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>ผู้มีสิทธิเข้าร่วมทั้งหมด (คน)</div>
          </div>
          <div style={{ fontSize: '2rem', color: '#ccc' }}>=</div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#28a745' }}>{attendancePercent.toFixed(1)}%</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>คิดเป็นร้อยละ</div>
          </div>
        </div>
      </div>

      {agendas.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>ยังไม่มีข้อมูลวาระการประชุม</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {agendas.map((agenda) => {
            let statusColor = '#6c757d';
            let statusBg = '#f8f9fa';
            
            if (agenda.result === 'อนุมัติ' || agenda.result === 'รับรอง' || agenda.result === 'เห็นชอบ') {
              statusColor = '#155724';
              statusBg = '#d4edda';
            } else if (agenda.result === 'ไม่อนุมัติ' || agenda.result === 'ไม่รับรอง' || agenda.result === 'ไม่เห็นชอบ') {
              statusColor = '#721c24';
              statusBg = '#f8d7da';
            } else if (agenda.result === 'รับทราบ') {
              statusColor = '#004085';
              statusBg = '#cce5ff';
            }

            return (
              <div key={agenda.id} style={{ 
                background: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1px solid #eaeaea',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      วาระที่ {agenda.number}: {agenda.title}
                    </h3>
                    {agenda.description && (
                      <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {agenda.description}
                      </p>
                    )}
                    
                    {(agenda.imageUrl || agenda.fileUrl) && (
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {agenda.imageUrl && (
                          <div style={{ maxWidth: '300px' }}>
                            <img src={agenda.imageUrl} alt="ภาพประกอบวาระ" style={{ width: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #ddd' }} />
                          </div>
                        )}
                        {agenda.fileUrl && (
                          <div>
                            <a href={agenda.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#e9ecef', color: '#495057', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                              📄 ดาวน์โหลดเอกสารแนบ
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem' }}>
                      {(agenda.approveVotes > 0 || agenda.disapproveVotes > 0) && (
                        <>
                          <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                            <span style={{ fontSize: '0.8rem', color: '#666', marginRight: '0.5rem', fontWeight: 'normal' }}>เห็นชอบ</span>
                            {agenda.approveVotes.toLocaleString()} เสียง
                          </div>
                          <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                            <span style={{ fontSize: '0.8rem', color: '#666', marginRight: '0.5rem', fontWeight: 'normal' }}>ไม่เห็นชอบ</span>
                            {agenda.disapproveVotes.toLocaleString()} เสียง
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ 
                    whiteSpace: 'nowrap',
                    padding: '0.5rem 1rem', 
                    borderRadius: '50px', 
                    backgroundColor: statusBg,
                    color: statusColor,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: `1px solid ${statusColor}33`
                  }}>
                    {agenda.result}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
