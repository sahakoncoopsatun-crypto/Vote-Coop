import { saveAgenda } from '../actions';
import AgendaForm from '../AgendaForm';
import Link from 'next/link';

export default function CreateAgendaPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>เพิ่มวาระการประชุมใหม่</h2>
        <Link href="/admin/agendas" style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          ย้อนกลับ
        </Link>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #ddd' }}>
        <AgendaForm action={saveAgenda} />
      </div>
    </div>
  );
}
