import CandidateApplicationForm from './CandidateApplicationForm';

export const dynamic = 'force-dynamic';

export default function ApplyCandidatePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#007bff' }}>
        ระบบรับสมัครผู้สมัครรับเลือกตั้ง
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
        สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ประจำปี 2569
      </p>

      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #dee2e6' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>เงื่อนไขการรับสมัคร</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li>ผู้สมัครจะต้องเป็นสมาชิกที่มีสิทธิรับเลือกตั้งตามระเบียบสหกรณ์ฯ</li>
          <li>โปรดตรวจสอบข้อมูล เลขทะเบียนสมาชิก และ เลขประจำตัวประชาชน ให้ถูกต้อง</li>
          <li>หากท่านส่งใบสมัครแล้ว จะไม่สามารถส่งใบสมัครซ้ำได้ จนกว่าจะได้รับการแจ้งผลการตรวจสอบ</li>
          <li>ข้อมูลรูปภาพและวิสัยทัศน์ จะถูกนำไปเผยแพร่ในหน้าทำเนียบผู้สมัครหลังจากแอดมินอนุมัติแล้ว</li>
        </ul>
      </div>

      <div style={{ background: '#e0f2fe', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#0369a1' }}>ตรวจสอบประวัติการฝึกอบรม</h4>
          <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.9rem' }}>สำหรับผู้สมัครที่ต้องการสื่บค้นประวัติการเข้ารับการฝึกอบรมของตนเอง</p>
        </div>
        <a 
          href="https://project-management-system-iota-six.vercel.app/?mode=member" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#0284c7',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap'
          }}
        >
          🔍 คลิ๊กเพื่อสื่บค้น
        </a>
      </div>

      <CandidateApplicationForm />
    </div>
  );
}
