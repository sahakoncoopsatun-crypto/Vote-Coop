'use client';

import { useState } from 'react';

export default function CheckEligibilityPage() {
  const [memberId, setMemberId] = useState('');
  const [idCard, setIdCard] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/eligibility?memberId=${memberId}&idCard=${idCard}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('ไม่พบข้อมูล กรุณาตรวจสอบเลขสมาชิกหรือเลขบัตรประชาชนอีกครั้ง');
        }
        throw new Error('เกิดข้อผิดพลาดในการตรวจสอบ');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to mask name for PDPA
  const maskName = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      // Assuming Format: "นาย ดำรงศักดิ์ นามสกุล" -> "นาย ดำรงศักดิ์ ***"
      // or "ดำรงศักดิ์ นามสกุล" -> "ดำรงศักดิ์ ***"
      const firstName = parts.slice(0, -1).join(' ');
      return `${firstName} ***`;
    }
    // If only one word, mask half of it
    return fullName.substring(0, Math.ceil(fullName.length / 2)) + '***';
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 className="text-center mb-8" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
        ตรวจสอบสิทธิเลือกตั้งและประชุมใหญ่
      </h1>

      <div className="glass-panel mb-8" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleCheck}>
          <div className="form-group">
            <label htmlFor="memberId" style={{ color: 'var(--primary-color)' }}>เลขทะเบียนสมาชิก (5 หรือ 6 หลัก)</label>
            <input 
              type="text" 
              id="memberId" 
              className="form-control" 
              value={memberId} 
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="เช่น 12345"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="idCard" style={{ color: 'var(--primary-color)' }}>เลขประจำตัวประชาชน (13 หลัก)</label>
            <input 
              type="text" 
              id="idCard" 
              className="form-control" 
              value={idCard} 
              onChange={(e) => setIdCard(e.target.value)}
              placeholder="เช่น 1910000000000"
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสิทธิ'}
          </button>
        </form>
      </div>

      {error && (
        <div className="glass-panel animate-fade-in text-center" style={{ borderColor: 'var(--secondary-color)', backgroundColor: '#fef2f2' }}>
          <p className="text-danger" style={{ margin: 0 }}><strong>{error}</strong></p>
        </div>
      )}

      {result && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
          <h3 className="mb-4 text-center" style={{ color: 'var(--primary-color)', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
            ผลการตรวจสอบสิทธิ
          </h3>
          <div style={{ padding: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-light)', width: '40%' }}>ชื่อ-สกุล</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>{maskName(result.name)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-light)' }}>เลขสมาชิก</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>{result.memberId}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-light)' }}>สังกัดหน่วยงาน</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>{result.organization || '-'}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-light)' }}>สถานที่เลือกตั้ง</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>
                    วันที่ 21 พฤศจิกายน 2569 เวลา 07.00 - 10.00 น. ณ หอประชุมเก่า โรงเรียนสตูลวิทยา
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-light)' }}>สถานที่ประชุมใหญ่สามัญ ประจำปี 2569</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>
                    วันที่ 21 พฤศจิกายน 2569 เวลา 08.30 น. เป็นต้นไป ณ หอประชุม 100 ปี โรงเรียนสตูลวิทยา
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-light)' }}>ลำดับที่ในบัญชีรายชื่อ</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>
                    ลำดับที่ {result.sequenceNumber || '-'} 
                    {result.registrationDesk && <span style={{ marginLeft: '10px', color: 'var(--secondary-color)' }}>(โต๊ะลงทะเบียนที่ {result.registrationDesk})</span>}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: result.canVote ? '#f0fdf4' : '#fef2f2', border: `1px solid ${result.canVote ? '#bbf7d0' : '#fecaca'}`, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ color: result.canVote ? '#166534' : '#991b1b', marginBottom: '0.5rem' }}>🗳️ สิทธิเลือกตั้ง</h4>
                {result.canVote 
                  ? <span className="badge" style={{ background: '#166534', color: 'white' }}>มีสิทธิ</span>
                  : <span className="badge" style={{ background: '#991b1b', color: 'white' }}>ไม่มีสิทธิ</span>
                }
              </div>
              <div style={{ background: result.canAttend ? '#f0f9ff' : '#fef2f2', border: `1px solid ${result.canAttend ? '#bae6fd' : '#fecaca'}`, padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ color: result.canAttend ? '#075985' : '#991b1b', marginBottom: '0.5rem' }}>👥 สิทธิประชุมใหญ่</h4>
                {result.canAttend 
                  ? <span className="badge" style={{ background: '#075985', color: 'white' }}>มีสิทธิ</span>
                  : <span className="badge" style={{ background: '#991b1b', color: 'white' }}>ไม่มีสิทธิ</span>
                }
              </div>
            </div>

            {result.remark && (
              <p className="mt-4 text-danger" style={{ fontSize: '0.9rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '4px', borderLeft: '4px solid var(--secondary-color)' }}>
                <strong>หมายเหตุ:</strong> {result.remark}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
