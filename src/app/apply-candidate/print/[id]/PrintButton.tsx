'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      🖨️ พิมพ์ใบสมัคร
    </button>
  );
}
