import { prisma } from '@/lib/prisma';
import { saveNews } from '../../actions';
import NewsForm from '../NewsForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const newsId = parseInt(resolvedParams.id);
  if (isNaN(newsId)) return notFound();

  const newsItem = await prisma.news.findUnique({
    where: { id: newsId }
  });

  if (!newsItem) return notFound();

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>แก้ไขข่าวสาร/ประกาศ</h2>
      <NewsForm action={saveNews} newsItem={newsItem} />
    </div>
  );
}
