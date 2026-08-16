'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่านให้ตรงกันครับ',
        confirmButtonColor: '#dc3545',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'ยืนยันการเปลี่ยนรหัสผ่าน?',
      text: 'คุณต้องการเปลี่ยนรหัสผ่านใหม่ใช่หรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
          confirmButtonColor: '#dc3545',
        });
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'เปลี่ยนรหัสผ่านสำเร็จ! ✅',
        text: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้วครับ',
        confirmButtonColor: '#28a745',
      });

      setForm({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        confirmButtonColor: '#dc3545',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>⚙️ ตั้งค่า / เปลี่ยนรหัสผ่าน</h1>

      <div style={{ maxWidth: '500px' }}>
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}>
          <strong>⚠️ คำแนะนำด้านความปลอดภัย:</strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
            ควรตั้งรหัสผ่านที่มีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวอักษรและตัวเลขผสมกันครับ
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              ชื่อผู้ใช้ (Username)
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #ced4da',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              รหัสผ่านปัจจุบัน
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              placeholder="กรอกรหัสผ่านเดิม"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #ced4da',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #ced4da',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid #ced4da',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
            }}
          >
            {loading ? '⏳ กำลังบันทึก...' : '🔒 เปลี่ยนรหัสผ่าน'}
          </button>
        </form>
      </div>
    </div>
  );
}
