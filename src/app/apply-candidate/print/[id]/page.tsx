import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';
import './print.css';
import { Sarabun } from 'next/font/google';

const sarabun = Sarabun({
  subsets: ['thai'],
  weight: ['400', '700'],
  display: 'swap',
});

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  if (isNaN(id)) {
    notFound();
  }

  const application = await prisma.candidateApplication.findUnique({
    where: { id }
  });

  if (!application) {
    notFound();
  }

  const nameParts = application.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const Row = ({ children, indent = false, marginTop = '10px' }: { children: React.ReactNode, indent?: boolean, marginTop?: string }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', marginTop, paddingLeft: indent ? '2.5cm' : '0' }}>
      {children}
    </div>
  );

  const Field = ({ children, flex = 1, minWidth }: { children?: React.ReactNode, flex?: number, minWidth?: string }) => (
    <span style={{ flex: flex, minWidth: minWidth, borderBottom: '1.5px dotted #000', textAlign: 'center', margin: '0 5px', display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <span className="fill-text" style={{ wordBreak: 'break-word', lineHeight: 1.2 }}>{children || '\u00A0'}</span>
    </span>
  );

  const renderMultiline = (text: string | null) => {
    return (
      <div className="dotted-bg">
        {text || ''}
      </div>
    );
  };

  return (
    <div className={`print-container ${sarabun.className}`}>
      <div className="no-print" style={{ maxWidth: '210mm', margin: '20px auto 0', display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
        <PrintButton />
      </div>

      {/* PAGE 1 */}
      <div className="a4-page">
        {/* Header */}
        <div style={{ textAlign: 'center', fontSize: '20pt', fontWeight: 'bold', marginBottom: '20px' }}>
          สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ประจำปี ๒๕๖๙
        </div>
        
        <div style={{ display: 'flex', marginTop: '1.5cm' }}>
          <div style={{ flex: 1 }}>
            <Row indent>
              <span style={{ whiteSpace: 'nowrap' }}>
                ข้าพเจ้า (
                <span style={{ textDecoration: application.title && application.title !== 'นาย' ? 'line-through' : 'none' }}>นาย</span>/
                <span style={{ textDecoration: application.title && application.title !== 'นาง' ? 'line-through' : 'none' }}>นาง</span>/
                <span style={{ textDecoration: application.title && application.title !== 'นางสาว' ? 'line-through' : 'none' }}>นางสาว</span>
                )
              </span>
              <Field>{firstName}</Field>
              <span style={{ whiteSpace: 'nowrap' }}>นามสกุล</span><Field>{lastName}</Field>
            </Row>
            
            <Row>
              <span style={{ whiteSpace: 'nowrap' }}>อายุ</span><Field flex={0} minWidth="30px">{application.age}</Field><span style={{ whiteSpace: 'nowrap' }}>ปี</span>
              <span style={{ whiteSpace: 'nowrap' }}>สมาชิกเลขที่</span><Field>{application.memberId}</Field>
            </Row>

            <Row>
              <span style={{ whiteSpace: 'nowrap' }}>ที่อยู่ปัจจุบันเลขที่</span><Field flex={0} minWidth="60px">{application.address}</Field>
              <span style={{ whiteSpace: 'nowrap' }}>หมู่ที่</span><Field flex={0} minWidth="30px">{application.moo}</Field>
              <span style={{ whiteSpace: 'nowrap' }}>ถนน</span><Field>{application.road}</Field>
            </Row>
            
            <Row>
              <span style={{ whiteSpace: 'nowrap' }}>ตำบล</span><Field>{application.subDistrict}</Field>
              <span style={{ whiteSpace: 'nowrap' }}>อำเภอ</span><Field>{application.district}</Field>
              <span style={{ whiteSpace: 'nowrap' }}>จังหวัด</span><Field>{application.province}</Field>
            </Row>
          </div>

          <div style={{ width: '3.5cm', height: '4.5cm', border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginLeft: '10px' }}>
            {application.imageUrl ? (
              <img src={application.imageUrl} alt="Candidate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '12pt', color: '#666' }}>ติดรูปถ่าย<br/>ขนาด 1.5 นิ้ว</span>
            )}
          </div>
        </div>
        
        <div>
          <Row>
            <span style={{ whiteSpace: 'nowrap' }}>สถานที่ทำงานปัจจุบัน (หน่วยงาน)</span><Field>{application.workplace}</Field>
            <span style={{ whiteSpace: 'nowrap' }}>ตำแหน่ง</span><Field>{application.jobTitle}</Field>
          </Row>
          <Row>
            <span style={{ whiteSpace: 'nowrap' }}>มือถือ</span><Field flex={0} minWidth="100px">{application.phone}</Field>
            <span style={{ whiteSpace: 'nowrap' }}>ID Line</span><Field flex={0} minWidth="100px">{application.idLine}</Field>
          </Row>

          <Row indent marginTop="15px">
            มีความประสงค์จะสมัครเพื่อรับการเลือกตั้งเป็นคณะกรรมการดำเนินการสหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ประจำปี ๒๕๖๙
          </Row>

          <div className="indent" style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'ประธานกรรมการ' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ประธานกรรมการดำเนินการ</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'กรรมการ รพ.สตูล' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ผู้สมัครกรรมการดำเนินการ หน่วย รพ.สตูล</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'กรรมการ สสอ.' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ผู้สมัครกรรมการดำเนินการ หน่วย สสอ.สตูล</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'ผู้ตรวจสอบกิจการ' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ผู้ตรวจสอบกิจการ</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
          </div>

          <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '15px' }}>ประวัติโดยสังเขป</div>
          
          <Row>
            <span>1. วุฒิการศึกษาสูงสุด</span><Field>{application.educationLevel}</Field>
            <span>สาขา</span><Field>{application.educationMajor}</Field>
            <span>สถาบัน</span><Field>{application.educationInst}</Field>
          </Row>
          
          <div style={{ marginTop: '10px' }}>
            2. ประวัติการทำงาน
            <div style={{ paddingLeft: '15px' }}>
               {renderMultiline(application.workHistory)}
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            3. นโยบาย/แนวคิด ในการที่จะบริหารงานสหกรณ์ (ไม่ใช้คำที่มีลักษณะส่อเสียด ให้ร้าย กล่าวหา ไม่สุภาพ หรือทำให้เกิดความเสียหายต่อชื่อเสียงของสหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด)
            <div style={{ paddingLeft: '15px' }}>
               {renderMultiline(application.policy)}
            </div>
          </div>

          <div className="indent" style={{ marginTop: '15px', textAlign: 'justify' }}>
            ข้าพเจ้าขอรับรองว่าข้อความตามใบสมัครนี้เป็นความจริงทุกประการ และมีคุณสมบัติครบถ้วนตามพระราชบัญญัติสหกรณ์ พ.ศ. ๒๕๔๒ และที่แก้ไขเพิ่มเติม (ฉบับที่ ๒) พ.ศ. ๒๕๕๓ และ (ฉบับที่ ๓) พ.ศ. ๒๕๖๒ รวมทั้งเป็นไปตามข้อบังคับของสหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด พ.ศ. ๒๕๖๗ ข้อ ๗๓ และข้อ ๗๔ พร้อมทั้งยินยอมให้สหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด เปิดเผยข้อมูลเพื่อประกอบการทำธุรกรรม จึงลงลายมือชื่อไว้เป็นหลักฐาน
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <div style={{ textAlign: 'center', width: '8cm' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                 <span>ลงชื่อ</span><Field></Field><span>ผู้สมัคร</span>
              </div>
              <div style={{ marginTop: '10px' }}>( <span className="fill-text">{application.name}</span> )</div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px' }}>
                 <span>วันที่</span><Field flex={0} minWidth="30px"></Field>
                 <span>เดือน</span><Field></Field>
                 <span>พ.ศ.</span><Field flex={0} minWidth="40px"></Field>
              </div>
            </div>
          </div>

          <div style={{ textDecoration: 'underline', fontWeight: 'bold', marginTop: '20px' }}>สมาชิกรับรอง ( ๓ คน )</div>
          
          <Row>
            <span>1. ชื่อ</span><Field>{application.guarantee1Name}</Field>
            <span>สมาชิกเลขที่</span><Field flex={0} minWidth="80px">{application.guarantee1Id}</Field>
            <span>ลายมือชื่อ</span><Field></Field>
          </Row>
          <Row>
            <span>2. ชื่อ</span><Field>{application.guarantee2Name}</Field>
            <span>สมาชิกเลขที่</span><Field flex={0} minWidth="80px">{application.guarantee2Id}</Field>
            <span>ลายมือชื่อ</span><Field></Field>
          </Row>
          <Row>
            <span>3. ชื่อ</span><Field>{application.guarantee3Name}</Field>
            <span>สมาชิกเลขที่</span><Field flex={0} minWidth="80px">{application.guarantee3Id}</Field>
            <span>ลายมือชื่อ</span><Field></Field>
          </Row>
          
          <div style={{ textAlign: 'right', borderTop: '1px dashed #ccc', marginTop: '30px', paddingTop: '10px', fontSize: '14pt', color: '#666' }}>
            /สำหรับเจ้าหน้าที่...
          </div>
        </div>
      </div>

      {/* PAGE 2 (For Staff) */}
      <div className="a4-page">
        <div style={{ textAlign: 'justify' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '15px', textDecoration: 'underline' }}>ส่วนของเจ้าหน้าที่ผู้รับสมัคร</div>
          <div className="indent">
            ได้รับใบสมัครรับเลือกตั้งเป็นคณะกรรมการดำเนินการสหกรณ์ออมทรัพย์สาธารณสุขสตูล จำกัด ประจำปี ๒๕๖๙
          </div>
          
          <Row marginTop="15px">
            <span>ของ (นาย/นาง/นางสาว)</span><Field>{application.name}</Field>
            <span>เมื่อวันที่</span><Field flex={0} minWidth="40px"></Field>
            <span>เดือน</span><Field flex={0} minWidth="80px"></Field>
            <span>พ.ศ.</span><Field flex={0} minWidth="40px"></Field>
            <span>เวลา</span><Field flex={0} minWidth="50px"></Field><span>น.</span>
          </Row>

          <div className="indent" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'ประธานกรรมการ' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ประธานกรรมการดำเนินการ</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'กรรมการ รพ.สตูล' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ผู้สมัครกรรมการดำเนินการ หน่วย รพ.สตูล</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'กรรมการ สสอ.' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ผู้สมัครกรรมการดำเนินการ หน่วย สสอ.สตูล</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '18px', height: '18px', border: '1px solid #000', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14pt' }}>
                {application.position === 'ผู้ตรวจสอบกิจการ' ? '✓' : ''}
              </div>
              <div style={{ width: '300px' }}>ผู้ตรวจสอบกิจการ</div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>หมายเลข</span><Field flex={1}></Field>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>พร้อมเอกสารดังต่อไปนี้</div>
          <div className="indent" style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '15px', height: '15px', border: '1px solid #000', marginRight: '10px' }}></div>
              <div>ค่าธรรมเนียมสมัคร ๕๐๐ บาท (ห้าร้อยบาทถ้วน)</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '15px', height: '15px', border: '1px solid #000', marginRight: '10px' }}></div>
              <div>รูปถ่ายหน้าตรง ขนาด ๑.๕ นิ้ว จำนวน ๒ รูป</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '15px', height: '15px', border: '1px solid #000', marginRight: '10px' }}></div>
              <div>สำเนาบัตรประจำตัวประชาชน / สำเนาบัตรข้าราชการ</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ width: '15px', height: '15px', border: '1px solid #000', marginRight: '10px' }}></div>
              <div style={{ display: 'flex', flex: 1, alignItems: 'baseline' }}>
                <span>อื่นๆ (ระบุ)</span><Field flex={1}></Field>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '60px' }}>
            <div style={{ textAlign: 'center', width: '8cm' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                 <span>ลงชื่อ</span><Field></Field><span>ผู้รับสมัคร</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '10px' }}>
                 <span>(</span><Field></Field><span>)</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
