/* HARIAKU — product & channel data shared by every option.
   Image paths are relative to /hariaku/shared/. Prices are left out on purpose:
   final prices are not confirmed yet, so every card says "Lihat di Shopee". */
(function () {
  var SHOP = 'https://shopee.co.id/hariakustudio';

  window.HK = window.HK || {};
  // relative path from the current page to /hariaku/ (set on <html data-base>)
  window.HK.base = document.documentElement.getAttribute('data-base') || '../';
  window.HK.asset = function (p) { return window.HK.base + 'shared/' + p; };

  window.HK.links = {
    instagram: 'https://www.instagram.com/bersama.hariaku',
    tiktok: 'https://www.tiktok.com/@bersama.hariaku',
    shopee: SHOP,
    igPost: function (code) { return 'https://www.instagram.com/p/' + code + '/'; }
  };

  // colors[].img = packshot / hanger photo, colors[].model = worn on a model (when we have one)
  window.HK.products = [
    {
      slug: 'love-button-cardigan', name: 'Love Button Cardigan', category: 'Cardigan',
      material: 'Rajut halus', note: 'Kancing hati merah', fit: 'All size',
      shopee: 'https://shopee.co.id/Love-Button-Cardigan-i.1266545926.51566980346',
      colors: [
        { id: 'blue', label: 'Misty Blue', hex: '#BFC4C8', img: 'img/products/love-button-cardigan/02.webp', model: 'img/products/love-button-cardigan/01.webp' },
        { id: 'cream', label: 'Cream', hex: '#EFE5D3', img: 'img/products/love-button-cardigan/04.webp', model: 'img/products/love-button-cardigan/03.webp' },
        { id: 'latte', label: 'Latte', hex: '#CDBBA4', img: 'img/products/love-button-cardigan/06.webp', model: 'img/products/love-button-cardigan/05.webp' }
      ],
      tryOn: 'cream',
      demo: { img: 'img/lifestyle/cardigan-pampas-sm.jpg', pos: '46% 50%' }
    },
    {
      slug: 'eyelet-cotton-shirt', name: 'Eyelet Cotton Shirt', category: 'Kemeja',
      material: 'Katun eyelet', note: 'Bordir bunga, hem scallop', fit: 'All size',
      shopee: 'https://shopee.co.id/Eyelet-Cotton-Shirt-i.1266545926.48516988683',
      colors: [
        { id: 'pink', label: 'Dusty Pink', hex: '#E2A9A3', img: 'img/products/eyelet-cotton-shirt/04.webp', model: 'img/lifestyle/eyelet-window-sm.jpg' },
        { id: 'cream', label: 'Cream', hex: '#F1E9D8', img: 'img/products/eyelet-cotton-shirt/02.webp', model: 'img/products/eyelet-cotton-shirt/01.webp' }
      ],
      tryOn: 'pink',
      demo: { img: 'img/lifestyle/eyelet-window-sm.jpg', pos: '52% 50%' }
    },
    {
      slug: 'babydoll-evening', name: 'Atasan Kemeja Babydoll Evening', short: 'Babydoll Evening', category: 'Blouse',
      material: 'Satin print', note: 'Motif tulisan tangan & bunga', fit: 'All size',
      shopee: 'https://shopee.co.id/Atasan-Kemeja-Babydoll-Evening-i.1266545926.29390220296',
      colors: [
        { id: 'black', label: 'Hitam', hex: '#232021', img: 'img/products/babydoll-evening/01.webp', model: 'img/products/babydoll-evening/02.webp' }
      ],
      tryOn: 'black',
      demo: { img: 'img/products/babydoll-evening/02.webp' }
    },
    {
      slug: 'denim-soft-jeans-bordir', name: 'Kemeja Denim Soft Jeans Bordir', short: 'Denim Bordir', category: 'Kemeja',
      material: 'Soft denim', note: 'Bordir mawar', fit: 'All size',
      shopee: SHOP,
      colors: [
        { id: 'lightwash', label: 'Light Wash', hex: '#8FB0D6', img: 'img/products/denim-soft-jeans-bordir/01.webp', model: 'img/products/denim-soft-jeans-bordir/03.webp' }
      ],
      tryOn: 'lightwash',
      demo: { img: 'img/products/denim-soft-jeans-bordir/03.webp' }
    },
    {
      slug: 'velvet-bludru', name: 'Atasan Kemeja Velvet Bludru Premium', short: 'Velvet Bludru', category: 'Kemeja',
      material: 'Velvet (bludru)', note: 'Kerah shanghai', fit: 'All size',
      shopee: 'https://shopee.co.id/Atasan-Kemeja-Velvet-Bludru-Premium-i.1266545926.26341335796',
      colors: [
        { id: 'teal', label: 'Teal', hex: '#1F5F73', img: 'img/products/velvet-bludru/05.webp', model: 'img/products/velvet-bludru/09.webp' },
        { id: 'navy', label: 'Navy', hex: '#1E2A55', img: 'img/products/velvet-bludru/04.webp', model: 'img/products/velvet-bludru/08.webp' },
        { id: 'dusty-pink', label: 'Dusty Pink', hex: '#B77F8A', img: 'img/products/velvet-bludru/02.webp', model: 'img/products/velvet-bludru/06.webp' },
        { id: 'charcoal', label: 'Charcoal', hex: '#3C3C40', img: 'img/products/velvet-bludru/03.webp', model: 'img/products/velvet-bludru/07.webp' }
      ],
      tryOn: 'teal',
      demo: { img: 'img/products/velvet-bludru/09.webp' }
    },
    {
      slug: 'tunik-bunga-maebae', name: 'Tunik Bunga MaeBae', short: 'Tunik MaeBae', category: 'Tunik',
      material: 'Ceruty print', note: 'Bunga pastel di hem', fit: 'All size',
      shopee: 'https://shopee.co.id/Tunik-Bunga-MaeBae-i.1266545926.44470340892',
      colors: [
        { id: 'champagne', label: 'Champagne', hex: '#E9D6C4', img: 'img/products/tunik-bunga-maebae/03.webp' },
        { id: 'sky', label: 'Sky', hex: '#CFDCE3', img: 'img/products/tunik-bunga-maebae/04.webp' }
      ],
      tryOn: 'champagne',
      demo: { img: 'img/products/tunik-bunga-maebae/03.webp' }
    },
    {
      slug: 'gold-button-cardigan', name: 'Gold Button Cardigan Knit Premium', short: 'Gold Button Cardigan', category: 'Cardigan',
      material: 'Rajut premium', note: 'Kancing emas', fit: 'All size',
      shopee: 'https://shopee.co.id/Gold-Button-Cardigan-Knit-Premium-i.1266545926.49068523543',
      colors: [{ id: 'black', label: 'Hitam', hex: '#1D1B1B', img: 'img/products/gold-button-cardigan/01.webp' }]
    },
    {
      slug: 'sailor-korea-bordir', name: 'Atasan Kemeja Sailor Korea Bordir', short: 'Sailor Bordir', category: 'Kemeja',
      material: 'Katun', note: 'Kerah sailor bordir navy', fit: 'All size',
      shopee: 'https://shopee.co.id/Atasan-Kemeja-Sailor-Korea-Bordir-i.1266545926.29990220401',
      colors: [{ id: 'white', label: 'Putih', hex: '#F4F2EE', img: 'img/products/sailor-korea-bordir/01.webp' }]
    },
    {
      slug: 'daisy-kancing-pita', name: 'Kemeja Atasan Daisy Kancing Pita', short: 'Daisy Kancing Pita', category: 'Kemeja',
      material: 'Katun', note: 'Kancing pita', fit: 'All size',
      shopee: 'https://shopee.co.id/Kemeja-atasan-Daisy-kancing-pita-i.1266545926.44314156021',
      colors: [{ id: 'white', label: 'Putih', hex: '#F3F1EA', img: 'img/products/daisy-kancing-pita/02.webp' }]
    }
  ];

  window.HK.product = function (slug) {
    return window.HK.products.filter(function (p) { return p.slug === slug; })[0];
  };

  // Instagram posts (first slide, downloaded from @bersama.hariaku)
  window.HK.social = [
    { code: 'Df9mycmGDjh', img: 'img/social/Df9mycmGDjh.jpg', alt: 'Banyak peran. Tetap kamu.' },
    { code: 'Df8evinAXeX', img: 'img/social/Df8evinAXeX.jpg', alt: 'Cardigan di dekat jendela' },
    { code: 'Df6efbemCBt', img: 'img/social/Df6efbemCBt.jpg', alt: 'Mengiringi setiap cerita kehidupan' },
    { code: 'Dc5t48xGOq6', img: 'img/social/Dc5t48xGOq6.jpg', alt: 'New arrival: Eyelet Cotton Shirt' },
    { code: 'DdgXN8PGAjc', img: 'img/social/DdgXN8PGAjc.jpg', alt: 'Love Button Cardigan' },
    { code: 'DeEIg8ymLsQ', img: 'img/social/DeEIg8ymLsQ.jpg', alt: 'Babydoll Evening' },
    { code: 'DfwuTumz8mB', img: 'img/social/DfwuTumz8mB.jpg', alt: 'Live Shopee HARIAKU' },
    { code: 'DbfHoukzUEe', img: 'img/social/DbfHoukzUEe.jpg', alt: 'Coming soon' }
  ];
})();
