(function(){
  function clamp01to100(v){
    var n = Number(v);
    if (!Number.isFinite(n)) n = 0;
    if (n < 0) n = 0;
    if (n > 100) n = 100;
    return n;
  }

  function initOne(el){
    if (!el || el.dataset.imgCompareInit === '1') return;
    var range = el.querySelector('.img-compare__range');
    if (!range) return;

    function setPos(v){
      var n = clamp01to100(v);
      el.style.setProperty('--pos', n + '%');
    }

    var initial = el.getAttribute('data-initial');
    if (initial != null && initial !== ''){
      range.value = String(clamp01to100(initial));
    }

    setPos(range.value);
    range.addEventListener('input', function(){ setPos(range.value); });
    el.dataset.imgCompareInit = '1';
  }

  function initAll(){
    var els = document.querySelectorAll('.img-compare');
    for (var i = 0; i < els.length; i++){
      initOne(els[i]);
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

