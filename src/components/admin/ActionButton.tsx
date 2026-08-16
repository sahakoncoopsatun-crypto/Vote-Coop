'use client';

import Swal from 'sweetalert2';

interface ActionButtonProps {
  action: () => Promise<void>;
  label: string;
  confirmTitle: string;
  confirmText: string;
  successText: string;
  color?: string;
  icon?: 'warning' | 'question' | 'info';
  isSubmit?: boolean;
}

export default function ActionButton({ 
  action, 
  label, 
  confirmTitle, 
  confirmText, 
  successText, 
  color = '#0d6efd',
  icon = 'question',
  isSubmit = false
}: ActionButtonProps) {
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: color,
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'ใช่, ดำเนินการ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'กำลังประมวลผล...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        await action();
        Swal.fire({
          title: 'สำเร็จ!',
          text: successText,
          icon: 'success',
          confirmButtonColor: '#198754'
        });
      } catch (error: any) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: error.message || 'ไม่สามารถทำรายการได้',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    }
  };

  return (
    <button 
      type={isSubmit ? "button" : "button"} 
      onClick={handleClick} 
      style={{ 
        padding: '0.25rem 0.5rem', 
        background: color, 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '0.8rem' 
      }}
    >
      {label}
    </button>
  );
}
