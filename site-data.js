// User-requested preview data. Replace these samples with verified clubs before launch.
// Schema: { id, name, region, description, url, logo?, image?, isSample? }
// Set logo to a local image path (e.g. assets/clubs/team-a.png) or an official HTTPS URL. Empty logos show a placeholder. Samples have no real team logos or channels.
window.CLUBS = [
  { id: 'sample-a', name: '팀 A', region: '서울', url: '', logo: '', isSample: true },
  { id: 'sample-b', name: '팀 B', region: '경기', url: '', logo: '', isSample: true },
  { id: 'sample-c', name: '팀 C', region: '인천', url: '', logo: '', isSample: true },
  { id: 'sample-d', name: '팀 D', region: '부산', url: '', logo: '', isSample: true },
  { id: 'sample-e', name: '팀 E', region: '대구', url: '', logo: '', isSample: true },
  { id: 'sample-f', name: '팀 F', region: '대전', url: '', logo: '', isSample: true }
];

// User-approved hierarchy: SHOP > Hyperflite series > formulation, plus Goods.
// Formulations verified in https://hyperflite.com/ Discs menu on 2026-11-01.
// Korean SHOP selection updated 2026-11-21: no Macro; Nano Competition Standard only.
// The full manufacturer lineup remains in DISC_OVERVIEW_SPECS for the guide.
window.SHOP_MENU = [
  { id: 'alpha', label: 'Alpha', detail: '10″', formulations: ['Competition Standard', 'Jawz'] },
  { id: 'z-disc', label: 'Z-Disc', detail: '9.25″', formulations: ['Competition Standard', 'HyperFlex', 'Jawz', 'X-Comp'] },
  { id: 'k-10', label: 'K-10', detail: '8.75″', formulations: ['Competition Standard', 'FrostBite', 'HyperFlex', 'Jawz', 'SofFlite', 'X-Comp'] },
  { id: 'maxq', label: 'MaxQ', detail: '8.5″', formulations: ['Competition Standard', 'Jawz'] },
  { id: 'z-pup', label: 'Z-Pup', detail: '7.25″', formulations: ['Competition Standard', 'HyperFlex', 'Jawz', 'SofFlite'] },
  { id: 'pup', label: 'Pup', detail: '7″', formulations: ['Competition Standard', 'FrostBite', 'HyperFlex', 'Jawz', 'SofFlite', 'X-Comp'] },
  { id: 'nano', label: 'Nano', detail: '4″', formulations: ['Competition Standard'] },
  { id: 'goods', label: '굿즈', formulations: [] },
].map(({ formulations, ...series }) => ({
  ...series,
  items: formulations.map((label) => {
    const id = label.toLowerCase().replaceAll(' ', '-');
    return { id, label, source: `https://hyperflite.com/${series.id}-${id}-disc/` };
  }),
}));

// User-confirmed names; photos, specifications and prices are not supplied yet.
window.GOODS_PRODUCTS = [
  { id: 'goods-tshirt-2026', name: '스카이하운즈 코리아 2026 티셔츠', material: '티셔츠', keywords: '굿즈 티셔츠 티 T-shirt tshirt 2026 Skyhoundz Korea' },
  { id: 'goods-keyring', name: '스카이하운즈 코리아 키링', material: '키링', keywords: '굿즈 키링 열쇠고리 keyring keychain Skyhoundz Korea' },
].map((product) => ({
  ...product,
  family: 'goods',
  isGoods: true,
  image: '',
}));
