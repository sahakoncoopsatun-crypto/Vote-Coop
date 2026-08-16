import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  'President': 'ประธานกรรมการ',
  'Committee-Hospital': 'กรรมการ (หน่วยโรงพยาบาลสตูล)',
  'Committee-SSJ': 'กรรมการ (หน่วยสำนักงานสาธารณสุขจังหวัดสตูล)',
  'Auditor': 'ผู้ตรวจสอบกิจการ'
};

export default async function CandidatesDirectory() {
  const candidates = await prisma.candidate.findMany({
    orderBy: [{ position: 'asc' }, { number: 'asc' }]
  });

  const groupedCandidates = candidates.reduce((acc, cand) => {
    if (!acc[cand.position]) acc[cand.position] = [];
    acc[cand.position].push(cand);
    return acc;
  }, {} as Record<string, typeof candidates>);

  const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '2rem' }}>
        ทำเนียบผู้สมัครรับเลือกตั้ง
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด
      </p>

      {positions.map(pos => {
        const cands = groupedCandidates[pos] || [];
        if (cands.length === 0) return null;

        return (
          <div key={pos} style={{ marginBottom: '4rem' }}>
            <h2 style={{ 
              marginBottom: '2rem', 
              color: 'var(--primary-color)', 
              borderBottom: '3px solid var(--secondary-color)',
              paddingBottom: '0.5rem',
              display: 'inline-block'
            }}>
              {POSITION_LABELS[pos]}
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {cands.map(cand => (
                <div key={cand.id} style={{ 
                  background: 'var(--glass-bg)', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--glass-border)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', height: '250px', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {cand.imageUrl ? (
                      <Image src={cand.imageUrl} alt={cand.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ fontSize: '4rem' }}>👤</div>
                    )}
                    
                    {/* Candidate Number Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'var(--secondary-color)',
                      color: 'white',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                    }}>
                      {cand.number}
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', color: 'var(--text-main)' }}>
                      {cand.name}
                    </h3>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>วิสัยทัศน์:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                        {cand.vision || '-'}
                      </p>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>นโยบาย:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                        {cand.policy || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
