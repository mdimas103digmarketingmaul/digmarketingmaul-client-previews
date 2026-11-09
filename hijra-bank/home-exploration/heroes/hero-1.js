/* Option 01: slots are offsets from the phone centre, in units of hero height. */
(function () {
  var QUAD = [[0.34016, 0.17197], [0.64952, 0.17138], [0.64836, 0.67834], [0.34248, 0.67899]];
  var hero = document.querySelector('.hero'), hint = document.querySelector('[data-hint]');

  function slot(dx, dy, mx, my) {
    return function (w, h) {
      if (w < 900) return [w / 2 + mx * w, my * h];
      return [w * .665 + dx * h, dy * h];
    };
  }

  HB.runPhoneHero({
    quad: function () { return QUAD; },
    delay: 900,
    radius: 62,
    onTint: function (b) { hero.style.setProperty('--tint', b.hex); },
    slots: [
      { id: 'haji',    pos: slot(-.33, .24, -.34, .24), rot: -5, depth: 22 },
      { id: 'qurban',  pos: slot(.345, .27, .34, .36),  rot: 4,  depth: 16 },
      { id: 'darurat', pos: slot(.405, .63, .34, .70),   rot: -3, depth: 26 },
      { id: 'rumah',   pos: slot(-.40, .80, -.34, .60), rot: 4,  depth: 18 },
      { id: 'sedekah', pos: slot(.21, .86, 0, 0),       rot: 2,  depth: 30, cls: 'only-lg' }
    ]
  });

  document.querySelector('[data-stage]').addEventListener('pointerdown', function (e) {
    if (e.target.closest('.fl')) hint.classList.add('off');
  });
})();
