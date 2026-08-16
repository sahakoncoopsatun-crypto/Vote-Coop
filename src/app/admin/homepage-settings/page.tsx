'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function HomepageSettingsPage() {
  const [form, setForm] = useState({
    homepage_title: 'ศูนย์ข้อมูลข่าวสารการเลือกตั้งและการประชุมใหญ่สามัญ \n ประจำปี 2569',
    homepage_subtitle: 'สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด \n ร่วมเป็นส่วนหนึ่งในการกำหนดทิศทางเพื่อความมั่นคงของมวลหมู่สมาชิก',
    countdown_target: '2026-11-21T09:00:00+07:00',
    election_date: '21 พฤศจิกายน 2569',
    election_time: '09:00 - 15:00 น.',
    election_location: 'โรงเรียนสตูลวิทยา ตำบลคลองขุด อำเภอเมืองสตูล จังหวัดสตูล'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch('/api/admin/homepage-settings')
      .then(res => res.json())
      .then(data => {
        setForm(prev => ({ ...prev, ...data }));
        setFetching(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/homepage-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to update');

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'ข้อมูลหน้าแรกถูกอัปเดตเรียบร้อยแล้ว',
        confirmButtonColor: '#28a745'
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>🏡 จัดการข้อมูลหน้าแรก</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ padding: '1.5rem', border: '1px solid #ced4da', borderRadius: '8px', background: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#495057' }}>ข้อความต้อนรับหลัก</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>หัวข้อหลัก (Title)</label>
            <textarea
              name="homepage_title"
              value={form.homepage_title}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
            />
            <small style={{ color: '#6c757d' }}>แนะนำให้ใช้บรรทัดใหม่เพื่อความสวยงาม</small>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>ข้อความรอง (Subtitle)</label>
            <textarea
              name="homepage_subtitle"
              value={form.homepage_subtitle}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
            />
          </div>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #ced4da', borderRadius: '8px', background: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#495057' }}>กำหนดการเลือกตั้ง (นับถอยหลัง)</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>วัน/เวลา เป้าหมายสำหรับการนับถอยหลัง (รูปแบบ: YYYY-MM-DDTHH:MM:SS+07:00)</label>
            <input
              type="text"
              name="countdown_target"
              value={form.countdown_target}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
            />
            <small style={{ color: '#6c757d' }}>เช่น: 2026-11-21T09:00:00+07:00</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>วันที่ (แสดงเป็นข้อความ)</label>
              <input
                type="text"
                name="election_date"
                value={form.election_date}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เวลา</label>
              <input
                type="text"
                name="election_time"
                value={form.election_time}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>สถานที่</label>
            <textarea
              name="election_location"
              value={form.election_location}
              onChange={handleChange}
              rows={2}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ กำลังบันทึก...' : '💾 บันทึกข้อมูลหน้าแรก'}
        </button>
      </form>
    </div>
  );
}
