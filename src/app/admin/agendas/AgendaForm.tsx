'use client';

import { useState } from 'react';

export default function AgendaForm({ action, initialData = null }: { action: (formData: FormData) => Promise<void>, initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await action(formData);
      window.location.href = '/admin/agendas';
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 2fr' }}>
      {initialData && <input type="hidden" name="id" value={initialData.id} />}
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>วาระที่ (ตัวเลข)</label>
        <input type="number" name="number" defaultValue={initialData?.number || ''} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>ผลการประชุม (เช่น อนุมัติ, รับทราบ, รอการลงมติ)</label>
        <input type="text" name="result" defaultValue={initialData?.result || 'รอการลงมติ'} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
      </div>
      
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>หัวข้อวาระ (เรื่องที่เสนอ)</label>
        <input type="text" name="title" defaultValue={initialData?.title || ''} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>จำนวนผู้เห็นชอบ (คะแนนเสียง)</label>
        <input type="number" name="approveVotes" defaultValue={initialData?.approveVotes || 0} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>จำนวนผู้ไม่เห็นชอบ (คะแนนเสียง)</label>
        <input type="number" name="disapproveVotes" defaultValue={initialData?.disapproveVotes || 0} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
      </div>
      
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>รายละเอียด (ไม่บังคับ)</label>
        <textarea name="description" defaultValue={initialData?.description || ''} rows={4} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
      </div>

      <div style={{ gridColumn: '1 / -1', background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>แนบไฟล์เพิ่มเติม (ไม่บังคับ)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>รูปภาพประกอบ</label>
            <input type="file" name="image" accept="image/*" style={{ width: '100%' }} />
            {initialData?.imageUrl && (
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                มีรูปภาพแล้ว: <a href={initialData.imageUrl} target="_blank" rel="noreferrer">ดูรูปภาพ</a> (อัปโหลดใหม่เพื่อเปลี่ยน)
              </p>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>ไฟล์เอกสาร (PDF, Word, Excel)</label>
            <input type="file" name="document" accept=".pdf,.doc,.docx,.xls,.xlsx" style={{ width: '100%' }} />
            {initialData?.fileUrl && (
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                มีไฟล์แล้ว: <a href={initialData.fileUrl} target="_blank" rel="noreferrer">ดาวน์โหลด</a> (อัปโหลดใหม่เพื่อเปลี่ยน)
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
        <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกวาระการประชุม'}
        </button>
      </div>
    </form>
  );
}
