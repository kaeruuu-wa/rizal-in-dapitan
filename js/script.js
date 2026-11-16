(function () {
  'use strict';

  /* Mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var links = document.getElementById('links');
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Timeline */
  var tlButtons = document.querySelectorAll('.tl button');
  function setItem(btn, open) {
    btn.setAttribute('aria-expanded', open);
    btn.nextElementSibling.classList.toggle('open', open);
  }
  tlButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setItem(btn, btn.getAttribute('aria-expanded') !== 'true');
    });
  });
  document.getElementById('expand-all').addEventListener('click', function () {
    tlButtons.forEach(function (b) { setItem(b, true); });
  });
  document.getElementById('collapse-all').addEventListener('click', function () {
    tlButtons.forEach(function (b) { setItem(b, false); });
  });

  /* Contribution tabs */
  var tabs = document.querySelectorAll('[role=tab]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  /* Gallery lightbox */
  var shots = document.querySelectorAll('.grid button');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var idx = 0, opener = null;
  function show(i) {
    idx = (i + shots.length) % shots.length;
    var img = shots[idx].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = shots[idx].parentElement.querySelector('figcaption').textContent;
  }
  function closeLb() {
    lb.hidden = true;
    if (opener) opener.focus();
  }
  shots.forEach(function (b, i) {
    b.addEventListener('click', function () {
      opener = b;
      show(i);
      lb.hidden = false;
      lb.querySelector('.lb-close').focus();
    });
  });
  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* Quiz (every answer is covered on this site) */
  var questions = [
    { q: 'In what year did Rizal arrive in Dapitan?', o: ['1890', '1892', '1894', '1896'], a: 1 },
    { q: 'Aboard which steamer did Rizal arrive in Dapitan?', o: ['España', 'Castilla', 'Cebu', 'Manila'], a: 2 },
    { q: 'Who ordered Rizal\'s exile to Dapitan?', o: ['Ricardo Carnicero', 'Eulogio Despujol', 'George Taufer', 'Pablo Pastells'], a: 1 },
    { q: 'Where did Rizal build his home, school and hospital?', o: ['Talisay', 'Calamba', 'Dumaguete', 'Zamboanga'], a: 0 },
    { q: 'Which language did Rizal teach his students besides Spanish?', o: ['English', 'French', 'German', 'Latin'], a: 0 },
    { q: 'What did Rizal build to bring water to Dapitan?', o: ['A canal and lock', 'A well and pump', 'A dam and aqueduct', 'A windmill'], a: 2 },
    { q: 'Which species was named in honor of Rizal?', o: ['Draco rizali', 'Draco dapitanensis', 'Rana mindanao', 'Apis rizali'], a: 0 },
    { q: 'Where did Josephine Bracken come from before arriving in Dapitan?', o: ['Manila', 'Cebu', 'Hong Kong', 'Madrid'], a: 2 },
    { q: 'On what date did Rizal leave Dapitan?', o: ['July 17, 1892', 'January 1, 1895', 'July 31, 1896', 'December 30, 1896'], a: 2 }
  ];
  var box = document.getElementById('quiz-box');
  var cur = 0, score = 0;

  function render() {
    if (cur >= questions.length) return result();
    var item = questions[cur];
    box.innerHTML = '';
    var meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = 'Question ' + (cur + 1) + ' of ' + questions.length + ' · Score: ' + score;
    var h = document.createElement('h3');
    h.textContent = item.q;
    box.appendChild(meta);
    box.appendChild(h);
    var fb = document.createElement('p');
    fb.className = 'fb';
    var next = document.createElement('button');
    next.className = 'btn small';
    next.textContent = cur === questions.length - 1 ? 'See results' : 'Next question';
    next.hidden = true;
    next.addEventListener('click', function () { cur++; render(); });
    var btns = item.o.map(function (text, i) {
      var b = document.createElement('button');
      b.className = 'opt';
      b.textContent = text;
      b.addEventListener('click', function () {
        btns.forEach(function (x, j) {
          x.disabled = true;
          if (j === item.a) x.classList.add('right');
        });
        if (i === item.a) {
          score++;
          fb.textContent = 'Correct.';
        } else {
          b.classList.add('wrong');
          fb.textContent = 'Not quite. The correct answer is: ' + item.o[item.a] + '.';
        }
        meta.textContent = 'Question ' + (cur + 1) + ' of ' + questions.length + ' · Score: ' + score;
        next.hidden = false;
        next.focus();
      });
      box.appendChild(b);
      return b;
    });
    box.appendChild(fb);
    box.appendChild(next);
  }

  function result() {
    var pct = Math.round(score / questions.length * 100);
    var msg = pct >= 80 ? 'Excellent work.' : pct >= 50 ? 'Good effort. Review the timeline and try again.' : 'Review the exhibit and try again.';
    box.innerHTML = '';
    var h = document.createElement('h3');
    h.textContent = 'Your score: ' + score + ' / ' + questions.length + ' (' + pct + '%)';
    var p = document.createElement('p');
    p.textContent = msg;
    var r = document.createElement('button');
    r.className = 'btn';
    r.textContent = 'Retake quiz';
    r.addEventListener('click', function () { cur = 0; score = 0; render(); });
    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(r);
  }

  render();
})();
