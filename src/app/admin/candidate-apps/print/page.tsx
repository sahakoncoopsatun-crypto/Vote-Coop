import { prisma } from '@/lib/prisma';
import './print.css';

import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  'President': 'ประธานกรรมการ',
  'Committee-Hospital': 'กรรมการ (หน่วยโรงพยาบาลสตูล)',
  'Committee-SSJ': 'กรรมการ (หน่วยสำนักงานสาธารณสุขจังหวัดสตูล)',
  'Auditor': 'ผู้ตรวจสอบกิจการ'
};

export default async function PrintCandidatesReport() {
  const applications = await prisma.candidateApplication.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'asc' }
  });

  const groupedApps = applications.reduce((acc, app) => {
    if (!acc[app.position]) acc[app.position] = [];
    acc[app.position].push(app);
    return acc;
  }, {} as Record<string, typeof applications>);

  const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="no-print" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <PrintButton />
        <p style={{ marginTop: '1rem', color: '#666' }}>กรุณาตั้งค่ากระดาษเป็น A4 แนวตั้ง (Portrait)</p>
      </div>

      <div id="print-area" style={{ background: 'white', padding: '2cm', maxWidth: '21cm', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '20pt', margin: '0 0 10px 0' }}>รายงานสรุปรายชื่อผู้ลงสมัครรับเลือกตั้งที่ผ่านการตรวจสอบคุณสมบัติ</h1>
          <h2 style={{ fontSize: '16pt', fontWeight: 'normal', margin: 0 }}>สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด</h2>
        </div>

        {positions.map((pos, index) => {
          const apps = groupedApps[pos] || [];
          if (apps.length === 0) return null;

          return (
            <div key={pos} className={index > 0 ? "page-break" : ""} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '16pt', marginBottom: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                ตำแหน่ง: {POSITION_LABELS[pos]} (จำนวน {apps.length} คน)
              </h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>ลำดับ</th>
                    <th style={{ width: '15%' }}>เลขสมาชิก</th>
                    <th style={{ width: '15%' }}>รูปประจำตัว</th>
                    <th style={{ width: '30%' }}>ชื่อ - สกุล</th>
                    <th style={{ width: '30%' }}>สถานที่ทำงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app, idx) => (
                    <tr key={app.id}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ textAlign: 'center' }}>{app.memberId}</td>
                      <td style={{ textAlign: 'center' }}>
                        {app.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.imageUrl} alt="รูปประจำตัว" style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '65px', background: '#e2e8f0', borderRadius: '4px', margin: '0 auto' }}></div>
                        )}
                      </td>
                      <td>{app.title || ''} {app.name}</td>
                      <td>{app.workplace || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        <div className="signature-box">
          <div className="signature-line">
            <p>ลงชื่อ .....................................................................</p>
            <p>(.....................................................................)</p>
            <p>ประธานกรรมการสรรหาฯ</p>
          </div>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        `
      }} />
    </div>
  );
}
