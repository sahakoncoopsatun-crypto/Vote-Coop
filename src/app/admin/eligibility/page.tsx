import { prisma } from '@/lib/prisma';
import { uploadEligibility, updateElectionSettings } from '../actions';
import Link from 'next/link';
import EligibilityUploadForm from './EligibilityUploadForm';

export const dynamic = 'force-dynamic';

export default async function AdminEligibility() {
  const settings = await prisma.setting.findMany();
  const getSetting = (key: string, def = '') => settings.find(s => s.key === key)?.value || def;

  const electionDate = getSetting('election_date', '');
  const electionTime = getSetting('election_time', '');
  const electionLocation = getSetting('election_location', '');
  
  const agmDate = getSetting('agm_date', '');
  const agmTime = getSetting('agm_time', '');
  const agmLocation = getSetting('agm_location', '');

  const eligibilityCount = await prisma.eligibility.count();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>จัดการผู้มีสิทธิเลือกตั้งและประชุมใหญ่</h2>
        <a href="/api/admin/eligibility/template" download style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          📥 ดาวน์โหลดไฟล์ Excel ต้นแบบ
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#007bff' }}>อัปโหลดรายชื่อ (จำนวนที่มีในระบบตอนนี้: {eligibilityCount.toLocaleString()} รายชื่อ)</h3>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
            * หมายเหตุ: การอัปโหลดไฟล์ใหม่ จะเป็นการลบข้อมูลรายชื่อเดิมทั้งหมดและแทนที่ด้วยข้อมูลในไฟล์นี้
          </p>
          <EligibilityUploadForm action={uploadEligibility} />
        </div>

        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#28a745' }}>ตั้งค่า กำหนดการ วัน/เวลา/สถานที่</h3>
          <form action={updateElectionSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: '0', color: '#007bff', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>กำหนดการเลือกตั้ง</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>วันที่</label>
                <input type="text" name="election_date" defaultValue={electionDate} placeholder="เช่น 24 ตุลาคม 2569" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>เวลา</label>
                <input type="text" name="election_time" defaultValue={electionTime} placeholder="เช่น 08:30 - 15:00 น." style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>สถานที่</label>
                <input type="text" name="election_location" defaultValue={electionLocation} placeholder="เช่น (ดูตามหน่วยเลือกตั้ง)" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            </div>

            <h4 style={{ margin: '1rem 0 0 0', color: '#ffc107', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>กำหนดการประชุมใหญ่สามัญ</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>วันที่</label>
                <input type="text" name="agm_date" defaultValue={agmDate} placeholder="เช่น 25 ตุลาคม 2569" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>เวลา</label>
                <input type="text" name="agm_time" defaultValue={agmTime} placeholder="เช่น 09:00 เป็นต้นไป" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>สถานที่</label>
                <input type="text" name="agm_location" defaultValue={agmLocation} placeholder="เช่น หอประชุมจังหวัดสตูล" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            </div>

            <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              บันทึกกำหนดการ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
