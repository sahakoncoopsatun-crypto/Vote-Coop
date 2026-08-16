import { saveNews } from '../../actions';
import NewsForm from '../NewsForm';

export default function CreateNewsPage() {
  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>เพิ่มข่าวสาร/ประกาศใหม่</h2>
      <NewsForm action={saveNews} />
    </div>
  );
}
