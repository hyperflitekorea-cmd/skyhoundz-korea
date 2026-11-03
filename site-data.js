// User-requested preview data. Replace these samples with verified clubs before launch.
// Schema: { id, name, region, description, url, logo?, image?, isSample? }
// Set logo to a local image path (e.g. assets/clubs/team-a.png) or an official HTTPS URL. Empty logos show a placeholder. Samples have no real team logos or channels.
window.CLUBS = [
  { id: 'sample-a', name: '팀 A', region: '서울', description: '클럽 소개가 들어갈 자리입니다. 함께하는 사람들과 팀의 이야기를 소개해요.', url: '', logo: '', isSample: true },
  { id: 'sample-b', name: '팀 B', region: '경기', description: '정기 모임과 활동 방식을 소개하는 공간입니다. 우리 팀의 분위기를 전해요.', url: '', logo: '', isSample: true },
  { id: 'sample-c', name: '팀 C', region: '인천', description: '처음 방문하는 분들을 위한 소개가 들어갑니다. 참여 방법을 안내해요.', url: '', logo: '', isSample: true },
  { id: 'sample-d', name: '팀 D', region: '부산', description: '팀이 즐기는 디스크독 활동을 소개합니다. 함께 플레이하는 순간을 전해요.', url: '', logo: '', isSample: true },
  { id: 'sample-e', name: '팀 E', region: '대구', description: '클럽의 특징과 활동 이야기가 들어갑니다. 우리 팀만의 매력을 소개해요.', url: '', logo: '', isSample: true },
  { id: 'sample-f', name: '팀 F', region: '대전', description: '지역에서 함께할 팀을 알아보는 공간입니다. 모임과 교류 소식을 전해요.', url: '', logo: '', isSample: true }
];

// User-approved hierarchy: SHOP > Hyperflite series > formulation, plus Goods.
// Formulations verified in https://hyperflite.com/ Discs menu on 2026-11-01.
// This is a navigation taxonomy, not a confirmed Korean inventory list.
window.SHOP_MENU = [
  { id: 'alpha', label: 'Alpha', detail: '10″', formulations: ['Competition Standard', 'Jawz'] },
  { id: 'z-disc', label: 'Z-Disc', detail: '9.25″', formulations: ['Competition Standard', 'HyperFlex', 'Jawz', 'X-Comp'] },
  { id: 'k-10', label: 'K-10', detail: '8.75″', formulations: ['Competition Standard', 'FrostBite', 'HyperFlex', 'Jawz', 'SofFlite', 'X-Comp'] },
  { id: 'maxq', label: 'MaxQ', detail: '8.5″', formulations: ['Competition Standard', 'Jawz'] },
  { id: 'z-pup', label: 'Z-Pup', detail: '7.25″', formulations: ['Competition Standard', 'HyperFlex', 'Jawz', 'SofFlite'] },
  { id: 'pup', label: 'Pup', detail: '7″', formulations: ['Competition Standard', 'FrostBite', 'HyperFlex', 'Jawz', 'SofFlite', 'X-Comp'] },
  { id: 'macro', label: 'Macro', detail: '5″', formulations: ['Competition Standard', 'HyperFlex', 'Jawz'] },
  { id: 'nano', label: 'Nano', detail: '4″', formulations: ['Competition Standard', 'HyperFlex', 'Jawz'] },
  { id: 'goods', label: '굿즈', formulations: [] },
].map(({ formulations, ...series }) => ({
  ...series,
  items: formulations.map((label) => {
    const id = label.toLowerCase().replaceAll(' ', '-');
    return { id, label, source: `https://hyperflite.com/${series.id}-${id}-disc/` };
  }),
}));
