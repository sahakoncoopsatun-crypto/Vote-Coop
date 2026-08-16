import { prisma } from '@/lib/prisma';
import { saveCandidate } from '../../actions';
import CandidateForm from '../CandidateForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const candidateId = parseInt(resolvedParams.id);
  if (isNaN(candidateId)) return notFound();

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId }
  });

  if (!candidate) return notFound();

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>แก้ไขข้อมูลผู้สมัคร (เบอร์ {candidate.number})</h2>
      <CandidateForm action={saveCandidate} candidate={candidate} />
    </div>
  );
}
