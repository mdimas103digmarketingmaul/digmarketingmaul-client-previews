/* Option 02: two model photos share the same layout; the live screen re-pins on swap. */
(function () {
  var QUADS = {
    'man': [[0.6698, 0.2836], [0.86828, 0.27943], [0.87656, 0.63639], [0.67898, 0.63933]],
    'man-peci': [[0.67453, 0.29323], [0.87769, 0.29153], [0.87703, 0.65123], [0.67453, 0.65049]]
  };
  var current = 'man', img = document.querySelector('[data-person]');

  // Offsets from the phone centre so cards stay attached to it at any viewport.
  function slot(dx, dy, mx, my) {
    return function (w, h) {
      if (w < 900) return [w / 2 + mx * w, my * h];
      var shotH = h * 1.16, shotW = shotH * .806, left = w * .56 - shotW * .46;
      return [left + shotW * .772 + dx * h, dy * h];
    };
  }

  HB.runPhoneHero({
    quad: function () { return QUADS[current]; },
    delay: 1000,
    radius: 34,
    beat: 2600,
    slots: [
      { id: 'haji',    pos: slot(.27, .39, 0, 0),   rot: 4,  depth: 18, cls: 'only-lg' },
      { id: 'qurban',  pos: slot(.285, .74, .02, .655),   rot: -3, depth: 26 },
      { id: 'rumah',   pos: slot(-.37, .83, -.31, .625), rot: -4, depth: 16 },
      { id: 'sedekah', pos: slot(-.62, .46, 0, 0),      rot: 3,  depth: 28, cls: 'only-lg' }
    ]
  }).then(function (r) {
    document.querySelectorAll('[data-v]').forEach(function (b) {
      b.addEventListener('click', function () {
        current = b.dataset.v;
        document.querySelectorAll('[data-v]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        img.src = '../shared/assets/photo/' + current + '.webp';
        r.repin();
      });
    });
  });
})();
