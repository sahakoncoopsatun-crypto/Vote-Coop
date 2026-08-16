'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewsForm({ newsItem, action }: { newsItem?: any, action: (formData: FormData) => Promise<void> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(newsItem?.imageUrl || '');
  const [pdfPreview, setPdfPreview] = useState('');

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
    if (newsItem?.id) {
      formData.append('id', newsItem.id.toString());
      formData.append('existingImageUrl', newsItem.imageUrl || '');
      formData.append('existingFileUrl', newsItem.fileUrl || '');
    }

    try {
      await action(formData);
      router.push('/admin/news');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>หัวข้อข่าวสาร / ประกาศ</label>
        <input type="text" name="title" defaultValue={newsItem?.title} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>เนื้อหา / รายละเอียด</label>
        <textarea name="content" defaultValue={newsItem?.content} rows={10} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>แนบรูปภาพประกอบ (ไม่บังคับ)</label>
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '1rem' }} />
        {imagePreview && (
          <div style={{ width: '200px', height: '150px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #ccc' }}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>แนบไฟล์เอกสาร (เช่น PDF) (ไม่บังคับ)</label>
        <input type="file" name="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type === 'application/pdf') {
            setPdfPreview(URL.createObjectURL(file));
          } else {
            setPdfPreview('');
          }
        }} style={{ marginBottom: '1rem' }} />
        
        {pdfPreview ? (
          <div style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', height: '400px' }}>
            <iframe src={pdfPreview} width="100%" height="100%" style={{ border: 'none' }} title="PDF Preview" />
          </div>
        ) : newsItem?.fileUrl && newsItem.fileUrl.endsWith('.pdf') ? (
          <div style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', height: '400px' }}>
            <iframe src={newsItem.fileUrl} width="100%" height="100%" style={{ border: 'none' }} title="PDF Preview" />
          </div>
        ) : newsItem?.fileUrl ? (
          <div style={{ fontSize: '0.9rem', color: '#666' }}>ไฟล์ปัจจุบัน: <a href={newsItem.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>ดาวน์โหลด</a></div>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข่าวสาร'}
        </button>
        <Link href="/admin/news" style={{ padding: '0.75rem 2rem', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          ยกเลิก
        </Link>
      </div>
    </form>
  );
}
