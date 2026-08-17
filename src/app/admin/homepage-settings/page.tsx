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
    election_location: 'โรงเรียนสตูลวิทยา ตำบลคลองขุด อำเภอเมืองสตูล จังหวัดสตูล',
    
    // Toggles and terms
    menu_check_eligibility: 'true',
    menu_candidates: 'true',
    menu_results: 'true',
    menu_apply_candidate: 'true',
    menu_apply_officer: 'true',
    require_officer_files: 'true',
    officer_terms: 'ข้าพเจ้าขอรับรองว่าข้อมูลที่กรอกทั้งหมดเป็นความจริง และยินยอมให้สหกรณ์ตรวจสอบข้อมูลส่วนบุคคลเพื่อประกอบการพิจารณา',
    candidate_terms: '',
    candidate_online_open: 'true',
    candidate_download_open: 'false',
    candidate_form_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/homepage-settings')
      .then(res => res.json())
      .then(data => {
        setForm(prev => ({ ...prev, ...data }));
        setFetching(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload-file', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setForm({ ...form, candidate_form_url: data.url });
        Swal.fire({ icon: 'success', title: 'อัปโหลดสำเร็จ', text: 'อัปโหลดไฟล์ใบสมัครเรียบร้อยแล้ว กรุณากดบันทึกข้อมูลหน้าแรก' });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'อัปโหลดล้มเหลว', text: 'ไม่สามารถอัปโหลดไฟล์ได้ กรุณาลองใหม่' });
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
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

        <div style={{ padding: '1.5rem', border: '1px solid #ced4da', borderRadius: '8px', background: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#495057' }}>ตั้งค่าเมนูและระบบ (เปิด/ปิด)</h3>
          <p style={{ color: '#6c757d', marginBottom: '1rem', fontSize: '0.9rem' }}>
            เลือก "เปิด" เพื่อให้ใช้งานได้ปกติ เลือก "ปิด" เพื่อแสดงหน้าปรับปรุงระบบ (Maintenance)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เมนู ตรวจสอบสิทธิ</label>
              <select name="menu_check-eligibility" value={form['menu_check-eligibility'] || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิดใช้งาน</option>
                <option value="false">🔴 ปิดปรับปรุง</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เมนู ทำเนียบผู้สมัคร</label>
              <select name="menu_candidates" value={form.menu_candidates || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิดใช้งาน</option>
                <option value="false">🔴 ปิดปรับปรุง</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เมนู ผลการเลือกตั้ง</label>
              <select name="menu_results" value={form.menu_results || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิดใช้งาน</option>
                <option value="false">🔴 ปิดปรับปรุง</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เมนู สมัครรับเลือกตั้ง</label>
              <select name="menu_apply-candidate" value={form['menu_apply-candidate'] || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิดใช้งาน</option>
                <option value="false">🔴 ปิดปรับปรุง</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เมนู รับสมัครเจ้าหน้าที่ กกต.</label>
              <select name="menu_apply-officer" value={form['menu_apply-officer'] || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิดใช้งาน</option>
                <option value="false">🔴 ปิดปรับปรุง</option>
              </select>
            </div>
          </div>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#495057' }}>ตั้งค่าแบบฟอร์มเจ้าหน้าที่</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>บังคับแนบไฟล์รูปถ่ายและสำเนาทะเบียนบ้าน</label>
            <select name="require_officer_files" value={form.require_officer_files || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
              <option value="true">🟢 บังคับ (ต้องแนบถึงจะส่งได้)</option>
              <option value="false">⚪ ไม่บังคับ (ส่งฟอร์มได้โดยไม่ต้องแนบไฟล์)</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เงื่อนไขการรับสมัคร (Terms & Conditions)</label>
            <textarea
              name="officer_terms"
              value={form.officer_terms || ''}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
              placeholder="ข้อความเงื่อนไขให้ผู้สมัครกดยอมรับก่อนเข้าสู่แบบฟอร์ม"
            />
          </div>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #ced4da', borderRadius: '8px', background: '#f8f9fa' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#495057' }}>ตั้งค่าระบบรับสมัครคณะกรรมการ</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>โหมดกรอกฟอร์มออนไลน์</label>
              <select name="candidate_online_open" value={form.candidate_online_open || 'true'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิด (ให้กรอกในเว็บได้)</option>
                <option value="false">🔴 ปิด (ไม่ให้กรอกออนไลน์)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>โหมดดาวน์โหลดใบสมัคร</label>
              <select name="candidate_download_open" value={form.candidate_download_open || 'false'} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}>
                <option value="true">🟢 เปิด (ให้ดาวน์โหลดได้)</option>
                <option value="false">🔴 ปิด (ไม่ให้ดาวน์โหลด)</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>อัปโหลดไฟล์ใบสมัครรับเลือกตั้ง (PDF/Word)</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileUpload} 
                disabled={uploading}
                style={{ padding: '0.4rem', border: '1px solid #ced4da', borderRadius: '4px', flex: 1, background: 'white' }}
              />
              {uploading && <span style={{ color: '#007bff' }}>กำลังอัปโหลด...</span>}
            </div>
            {form.candidate_form_url && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#28a745' }}>
                ✅ มีไฟล์ในระบบแล้ว: <a href={form.candidate_form_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>ดูไฟล์ปัจจุบัน</a>
              </p>
            )}
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>เงื่อนไขการรับสมัคร (Terms & Conditions)</label>
            <textarea
              name="candidate_terms"
              value={form.candidate_terms || ''}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ced4da' }}
              placeholder="ข้อความเงื่อนไขให้ผู้สมัครกดยอมรับก่อนเข้าสู่แบบฟอร์มรับเลือกตั้ง"
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
