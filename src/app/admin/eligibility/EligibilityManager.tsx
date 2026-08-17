'use client';

import { useState, useEffect } from 'react';
import * as xlsx from 'xlsx';
import { 
  searchEligibility, 
  saveSingleEligibility, 
  deleteSingleEligibility, 
  checkEligibilityDuplicates, 
  importEligibilityData 
} from '../actions';

export default function EligibilityManager() {
  // Main view state
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Manual Add Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    id: null as number | null,
    memberId: '',
    idCard: '',
    name: '',
    canVote: true,
    canAttend: true,
    pollingStation: '',
    organization: '',
    remark: ''
  });

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [uploadMode, setUploadMode] = useState<'append' | 'overwrite'>('append');
  const [processingFile, setProcessingFile] = useState(false);

  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await searchEligibility(query, 0, 50);
      setMembers(res.data);
      setTotalCount(res.total);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveSingleEligibility(manualForm);
      alert('บันทึกข้อมูลสำเร็จ');
      setShowManualModal(false);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายชื่อนี้?')) {
      try {
        await deleteSingleEligibility(id);
        fetchData();
      } catch (e) {
        alert('ลบล้มเหลว');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingFile(true);
    try {
      const bytes = await file.arrayBuffer();
      const workbook = xlsx.read(bytes, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = xlsx.utils.sheet_to_json(sheet) as any[];

      const parsed = rawData.map(row => {
        const canVoteStr = (row['สิทธิเลือกตั้ง'] || row['canVote'])?.toString().trim();
        const canAttendStr = (row['สิทธิประชุม'] || row['canAttend'])?.toString().trim();
        return {
          memberId: (row['เลขสมาชิก'] || row['memberId'])?.toString().trim(),
          idCard: (row['เลขบัตรประชาชน'] || row['idCard'])?.toString().trim(),
          name: (row['ชื่อ-สกุล'] || row['name'])?.toString().trim(),
          pollingStation: (row['หน่วยเลือกตั้ง'] || row['pollingStation'])?.toString().trim() || '',
          organization: (row['สังกัด'] || row['organization'])?.toString().trim() || '',
          canVote: canVoteStr === '1' || canVoteStr?.toLowerCase() === 'true' || canVoteStr === 'มีสิทธิ' || canVoteStr === 'มี' || true,
          canAttend: canAttendStr === '1' || canAttendStr?.toLowerCase() === 'true' || canAttendStr === 'มีสิทธิ' || canAttendStr === 'มี' || true,
          remark: (row['หมายเหตุ'] || row['remark'])?.toString().trim() || ''
        };
      }).filter(r => r.memberId && r.name && r.idCard);

      setUploadData(parsed);
      
      // Check duplicates
      const dupes = await checkEligibilityDuplicates(parsed);
      setDuplicates(dupes);

    } catch (e: any) {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + e.message);
    }
    setProcessingFile(false);
  };

  const handleImport = async () => {
    if (uploadMode === 'overwrite' && !confirm('ข้อมูลเก่าทั้งหมดจะถูกลบและแทนที่ด้วยไฟล์นี้ ยืนยันหรือไม่?')) {
      return;
    }
    if (uploadMode === 'append' && duplicates.length > 0) {
      if (!confirm(`มีรายชื่อซ้ำในระบบ ${duplicates.length} รายการ หากดำเนินการต่อข้อมูลเก่าจะถูกอัปเดตทับ ยืนยันหรือไม่?`)) {
        return;
      }
    }

    setProcessingFile(true);
    try {
      const res = await importEligibilityData(uploadData, uploadMode);
      if (res.success) {
        alert(`นำเข้าข้อมูลสำเร็จ ${res.count} รายการ`);
        setShowUploadModal(false);
        setUploadData([]);
        setDuplicates([]);
        fetchData();
      }
    } catch (e: any) {
      alert('เกิดข้อผิดพลาด: ' + e.message);
    }
    setProcessingFile(false);
  };

  const openManualModal = (member?: any) => {
    if (member) {
      setManualForm(member);
    } else {
      setManualForm({
        id: null,
        memberId: '',
        idCard: '',
        name: '',
        canVote: true,
        canAttend: true,
        pollingStation: '',
        organization: '',
        remark: ''
      });
    }
    setShowManualModal(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="ค้นหา ชื่อ, เลขสมาชิก, เลขบัตรประชาชน..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ced4da' }}
        />
        <button onClick={() => openManualModal()} style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + เพิ่มรายชื่อ (1 คน)
        </button>
        <button onClick={() => setShowUploadModal(true)} style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + นำเข้า Excel
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
          <strong>แสดง {members.length} รายการ </strong> (จากทั้งหมดในระบบประมาณ {totalCount.toLocaleString()} รายการ)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#e9ecef' }}>
                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>เลขสมาชิก</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>เลขบัตรประชาชน</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>ชื่อ-สกุล</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>สิทธิเลือกตั้ง</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>สิทธิประชุม</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid #dee2e6' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลดข้อมูล...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>ไม่พบข้อมูลรายชื่อ</td></tr>
              ) : (
                members.map((m: any) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem' }}>{m.memberId}</td>
                    <td style={{ padding: '1rem' }}>{m.idCard}</td>
                    <td style={{ padding: '1rem' }}>{m.name}</td>
                    <td style={{ padding: '1rem', color: m.canVote ? '#28a745' : '#dc3545' }}>{m.canVote ? 'มีสิทธิ' : 'ไม่มีสิทธิ'}</td>
                    <td style={{ padding: '1rem', color: m.canAttend ? '#28a745' : '#dc3545' }}>{m.canAttend ? 'มีสิทธิ' : 'ไม่มีสิทธิ'}</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => openManualModal(m)} style={{ marginRight: '0.5rem', background: '#ffc107', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>แก้ไข</button>
                      <button onClick={() => handleDelete(m.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>ลบ</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add/Edit Modal */}
      {showManualModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{manualForm.id ? 'แก้ไขรายชื่อ' : 'เพิ่มรายชื่อใหม่'}</h3>
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>เลขสมาชิก *</label>
                <input required type="text" value={manualForm.memberId} onChange={e => setManualForm({...manualForm, memberId: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>เลขบัตรประชาชน *</label>
                <input required type="text" value={manualForm.idCard} onChange={e => setManualForm({...manualForm, idCard: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>ชื่อ-สกุล *</label>
                <input required type="text" value={manualForm.name} onChange={e => setManualForm({...manualForm, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={manualForm.canVote} onChange={e => setManualForm({...manualForm, canVote: e.target.checked})} />
                  สิทธิเลือกตั้ง
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={manualForm.canAttend} onChange={e => setManualForm({...manualForm, canAttend: e.target.checked})} />
                  สิทธิประชุมใหญ่
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>บันทึก</button>
                <button type="button" onClick={() => setShowManualModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Preview Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>นำเข้าข้อมูลจาก Excel / CSV</h3>
            
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} disabled={processingFile} style={{ flex: 1 }} />
              <select value={uploadMode} onChange={e => setUploadMode(e.target.value as any)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="append">เพิ่มข้อมูล (Append / Update)</option>
                <option value="overwrite">ลบของเก่าทิ้งทั้งหมดแล้วนำเข้า (Overwrite)</option>
              </select>
            </div>

            {processingFile && <p style={{ color: '#007bff' }}>กำลังประมวลผลไฟล์...</p>}

            {duplicates.length > 0 && uploadMode === 'append' && (
              <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', borderRadius: '4px', marginBottom: '1rem' }}>
                <strong>⚠️ แจ้งเตือนข้อมูลซ้ำซ้อน:</strong> พบข้อมูลที่มีเลขสมาชิกหรือบัตรประชาชนตรงกับในระบบจำนวน {duplicates.length} รายการ (เช่น {duplicates.slice(0,3).map(d => d.name).join(', ')}{duplicates.length > 3 ? '...' : ''}) 
                <br/>* หากกดยืนยัน ข้อมูลเดิมในระบบจะถูกอัปเดตทับด้วยข้อมูลในไฟล์นี้
              </div>
            )}

            {uploadData.length > 0 && (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>ตัวอย่างข้อมูลที่จะนำเข้า ({uploadData.length} รายการ)</h4>
                <div style={{ overflow: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#e9ecef', position: 'sticky', top: 0 }}>
                        <th style={{ padding: '0.5rem' }}>เลขสมาชิก</th>
                        <th style={{ padding: '0.5rem' }}>บัตรประชาชน</th>
                        <th style={{ padding: '0.5rem' }}>ชื่อ-สกุล</th>
                        <th style={{ padding: '0.5rem' }}>สิทธิ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadData.slice(0, 100).map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #dee2e6', background: duplicates.find(d => d.memberId === row.memberId || d.idCard === row.idCard) ? '#fff3cd' : 'transparent' }}>
                          <td style={{ padding: '0.5rem' }}>{row.memberId}</td>
                          <td style={{ padding: '0.5rem' }}>{row.idCard}</td>
                          <td style={{ padding: '0.5rem' }}>{row.name}</td>
                          <td style={{ padding: '0.5rem' }}>
                            {row.canVote ? '✅ เลือก ' : '❌ เลือก '}
                            {row.canAttend ? '✅ ประชุม' : '❌ ประชุม'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {uploadData.length > 100 && <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>* แสดงตัวอย่างเพียง 100 รายการแรก</p>}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleImport} disabled={processingFile || uploadData.length === 0} style={{ flex: 1, padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: (processingFile || uploadData.length === 0) ? 'not-allowed' : 'pointer' }}>
                ยืนยันการนำเข้าข้อมูล
              </button>
              <button type="button" onClick={() => { setShowUploadModal(false); setUploadData([]); setDuplicates([]); }} style={{ flex: 1, padding: '0.75rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
