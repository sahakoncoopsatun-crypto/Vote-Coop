export default function MaintenancePage() {
  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem' 
    }}>
      <div style={{ 
        maxWidth: '600px', 
        textAlign: 'center', 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</div>
        <h1 style={{ color: '#0f172a', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          ระบบอยู่ระหว่างปรับปรุง
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          ระบบหรือหน้าเว็บที่คุณกำลังเข้าถึงอยู่ในระหว่างการปรับปรุงข้อมูลชั่วคราว คุณต้องรอให้เจ้าหน้าที่อัปเดตระบบให้แล้วเสร็จ จึงจะสามารถใช้งานหรือตรวจสอบข้อมูลได้ตามปกติ
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          ขออภัยในความไม่สะดวกครับ 🙏
        </p>
      </div>
    </div>
  );
}
