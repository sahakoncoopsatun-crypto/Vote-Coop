import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['homepage_title', 'homepage_subtitle', 'countdown_target', 'election_date', 'election_time', 'election_location']
      }
    }
  });

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as any);

  const titleText = settingsMap['homepage_title'] || 'ศูนย์ข้อมูลข่าวสารการเลือกตั้งและการประชุมใหญ่สามัญ \n ประจำปี 2569';
  const subtitleText = settingsMap['homepage_subtitle'] || 'สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด \n ร่วมเป็นส่วนหนึ่งในการกำหนดทิศทางเพื่อความมั่นคงของมวลหมู่สมาชิก';
  const targetDateStr = settingsMap['countdown_target'] || '2026-11-21T09:00:00+07:00';
  const electionDate = settingsMap['election_date'] || '21 พฤศจิกายน 2569';
  const electionTime = settingsMap['election_time'] || '09:00 - 15:00 น.';
  const electionLocation = settingsMap['election_location'] || 'โรงเรียนสตูลวิทยา ตำบลคลองขุด อำเภอเมืองสตูล จังหวัดสตูล';

  return (
    <div className="animate-fade-in">
      <section className="text-center mb-8" style={{ padding: '4rem 0 2rem' }}>
        <h1 className="mb-4" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', whiteSpace: 'pre-line' }}>
          {titleText}
        </h1>
        <p className="mb-8" style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '800px', margin: '0 auto 2rem', whiteSpace: 'pre-line' }}>
          {subtitleText}
        </p>

        <CountdownTimer targetDateStr={targetDateStr} />
        
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', display: 'inline-block', marginBottom: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>กำหนดการเลือกตั้งและประชุมใหญ่</h4>
          <p style={{ margin: '0.25rem 0' }}><strong>วันที่:</strong> {electionDate} <strong>เวลา:</strong> {electionTime}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>สถานที่:</strong> {electionLocation}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/check-eligibility" className="btn">
            ตรวจสอบสิทธิเลือกตั้ง
          </Link>
          <Link href="/results" className="btn btn-secondary">
            ดูผลการเลือกตั้ง
          </Link>
        </div>
      </section>

      <section className="grid mb-8">
        <div className="card">
          <div className="card-body text-center">
            <h3 className="card-title">ผู้สมัครรับเลือกตั้ง</h3>
            <p className="mb-4">ดูรายชื่อ โปรไฟล์ วิสัยทัศน์ และนโยบายของผู้สมัครแต่ละตำแหน่ง</p>
            <Link href="/candidates" className="btn btn-secondary" style={{ width: '100%' }}>ดูข้อมูลผู้สมัคร</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <h3 className="card-title">ข่าวสารล่าสุด</h3>
            <p className="mb-4">ติดตามประกาศและข่าวสารสำคัญเกี่ยวกับการเลือกตั้ง</p>
            <Link href="/news" className="btn btn-secondary" style={{ width: '100%' }}>อ่านข่าวสาร</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <h3 className="card-title">สมัครรับเลือกตั้ง</h3>
            <p className="mb-4">กรอกใบสมัครรับเลือกตั้งออนไลน์ และพิมพ์ใบสมัครเพื่อยื่น</p>
            <Link href="/apply-candidate" className="btn" style={{ width: '100%' }}>สมัครรับเลือกตั้ง</Link>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <h3 className="card-title">สมัครเจ้าหน้าที่</h3>
            <p className="mb-4">ลงทะเบียนสมัครเป็นเจ้าหน้าที่ดำเนินการเลือกตั้ง</p>
            <Link href="/apply-officer" className="btn" style={{ width: '100%' }}>สมัครเจ้าหน้าที่</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
