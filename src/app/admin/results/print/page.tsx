import { prisma } from '@/lib/prisma';
import '../../candidate-apps/print/print.css';

import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  'President': 'ประธานกรรมการ',
  'Committee-Hospital': 'กรรมการ (หน่วยโรงพยาบาลสตูล)',
  'Committee-SSJ': 'กรรมการ (หน่วยสำนักงานสาธารณสุขจังหวัดสตูล)',
  'Auditor': 'ผู้ตรวจสอบกิจการ'
};

export default async function PrintResultsReport() {
  const candidates = await prisma.candidate.findMany({
    orderBy: [
      { position: 'asc' }, 
      { votes: 'desc' }, 
      { number: 'asc' }
    ]
  });

  const groupedCandidates = candidates.reduce((acc, cand) => {
    if (!acc[cand.position]) acc[cand.position] = [];
    acc[cand.position].push(cand);
    return acc;
  }, {} as Record<string, typeof candidates>);

  const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div className="no-print" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <PrintButton />
        <p style={{ marginTop: '1rem', color: '#666' }}>กรุณาตั้งค่ากระดาษเป็น A4 แนวตั้ง (Portrait)</p>
      </div>

      <div id="print-area" style={{ background: 'white', padding: '2cm', maxWidth: '21cm', margin: '0 auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '20pt', margin: '0 0 10px 0' }}>รายงานสรุปผลการเลือกตั้งคณะกรรมการดำเนินการและผู้ตรวจสอบกิจการ</h1>
          <h2 style={{ fontSize: '16pt', fontWeight: 'normal', margin: 0 }}>สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ประจำปี 2569</h2>
        </div>

        {positions.map((pos, index) => {
          const cands = groupedCandidates[pos] || [];
          if (cands.length === 0) return null;

          return (
            <div key={pos} className={index > 0 ? "page-break" : ""} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '16pt', marginBottom: '1rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                ตำแหน่ง: {POSITION_LABELS[pos]}
              </h3>
              <table className="print-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%', textAlign: 'center' }}>ลำดับที่ (ได้คะแนน)</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>เบอร์ผู้สมัคร</th>
                    <th style={{ width: '40%' }}>ชื่อ - สกุล</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>คะแนนเสียง</th>
                    <th style={{ width: '15%', textAlign: 'center' }}>หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {cands.map((cand, idx) => (
                    <tr key={cand.id} style={cand.isWinner ? { backgroundColor: '#f0fdf4' } : {}}>
                      <td style={{ textAlign: 'center', fontWeight: cand.isWinner ? 'bold' : 'normal' }}>{idx + 1}</td>
                      <td style={{ textAlign: 'center' }}>{cand.number}</td>
                      <td style={{ fontWeight: cand.isWinner ? 'bold' : 'normal' }}>{cand.name}</td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{cand.votes.toLocaleString()}</td>
                      <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 'bold' }}>
                        {cand.isWinner ? 'ได้รับเลือกตั้ง' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        <div className="signature-box" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'space-between' }}>
          <div className="signature-line">
            <p>ลงชื่อ ..................................................................... กรรมการ</p>
            <p>(.....................................................................)</p>
          </div>
          <div className="signature-line">
            <p>ลงชื่อ ..................................................................... ประธาน</p>
            <p>(.....................................................................)</p>
            <p>ประธานกรรมการดำเนินการเลือกตั้ง</p>
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
