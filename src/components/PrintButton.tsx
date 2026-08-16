'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== 'undefined') window.print();
      }}
      style={{ padding: '0.75rem 2rem', background: '#004a8f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
    >
      🖨️ สั่งพิมพ์หน้านี้
    </button>
  );
}
