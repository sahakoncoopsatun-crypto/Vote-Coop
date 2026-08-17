'use client';

import { useState } from 'react';
import { submitCandidateApplication } from './actions';

export default function CandidateApplicationForm({ 
  terms, 
  onlineOpen, 
  downloadOpen, 
  formUrl 
}: { 
  terms: string, 
  onlineOpen: boolean, 
  downloadOpen: boolean, 
  formUrl: string 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [applicationId, setApplicationId] = useState<number | null>(null);
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(!!terms); // Only show terms if there are terms configured

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (terms && !acceptedTerms) {
      alert('กรุณายอมรับเงื่อนไขการรับสมัครก่อน');
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitCandidateApplication(formData);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        if (res.applicationId) setApplicationId(res.applicationId);
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง' });
    }
    setIsSubmitting(false);
  };

  if (showTerms) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#007bff' }}>เงื่อนไขการรับสมัคร</h3>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          textAlign: 'left', 
          marginBottom: '2rem',
          minHeight: '150px',
          whiteSpace: 'pre-wrap',
          border: '1px solid #e9ecef',
          color: '#333'
        }}>
          {terms}
        </div>
        
        <button 
          onClick={() => {
            setAcceptedTerms(true);
            setShowTerms(false);
          }}
          className="btn"
          style={{
            padding: '1rem 2rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ฉันได้อ่านและยอมรับเงื่อนไข
        </button>
      </div>
    );
  }

  if (applicationId) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '2rem' }}>บันทึกข้อมูลเรียบร้อยแล้ว</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          ข้อมูลการสมัครของคุณได้เข้าสู่ระบบแล้ว กรุณาพิมพ์ใบสมัครและนำไปยื่นด้วยตนเองที่สหกรณ์ฯ
        </p>
        <a 
          href={`/apply-candidate/print/${applicationId}`} 
          target="_blank" 
          rel="noreferrer"
          className="btn"
          style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '50px', boxShadow: '0 8px 20px rgba(123, 31, 162, 0.4)' }}
        >
          🖨️ พิมพ์ใบสมัครรับเลือกตั้ง
        </a>
      </div>
    );
  }

  if (!onlineOpen && !downloadOpen) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⛔</div>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '2rem' }}>ขณะนี้ระบบปิดรับสมัครแล้ว</h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          หมดเขตการรับสมัครคณะกรรมการตามเวลาที่กำหนด หรือระบบอยู่ระหว่างการปรับปรุง
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', fontSize: '2.2rem', fontWeight: 'bold' }}>ใบสมัครรับเลือกตั้งคณะกรรมการ</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด</p>
      </div>

      {downloadOpen && (
        <div className="glass-panel" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#0369a1', marginBottom: '1rem' }}>สำหรับผู้ประสงค์ยื่นใบสมัครด้วยตนเอง</h3>
          <p style={{ color: '#0c4a6e', marginBottom: '1.5rem' }}>ท่านสามารถดาวน์โหลดแบบฟอร์มใบสมัครเพื่อนำไปเขียนด้วยตนเอง และนำส่งที่สหกรณ์ฯ</p>
          {formUrl ? (
            <a 
              href={formUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn"
              style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', borderRadius: '50px', background: '#0284c7', color: 'white', display: 'inline-block', textDecoration: 'none' }}
            >
              📥 ดาวน์โหลดแบบฟอร์มใบสมัคร
            </a>
          ) : (
            <p style={{ color: '#dc2626' }}>ยังไม่มีไฟล์ใบสมัครในระบบ</p>
          )}
        </div>
      )}

      {onlineOpen && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ background: '#ffffff', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '16px', padding: '3rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #f3e5f5', paddingBottom: '0.5rem', display: 'inline-block' }}>แบบฟอร์มสมัครออนไลน์</h3>
          </div>

          {message.text && (
          <div style={{ 
            padding: '1rem 1.5rem', 
            marginBottom: '2rem', 
            borderRadius: '8px',
            background: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
            color: message.type === 'success' ? '#2E7D32' : '#C62828',
            borderLeft: `4px solid ${message.type === 'success' ? '#2E7D32' : '#C62828'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #f3e5f5', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>1. ข้อมูลการสมัคร</h4>
          
          <div className="form-group">
            <label>ตำแหน่งที่ประสงค์จะลงสมัคร <span className="text-danger">*</span></label>
            <select name="position" required className="form-control" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <option value="">-- เลือกตำแหน่ง --</option>
              <option value="ประธานกรรมการ">ประธานกรรมการ</option>
              <option value="กรรมการ รพ.สตูล">กรรมการ รพ.สตูล</option>
              <option value="กรรมการ สสอ.">กรรมการ สสอ.</option>
              <option value="ผู้ตรวจสอบกิจการ">ผู้ตรวจสอบกิจการ</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #f3e5f5', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>2. ข้อมูลส่วนตัว</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>คำนำหน้า <span className="text-danger">*</span></label>
              <select name="title" required className="form-control">
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>เลขทะเบียนสมาชิก 5 หลัก <span className="text-danger">*</span></label>
              <input type="text" name="memberId" required pattern="\d{5}" title="โปรดกรอกตัวเลข 5 หลัก" className="form-control" placeholder="เช่น 12345" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>เลขประจำตัวประชาชน <span className="text-danger">*</span></label>
              <input type="text" name="idCard" required pattern="\d{13}" title="โปรดกรอกตัวเลข 13 หลัก" className="form-control" placeholder="เลข 13 หลัก" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>อายุ (ปี)</label>
              <input type="number" name="age" className="form-control" placeholder="อายุ" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>เบอร์มือถือ</label>
              <input type="text" name="phone" className="form-control" placeholder="08X-XXX-XXXX" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ID Line</label>
              <input type="text" name="idLine" className="form-control" placeholder="Line ID" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #f3e5f5', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>3. ที่อยู่และที่ทำงานปัจจุบัน</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>บ้านเลขที่</label>
              <input type="text" name="address" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>หมู่ที่</label>
              <input type="text" name="moo" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ถนน</label>
              <input type="text" name="road" className="form-control" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ตำบล</label>
              <input type="text" name="subDistrict" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>อำเภอ</label>
              <input type="text" name="district" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>จังหวัด</label>
              <input type="text" name="province" className="form-control" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>สถานที่ทำงานปัจจุบัน (หน่วยงาน)</label>
              <input type="text" name="workplace" className="form-control" placeholder="เช่น รพ.สตูล" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ตำแหน่ง</label>
              <input type="text" name="jobTitle" className="form-control" placeholder="เช่น นักวิชาการสาธารณสุขชำนาญการ" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #f3e5f5', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>4. ประวัติและการศึกษา</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>วุฒิการศึกษาสูงสุด</label>
              <input type="text" name="educationLevel" className="form-control" placeholder="เช่น ปริญญาโท" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>สาขา</label>
              <input type="text" name="educationMajor" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>สถาบัน</label>
              <input type="text" name="educationInst" className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label>ประวัติการทำงาน</label>
            <textarea name="workHistory" rows={3} className="form-control" placeholder="ระบุประวัติการทำงานโดยสังเขป"></textarea>
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ color: 'var(--primary-color)', borderBottom: '2px solid #f3e5f5', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}>5. นโยบายและวิสัยทัศน์</h4>
          
          <div className="form-group">
            <label>วิสัยทัศน์ (Vision)</label>
            <textarea name="vision" rows={3} className="form-control" placeholder="กรอกวิสัยทัศน์ของคุณ"></textarea>
          </div>

          <div className="form-group">
            <label>นโยบาย (Policy) <small style={{ color: '#F57C00', fontWeight: 'normal' }}>(งดใช้คำส่อเสียดหรือให้ร้าย)</small></label>
            <textarea name="policy" rows={3} className="form-control" placeholder="นโยบายหรือแนวคิดในการบริหารงานสหกรณ์"></textarea>
          </div>
          
          <div className="form-group" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📸</span> รูปภาพประจำตัวผู้สมัคร (แนะนำหน้าตรง)
            </label>
            <input type="file" name="image" accept="image/*" className="form-control" style={{ background: 'white' }} />
          </div>
        </div>

        <div style={{ background: '#F3F4F6', padding: '2rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
          <h4 style={{ color: '#374151', marginBottom: '0.5rem', fontSize: '1.1rem' }}>✍️ สมาชิกผู้รับรอง (3 คน)</h4>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            คุณสามารถพิมพ์ชื่อไว้ล่วงหน้า หรือเว้นว่างไว้เพื่อเขียนด้วยปากกาตอนนำใบสมัครไปยื่นได้
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.9rem', color: '#4B5563' }}>ชื่อผู้รับรองคนที่ 1</label>
              <input type="text" name="guarantee1Name" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.9rem', color: '#4B5563' }}>เลขสมาชิกผู้รับรองคนที่ 1</label>
              <input type="text" name="guarantee1Id" className="form-control" />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.9rem', color: '#4B5563' }}>ชื่อผู้รับรองคนที่ 2</label>
              <input type="text" name="guarantee2Name" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.9rem', color: '#4B5563' }}>เลขสมาชิกผู้รับรองคนที่ 2</label>
              <input type="text" name="guarantee2Id" className="form-control" />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.9rem', color: '#4B5563' }}>ชื่อผู้รับรองคนที่ 3</label>
              <input type="text" name="guarantee3Name" className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.9rem', color: '#4B5563' }}>เลขสมาชิกผู้รับรองคนที่ 3</label>
              <input type="text" name="guarantee3Id" className="form-control" />
            </div>
          </div>
        </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" disabled={isSubmitting} className="btn" style={{ 
              width: '100%', 
              maxWidth: '400px',
              padding: '1rem', 
              borderRadius: '50px', 
              fontSize: '1.2rem',
              boxShadow: '0 8px 15px rgba(123, 31, 162, 0.4)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}>
              {isSubmitting ? 'กำลังประมวลผลข้อมูล...' : 'ส่งใบสมัครรับเลือกตั้ง 🚀'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
