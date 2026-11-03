(() => {
  'use strict';
  const specs = window.DISC_OVERVIEW_SPECS;
  const series = window.SHOP_MENU.filter(item => item.id !== 'goods');
  const formulations = ['Competition Standard', 'FrostBite', 'HyperFlex', 'Jawz', 'SofFlite', 'X-Comp'];
  const materialId = name => name.toLowerCase().replaceAll(' ', '-');
  const href = (family, material) => `#shop/family/${family}${material ? `/${materialId(material)}` : ''}`;
  const images = window.DISC_OVERVIEW_IMAGES;
  const photo = (family, material) => images.lineup[`${family}/${materialId(material)}`];
  const familiesBySize = [...series].sort((a,b) => parseFloat(a.detail) - parseFloat(b.detail));
  document.querySelector('#guide-lineup-body').innerHTML = familiesBySize.map(family => `<tr><th scope="row"><a href="${href(family.id)}">${family.label}</a><small>${family.detail}</small></th>${formulations.map(material => `<td>${family.items.some(item => item.label === material) ? `<a href="${href(family.id, material)}" aria-label="${family.label} ${material} SHOP에서 보기"><img src="${photo(family.id,material)}" alt="Hyperflite ${family.label} ${material} 원반" width="150" height="150" loading="lazy"></a>` : '<span aria-label="해당 소재 없음">—</span>'}</td>`).join('')}</tr>`).join('');
  const chartButton = document.querySelector('#guide-chart-zoom');
  const chartViewport = document.querySelector('#guide-chart-viewport');
  chartButton.addEventListener('click', () => {
    const zoomed = chartButton.getAttribute('aria-pressed') !== 'true';
    chartButton.setAttribute('aria-pressed', String(zoomed));
    chartButton.textContent = zoomed ? '전체 크기로 보기' : '이미지 확대';
    chartViewport.classList.toggle('is-zoomed', zoomed);
    chartViewport.scrollTo({ top:0, left:0 });
  });
  const filter = document.querySelector('#guide-spec-series');
  const search = document.querySelector('#guide-spec-search');
  const table = document.querySelector('#guide-spec-table-wrap');
  const empty = document.querySelector('#guide-spec-empty');
  const normalize = value => value.toLocaleLowerCase().replace(/[\s-]/g,'');
  filter.innerHTML += series.map(family => `<option value="${family.id}">${family.label}</option>`).join('');
  function renderSpecs() {
    const query = normalize(search.value.trim());
    const filtered = specs.filter(row => (filter.value === 'all' || row.family === filter.value) && normalize(`${row.series} ${row.material} ${row.materialKo} ${row.colors}`).includes(query));
    document.querySelector('#guide-spec-body').innerHTML = filtered.map(row => `<tr><th scope="row"><a href="${href(row.family)}">${row.series}</a></th><td><a href="${href(row.family,row.material)}">${row.material}</a></td><td>${row.diameter}</td><td>${row.weight}</td><td>${row.colors}</td></tr>`).join('');
    document.querySelector('#guide-spec-count').textContent = `${filtered.length} / ${specs.length}개 제품`;
    table.hidden = !filtered.length;
    empty.hidden = Boolean(filtered.length);
  }
  filter.addEventListener('change', renderSpecs);
  search.addEventListener('input', renderSpecs);
  document.querySelector('#guide-spec-form').addEventListener('submit', event => event.preventDefault());
  document.querySelector('[data-reset-specs]').addEventListener('click', () => {
    filter.value = 'all'; search.value = ''; renderSpecs(); search.focus();
  });
  renderSpecs();
})();
