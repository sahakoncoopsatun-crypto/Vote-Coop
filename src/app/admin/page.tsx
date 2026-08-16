import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { toggleReferendum, updateStats } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [candidatesCount, newsCount, eligibilityCount, agendaCount, settings] = await Promise.all([
    prisma.candidate.count(),
    prisma.news.count(),
    prisma.eligibility.count(),
    prisma.agenda.count(),
    prisma.setting.findMany()
  ]);

  const getSetting = (key: string, def = '0') => settings.find(s => s.key === key)?.value || def;

  const showReferendum = getSetting('showReferendum', 'false') === 'true';
  const electionTotalVoters = getSetting('electionTotalVoters', '0');
  const electionEligibleVoters = getSetting('electionEligibleVoters', '0');
  const agmTotalAttendees = getSetting('agmTotalAttendees', '0');
  const agmEligibleAttendees = getSetting('agmEligibleAttendees', '0');

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>แผงควบคุม (Dashboard)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>จำนวนผู้สมัคร</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{candidatesCount}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/admin/candidates" style={{ color: '#007bff', textDecoration: 'underline' }}>จัดการรายชื่อผู้สมัคร</Link>
            <Link href="/admin/candidate-apps" style={{ color: '#ff5722', textDecoration: 'underline', fontWeight: 'bold' }}>ตรวจใบสมัครออนไลน์</Link>
          </div>
        </div>
        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>ข่าวสารทั้งหมด</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{newsCount}</p>
          <Link href="/admin/news" style={{ color: '#28a745', textDecoration: 'underline' }}>จัดการข่าวสาร</Link>
        </div>
        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>วาระการประชุม</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>{agendaCount}</p>
          <Link href="/admin/agendas" style={{ color: '#ffc107', textDecoration: 'underline' }}>จัดการวาระประชุม</Link>
        </div>
        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>ฐานข้อมูลผู้มีสิทธิ</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>{eligibilityCount}</p>
          <Link href="/admin/eligibility" style={{ color: '#17a2b8', textDecoration: 'underline' }}>จัดการผู้มีสิทธิ & กำหนดการ</Link>
        </div>
        <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h3>เจ้าหน้าที่เลือกตั้ง</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1' }}>7 อำเภอ</p>
          <Link href="/admin/officers" style={{ color: '#6f42c1', textDecoration: 'underline' }}>จัดการสมัครเจ้าหน้าที่</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Statistics Update Form */}
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>อัปเดตข้อมูลสถิติการเข้าร่วม</h3>
          <form action={updateStats} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: '0', color: '#007bff' }}>สถิติการเลือกตั้ง</h4>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>จำนวนผู้มาใช้สิทธิเลือกตั้ง</label>
              <input type="number" name="electionTotalVoters" defaultValue={electionTotalVoters} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>จำนวนผู้มีสิทธิเลือกตั้งทั้งหมด</label>
              <input type="number" name="electionEligibleVoters" defaultValue={electionEligibleVoters} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            
            <h4 style={{ margin: '1rem 0 0 0', color: '#28a745' }}>สถิติการประชุมใหญ่</h4>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>จำนวนผู้เข้าประชุมใหญ่</label>
              <input type="number" name="agmTotalAttendees" defaultValue={agmTotalAttendees} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>จำนวนผู้มีสิทธิเข้าร่วมประชุมทั้งหมด</label>
              <input type="number" name="agmEligibleAttendees" defaultValue={agmEligibleAttendees} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            
            <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              บันทึกสถิติ
            </button>
          </form>
        </div>

        {/* Display Settings Form */}
        <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>ตั้งค่าหน้าแสดงผล</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <strong>แสดงผลประชามติ</strong>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '0' }}>เปิดหรือปิดกล่องประชามติที่หน้าประกาศผล</p>
            </div>
            <form action={async () => {
              'use server';
              await toggleReferendum(!showReferendum);
            }}>
              <button type="submit" style={{ 
                padding: '0.5rem 1rem', 
                background: showReferendum ? '#dc3545' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}>
                {showReferendum ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <div>
              <strong>แสดงหน้ารายงานการประชุมใหญ่</strong>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '0' }}>เปิดหรือปิดหน้ารายงานวาระการประชุมต่อสาธารณะ</p>
            </div>
            <form action={async () => {
              'use server';
              // Note: need to import toggleAgmReport
              const { toggleAgmReport } = await import('./actions');
              const showAgmReport = getSetting('agm_report_enabled', 'false') === 'true';
              await toggleAgmReport(!showAgmReport);
            }}>
              <button type="submit" style={{ 
                padding: '0.5rem 1rem', 
                background: getSetting('agm_report_enabled', 'false') === 'true' ? '#dc3545' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}>
                {getSetting('agm_report_enabled', 'false') === 'true' ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
              </button>
            </form>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <div>
              <strong>แสดงหน้าวาระการประชุม</strong>
              <p style={{ fontSize: '0.8rem', color: '#666', margin: '0' }}>เปิดหรือปิดหน้าวาระการประชุมต่อสาธารณะ</p>
            </div>
            <form action={async () => {
              'use server';
              const { toggleAgendas } = await import('./actions');
              const showAgendas = getSetting('agendas_enabled', 'false') === 'true';
              await toggleAgendas(!showAgendas);
            }}>
              <button type="submit" style={{ 
                padding: '0.5rem 1rem', 
                background: getSetting('agendas_enabled', 'false') === 'true' ? '#dc3545' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}>
                {getSetting('agendas_enabled', 'false') === 'true' ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
