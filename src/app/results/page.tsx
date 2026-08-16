import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const POSITION_LABELS: Record<string, string> = {
  'President': 'ประธานกรรมการ',
  'Committee-Hospital': 'กรรมการ (หน่วยโรงพยาบาลสตูล)',
  'Committee-SSJ': 'กรรมการ (หน่วยสำนักงานสาธารณสุขจังหวัดสตูล)',
  'Auditor': 'ผู้ตรวจสอบกิจการ'
};

export default async function ElectionResults() {
  const candidates = await prisma.candidate.findMany({
    orderBy: [
      { position: 'asc' }, 
      { votes: 'desc' }, 
      { number: 'asc' }
    ]
  });

  const groupedCandidates = candidates.reduce((acc, cand) => {
    if (!acc[cand.position]) acc[cand.position] = [];
    acc[cand.position].push(cand);
    return acc;
  }, {} as Record<string, typeof candidates>);

  const positions = ['President', 'Committee-Hospital', 'Committee-SSJ', 'Auditor'];

  // Determine the max votes for progress bar scaling
  const maxVotes = candidates.length > 0 ? Math.max(...candidates.map(c => c.votes)) : 1;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '2rem' }}>
        📊 ผลการนับคะแนนเลือกตั้ง
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        (อัปเดตข้อมูลแบบเรียลไทม์)
      </p>

      {positions.map(pos => {
        const cands = groupedCandidates[pos] || [];
        if (cands.length === 0) return null;

        return (
          <div key={pos} style={{ 
            marginBottom: '4rem', 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            boxShadow: 'var(--shadow)' 
          }}>
            <h2 style={{ 
              margin: '0 0 2rem 0', 
              color: 'var(--primary-color)', 
              borderBottom: '2px solid #eee',
              paddingBottom: '1rem'
            }}>
              {POSITION_LABELS[pos]}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cands.map((cand, index) => {
                const percentage = maxVotes > 0 ? (cand.votes / maxVotes) * 100 : 0;
                
                return (
                  <div key={cand.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem',
                    padding: '1rem',
                    background: cand.isWinner ? '#f0fdf4' : 'transparent',
                    border: cand.isWinner ? '2px solid #4ade80' : '1px solid transparent',
                    borderRadius: '8px',
                    position: 'relative'
                  }}>
                    
                    {/* Winner Crown */}
                    {cand.isWinner && (
                      <div style={{ position: 'absolute', top: '-15px', right: '15px', fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                        👑
                      </div>
                    )}

                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%', 
                      background: '#e2e8f0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      {cand.imageUrl ? (
                        <Image src={cand.imageUrl} alt={cand.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>👤</span>
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                          <span style={{ color: 'var(--secondary-color)', marginRight: '8px' }}>เบอร์ {cand.number}</span>
                          {cand.name}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                          {cand.votes.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 'normal' }}>คะแนน</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          background: cand.isWinner ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'var(--primary-gradient)',
                          transition: 'width 1s ease-in-out'
                        }}></div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
