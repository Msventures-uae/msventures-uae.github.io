(function () {
  "use strict";
  var PHONE = "971554565699";
  var EMAIL = "manichesharma@gmail.com";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Highlight the current section in the nav
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) io.observe(s);
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Quote form: builds a WhatsApp or email message. Nothing is sent to or stored on this site.
  var form = document.getElementById("quote-form");
  if (!form) return;
  var err = document.getElementById("form-error");

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function buildMessage() {
    var lines = ["Hello MS Ventures, I would like a quotation for engine parts.", ""];
    var rows = [
      ["Engine make", val("f-make")],
      ["Engine model", val("f-model")],
      ["Serial / part number", val("f-part")],
      ["Quantity", val("f-qty")],
      ["Destination country", val("f-dest")],
      ["Name", val("f-name")],
      ["Company", val("f-company")]
    ];
    rows.forEach(function (r) { if (r[1]) lines.push(r[0] + ": " + r[1]); });
    var msg = val("f-message");
    if (msg) { lines.push(""); lines.push("Message: " + msg); }
    return lines.join("\n");
  }

  function validate() {
    var problems = [];
    if (!val("f-name")) problems.push("your name");
    if (!val("f-model") && !val("f-part")) problems.push("an engine model or a serial or part number");
    if (problems.length) {
      err.textContent = "Please enter " + problems.join(" and ") + ".";
      err.hidden = false;
      return false;
    }
    err.hidden = true;
    return true;
  }

  function waUrl(text) {
    return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
  }

  function mailUrl(text) {
    var subject = "Quotation request" + (val("f-make") ? ": " + val("f-make") : "") + (val("f-model") ? " " + val("f-model") : "");
    return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(text.replace(/\n/g, "\r\n"));
  }

  // Exposed for testing only
  window.msvQuote = { build: buildMessage, wa: waUrl, mail: mailUrl };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var url = waUrl(buildMessage());
    var w = window.open(url, "_blank");
    if (w) { w.opener = null; } else { window.location.href = url; }
  });

  document.getElementById("send-mail").addEventListener("click", function () {
    if (!validate()) return;
    window.location.href = mailUrl(buildMessage());
  });
})();
