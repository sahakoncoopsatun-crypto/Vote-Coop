import { saveCandidate } from '../../actions';
import CandidateForm from '../CandidateForm';

export default function CreateCandidatePage() {
  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>เพิ่มผู้สมัครใหม่</h2>
      <CandidateForm action={saveCandidate} />
    </div>
  );
}
