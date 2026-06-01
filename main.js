// STACKLY Landing Page Script

document.addEventListener("DOMContentLoaded", () => {
  initPageLoader();
  initLenisScroll();
  initGSAPAnimations();
  initCustomTabs();
  initSolutionsSlider();
  initThreeJSParticles();
  initMobileMenu();
  updateCurrentYear();
});

// 1. Page Loader
function initPageLoader() {
  const loader = document.getElementById("pageLoader");
  const loaderGrid = document.getElementById("loaderGrid");
  
  if (!loader) return;
  
  // Dynamically generate rows and blocks for split reveal transition
  const rowCount = 4;
  const blockCount = 16;
  
  for (let r = 0; r < rowCount; r++) {
    const row = document.createElement("div");
    row.classList.add("loader-row");
    
    for (let b = 0; b < blockCount; b++) {
      const block = document.createElement("div");
      block.classList.add("loader-block");
      row.appendChild(block);
    }
    
    loaderGrid.appendChild(row);
  }
  
  window.addEventListener("load", () => {
    // Transition loader out
    const blocks = document.querySelectorAll(".loader-block");
    const rows = document.querySelectorAll(".loader-row");
    
    gsap.timeline({
      onComplete: () => {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 800);
      }
    })
    .to(".page-loader_logo", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
    .to(blocks, {
      scaleX: 0,
      duration: 0.8,
      ease: "power2.inOut",
      stagger: {
        amount: 0.4,
        from: "random"
      }
    }, "-=0.2");
  });
  
  // Safe fallback if window load takes too long
  setTimeout(() => {
    if (loader.style.display !== "none") {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 800);
    }
  }, 3000);
}

// 2. Lenis Smooth Scroll
let lenisInstance = null;
function initLenisScroll() {
  if (typeof Lenis === "undefined") return;
  
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    infinite: false
  });
  
  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
}

// 3. GSAP Entrance and Parallax Animations
function initGSAPAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Reveal Hero Text
  const heroLines = document.querySelectorAll(".hero-reveal-line span");
  if (heroLines.length === 0) {
    // If not wrapped in span, do it dynamically
    const revealWrappers = document.querySelectorAll(".hero-reveal-line");
    revealWrappers.forEach(wrap => {
      const text = wrap.textContent.trim();
      wrap.innerHTML = `<span>${text}</span>`;
    });
  }
  
  gsap.timeline()
    .to(".hero-reveal-line span", {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.15,
      delay: 0.5
    })
    .from(".home-header_content", {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: "power3.out"
    }, "-=1.0")
    .from(".home-header_content-line", {
      scaleY: 0,
      transformOrigin: "top center",
      duration: 1.5,
      ease: "power3.out"
    }, "-=1.2");
  
  // Parallax scroll on tech campus image
  const campusImg = document.getElementById("campusImg");
  if (campusImg) {
    gsap.to(campusImg, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-tech_component",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
  
  // Entrance animations for standard elements
  const animateElements = document.querySelectorAll("[data-animate-y]");
  animateElements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });
  
  const animateScaleElements = document.querySelectorAll("[data-animate-scale]");
  animateScaleElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });
  
  // Detail texts scrolling reveal line by line (Simulated)
  const detailTexts = document.querySelectorAll("[data-animate-detail-text]");
  detailTexts.forEach(text => {
    gsap.fromTo(text,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: text,
          start: "top 90%"
        }
      }
    );
  });
  
  // Header scroll shadow class
  ScrollTrigger.create({
    start: "top -50px",
    onUpdate: (self) => {
      const header = document.getElementById("mainHeader");
      if (self.scroll() > 50) {
        header.classList.add("is-navbar-scrolled");
      } else {
        header.classList.remove("is-navbar-scrolled");
      }
    }
  });
}

// 4. Custom Tabs Component Logic
function initCustomTabs() {
  const tabsNav = document.querySelector(".tabs_nav");
  const tabItems = document.querySelectorAll(".tabs_nav-item");
  const tabs = document.querySelectorAll(".tabs_tab");
  const activeLine = document.getElementById("tabActiveLine");
  
  if (!tabsNav || tabItems.length === 0) return;
  
  function updateActiveLine(activeTab) {
    const tabRect = activeTab.getBoundingClientRect();
    const navRect = tabsNav.getBoundingClientRect();
    const leftOffset = tabRect.left - navRect.left + tabsNav.scrollLeft;
    
    activeLine.style.width = `${tabRect.width}px`;
    activeLine.style.transform = `translateX(${leftOffset}px)`;
  }
  
  // Initialize line position
  setTimeout(() => {
    const initialActive = document.querySelector(".tabs_nav-item.is-active");
    if (initialActive) updateActiveLine(initialActive);
  }, 100);
  
  tabItems.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      // Remove active states
      tabItems.forEach(t => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tabs.forEach(p => p.classList.remove("is-active"));
      
      // Set active state on clicked
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      updateActiveLine(tab);
      
      // Show matching panel
      const targetId = tab.getAttribute("data-tab-target");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("is-active");
        
        // Animate image and texts inside tab
        const img = targetPanel.querySelector(".tab_img");
        const texts = targetPanel.querySelector(".tab_content-overlay");
        
        gsap.fromTo(img, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" });
        gsap.fromTo(texts, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" });
      }
    });
  });
  
  window.addEventListener("resize", () => {
    const activeTab = document.querySelector(".tabs_nav-item.is-active");
    if (activeTab) updateActiveLine(activeTab);
  });
}

