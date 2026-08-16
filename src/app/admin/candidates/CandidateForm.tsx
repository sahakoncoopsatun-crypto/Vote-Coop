'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CandidateForm({ candidate, action }: { candidate?: any, action: (formData: FormData) => Promise<void> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(candidate?.imageUrl || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    if (candidate?.id) {
      formData.append('id', candidate.id.toString());
      formData.append('existingImageUrl', candidate.imageUrl || '');
    }

    try {
      await action(formData);
      router.push('/admin/candidates');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '800px', display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ชื่อ-นามสกุล</label>
        <input type="text" name="name" defaultValue={candidate?.name} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ตำแหน่งที่ลงสมัคร</label>
        <select name="position" defaultValue={candidate?.position || 'ประธานกรรมการ'} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="ประธานกรรมการ">ประธานกรรมการ</option>
          <option value="กรรมการหน่วยโรงพยาบาลสตูล">กรรมการหน่วยโรงพยาบาลสตูล</option>
          <option value="กรรมการหน่วยสำนักงานสาธารณสุขจังหวัดสตูล">กรรมการหน่วยสำนักงานสาธารณสุขจังหวัดสตูล</option>
          <option value="ผู้ตรวจสอบกิจการ">ผู้ตรวจสอบกิจการ</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>เบอร์ผู้สมัคร</label>
        <input type="number" name="number" defaultValue={candidate?.number} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>คะแนนโหวต (หากต้องการแก้ไข)</label>
        <input type="number" name="votes" defaultValue={candidate?.votes || 0} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>รูปภาพผู้สมัคร</label>
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '1rem' }} />
        {imagePreview && (
          <div style={{ width: '150px', height: '200px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ccc' }}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ประวัติส่วนตัว / ประวัติการทำงาน</label>
        <textarea name="vision" defaultValue={candidate?.vision} rows={5} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>นโยบาย / วิสัยทัศน์</label>
        <textarea name="policy" defaultValue={candidate?.policy} rows={5} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
        <Link href="/admin/candidates" style={{ padding: '0.75rem 2rem', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
