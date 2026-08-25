import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-center mb-8" style={{ color: 'var(--primary-color)' }}>
        ข่าวสารและประกาศ
      </h1>

      {news.length === 0 ? (
        <div className="glass-panel text-center text-light">
          ยังไม่มีข่าวสารในขณะนี้
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {news.map((item) => (
            <div key={item.id} className="card">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }} />
              )}
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 className="card-title" style={{ margin: 0 }}>{item.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>
                    {new Date(item.createdAt).toLocaleDateString('th-TH', { 
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{item.content}</p>
                {item.fileUrl && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                    {item.fileUrl.toLowerCase().endsWith('.pdf') ? (
                      <div style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', height: '500px' }}>
                        <iframe src={item.fileUrl} width="100%" height="100%" style={{ border: 'none' }} title="PDF Document" />
                      </div>
                    ) : (
                      <a href={item.fileUrl} download="�͡��â������" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        📎 ดาวน์โหลดไฟล์แนบ
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
