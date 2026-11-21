/* Try Me — standalone page */
HK.ready(function () {
  HKTryOn.mount(document.querySelector('[data-tryon]'), { reveal: 'sweep' });
  var L = window.HK_LOOKS || {}, n = Object.keys(L.avatars || {}).length;
  Object.keys(L.looks || {}).forEach(function (k) { n += Object.keys(L.looks[k]).length; });
  document.querySelector('[data-count]').textContent = n;
  document.querySelector('[data-bar]').style.width = Math.min(100, n / 84 * 100) + '%';
  HKButterfly.init({ size: 42, ink: '#9A4826', thread: false });
});
