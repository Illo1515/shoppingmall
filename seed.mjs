import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwzarlqjvtkhnengccix.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key
const supabase = createClient(supabaseUrl, supabaseKey);

const dummyProducts = [
  { name: '미니멀 무선 헤드폰 PRO', description: '토스 스타일 화이트 헤드폰. 완벽한 노이즈 캔슬링.', price: 299000, category: '가전/디지털', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80' },
  { name: '오가닉 코튼 릴렉스 티셔츠', description: '피부에 닿는 부드러운 감촉. 데일리 웨어로 완벽합니다.', price: 35000, category: '패션/의류', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
  { name: '스마트 데스크 램프', description: '눈이 편안한 색온도 조절 기능이 탑재된 스마트 조명.', price: 89000, category: '라이프스타일', image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80' },
  { name: '포터블 에스프레소 메이커', description: '어디서든 완벽한 크레마를 즐기세요.', price: 120000, category: '주방/커피', image_url: 'https://images.unsplash.com/photo-1520288349258-dcf259bd77bb?w=800&q=80' },
  { name: '프리미엄 세라믹 머그컵', description: '견고하고 아름다운 디자인의 수공예 머그.', price: 24000, category: '라이프스타일', image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80' },
  { name: '스마트 워치 시리즈 8', description: '당신의 모든 일상을 트래킹하는 가장 완벽한 시계.', price: 450000, category: '가전/디지털', image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80' },
  { name: '천연 가죽 패스포트 지갑', description: '여행의 품격을 높여주는 클래식 디자인.', price: 55000, category: '패션/잡화', image_url: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=800&q=80' },
  { name: '초경량 티타늄 텀블러', description: '24시간 보온보냉 유지. 무게를 최소화했습니다.', price: 42000, category: '아웃도어', image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80' },
  { name: '에르고노믹 오피스 체어', description: '허리를 완벽하게 받쳐주는 인체공학적 설계.', price: 320000, category: '가구/인테리어', image_url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80' },
  { name: '클래식 캔버스 스니커즈', description: '어떤 착장에도 어울리는 깔끔한 화이트 스니커즈.', price: 89000, category: '패션/신발', image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
  { name: '무소음 기계식 키보드', description: '사무실에서도 눈치보지 않고 쓰는 프리미엄 타건감.', price: 165000, category: '가전/디지털', image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80' },
  { name: '100% 퓨어 실크 파자마', description: '최상의 수면을 위한 부드러운 실크 나이트웨어.', price: 145000, category: '의류/속옷', image_url: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=800&q=80' },
  { name: '히말라야 핑크 솔트 디퓨저', description: '은은한 향과 함께 인테리어 오브제로 완벽합니다.', price: 38000, category: '라이프스타일', image_url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80' },
  { name: '프리미엄 노이즈캔슬링 이어폰', description: '완벽한 몰입을 위한 차세대 TWS 이어폰.', price: 219000, category: '가전/디지털', image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80' },
  { name: '심플 슬리브 랩탑 파우치', description: '충격 보호 기능이 강화된 미니멀 파우치.', price: 45000, category: '패션/잡화', image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80' },
  { name: '멀티비타민 구미 베어', description: '맛있게 챙기는 하루 활력. (30일분)', price: 28000, category: '식품/영양', image_url: 'https://images.unsplash.com/photo-1577003444985-055ee1feeb1b?w=800&q=80' },
  { name: '우드 텍스처 요가 매트', description: '미끄럼 방지 처리된 친환경 TPE 요가매트.', price: 54000, category: '스포츠/레저', image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
  { name: '미도리 트래블러스 노트', description: '시간이 지날수록 멋이 더해지는 빈티지 가죽 노트.', price: 68000, category: '문구/오피스', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80' }
];

async function seed() {
  console.log('Clearing existing products...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  console.log('Inserting 18 dummy products...');
  const { data, error } = await supabase.from('products').insert(dummyProducts);
  
  if (error) {
    console.error('Error inserting products:', error);
  } else {
    console.log('Success! 18 products added to Database.');
  }
}

seed();