// 5. Custom Solutions Swiper/Slider Logic (Swipeable)
function initSolutionsSlider() {
  const slider = document.getElementById("solutionsSlider");
  const track = slider ? slider.querySelector(".slider_track") : null;
  const slides = slider ? slider.querySelectorAll(".slider_slide") : [];
  const dotsContainer = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("sliderPrevBtn");
  const nextBtn = document.getElementById("sliderNextBtn");
  
  if (!slider || !track || slides.length === 0) return;
  
  let currentIndex = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let animationID = 0;
  
  // Calculate spaces
  const gap = 24; // matches stylesheet padding
  
  // Generate dots
  slides.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.classList.add("slider_dot");
    if (idx === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => slideTo(idx));
    dotsContainer.appendChild(dot);
  });
  
  const dots = dotsContainer.querySelectorAll(".slider_dot");
  
  function getSlideWidth() {
    return slides[0].getBoundingClientRect().width;
  }
  
  function slideTo(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    const slideWidth = getSlideWidth();
    currentTranslate = -currentIndex * (slideWidth);
    prevTranslate = currentTranslate;
    
    // Animate transition
    track.style.transition = "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)";
    setSliderPosition();
    
    // Update active class on slides
    slides.forEach((slide, idx) => {
      const img = slide.querySelector(".home-sector_image");
      if (idx === currentIndex) {
        slide.classList.add("is-active");
        if (img) img.style.transform = "scale(1.2)";
      } else {
        slide.classList.remove("is-active");
        if (img) img.style.transform = "scale(1)";
      }
    });
    
    // Update Dots
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) dot.classList.add("is-active");
      else dot.classList.remove("is-active");
    });
    
    // Update Nav buttons state
    if (currentIndex === 0) prevBtn.style.opacity = "0.5";
    else prevBtn.style.opacity = "1";
    
    if (currentIndex === slides.length - 1) nextBtn.style.opacity = "0.5";
    else nextBtn.style.opacity = "1";
  }
  
  // Click Events
  prevBtn.addEventListener("click", () => slideTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => slideTo(currentIndex + 1));
  
  // Touch / Drag event handlers for swipe
  slider.addEventListener("mousedown", dragStart);
  slider.addEventListener("touchstart", dragStart, { passive: true });
  slider.addEventListener("mouseup", dragEnd);
  slider.addEventListener("mouseleave", dragEnd);
  slider.addEventListener("touchend", dragEnd);
  slider.addEventListener("mousemove", dragMove);
  slider.addEventListener("touchmove", dragMove, { passive: true });
  
  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = "none";
    animationID = requestAnimationFrame(animationLoop);
  }
  
  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
  }
  
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Snap conditions
    if (movedBy < -100 && currentIndex < slides.length - 1) {
      slideTo(currentIndex + 1);
    } else if (movedBy > 100 && currentIndex > 0) {
      slideTo(currentIndex - 1);
    } else {
      slideTo(currentIndex);
    }
  }
  
  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }
  
  function animationLoop() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animationLoop);
  }
  
  function setSliderPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }
  
  // Resize handler
  window.addEventListener("resize", () => slideTo(currentIndex));
  slideTo(0);
}

// 6. Three.js Particle Grid Wave Animation
function initThreeJSParticles() {
  const container = document.getElementById("particles-footer-canvas");
  const ctaContainer = document.getElementById("ctaParticles");
  
  if (!container && !ctaContainer) return;
  
  // --- Footer Particles ---
  if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 25;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Configuration
    const lineCount = 4;
    const dotsPerLine = 35;
    const spacing = 1.0;
    const dotsTotal = lineCount * dotsPerLine;
    
    const positions = new Float32Array(dotsTotal * 3);
    const initialPositions = [];
    
    let index = 0;
    for (let l = 0; l < lineCount; l++) {
      const y = (l - (lineCount - 1) / 2) * spacing * 1.5;
      
      for (let d = 0; d < dotsPerLine; d++) {
        const x = (d - (dotsPerLine - 1) / 2) * spacing * 1.2;
        const z = (Math.random() - 0.5) * 5;
        
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;
        
        initialPositions.push({ x, y, z, offset: Math.random() * Math.PI * 2 });
        index++;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create Circle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff'; // STACKLY Tech Accent Teal
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    
    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: texture,
      transparent: true,
      alphaTest: 0.1,
      depthWrite: false
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    // Animation loop
    let clock = new THREE.Clock();
    
    function animate() {
      requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      const posArr = geometry.attributes.position.array;
      
      for (let i = 0; i < dotsTotal; i++) {
        const data = initialPositions[i];
        
        // Flow in sine wave
        const wave = Math.sin(data.x * 0.2 + time * 1.5 + data.offset) * 1.5;
        posArr[i * 3 + 1] = data.y + wave;
        posArr[i * 3 + 2] = data.z + Math.cos(data.x * 0.1 + time) * 2;
      }
      
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener("resize", () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }
}



// 8. Mobile Menu hamburger logic
function initMobileMenu() {
  const hamburger = document.getElementById("hamburgerMenu");
  const navbar = document.getElementById("mainHeader");
  const links = document.querySelectorAll(".navbar_link");
  
  if (!hamburger) return;
  
  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("is-menu-opened");
  });
  
  // Close menu on link clicks
  links.forEach(link => {
    link.addEventListener("click", () => {
      navbar.classList.remove("is-menu-opened");
    });
  });
}

// 9. Current Year Utility
function updateCurrentYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
