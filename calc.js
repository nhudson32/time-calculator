// Shared maths and rendering for the Instagram time calculator.
var NH = (function () {
  var KEY = "nh-time-calculator";
  var FEE = 749;
  var WEEKS_PER_MONTH = 52 / 12;
  var DEFAULTS = { posts: 3, ideas: 20, caption: 25, design: 30, reels: 1, reelTime: 60, faff: 45, rate: 80 };

  function mins(m) {
    if (m < 60) return Math.round(m) + " min";
    var h = Math.floor(m / 60), r = Math.round(m % 60);
    if (r === 60) { h += 1; r = 0; }
    return h + " hr" + (r ? " " + r + " min" : "");
  }
  function hrs(m) {
    var h = m / 60;
    return (h < 10 ? h.toFixed(1).replace(/\.0$/, "") : Math.round(h)) + " hrs";
  }
  function euro(n) { return "€" + Math.round(n).toLocaleString("en-GB"); }

  function compute(v) {
    var wk = {
      ideas: v.posts * v.ideas,
      caption: v.posts * v.caption,
      design: v.posts * v.design,
      reels: v.reels * v.reelTime,
      faff: v.faff
    };
    var week = wk.ideas + wk.caption + wk.design + wk.reels + wk.faff;
    var month = week * WEEKS_PER_MONTH;
    return { wk: wk, month: month, year: week * 52, money: (month / 60) * v.rate };
  }

  function set(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }

  function render(v) {
    var r = compute(v);
    Object.keys(r.wk).forEach(function (k) { set("r-" + k, hrs(r.wk[k] * WEEKS_PER_MONTH)); });
    set("r-month", hrs(r.month));
    set("r-money", euro(r.money));
    set("r-year", hrs(r.year));
    set("r-weeks", (r.year / 60 / 40).toFixed(1).replace(/\.0$/, ""));

    var h = r.month / 60, verdict;
    if (h === 0) verdict = "Zero. Then you genuinely don’t need me, and I respect that.";
    else if (h < 5) verdict = "Not huge. But it’s rarely the hours, it’s the thinking about it.";
    else if (h < 15) verdict = "That’s a few client sessions a month, gone on captions.";
    else verdict = "That’s a part-time job you didn’t apply for.";
    set("r-verdict", verdict);

    var base = "I write it, design it, edit it and schedule it. You spend about twenty minutes approving it.";
    set("compare", r.money > FEE
      ? "Your time on this is worth " + euro(r.money) + " a month. Done for you is €749. " + base
      : "Done for you is €749 a month. " + base);
  }

  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  return { mins: mins, render: render, save: save, load: load, DEFAULTS: DEFAULTS };
})();
