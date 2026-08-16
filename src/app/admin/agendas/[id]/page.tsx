import { prisma } from '@/lib/prisma';
import { saveAgenda } from '../actions';
import AgendaForm from '../AgendaForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const agenda = await prisma.agenda.findUnique({
    where: { id: parseInt(resolvedParams.id) }
  });

  if (!agenda) {
    notFound();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>แก้ไขวาระการประชุมที่ {agenda.number}</h2>
        <Link href="/admin/agendas" style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          ย้อนกลับ
        </Link>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
        <AgendaForm action={saveAgenda} initialData={agenda} />
      </div>
    </div>
  );
}
