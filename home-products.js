/* Korea's November–February winter feature replaces the regular X-Comp card. */
(() => {
  const monthInKorea = Number(new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
  }).format(new Date()));
  if (monthInKorea >= 3 && monthInKorea <= 10) return;

  const regularCard = document.querySelector('.home-disc-grid [data-product="k-10-x-comp"]');
  const winterCard = document.getElementById('home-winter-disc');
  if (regularCard && winterCard) regularCard.replaceWith(winterCard.content.cloneNode(true));
})();
