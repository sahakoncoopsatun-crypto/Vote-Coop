'use client';

import { useState } from 'react';

export default function EligibilityUploadForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm('ข้อมูลผู้มีสิทธิเดิมทั้งหมดจะถูกลบและแทนที่ด้วยไฟล์นี้ ยืนยันการอัปโหลดหรือไม่?')) {
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
      alert('อัปโหลดและบันทึกข้อมูลสำเร็จ');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'รูปแบบไฟล์ไม่ถูกต้อง'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          เลือกไฟล์ Excel (.xlsx) หรือ CSV
        </label>
        <input 
          type="file" 
          name="file" 
          accept=".xlsx,.xls,.csv" 
          required 
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <button 
        type="submit" 
        disabled={isUploading}
        style={{ 
          padding: '0.75rem', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: isUploading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isUploading ? 'กำลังอัปโหลดและประมวลผล...' : 'อัปโหลดรายชื่อ'}
      </button>
    </form>
  );
}
