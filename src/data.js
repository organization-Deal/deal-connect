export const seedCustomers = [
{id:'CUS-0001',name:'กิตติพงษ์ วัฒนกิจ',email:'kitti.demo@example.com',phone:'081-234-5678',type:'นักลงทุน',holdings:5,locations:3,status:'Active',joined:'12 ม.ค. 2568',line:true},
{id:'CUS-0002',name:'ณัฐชา ศรีสมบัติ',email:'natcha.demo@example.com',phone:'089-345-6789',type:'นักลงทุน / เจ้าของสถานที่',holdings:8,locations:4,status:'Active',joined:'03 มี.ค. 2568',line:true},
{id:'CUS-0003',name:'ธนกร ภูมิใจ',email:'thanakorn.demo@example.com',phone:'',type:'นักลงทุน',holdings:2,locations:2,status:'Active',joined:'22 มิ.ย. 2568',line:false},
{id:'CUS-0004',name:'พิมพ์ชนก ตั้งมั่น',email:'pimchanok.demo@example.com',phone:'086-456-7890',type:'เจ้าของสถานที่',holdings:0,locations:2,status:'Active',joined:'17 ส.ค. 2568',line:true},
{id:'CUS-0005',name:'วรเมธ รุ่งเรือง',email:'',phone:'',type:'นักลงทุน',holdings:3,locations:2,status:'Active',joined:'09 ก.ย. 2568',line:false},
{id:'CUS-0006',name:'อรทัย มณีวงศ์',email:'orathai.demo@example.com',phone:'082-567-8901',type:'นักลงทุน',holdings:1,locations:1,status:'Active',joined:'14 ต.ค. 2568',line:true},
{id:'CUS-0007',name:'ภัทรพล ใจดี',email:'pat.demo@example.com',phone:'084-678-9012',type:'นักลงทุน',holdings:4,locations:3,status:'Active',joined:'20 พ.ย. 2568',line:false},
{id:'CUS-0008',name:'มนัสวี แสงทอง',email:'manaswee.demo@example.com',phone:'087-789-0123',type:'เจ้าของสถานที่',holdings:0,locations:1,status:'Active',joined:'11 ธ.ค. 2568',line:true}
];
export const seedAssets = [
{id:'LOC-0195',name:'ตู้ชกมวย No.195',kind:'ตู้ชกมวย',location:'กรุงเทพฯ · อารีย์',percent:25,status:'เปิดให้บริการ',income:12800,project:'Boxing Arcade'},
{id:'LOC-0182',name:'ตู้ชกมวย No.182',kind:'ตู้ชกมวย',location:'สมุทรปราการ · บางปู',percent:15,status:'เปิดให้บริการ',income:9400,project:'Boxing Arcade'},
{id:'LOC-0210',name:'ตู้พ่นน้ำหอม No.210',kind:'ตู้พ่นน้ำหอม',location:'กรุงเทพฯ · ทองหล่อ',percent:10,status:'เปิดให้บริการ',income:7200,project:'Perfume Station'},
{id:'LOC-0318',name:'Human Allowed (1)',kind:'บ้านพักรายวัน',location:'เชียงใหม่ · สะพานนวรัฐ',percent:10,status:'กำลังดำเนินงาน',income:0,project:'Human Allowed'},
{id:'LOC-0151',name:'JENnie Café No.151',kind:'ตู้กาแฟ',location:'กรุงเทพฯ · สุขุมวิท',percent:20,status:'เปิดให้บริการ',income:15300,project:'JENnie Café'},
{id:'LOC-0202',name:'ตู้ถ่ายภาพ No.202',kind:'Photo Booth',location:'กรุงเทพฯ · สยาม',percent:12,status:'เปิดให้บริการ',income:8600,project:'Photo Booth'}
];
export const seedCases = [
{id:'PX-2026-0148',title:'เครื่องรับเหรียญไม่ตอบสนอง',category:'แจ้งซ่อม',location:'ตู้ชกมวย No.195 · อารีย์',customer:'CUS-0001',status:'กำลังดำเนินการ',priority:'สูง',owner:'ทีมช่าง A',updated:'วันนี้ 14:20'},
{id:'PX-2026-0147',title:'ขอเปลี่ยนป้ายประชาสัมพันธ์',category:'คำขอทั่วไป',location:'ตู้พ่นน้ำหอม No.210',customer:'CUS-0001',status:'รอตรวจสอบ',priority:'ปกติ',owner:'ทีม PX',updated:'วันนี้ 11:05'},
{id:'PX-2026-0144',title:'ตรวจสอบยอดรายได้ประจำเดือน',category:'ปัญหาการชำระเงิน',location:'JENnie Café No.151',customer:'CUS-0002',status:'กำลังดำเนินการ',priority:'ปกติ',owner:'Accounting',updated:'เมื่อวาน'},
{id:'PX-2026-0139',title:'ย้ายเครื่องไปตำแหน่งใหม่',category:'ย้ายโลเคชั่น',location:'ตู้ชกมวย No.182',customer:'CUS-0002',status:'รออะไหล่',priority:'ปกติ',owner:'Operation',updated:'2 พ.ย. 2569'},
{id:'PX-2026-0132',title:'ตรวจสอบการเชื่อมต่อระบบ',category:'อื่น ๆ',location:'Human Allowed (1)',customer:'CUS-0003',status:'เสร็จสิ้น',priority:'ต่ำ',owner:'System',updated:'31 ต.ค. 2569'}
];
export const seedVotes = [
{id:'VOTE-026',title:'สำรวจความคิดเห็นเรื่องเวลาเปิดให้บริการ',location:'ตู้ชกมวย No.195 · อารีย์',type:'สำรวจความคิดเห็น',closes:'10 พ.ย. 2569',yes:64,no:18,pending:18,status:'เปิดโหวต',weighting:'หนึ่งคนหนึ่งเสียง'},
{id:'VOTE-025',title:'ข้อเสนอการปรับปรุงพื้นที่ติดตั้ง',location:'ตู้ชกมวย No.182 · บางปู',type:'ลงมติผู้ถือสิทธิ์',closes:'ปิดแล้ว · 2 พ.ย. 2569',yes:72,no:18,pending:10,status:'ปิดแล้ว',weighting:'ตามสัดส่วนถือครอง'}
];
export const seedNotices = [
{id:'ANN-041',title:'รายงานผลการดำเนินงานประจำเดือนตุลาคม',body:'รายงานสรุปผลการดำเนินงานและข้อมูลที่เกี่ยวข้องกับทรัพย์สินของคุณพร้อมให้ตรวจสอบแล้ว',audience:'ลูกค้าทุกคน',date:'วันนี้ 09:00',status:'เผยแพร่',read:false},
{id:'ANN-040',title:'แจ้งกำหนดการบำรุงรักษาระบบ',body:'ระบบรายงานจะปิดปรับปรุงชั่วคราวในช่วงเวลาที่กำหนด',audience:'ผู้ถือสิทธิ์ Boxing Arcade',date:'2 พ.ย. 2569',status:'เผยแพร่',read:true},
{id:'ANN-039',title:'เปิดรับความคิดเห็นโครงการ',body:'ร่วมแสดงความคิดเห็นต่อแนวทางการพัฒนาโลเคชั่น',audience:'เจ้าของ No.182',date:'31 ต.ค. 2569',status:'เผยแพร่',read:true}
];
export const seedConnections = [
{id:'REQ-1024',name:'กิตติพงษ์ วัฒนกิจ',email:'kitti.demo@example.com',phone:'081-234-5678',submitted:'วันนี้ 14:12',candidate:'CUS-0001',status:'รอตรวจสอบ',reason:'ชื่อและอีเมลตรงกับทะเบียน'},
{id:'REQ-1023',name:'ณัฐชา ศรีสมบัติ',email:'natcha.demo@example.com',phone:'089-345-6789',submitted:'วันนี้ 12:48',candidate:'CUS-0002',status:'รอตรวจสอบ',reason:'พบผู้สมัครที่ตรงกัน 1 ราย'},
{id:'REQ-1022',name:'ธนกร ภูมิใจ',email:'thanakorn.new@example.com',phone:'081-000-1234',submitted:'เมื่อวาน 16:30',candidate:'CUS-0003',status:'ต้องตรวจเพิ่ม',reason:'อีเมลไม่ตรงกับข้อมูลเดิม'},
{id:'REQ-1021',name:'วรเมธ รุ่งเรือง',email:'',phone:'',submitted:'1 พ.ย. 2569',candidate:'',status:'ไม่พบข้อมูล',reason:'ไม่มีช่องทางติดต่อเดิมให้ตรวจสอบ'}
];
