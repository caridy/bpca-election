(function(){
  function clamp(n, lo, hi){ return Math.max(lo, Math.min(hi, n)); }

  function initOne(root){
    if (!root || root.dataset.bpGalleryInit === '1') return;
    var track = root.querySelector('.bp-gallery__track');
    var slides = root.querySelectorAll('.bp-gallery__slide');
    if (!track || !slides.length) return;

    var idx = clamp(Number(root.getAttribute('data-initial')) || 0, 0, slides.length - 1);
    var prev = root.querySelector('[data-gallery-prev]');
    var next = root.querySelector('[data-gallery-next]');
    var dots = root.querySelectorAll('.bp-gallery__dot');

    function render(){
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      if (prev) prev.disabled = (idx === 0);
      if (next) next.disabled = (idx === slides.length - 1);
      for (var i = 0; i < dots.length; i++){
        dots[i].classList.toggle('is-active', i === idx);
      }
    }

    function goTo(i){
      idx = clamp(i, 0, slides.length - 1);
      render();
    }

    if (prev) prev.addEventListener('click', function(){ goTo(idx - 1); });
    if (next) next.addEventListener('click', function(){ goTo(idx + 1); });

    for (var d = 0; d < dots.length; d++){
      (function(dot, i){
        dot.addEventListener('click', function(){ goTo(i); });
      })(dots[d], d);
    }

    // Touch swipe: lightweight, no momentum.
    var startX = null;
    var moved = false;
    track.addEventListener('pointerdown', function(e){
      if (e.pointerType === 'mouse') return;
      startX = e.clientX;
      moved = false;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function(e){
      if (startX == null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 12) moved = true;
    });
    track.addEventListener('pointerup', function(e){
      if (startX == null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (!moved) return;
      if (dx < -30) goTo(idx + 1);
      if (dx > 30) goTo(idx - 1);
    });

    // Keyboard: when focused inside the gallery.
    root.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft') goTo(idx - 1);
      if (e.key === 'ArrowRight') goTo(idx + 1);
    });

    render();
    root.dataset.bpGalleryInit = '1';
  }

  function initAll(){
    var roots = document.querySelectorAll('.bp-gallery');
    for (var i = 0; i < roots.length; i++){
      initOne(roots[i]);
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

