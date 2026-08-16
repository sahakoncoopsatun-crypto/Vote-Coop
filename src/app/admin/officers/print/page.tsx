import { prisma } from '@/lib/prisma';
import './print.css'; // We'll create this next

export const dynamic = 'force-dynamic';

export default async function PrintOfficersReport() {
  const districts = await prisma.district.findMany({
    include: {
      applications: {
        where: {
          status: 'approved' // Only show approved officers for the formal report
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  const totalQuota = districts.reduce((acc, d) => acc + d.quota, 0);
  const totalApproved = districts.reduce((acc, d) => acc + d.applications.length, 0);

  return (
    <div className="print-container">
      <div className="print-header">
        <h1>รายงานสรุปรายชื่อผู้ได้รับการอนุมัติเป็นเจ้าหน้าที่ดำเนินการเลือกตั้ง</h1>
        <h2>สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ประจำปี 2569</h2>
        <p>เพื่อนำเสนอเป็นวาระพิจารณาในการประชุมคณะกรรมการ</p>
      </div>

      <div className="print-summary">
        <p><strong>สรุปข้อมูลการรับสมัคร:</strong></p>
        <ul>
          <li>จำนวนโควตารวมทุกอำเภอ: {totalQuota} คน</li>
          <li>จำนวนผู้ที่ได้รับการอนุมัติรวม: {totalApproved} คน</li>
        </ul>
      </div>

      {districts.map(district => (
        <div key={district.id} className="district-section">
          <h3>
            อำเภอ: {district.name} 
            <span style={{ fontWeight: 'normal', fontSize: '0.9em', marginLeft: '10px' }}>
              (โควตา: {district.quota} คน / อนุมัติแล้ว: {district.applications.length} คน)
            </span>
          </h3>

          {district.applications.length > 0 ? (
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>ลำดับ</th>
                  <th style={{ width: '20%' }}>เลขทะเบียนสมาชิก</th>
                  <th style={{ width: '40%' }}>ชื่อ-สกุล</th>
                  <th style={{ width: '30%' }}>เบอร์โทรศัพท์</th>
                </tr>
              </thead>
              <tbody>
                {district.applications.map((app, index) => (
                  <tr key={app.id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center' }}>{app.memberId}</td>
                    <td>{app.name}</td>
                    <td style={{ textAlign: 'center' }}>{app.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">ยังไม่มีผู้ได้รับการอนุมัติในอำเภอนี้</p>
          )}
        </div>
      ))}

      <div className="print-signatures">
        <div className="signature-box">
          <p>ผู้รายงาน</p>
          <br /><br />
          <p>(..........................................................)</p>
          <p>ตำแหน่ง ....................................................</p>
        </div>
        <div className="signature-box">
          <p>ผู้ตรวจสอบ/อนุมัติ</p>
          <br /><br />
          <p>(..........................................................)</p>
          <p>ประธานกรรมการดำเนินการ</p>
        </div>
      </div>
      
      {/* Auto-print script */}
      <script dangerouslySetInnerHTML={{
        __html: `window.onload = function() { window.print(); }`
      }} />
    </div>
  );
}
