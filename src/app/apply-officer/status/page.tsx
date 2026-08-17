'use client';

import { useState } from 'react';
import { checkStatus } from './actions';
import Link from 'next/link';

export default function CheckOfficerStatusPage() {
  const [memberId, setMemberId] = useState('');
  const [idCard, setIdCard] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await checkStatus(memberId, idCard);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
    setLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>🟡 ยื่นใบสมัครสำเร็จ (อยู่ระหว่างพิจารณา)</span>;
      case 'approved': return <span style={{ color: '#10b981', fontWeight: 'bold' }}>🟢 อนุมัติแล้ว</span>;
      case 'rejected': return <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 ไม่อนุมัติ</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/apply-officer" style={{ color: '#64748b', textDecoration: 'none' }}>
          ← กลับหน้าสมัครเจ้าหน้าที่
        </Link>
      </div>

      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h1 style={{ color: '#0f172a', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.8rem' }}>
          ตรวจสอบสถานะการสมัครเจ้าหน้าที่
        </h1>
        
        <form onSubmit={handleCheck}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>
              เลขทะเบียนสมาชิก (5 หลัก)
            </label>
            <input 
              type="text" 
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required 
              maxLength={5}
              pattern="\d{5}"
              placeholder="ตัวอย่าง 12345"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#334155' }}>
              เลขประจำตัวประชาชน (13 หลัก)
            </label>
            <input 
              type="text" 
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              required 
              pattern="\d{13}"
              placeholder="เลข 13 หลัก"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: '#0ea5e9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสถานะ'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>ผลการตรวจสอบ</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div><strong>ชื่อ-นามสกุล:</strong> {result.name}</div>
              <div><strong>อำเภอที่สมัคร:</strong> {result.districtName}</div>
              <div><strong>วันที่สมัคร:</strong> {new Date(result.createdAt).toLocaleDateString('th-TH')}</div>
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'center', fontSize: '1.1rem' }}>
                สถานะ: {getStatusDisplay(result.status)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
