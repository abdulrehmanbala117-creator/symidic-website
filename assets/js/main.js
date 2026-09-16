/* ========================================================================
   Symidic — Main JavaScript
   Nav, scroll reveals, parallax, scroll progress, scroll-spy, video load
   ======================================================================== */
(function () {
  "use strict";

  /* --- Mobile Nav Toggle ---------------------------------------------- */
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
      menuBtn.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
        menuBtn.classList.remove("open");
      });
    });
  }

  /* --- Scroll Reveal (IntersectionObserver) --------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* --- Scroll Progress Bar -------------------------------------------- */
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* --- Scroll-Spy (active nav link) ----------------------------------- */
  const spyLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a[href^='#']")
  );
  if (spyLinks.length) {
    const sections = spyLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = "#" + e.target.id;
            spyLinks.forEach((a) => {
              a.classList.toggle("active", a.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spyObserver.observe(s));
  }

  /* --- Mouse Parallax on Hero Visual --------------------------------- */
  const heroVisual = document.querySelector(".hero-visual");
  const visualCore = document.querySelector(".visual-core");
  if (heroVisual && visualCore) {
    let targetX = 0,
      targetY = 0;
    let currentX = 0,
      currentY = 0;

    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = y * 12;
    });

    heroVisual.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
    });

    function animateParallax() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      visualCore.style.transform =
        "translate(" + currentX + "px, " + currentY + "px)";
      requestAnimationFrame(animateParallax);
    }

    // Only run parallax if no reduced-motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (mq.matches) {
      requestAnimationFrame(animateParallax);
    }
  }

  /* --- Navbar Background on Scroll ------------------------------------ */
  const nav = document.querySelector(".nav");
  if (nav) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (window.scrollY > 20) {
              nav.style.background = "rgba(5,6,10,0.92)";
            } else {
              nav.style.background = "rgba(5,6,10,0.75)";
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --- Smooth Scroll for Anchor Links --------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* --- Lazy-load / click-to-play YouTube embed ------------------------ */
  const ytContainer = document.querySelector(".video-container[data-src]");
  if (ytContainer) {
    const placeholder = ytContainer.querySelector(".video-placeholder");
    const ytObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (placeholder) placeholder.classList.add("vp-ready");
            ytObserver.unobserve(ytContainer);
          }
        });
      },
      { rootMargin: "150px" }
    );
    ytObserver.observe(ytContainer);

    const loadVideo = (src) => {
      ytContainer.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.title = "Symidic AI demo video — AI customer support for Shopify";
      iframe.loading = "lazy";
      ytContainer.appendChild(iframe);
    };

    if (placeholder) {
      placeholder.addEventListener("click", () => {
        loadVideo(ytContainer.dataset.src);
      });
      placeholder.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          loadVideo(ytContainer.dataset.src);
        }
      });
    }
  }
})();