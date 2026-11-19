/* Static, locally generated grain for the home gradient surfaces. */
(() => {
  const home = document.querySelector('[data-page="home"]');
  if (!home) return;

  try {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return;

    const texture = context.createImageData(size, size);
    let seed = 0x48f17e;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    };

    for (let offset = 0; offset < texture.data.length; offset += 4) {
      const tone = random() > 0.5 ? 255 : 0;
      texture.data[offset] = tone;
      texture.data[offset + 1] = tone;
      texture.data[offset + 2] = tone;
      texture.data[offset + 3] = Math.round(24 + random() * 72);
    }

    context.putImageData(texture, 0, 0);
    home.style.setProperty('--home-grain', `url("${canvas.toDataURL('image/png')}")`);
  } catch {
    // The gradient remains complete when canvas or image export is unavailable.
  }
})();
