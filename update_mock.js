const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateMockData() {
  await prisma.candidate.deleteMany(); // Clear old ones

  await prisma.candidate.createMany({
    data: [
      { 
        name: 'นายแพทย์ อนันต์ บุญรักษา', 
        position: 'ประธานกรรมการ', 
        number: 1, 
        vision: 'สานต่อความมั่นคง มุ่งสู่อนาคตที่ยั่งยืน', 
        policy: 'เพิ่มเงินปันผล 6.5%, ลดดอกเบี้ยเงินกู้เหลือ 4.5%, เพิ่มสวัสดิการรักษาพยาบาล',
        imageUrl: '/images/candidate1.jpg',
        votes: 12543,
        isWinner: true
      },
      { 
        name: 'พญ. วิภาวดี ศรีสตูล', 
        position: 'ประธานกรรมการ', 
        number: 2, 
        vision: 'โปร่งใส ตรวจสอบได้ ใส่ใจทุกเสียงของสมาชิก', 
        policy: 'ขยายวงเงินกู้ฉุกเฉิน, สร้างแอปพลิเคชันสหกรณ์บนมือถือ, ตั้งกองทุนช่วยเหลือสมาชิก',
        imageUrl: '/images/candidate2.jpg',
        votes: 11200,
        isWinner: false
      },
      { 
        name: 'นาย สมศักดิ์ เกียรติภูมิ', 
        position: 'ประธานกรรมการ', 
        number: 3, 
        vision: 'สหกรณ์ยุคใหม่ ก้าวไกลด้วยเทคโนโลยี', 
        policy: 'ปรับโครงสร้างหนี้, อนุมัติเงินกู้ออนไลน์, เพิ่มทุนเรือนหุ้นขั้นต่ำ',
        imageUrl: '/images/candidate3.jpg',
        votes: 9870,
        isWinner: false
      },
      // Committee Hospital
      { 
        name: 'นาย ประเสริฐ รักดี', 
        position: 'กรรมการหน่วยโรงพยาบาลสตูล', 
        number: 1, 
        vision: 'เป็นปากเป็นเสียงให้พี่น้อง รพ.สตูล', 
        policy: 'เพิ่มงบสวัสดิการหน่วย, จัดอบรมการเงิน',
        imageUrl: '',
        votes: 4500,
        isWinner: true
      },
      // Committee SSJ
      { 
        name: 'นาง สุดารัตน์ มั่นคง', 
        position: 'กรรมการหน่วยสำนักงานสาธารณสุขจังหวัดสตูล', 
        number: 1, 
        vision: 'ดูแลสวัสดิการ สสอ. และ สสจ. อย่างทั่วถึง', 
        policy: 'เพิ่มโควต้ากู้ฉุกเฉินสำหรับหน่วย',
        imageUrl: '',
        votes: 3800,
        isWinner: true
      }
    ]
  });
  console.log('Mock data updated with images and detailed info.');
}

updateMockData().then(() => prisma.$disconnect());
