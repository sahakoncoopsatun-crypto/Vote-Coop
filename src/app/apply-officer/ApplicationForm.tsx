'use client';

import { useState } from 'react';
import { submitApplication } from './actions';

export default function ApplicationForm({ districts, terms, requireFiles }: { districts: any[], terms: string, requireFiles: boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('กรุณายอมรับเงื่อนไขการรับสมัครก่อน');
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitApplication(formData);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        (e.target as HTMLFormElement).reset();
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
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #dee2e6', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#007bff' }}>เงื่อนไขการรับสมัคร</h3>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          textAlign: 'left', 
          marginBottom: '2rem',
          minHeight: '150px',
          whiteSpace: 'pre-wrap',
          border: '1px solid #e9ecef'
        }}>
          {terms || 'ยังไม่ได้กำหนดเงื่อนไข'}
        </div>
        
        <button 
          onClick={() => {
            setAcceptedTerms(true);
            setShowTerms(false);
          }}
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

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #dee2e6' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#007bff' }}>กรอกข้อมูลสมัครเจ้าหน้าที่</h3>
      
      <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
        <a href="/apply-officer/status" style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 'bold' }}>
          🔍 ตรวจสอบสถานะการสมัคร
        </a>
      </div>

      {message.text && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '4px',
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>อำเภอที่ต้องการลงปฏิบัติหน้าที่ <span style={{color: 'red'}}>*</span></label>
          <select name="districtId" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="">-- เลือกอำเภอ --</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name} (ว่าง {Math.max(0, d.quota - d.approvedCount)} ที่)</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>เลขทะเบียนสมาชิก 5 หลัก <span style={{color: 'red'}}>*</span></label>
            <input type="text" name="memberId" required maxLength={5} pattern="\d{5}" title="โปรดกรอกตัวเลข 5 หลัก" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="ตัวอย่าง 12345" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>เลขประจำตัวประชาชน 13 หลัก <span style={{color: 'red'}}>*</span></label>
            <input type="text" name="idCard" required pattern="\d{13}" title="โปรดกรอกตัวเลข 13 หลัก" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="เลข 13 หลัก" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ตำแหน่ง</label>
            <input type="text" name="jobTitle" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="ตำแหน่ง" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>สังกัด</label>
            <input type="text" name="workplace" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="สังกัด/หน่วยงาน" />
          </div>
        </div>

        <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>ที่อยู่ปัจจุบัน</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>บ้านเลขที่</label>
            <input type="text" name="address" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>หมู่ที่</label>
            <input type="text" name="moo" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ตรอก</label>
            <input type="text" name="trok" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ซอย</label>
            <input type="text" name="soi" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ถนน</label>
            <input type="text" name="road" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ตำบล</label>
            <input type="text" name="subDistrict" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>อำเภอ</label>
            <input type="text" name="districtName" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>จังหวัด</label>
            <input type="text" name="province" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>รหัสไปรษณีย์</label>
            <input type="text" name="zipcode" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>เบอร์โทรศัพท์ติดต่อ <span style={{color: 'red'}}>*</span></label>
          <input type="text" name="phone" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="ตัวอย่าง 0812345678" />
        </div>

        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            อัปโหลดรูปถ่ายหน้าตรง {requireFiles && <span style={{color: 'red'}}>*</span>}
          </label>
          <input type="file" name="image" accept="image/*" required={requireFiles} style={{ width: '100%', padding: '0.5rem' }} />
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>* รองรับไฟล์ .jpg, .png ขนาดไม่เกิน 5MB</p>
        </div>

        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            สำเนาทะเบียนบ้าน พร้อมรับรองสำเนาถูกต้อง {requireFiles && <span style={{color: 'red'}}>*</span>}
          </label>
          <input type="file" name="houseRegImage" accept="image/*,.pdf" required={requireFiles} style={{ width: '100%', padding: '0.5rem' }} />
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>* รองรับไฟล์รูปภาพและ PDF</p>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting} style={{ 
            width: '100%', 
            padding: '1rem', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}>
            {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งใบสมัคร'}
          </button>
        </div>
      </div>
    </form>
  );
}
