(() => {
  'use strict';

  const source = 'https://hyperflite.com/discs-overview/';
  // Requested preview buttons only; this is not an inventory declaration.
  const stockRequestProductIds = new Set(['alpha-jawz', 'z-disc-x-comp', 'k-10-frostbite', 'k-10-x-comp']);
  // Manufacturer formulation descriptions. Model and material remain distinct.
  // Verified against Hyperflite's official overview on 2026-11-19.
  const formulationDescriptions = {
    'competition-standard': '부드럽게 무는 반려견을 위한 탄탄한 기본 경기용 소재입니다. 물에 뜨며, 치아에 의한 관통 저항성은 없습니다.',
    frostbite: '추운 날씨의 플레이를 위해 개발한 부드러운 소재입니다. 물에 뜨며, 치아에 의한 관통 저항성은 없습니다.',
    hyperflex: '잘 휘어지는 유연한 소재로, 관통 저항성과 부드러운 촉감을 함께 고려한 원반입니다. 물에는 뜨지 않습니다.',
    jawz: '강하게 무는 반려견을 고려한 관통 저항 소재입니다. 중간 정도의 단단함을 지니며, 물에는 뜨지 않습니다.',
    sofflite: '부드럽게 무는 반려견에게 적합한 말랑한 소재입니다. 물에 뜨며, 치아에 의한 관통 저항성은 없습니다.',
    'x-comp': '장거리 던지기를 위한 단단한 관통 저항 소재입니다. 물에는 뜨지 않습니다.',
  };
  const existingProducts = [
    {
      id: 'cs',
      name: 'Competition Standard',
      ko: '컴피티션 스탠더드',
      material: '탄탄한 기본형 · K-10',
      size: '22.23 cm',
      weight: '110 g',
      description: '탄탄한 소재의 기본형 원반입니다. 던지고 받는 놀이와 디스크 훈련에 사용할 수 있어요. 반려견과 함께하는 놀이·훈련용 원반이며, 씹는 장난감은 아닙니다.',
      image: 'assets/product-cs.png',
      category: 'standard',
      family: 'k-10',
      formulation: 'competition-standard',
      keywords: '기본 기본형 표준 스탠다드 탄탄함 단단함 입문 연습 cs k-10',
      source,
    },
    {
      id: 'hyperflex',
      name: 'HyperFlex',
      ko: '하이퍼플렉스',
      material: '유연한 소재 · K-10',
      size: '22.23 cm',
      weight: '150 g',
      description: '잘 휘어지는 유연한 소재의 원반입니다. 탄탄한 원반과 다른 촉감을 원하는 반려견에게 고려할 수 있어요. 반려견과 함께하는 놀이·훈련용 원반이며, 씹는 장난감은 아닙니다.',
      image: 'assets/product-hyperflex.png',
      category: 'flexible',
      family: 'k-10',
      formulation: 'hyperflex',
      keywords: '유연함 유연한 원반 유연한 소재 부드러움 부드러운 원반 잘 휘는 원반 하이퍼 플렉스',
      source,
    },
    {
      id: 'jawz',
      name: 'Jawz',
      ko: '조즈',
      material: '관통 저항 소재 · K-10',
      size: '22.23 cm',
      weight: '150 g',
      description: '치아에 의한 관통에 저항하도록 설계된 소재와 중간 정도의 유연성을 갖춘 원반입니다. 손상되지 않는 제품은 아니므로 사용 중 상태를 확인해 주세요. 놀이·훈련용 원반이며, 씹는 장난감은 아닙니다.',
      image: 'assets/product-jawz.png',
      category: 'tough',
      family: 'k-10',
      formulation: 'jawz',
      keywords: '내구성 튼튼함 튼튼한 원반 관통 저항 조스 죠스 죠즈',
      source,
    },
    {
      id: 'pup',
      name: 'Pup Competition Standard',
      ko: '펍 컴피티션 스탠더드',
      material: '작고 가벼운 기본형 · Pup',
      size: '17.8 cm',
      weight: '70 g',
      description: '지름 17.8 cm, 무게 70 g의 작은 기본형 원반입니다. 반려견의 체격과 입 크기에 맞춰 선택해 주세요. 반려견과 함께하는 놀이·훈련용 원반이며, 씹는 장난감은 아닙니다.',
      image: 'assets/product-pup.png',
      category: 'small',
      family: 'pup',
      formulation: 'competition-standard',
      keywords: '작은 원반 작은 사이즈 작은 크기 작음 가벼움 가벼운 원반 소형 소형견 펍',
      source,
    },
  ];

  // One product for each approved series/formulation. Keep the original IDs so
  // saved carts, home links and the existing four-product comparison still work.
  const products = window.SHOP_MENU.flatMap((series) => series.items.map((item) => {
    const existing = existingProducts.find((product) => product.family === series.id && product.formulation === item.id);
    const spec = window.DISC_OVERVIEW_SPECS.find((row) => row.family === series.id && row.material === item.label);
    const size = spec.diameter.split(' / ')[1];
    return {
      ...existing,
      id: existing?.id || `${series.id}-${item.id}`,
      name: `${series.label} ${item.label}`,
      ko: spec.materialKo,
      material: `${item.label} · ${series.label}`,
      size,
      weight: spec.weight,
      description: `${series.label} 모델의 ${item.label} 원반입니다. ${formulationDescriptions[item.id]} 지름 ${size}, 무게 ${spec.weight}. 놀이·훈련용 원반이며 씹는 장난감이 아닙니다.${['jawz', 'hyperflex', 'x-comp'].includes(item.id) ? ' 관통 저항성이 있어도 손상될 수 있으므로 상태를 확인하며 사용해 주세요.' : ''}`,
      image: window.SHOP_IMAGES[`${series.id}-${item.id}`],
      family: series.id,
      formulation: item.id,
      requestOnly: stockRequestProductIds.has(`${series.id}-${item.id}`),
      keywords: `${existing?.keywords || ''} ${series.label} ${spec.materialKo}`,
      source: item.source,
    };
  })).concat(window.GOODS_PRODUCTS || []);
  const comparisonProducts = existingProducts.map((original) => products.find((product) => product.id === original.id));
  window.PRODUCTS = products;

  const arrow = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function initialize() {
    const routes = {
      home: '하이퍼플라이트 코리아 | Hyperflite Korea',
      brand: '브랜드 소개 · Hyperflite Korea',
      shop: '디스크 쇼핑 · Hyperflite Korea',
      guide: '원반 가이드 · Hyperflite Korea',
      compare: '제품 비교 · 원반 가이드 · Hyperflite Korea',
      competition: 'Skyhoundz 대회 · Hyperflite Korea',
      training: '훈련 가이드 · Hyperflite Korea',
      clubs: '국내 클럽 · Hyperflite Korea',
    };
    const aliases = { discs: 'shop', story: 'brand', learn: 'training' };
    const cartStorageKey = 'skyhoundz-korea-cart-v1';
    const requestStorageKey = 'skyhoundz-korea-stock-request-preview-v1';
    const productGrid = document.querySelector('#product-grid');
    const productCount = document.querySelector('#product-count');
    const shopMenu = window.SHOP_MENU;
    const productDialog = document.querySelector('#product-dialog');
    const productDialogContent = document.querySelector('#product-dialog-content');
    const searchDialog = document.querySelector('#search-dialog');
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    const menuToggle = document.querySelector('#menu-toggle');
    const mobileNav = document.querySelector('#mobile-nav');
    const mobileMenuDialog = document.querySelector('#mobile-menu-dialog');
    const compactNavigation = window.matchMedia('(max-width: 1100px)');
    let menuScrollPosition = 0;
    const cartDialog = document.querySelector('#cart-dialog');
    const cartContent = document.querySelector('#cart-content');
    const compareControls = document.querySelector('#compare-controls');
    const compareContent = document.querySelector('#compare-content');
    const comparisonResizeObserver = new ResizeObserver((entries) => {
      const scrollArea = entries[0]?.target;
      const hint = compareContent.querySelector('.compare-scroll-hint');
      if (scrollArea && hint) {
        scrollArea.style.setProperty('--compare-viewport-width', `${scrollArea.clientWidth}px`);
        hint.hidden = scrollArea.scrollWidth <= scrollArea.clientWidth + 1;
      }
    });
    const clubRegion = document.querySelector('#club-region');
    const clubSearch = document.querySelector('#club-search');
    const clubList = document.querySelector('#club-list');
    const clubCount = document.querySelector('#club-count');
    const selectedComparison = new Set(['cs', 'hyperflex', 'jawz']);
    const clubs = Array.isArray(window.CLUBS)
      ? window.CLUBS.filter((club) => club && typeof club.id === 'string' && typeof club.name === 'string' && club.name.trim())
      : [];
    let storageAvailable = true;
    let cart = readCart();
    let requestStorageAvailable = true;
    let stockRequests = readStockRequests();

    function getProduct(id) {
      return products.find((product) => product.id === id);
    }

    function productVisual(product, size = 600) {
      return product.image
        ? `<img src="${product.image}" alt="${product.isGoods ? product.name : `Hyperflite ${product.name} 원반`}" loading="lazy" width="${size}" height="${size}">`
        : '<span class="product-photo-placeholder">상품 사진<br>준비 중</span>';
    }

    function readStockRequests() {
      try {
        const saved = JSON.parse(localStorage.getItem(requestStorageKey) || '[]');
        return new Set(Array.isArray(saved) ? saved.filter((id) => stockRequestProductIds.has(id)) : []);
      } catch {
        requestStorageAvailable = false;
        return new Set();
      }
    }

    function requestButtonContent(selected) {
      const path = selected ? 'm5 12 4 4L19 6' : 'M12 5v14M5 12h14';
      return `<span>${selected ? '선택 취소' : '입고해주세요'}</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    function requestNote(selected) {
      if (!requestStorageAvailable) return '현재 화면에만 선택이 유지됩니다. 실제 요청은 전송되지 않습니다.';
      const note = selected ? '이 브라우저에 저장했어요. 실제 요청은 전송되지 않습니다.' : '선택은 이 브라우저에만 저장됩니다.';
      return note;
    }

    function renderStockRequest(product) {
      const selected = stockRequests.has(product.id);
      return `<div class="stock-request">
        <button class="button button-secondary stock-request-button" type="button" data-stock-request="${product.id}" data-selected="${selected}" aria-label="${product.name} ${selected ? '입고 요청 선택 취소' : '입고해주세요'}">${requestButtonContent(selected)}</button>
        <p class="stock-request-note" data-stock-feedback="${product.id}" role="status">${requestNote(selected)}</p>
      </div>`;
    }

    function updateStockRequestControls() {
      document.querySelectorAll('[data-stock-request]').forEach((button) => {
        const product = getProduct(button.dataset.stockRequest);
        if (!product?.requestOnly) return;
        const selected = stockRequests.has(product.id);
        button.dataset.selected = String(selected);
        button.setAttribute('aria-label', `${product.name} ${selected ? '입고 요청 선택 취소' : '입고해주세요'}`);
        button.innerHTML = requestButtonContent(selected);
      });
      document.querySelectorAll('[data-stock-feedback]').forEach((note) => {
        note.textContent = requestNote(stockRequests.has(note.dataset.stockFeedback));
      });
    }

    function toggleStockRequest(id) {
      if (!getProduct(id)?.requestOnly) return;
      if (stockRequests.has(id)) stockRequests.delete(id);
      else stockRequests.add(id);
      try {
        localStorage.setItem(requestStorageKey, JSON.stringify([...stockRequests]));
        requestStorageAvailable = true;
      } catch {
        requestStorageAvailable = false;
      }
      // Keep the existing button node so keyboard focus survives the toggle.
      updateStockRequestControls();
    }

    function normalizeQuantity(value, fallback = 1) {
      const number = typeof value === 'string' && !value.trim() ? NaN : Number(value);
      return Number.isFinite(number) ? Math.max(1, Math.min(99, Math.trunc(number))) : fallback;
    }

    function sanitizeCart(value) {
      const items = Array.isArray(value) ? value : value?.version === 1 && Array.isArray(value.items) ? value.items : [];
      const valid = new Map();
      items.forEach((item) => {
        if (!item || !getProduct(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1) return;
        valid.set(item.id, Math.min(99, (valid.get(item.id) || 0) + item.quantity));
      });
      return Array.from(valid, ([id, quantity]) => ({ id, quantity }));
    }

    function readCart() {
      try {
        return sanitizeCart(JSON.parse(localStorage.getItem(cartStorageKey) || '[]'));
      } catch {
        storageAvailable = false;
        return [];
      }
    }

    function saveCart() {
      try {
        localStorage.setItem(cartStorageKey, JSON.stringify({ version: 1, items: cart }));
        storageAvailable = true;
      } catch {
        storageAvailable = false;
      }
      updateCartCount();
    }

    function updateCartCount() {
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      document.querySelectorAll('[data-cart-count]').forEach((element) => { element.textContent = String(count); });
      document.querySelectorAll('[data-open-cart]').forEach((button) => {
        button.setAttribute('aria-label', `장바구니 보기, 상품 ${count}개`);
      });
    }

    function updateDialogState() {
      document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
    }

    function closeDialog(dialog) {
      if (!dialog || !dialog.open) return;
      if (dialog === mobileMenuDialog) {
        setMobileMenu(false);
        return;
      }
      dialog.close();
      updateDialogState();
    }

    function openDialog(dialog) {
      if (!dialog || dialog.open) return;
      document.querySelectorAll('dialog[open]').forEach((other) => closeDialog(other));
      closeMegaMenus();
      setMobileMenu(false);
      dialog.showModal();
      updateDialogState();
    }

    function shopHref(series, item) {
      const base = series.id === 'goods' ? '#shop/goods' : `#shop/family/${series.id}`;
      return item ? `${base}/${item.id}` : base;
    }

    function shopLink(series, item) {
      return `<a href="${shopHref(series, item)}"><span>${item.label}</span></a>`;
    }

    function renderShopNavigation() {
      document.querySelector('#shop-desktop-categories').innerHTML = shopMenu.map((series) => series.id === 'goods' ? '<a class="shop-goods" href="#shop/goods">굿즈</a>' : `
        <section class="shop-menu-group"><h2><a href="${shopHref(series)}"><span>${series.label}</span><small>${series.detail}</small></a></h2><div>${series.items.map((item) => shopLink(series, item)).join('')}</div></section>
      `).join('');
      document.querySelector('#mobile-shop').innerHTML = '<a href="#shop">전체 상품 보기</a>' + shopMenu.map((series) => series.id === 'goods' ? '<a href="#shop/goods">굿즈</a>' : `
        <details class="shop-mobile-group" name="mobile-shop-groups"><summary><span>${series.label}</span><small>${series.detail}</small><svg aria-hidden="true"><use href="#chevron"/></svg></summary><div><a href="${shopHref(series)}">${series.label} 전체 보기</a>${series.items.map((item) => shopLink(series, item)).join('')}</div></details>
      `).join('');
      document.querySelector('#shop-browse-groups').innerHTML = '<a href="#shop" data-shop-series="all">전체</a>' + shopMenu.map((series) => `<a href="${shopHref(series)}" data-shop-series="${series.id}">${series.label}</a>`).join('');
    }

    function renderProducts(category = '') {
      const series = shopMenu.find((item) => item.id === 'goods' ? category === 'goods' : category === `family-${item.id}` || category.startsWith(`family-${item.id}-`));
      const selected = series?.items.find((item) => category === `family-${series.id}-${item.id}`);
      const filteredProducts = products.filter((product) => !series || (product.family === series.id && (!selected || product.formulation === selected.id)));
      const activeHash = series ? shopHref(series, selected) : '#shop';
      document.querySelector('#shop-category-title').textContent = series ? `${series.label}${selected ? ` · ${selected.label}` : ''}` : '전체 상품';
      const subnav = document.querySelector('#shop-browse-items');
      subnav.hidden = !series?.items.length;
      subnav.innerHTML = series?.items.length ? `<a href="${shopHref(series)}">전체 보기</a>` + series.items.map((item) => shopLink(series, item)).join('') : '';
      document.querySelectorAll('[data-shop-series]').forEach((link) => {
        if (link.dataset.shopSeries === (series?.id || 'all')) link.setAttribute('aria-current', selected ? 'true' : 'page');
        else link.removeAttribute('aria-current');
      });
      document.querySelectorAll('#shop-desktop-categories a, #mobile-shop a, #shop-browse-items a').forEach((link) => {
        if (link.getAttribute('href') === activeHash) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });

      if (productGrid) {
        productGrid.innerHTML = filteredProducts.length
          ? filteredProducts.map((product) => `
              <article class="product-card${product.isGoods ? ' product-card--goods' : ''}">
                <button class="product-image-button" type="button" data-product="${product.id}" aria-label="${product.name} 상세 보기">
                  ${productVisual(product)}
                  <span class="product-open-icon">${arrow}</span>
                </button>
                <div class="product-meta">
                  <p class="product-series">${product.material}</p>
                  <h3><button type="button" data-product="${product.id}">${product.name}</button></h3>
                  <p class="product-spec">${product.isGoods ? '상세 정보 준비 중' : `${product.size}<span aria-hidden="true"> / </span>${product.weight}`}</p>
                  <p class="product-price">${product.requestOnly ? '입고 검토 후보' : '판매가 공개 예정'}</p>
                  ${product.requestOnly ? renderStockRequest(product) : `<button class="button button-secondary product-buy" type="button" data-product="${product.id}">${product.isGoods ? '상품 정보' : '구매 옵션'} ${arrow}</button>`}
                </div>
              </article>
            `).join('')
          : `<div class="shop-empty"><h3>상품 정보를 준비하고 있어요.</h3><p>${series?.id === 'goods' ? '굿즈 상품은 준비되는 대로 소개할게요.' : '국내 판매 상품과 입고 일정이 정해지면 이곳에 안내할게요.'}</p><a class="text-link" href="#shop">전체 상품 보기 ${arrow}</a></div>`;
      }

      if (productCount) productCount.textContent = `${filteredProducts.length}개의 상품`;
    }

    function openProduct(id) {
      const product = getProduct(id);
      if (!product || !productDialog || !productDialogContent) return;

      closeDialog(searchDialog);
      productDialogContent.innerHTML = `
        <div class="product-dialog-image">
          ${productVisual(product)}
        </div>
        <div class="product-dialog-info">
          <h2 id="product-title">${product.name}</h2>
          <p class="product-material">${product.isGoods ? 'SKYHOUNDZ KOREA' : 'HYPERFLITE'} / ${product.material}</p>
          <p class="product-dialog-description">${product.description}</p>
          ${product.isGoods ? '' : `<dl class="product-dialog-specs">
            <div><dt>지름</dt><dd>${product.size}</dd></div>
            <div><dt>무게</dt><dd>${product.weight}</dd></div>
          </dl>

          ${product.requestOnly ? renderStockRequest(product) : `<form class="product-options" id="product-options-form" data-product-id="${product.id}">
            <p class="product-color-note"><strong>색상</strong> 현재 이미지는 대표 색상입니다. 판매 색상은 입고 시 안내합니다.</p>
            <label for="product-quantity">수량</label>
            <div class="quantity-control">
              <button type="button" data-quantity-step="-1" aria-label="수량 줄이기">−</button>
              <input id="product-quantity" name="quantity" type="number" inputmode="numeric" min="1" max="99" step="1" value="1" required>
              <button type="button" data-quantity-step="1" aria-label="수량 늘리기">+</button>
            </div>

            <div class="product-purchase-actions"><button class="button button-primary" type="submit">장바구니 담기 ${arrow}</button></div>
            <p class="product-feedback" id="product-feedback" role="status" aria-live="polite"></p>
            <button class="text-link" type="button" data-open-cart hidden id="product-view-cart">장바구니 보기 ${arrow}</button>
            <p class="product-cart-note">담은 제품은 이 브라우저에 저장됩니다. 현재 결제는 지원하지 않습니다.</p>
          </form>`}
          `}
        </div>
      `;
      productDialog.setAttribute('aria-labelledby', 'product-title');
      openDialog(productDialog);
    }

    function addProductToCart(form) {
      const product = getProduct(form.dataset.productId);
      const input = form.querySelector('[name="quantity"]');
      if (!product || product.requestOnly || product.isGoods || !input || !form.reportValidity()) return;
      const quantity = normalizeQuantity(input.value);
      input.value = String(quantity);
      const existing = cart.find((item) => item.id === product.id);
      const previousQuantity = existing?.quantity || 0;
      const nextQuantity = Math.min(99, previousQuantity + quantity);
      if (existing) existing.quantity = nextQuantity;
      else cart.push({ id: product.id, quantity: nextQuantity });
      saveCart();
      renderCart();
      const feedback = document.querySelector('#product-feedback');
      const added = nextQuantity - previousQuantity;
      if (feedback) feedback.textContent = added > 0
        ? `${product.name} ${added}개를 장바구니에 담았어요.${nextQuantity === 99 ? ' 한 상품은 최대 99개까지 담을 수 있어요.' : ''}`
        : '이 상품은 이미 99개 담겨 있어요. 한 상품은 최대 99개까지 담을 수 있어요.';
      const viewCart = document.querySelector('#product-view-cart');
      if (viewCart) viewCart.hidden = false;
    }

    function renderCart(focusId, announcement = '') {
      if (!cartContent) return;
      if (!cart.length) {
        cartContent.innerHTML = `
          <div class="cart-empty"><h3>아직 담은 원반이 없어요</h3><p>원반을 살펴보고 관심 있는 제품을 담아 보세요.</p><a class="button button-primary" href="#shop">디스크 살펴보기 ${arrow}</a></div>
          <p class="cart-status" id="cart-status" role="status" aria-live="polite"></p>
        `;
      } else {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartContent.innerHTML = `
          <div class="cart-items">
            ${cart.map((item) => {
              const product = getProduct(item.id);
              return `<article class="cart-item">
                <button class="cart-item-image" type="button" data-product="${product.id}" aria-label="${product.name} 구매 옵션"><img src="${product.image}" alt="" width="130" height="130"></button>
                <div class="cart-item-info"><h3>${product.name}</h3><p>${product.size} / ${product.weight}</p><p class="cart-color-note">판매 색상 추후 안내</p></div>
                <div class="cart-item-controls">
                  <label class="sr-only" for="cart-quantity-${product.id}">${product.name} 수량</label>
                  <div class="quantity-control">
                    <button type="button" data-cart-step="${product.id}" data-step="-1" aria-label="${product.name} 수량 줄이기" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                    <input id="cart-quantity-${product.id}" data-cart-quantity="${product.id}" type="number" inputmode="numeric" min="1" max="99" step="1" value="${item.quantity}" required>
                    <button type="button" data-cart-step="${product.id}" data-step="1" aria-label="${product.name} 수량 늘리기" ${item.quantity >= 99 ? 'disabled' : ''}>+</button>
                  </div>
                  <button class="text-link cart-remove" type="button" data-remove-cart="${product.id}" aria-label="${product.name} 장바구니에서 삭제">삭제</button>
                </div>
              </article>`;
            }).join('')}
          </div>
          <div class="cart-summary"><p><strong>총 ${count}개</strong></p><p class="cart-note">현재 결제는 지원하지 않습니다.</p><p class="cart-note">${storageAvailable ? '담은 제품과 수량은 이 브라우저에 저장됩니다.' : '브라우저 저장소를 사용할 수 없어 현재 화면에서만 장바구니가 유지됩니다.'}</p><div class="cart-actions"><button class="button button-primary" type="button" disabled>구매 불가</button><button class="text-link" type="button" data-clear-cart>장바구니 비우기</button></div></div>
          <p class="cart-status" id="cart-status" role="status" aria-live="polite"></p>
        `;
      }
      if (focusId) document.getElementById(`cart-quantity-${focusId}`)?.focus({ preventScroll: true });
      if (announcement) requestAnimationFrame(() => {
        const status = document.querySelector('#cart-status');
        if (status) status.textContent = announcement;
      });
    }

    function changeCartQuantity(id, value) {
      const item = cart.find((entry) => entry.id === id);
      if (!item) return;
      const quantity = normalizeQuantity(value, item.quantity);
      const corrected = String(quantity) !== String(value).trim();
      item.quantity = quantity;
      saveCart();
      renderCart(id, corrected ? '수량은 1개부터 99개까지의 정수로 입력해 주세요.' : `${getProduct(id).name} 수량을 ${quantity}개로 변경했어요.`);
    }

    function renderCompareControls() {
      if (!compareControls) return;
      compareControls.innerHTML = comparisonProducts.map((product) => `
        <label class="compare-choice"><img src="${product.image}" alt="" width="80" height="80"><span><strong>${product.name}</strong><small>${product.family === 'pup' ? 'Pup' : 'K-10'} · ${product.size}</small></span><input type="checkbox" data-compare="${product.id}" value="${product.id}" aria-label="${product.name} 비교 선택" ${selectedComparison.has(product.id) ? 'checked' : ''}></label>
      `).join('');
    }

    function renderComparison() {
      if (!compareContent) return;
      comparisonResizeObserver.disconnect();
      const selected = products.filter((product) => selectedComparison.has(product.id));
      const count = document.querySelector('#compare-count');
      const differenceToggle = document.querySelector('#compare-differences');
      differenceToggle.disabled = selected.length < 2;
      if (selected.length < 2) differenceToggle.checked = false;
      const differencesOnly = differenceToggle.checked;
      if (count) count.textContent = selected.length === 1 ? '1개 선택 · 하나 더 골라 비교해 보세요' : `${selected.length}개 선택`;
      if (!selected.length) {
        compareContent.innerHTML = '<div class="compare-empty"><h3>비교할 원반을 선택해 주세요</h3><p>위에서 제품을 선택하면 크기와 무게, 소재를 나란히 볼 수 있어요.</p></div>';
        return;
      }
      const rows = [
        ['시리즈', (product) => product.family === 'pup' ? 'Pup' : 'K-10'],
        ['지름', (product) => product.size],
        ['무게', (product) => product.weight],
        ['소재', (product) => product.material.split(' · ')[0]],
      ].map(([label, value]) => ({ label, values: selected.map(value), different: selected.length > 1 && new Set(selected.map(value)).size > 1 }));
      compareContent.innerHTML = `
        <p class="compare-scroll-hint">좌우로 넘겨 비교하세요. 항목명은 왼쪽에 고정돼요.</p>
        <div class="compare-scroll" tabindex="0" role="region" aria-label="원반 비교 표, 작은 화면에서는 가로로 스크롤할 수 있습니다">
          <table class="compare-table" style="--compare-columns:${selected.length}"><caption class="sr-only">선택한 Hyperflite 원반의 시리즈, 크기, 무게, 소재 비교${differencesOnly ? ', 차이가 있는 항목만 표시' : ''}</caption>
            <thead><tr><th scope="col">비교 항목</th>${selected.map((product) => `<th scope="col"><div class="compare-product"><img src="${product.image}" alt="" width="120" height="120"><strong>${product.name}</strong></div></th>`).join('')}</tr></thead>
            <tbody>${rows.filter((row) => !differencesOnly || row.different).map((row) => `<tr class="${row.different ? 'compare-row-different' : ''}"><th scope="row">${row.label}${row.different ? '<span class="compare-row-note">차이 있음</span>' : ''}</th>${row.values.map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')}
              <tr class="compare-action-row"><th scope="row">자세히</th>${selected.map((product) => `<td><button class="button button-secondary" type="button" data-product="${product.id}" aria-label="${product.name} 상세 보기">상세 보기</button></td>`).join('')}</tr>
            </tbody>
          </table>
        </div>
        <details class="compare-descriptions"><summary>자세한 제품 소개 <svg aria-hidden="true"><use href="#chevron"/></svg></summary><div>${selected.map((product) => `<article><h3>${product.name}</h3><p>${product.description}</p></article>`).join('')}</div></details>
      `;
      comparisonResizeObserver.observe(compareContent.querySelector('.compare-scroll'));
    }

    function safeUrl(value, allowLocal = false) {
      if (typeof value !== 'string' || !value.trim()) return null;
      try {
        const url = new URL(value, document.baseURI);
        if (url.protocol === 'https:' || url.protocol === 'http:' || (allowLocal && url.protocol === 'file:')) return url.href;
      } catch { /* Invalid optional links are omitted. */ }
      return null;
    }

    function initializeClubRegions() {
      if (!clubRegion) return;
      const regions = Array.from(new Set(clubs.map((club) => typeof club.region === 'string' ? club.region.trim() : '').filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ko'));
      clubRegion.replaceChildren(new Option('전체 지역', 'all'), ...regions.map((region) => new Option(region, region)));
    }

    function renderClubs() {
      if (!clubList) return;
      const region = clubRegion?.value || 'all';
      const query = (clubSearch?.value || '').trim().toLocaleLowerCase('ko-KR');
      const matches = clubs.filter((club) => (region === 'all' || club.region === region) && [club.name, club.region, club.description].filter(Boolean).join(' ').toLocaleLowerCase('ko-KR').includes(query));
      if (clubCount) clubCount.textContent = `${matches.length}개 클럽`;
      clubList.replaceChildren();
      const sampleNote = document.querySelector('#club-sample-note');
      if (sampleNote) sampleNote.hidden = !clubs.some((club) => club.isSample === true);
      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'club-empty';
        const title = document.createElement('h3');
        title.textContent = clubs.length ? '검색 조건에 맞는 클럽이 없어요' : '클럽 정보를 준비하고 있어요';
        const description = document.createElement('p');
        description.textContent = clubs.length ? '다른 지역이나 검색어로 다시 찾아보세요.' : '확인된 국내 디스크도그 클럽 정보를 이곳에 소개할 예정입니다.';
        empty.append(title, description);
        if (clubs.length) {
          const reset = document.createElement('button');
          reset.type = 'button';
          reset.className = 'text-link';
          reset.dataset.resetClubs = '';
          reset.textContent = '전체 클럽 보기';
          empty.append(reset);
        }
        clubList.append(empty);
        return;
      }
      matches.forEach((club) => {
        const card = document.createElement('article');
        card.className = 'club-card';
        const logoBox = document.createElement('div');
        logoBox.className = 'club-logo';
        const showLogoPlaceholder = () => {
          const placeholder = document.createElement('div');
          placeholder.className = 'club-logo-placeholder';
          const team = document.createElement('strong');
          team.textContent = club.name;
          const hint = document.createElement('span');
          hint.textContent = '클럽 로고';
          placeholder.append(team, hint);
          logoBox.replaceChildren(placeholder);
        };
        const logoUrl = safeUrl(club.logo, true);
        if (logoUrl) {
          const logo = document.createElement('img');
          logo.src = logoUrl;
          logo.alt = `${club.name} 로고`;
          logo.loading = 'lazy';
          logo.addEventListener('error', showLogoPlaceholder, { once: true });
          logoBox.append(logo);
        } else {
          showLogoPlaceholder();
        }
        card.append(logoBox);
        const imageUrl = safeUrl(club.image, true);
        if (imageUrl) {
          const image = document.createElement('img');
          image.className = 'club-image';
          image.src = imageUrl;
          image.alt = `${club.name} 활동 사진`;
          image.loading = 'lazy';
          card.append(image);
        }
        const body = document.createElement('div');
        body.className = 'club-card-body';
        const name = document.createElement('h3');
        name.textContent = club.name;
        if (club.isSample === true) {
          const badge = document.createElement('span');
          badge.className = 'club-sample-badge';
          badge.textContent = '샘플';
          name.append(badge);
        }
        body.append(name);
        if (typeof club.region === 'string' && club.region.trim()) {
          const location = document.createElement('p');
          location.className = 'club-region';
          location.textContent = club.region;
          body.append(location);
        }
        if (typeof club.description === 'string' && club.description.trim()) {
          const description = document.createElement('p');
          description.textContent = club.description;
          body.append(description);
        }
        const clubUrl = safeUrl(club.url);
        if (clubUrl) {
          const link = document.createElement('a');
          link.href = clubUrl;
          link.className = 'text-link';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = '클럽 채널 방문';
          link.setAttribute('aria-label', `${club.name} 클럽 채널 방문 (새 창)`);
          link.insertAdjacentHTML('beforeend', arrow);
          body.append(link);
        }
        card.append(body);
        clubList.append(card);
      });
    }

    function renderSearch() {
      if (!searchInput || !searchResults) return;
      const query = searchInput.value.trim().toLocaleLowerCase('ko-KR');
      const matches = products.filter((product) =>
        [product.name, product.ko, product.material, product.description, product.size, product.weight, product.keywords]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(query)
      );

      searchResults.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement('div');
        empty.className = 'search-empty';
        const message = document.createElement('p');
        message.textContent = `“${searchInput.value.trim()}”에 맞는 상품을 찾지 못했어요.`;
        const reset = document.createElement('button');
        reset.className = 'text-link';
        reset.type = 'button';
        reset.dataset.resetSearch = '';
        reset.textContent = '전체 상품 보기';
        empty.append(message, reset);
        searchResults.append(empty);
        return;
      }

      searchResults.innerHTML = matches.map((product) => `
        <button class="search-result" type="button" data-product="${product.id}">
          ${productVisual(product, 80)}
          <span class="search-result-copy"><strong>${product.name}</strong><span>${product.isGoods ? `${product.material} · 상세 정보 준비 중` : `${product.material} · ${product.size} / ${product.weight}`}</span></span>
          <span class="search-result-arrow">${arrow}</span>
        </button>
      `).join('');
    }

    function resetSearch() {
      if (!searchInput) return;
      searchInput.value = '';
      renderSearch();
      searchInput.focus();
    }

    function resetMobileSubmenus() {
      mobileNav?.querySelectorAll('.shop-mobile-group[open]').forEach((group) => { group.open = false; });
      mobileNav?.querySelectorAll('[data-mobile-expand]').forEach((button) => {
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', button.getAttribute('aria-label').replace('닫기', '열기'));
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });
    }

    function setMobileMenu(isOpen) {
      if (!menuToggle || !mobileMenuDialog || (isOpen && !compactNavigation.matches)) return;
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
      const label = menuToggle.querySelector('[data-menu-label]');
      if (label) label.textContent = isOpen ? '닫기' : '메뉴';
      menuToggle.querySelector('svg use')?.setAttribute('href', isOpen ? '#close' : '#menu');
      if (isOpen && !mobileMenuDialog.open) {
        closeMegaMenus();
        document.querySelectorAll('dialog[open]').forEach((dialog) => closeDialog(dialog));
        resetMobileSubmenus();
        menuScrollPosition = window.scrollY;
        document.body.style.setProperty('--menu-scroll-top', `-${menuScrollPosition}px`);
        document.body.classList.add('menu-open');
        mobileMenuDialog.showModal();
        mobileMenuDialog.querySelector('.mobile-menu-scroll').scrollTop = 0;
      } else if (!isOpen) {
        if (mobileMenuDialog.open) mobileMenuDialog.close();
        if (document.body.classList.contains('menu-open')) {
          document.body.classList.remove('menu-open');
          document.body.style.removeProperty('--menu-scroll-top');
          window.scrollTo({ top: menuScrollPosition, behavior: 'instant' });
        }
        resetMobileSubmenus();
      }
      updateDialogState();
    }

    function closeMegaMenus(restoreFocus = false) {
      let trigger = null;
      document.querySelectorAll('[data-mega]').forEach((button) => {
        if (button.getAttribute('aria-expanded') === 'true') trigger = button;
        button.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('[data-mega-panel]').forEach((panel) => { panel.hidden = true; });
      if (restoreFocus) trigger?.focus();
    }

    function toggleMegaMenu(button) {
      const wasOpen = button.getAttribute('aria-expanded') === 'true';
      closeMegaMenus();
      if (wasOpen) return;
      const panel = Array.from(document.querySelectorAll('[data-mega-panel]')).find((item) => item.dataset.megaPanel === button.dataset.mega);
      if (!panel) return;
      button.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      panel.querySelector('a[href], button:not([disabled])')?.focus({ preventScroll: true });
    }

    function parseRoute(hash = window.location.hash) {
      let path;
      try { path = decodeURIComponent(hash.replace(/^#/, '')); } catch { path = ''; }
      const [name, ...segments] = path.split('/');
      if (name === 'guide' && segments[0] === 'compare') return { route: 'compare', sub: '' };
      const route = aliases[name] || name || 'home';
      return { route: Object.hasOwn(routes, route) ? route : 'home', sub: segments.join('-') };
    }

    function renderRoute(initial = false) {
      const { route, sub } = parseRoute();
      if (route === 'shop') renderProducts(sub);
      document.querySelectorAll('[data-page]').forEach((page) => { page.hidden = page.dataset.page !== route; });
      document.title = routes[route];
      document.body.dataset.currentPage = route;
      document.querySelectorAll('a[data-route]').forEach((link) => {
        const destination = link.dataset.route.split('/')[0];
        const current = destination === route || (destination === 'guide' && route === 'compare');
        if (current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      closeMegaMenus();
      setMobileMenu(false);
      document.querySelectorAll('dialog[open]').forEach((dialog) => closeDialog(dialog));
      requestAnimationFrame(() => {
        const target = sub ? document.getElementById(`${route}-${sub}`) : null;
        if (!initial) document.querySelector('#main')?.focus({ preventScroll: true });
        if (target && target.closest('[data-page]')?.dataset.page === route) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (target.closest('[data-clear-comparison]')) {
        selectedComparison.clear();
        renderCompareControls();
        renderComparison();
        return;
      }

      if (!target.closest('[data-mega], [data-mega-panel]')) closeMegaMenus();

      const megaButton = target.closest('[data-mega]');
      if (megaButton) {
        toggleMegaMenu(megaButton);
        return;
      }

      const routeLink = target.closest('a[href^="#"]');
      if (routeLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
        const href = routeLink.getAttribute('href');
        const name = href.slice(1).split('/')[0];
        if (name === 'main') return;
        if (Object.hasOwn(routes, name) || Object.hasOwn(aliases, name) || !name) {
          event.preventDefault();
          if (window.location.hash === href || (!window.location.hash && href === '#home')) renderRoute();
          else window.location.hash = href;
          return;
        }
      }

      const requestButton = target.closest('[data-stock-request]');
      if (requestButton) {
        toggleStockRequest(requestButton.dataset.stockRequest);
        return;
      }

      const productButton = target.closest('[data-product]');
      if (productButton) {
        openProduct(productButton.dataset.product);
        return;
      }

      if (target.closest('[data-open-search]')) {
        setMobileMenu(false);
        renderSearch();
        openDialog(searchDialog);
        searchInput?.focus();
        return;
      }

      if (target.closest('[data-open-cart]')) {
        renderCart();
        openDialog(cartDialog);
        return;
      }

      const quantityStep = target.closest('[data-quantity-step]');
      if (quantityStep) {
        const input = document.querySelector('#product-quantity');
        if (input) input.value = String(normalizeQuantity(normalizeQuantity(input.value) + Number(quantityStep.dataset.quantityStep)));
        return;
      }

      const cartStep = target.closest('[data-cart-step]');
      if (cartStep) {
        const item = cart.find((entry) => entry.id === cartStep.dataset.cartStep);
        if (item) changeCartQuantity(item.id, item.quantity + Number(cartStep.dataset.step));
        return;
      }

      const removeCart = target.closest('[data-remove-cart]');
      if (removeCart) {
        const product = getProduct(removeCart.dataset.removeCart);
        cart = cart.filter((item) => item.id !== removeCart.dataset.removeCart);
        saveCart();
        renderCart(null, product ? `${product.name}을 장바구니에서 삭제했어요.` : '상품을 삭제했어요.');
        (cartContent?.querySelector('[data-remove-cart], a') || cartDialog?.querySelector('[data-close-dialog]'))?.focus();
        return;
      }

      if (target.closest('[data-clear-cart]')) {
        cart = [];
        saveCart();
        renderCart(null, '장바구니를 비웠어요.');
        cartContent?.querySelector('a')?.focus();
        return;
      }

      if (target.closest('[data-reset-clubs]')) {
        if (clubRegion) clubRegion.value = 'all';
        if (clubSearch) clubSearch.value = '';
        renderClubs();
        clubSearch?.focus();
        return;
      }

      const closeButton = target.closest('[data-close-dialog]');
      if (closeButton) {
        closeDialog(closeButton.closest('dialog'));
        return;
      }

      if (target.closest('[data-reset-search], #search-reset')) resetSearch();
    });

    [productDialog, searchDialog, cartDialog].forEach((dialog) => {
      if (!dialog) return;
      dialog.addEventListener('close', updateDialogState);
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (outside) closeDialog(dialog);
      });
    });

    searchInput?.addEventListener('input', renderSearch);
    searchInput?.closest('form')?.addEventListener('submit', (event) => event.preventDefault());
    clubRegion?.addEventListener('change', renderClubs);
    clubSearch?.addEventListener('input', renderClubs);
    clubSearch?.closest('form')?.addEventListener('submit', (event) => event.preventDefault());

    document.addEventListener('submit', (event) => {
      if (event.target instanceof HTMLFormElement && event.target.id === 'product-options-form') {
        event.preventDefault();
        addProductToCart(event.target);
      }
    });

    document.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      if (input.id === 'product-quantity') input.value = String(normalizeQuantity(input.value));
      if (input.hasAttribute('data-cart-quantity')) changeCartQuantity(input.dataset.cartQuantity, input.value);
      if (input.hasAttribute('data-compare') && getProduct(input.dataset.compare)) {
        if (input.checked) selectedComparison.add(input.dataset.compare);
        else selectedComparison.delete(input.dataset.compare);
        renderComparison();
      }
    });

    menuToggle?.addEventListener('click', () => {
      setMobileMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenuDialog?.querySelectorAll('[data-close-mobile-menu]').forEach((button) => {
      button.addEventListener('click', () => setMobileMenu(false));
    });
    mobileMenuDialog?.addEventListener('cancel', (event) => {
      event.preventDefault();
      setMobileMenu(false);
    });
    mobileMenuDialog?.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(mobileMenuDialog.querySelectorAll('a[href], button:not([disabled])'))
        .filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus({ preventScroll: true });
      }
    });
    mobileMenuDialog?.addEventListener('close', () => {
      if (!mobileMenuDialog.open) setMobileMenu(false);
    });
    let menuBackdropPointerDown = false;
    function isOutsideMobileMenu(event) {
      const bounds = mobileMenuDialog.getBoundingClientRect();
      return event.target === mobileMenuDialog && (
        event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom
      );
    }
    mobileMenuDialog?.addEventListener('pointerdown', (event) => {
      menuBackdropPointerDown = isOutsideMobileMenu(event);
    });
    mobileMenuDialog?.addEventListener('click', (event) => {
      if (menuBackdropPointerDown && isOutsideMobileMenu(event)) setMobileMenu(false);
      menuBackdropPointerDown = false;
    });
    mobileNav?.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const expand = event.target.closest('[data-mobile-expand]');
      if (expand) {
        const wasOpen = expand.getAttribute('aria-expanded') === 'true';
        resetMobileSubmenus();
        if (!wasOpen) {
          expand.setAttribute('aria-expanded', 'true');
          expand.setAttribute('aria-label', expand.getAttribute('aria-label').replace('열기', '닫기'));
          document.getElementById(expand.getAttribute('aria-controls')).hidden = false;
        }
      } else if (event.target.closest('a') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
        setMobileMenu(false);
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) closeMegaMenus(true);
    });

    document.addEventListener('focusin', (event) => {
      if (event.target instanceof Element && !event.target.closest('[data-mega], [data-mega-panel]')) closeMegaMenus();
    });

    compactNavigation.addEventListener('change', (event) => {
      const activeElement = document.activeElement;
      const focusWillBeHidden = activeElement instanceof Element && (
        mobileMenuDialog?.contains(activeElement) ||
        activeElement.closest('[data-mega-panel]') ||
        (event.matches ? activeElement.closest('.desktop-nav') : activeElement === menuToggle)
      );
      setMobileMenu(false);
      closeMegaMenus();
      if (focusWillBeHidden) {
        const focusTarget = event.matches
          ? menuToggle
          : document.querySelector('.desktop-nav a[aria-current="page"]') || document.querySelector('.site-header .brand');
        focusTarget?.focus({ preventScroll: true });
      }
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash !== '#main') renderRoute();
    });
    window.addEventListener('storage', (event) => {
      if (event.key === requestStorageKey || event.key === null) {
        stockRequests = readStockRequests();
        updateStockRequestControls();
      }
      if (event.key !== cartStorageKey) return;
      try { cart = sanitizeCart(JSON.parse(event.newValue || '[]')); } catch { cart = []; }
      updateCartCount();
      renderCart();
    });

    document.querySelector('#compare-differences')?.addEventListener('change', renderComparison);

    renderShopNavigation();
    setMobileMenu(false);
    renderProducts();
    renderSearch();
    renderCart();
    updateCartCount();
    renderCompareControls();
    renderComparison();
    initializeClubRegions();
    renderClubs();
    renderRoute(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
