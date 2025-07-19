// ==========================================
// ANIMATED PARTICLES BACKGROUND SYSTEM
// ==========================================

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.mousePosition = { x: 0, y: 0 };
    this.isActive = true;
    this.animationId = null;

    this.config = {
      particleCount: window.innerWidth < 768 ? 50 : 100,
      particleSize: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      connectionDistance: 120,
      mouseInfluence: 100,
      colors: {
        light: [
          "#007bff",
          "#0056b3",
          "#6c757d",
          "#28a745",
          "#f8b4cb",
          "#fce7f3",
          "#ec4899",
        ],
        dark: [
          "#4dabf7",
          "#74c0fc",
          "#adb5bd",
          "#51cf66",
          "#f472b6",
          "#f9a8d4",
          "#ec4899",
        ],
      },
    };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";

    this.ctx.scale(dpr, dpr);

    // Adjust particle count based on screen size
    this.config.particleCount =
      window.innerWidth < 768 ? 50 : window.innerWidth < 1200 ? 75 : 100;
  }

  createParticles() {
    this.particles = [];
    const colors = document.body.classList.contains("dark-mode")
      ? this.config.colors.dark
      : this.config.colors.light;

    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.offsetWidth,
        y: Math.random() * this.canvas.offsetHeight,
        vx: (Math.random() - 0.5) * this.config.speed.max,
        vy: (Math.random() - 0.5) * this.config.speed.max,
        size:
          Math.random() *
            (this.config.particleSize.max - this.config.particleSize.min) +
          this.config.particleSize.min,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  bindEvents() {
    window.addEventListener(
      "resize",
      debounce(() => {
        this.resize();
        this.createParticles();
      }, 250)
    );

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition.x = e.clientX - rect.left;
      this.mousePosition.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mousePosition.x = -1000;
      this.mousePosition.y = -1000;
    });

    // Theme change detection
    const observer = new MutationObserver(() => {
      this.createParticles();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  updateParticle(particle) {
    // Mouse influence
    const dx = this.mousePosition.x - particle.x;
    const dy = this.mousePosition.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.config.mouseInfluence) {
      const force =
        (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
      particle.vx -= (dx / distance) * force * 0.01;
      particle.vy -= (dy / distance) * force * 0.01;
    }

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Boundary collision
    if (particle.x < 0 || particle.x > this.canvas.offsetWidth) {
      particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > this.canvas.offsetHeight) {
      particle.vy *= -1;
    }

    // Keep particles in bounds
    particle.x = Math.max(0, Math.min(this.canvas.offsetWidth, particle.x));
    particle.y = Math.max(0, Math.min(this.canvas.offsetHeight, particle.y));

    // Damping
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  }

  drawParticle(particle) {
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
      .toString(16)
      .padStart(2, "0")}`;
    this.ctx.fill();
  }

  drawConnections() {
    const connectionOpacity = document.body.classList.contains("dark-mode")
      ? 0.1
      : 0.15;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.connectionDistance) {
          const opacity =
            (1 - distance / this.config.connectionDistance) * connectionOpacity;

          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(${
            document.body.classList.contains("dark-mode")
              ? "255,255,255"
              : "0,123,255"
          }, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

    // Update and draw particles
    this.particles.forEach((particle) => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    // Draw connections
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  pause() {
    this.isActive = false;
  }

  resume() {
    if (!this.isActive) {
      this.isActive = true;
      this.animate();
    }
  }
}

// Initialize particles system
let particleSystem = null;

function initializeParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  // Check for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  particleSystem = new ParticleSystem(canvas);

  // Pause particles when page is not visible for performance
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      particleSystem?.pause();
    } else {
      particleSystem?.resume();
    }
  });
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS & UTILITIES
// ==========================================

// Debounce function for performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading and animations
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.1,
};

// Animation observer for scroll-triggered animations
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      // Trigger number counting animation for stats
      if (entry.target.classList.contains("stat-number")) {
        animateNumber(entry.target);
      }
    }
  });
}, observerOptions);

// Lazy loading observer for images
const lazyImageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add("loaded");
      lazyImageObserver.unobserve(img);
    }
  });
}, observerOptions);

// ==========================================
// DOM CONTENT LOADED - INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("CodeWave Web App Initialized");

  // Initialize all components
  initializeLoader();
  initializeParticles();
  initializeNavigation();
  initializeScrollEffects();
  initializeThemeToggle();
  initializeFormValidation();
  initializeProductsSection();
  initializeModals();
  initializeAccessibility();
  initializePerformanceOptimizations();

  // Observe elements for animations
  observeAnimatedElements();

  // Initialize Service Worker for PWA functionality
  initializeServiceWorker();

  console.log("All components initialized successfully");
});

// ==========================================
// LOADING SCREEN
// ==========================================

function initializeLoader() {
  const loader = document.getElementById("loader");

  // Minimum loading time for better UX
  const minLoadTime = 1000;
  const startTime = Date.now();

  window.addEventListener("load", () => {
    const loadTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - loadTime);

    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "visible";

      // Remove loader from DOM after animation
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }, remainingTime);
  });
}

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================

function initializeNavigation() {
  const header = document.querySelector(".header");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("active");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add("active");
    mobileMenuToggle.classList.add("active");
    mobileMenuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    // Focus management
    const firstLink = navMenu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    navMenu.classList.remove("active");
    mobileMenuToggle.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    mobileMenuToggle.focus();
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar") && navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        scrollToSection(targetId);

        // Close mobile menu if open
        if (navMenu.classList.contains("active")) {
          closeMobileMenu();
        }

        // Update active nav link
        updateActiveNavLink(link);
      }
    });
  });

  // Navbar background on scroll
  const handleNavbarScroll = throttle(() => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, 100);

  window.addEventListener("scroll", handleNavbarScroll);

  // Update active nav link based on scroll position
  const updateActiveNavOnScroll = throttle(() => {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) {
          updateActiveNavLink(activeLink);
        }
      }
    });
  }, 100);

  window.addEventListener("scroll", updateActiveNavOnScroll);
}

function updateActiveNavLink(activeLink) {
  // Remove active class from all links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current link
  activeLink.classList.add("active");
}

// ==========================================
// SCROLL EFFECTS & ANIMATIONS
// ==========================================

function initializeScrollEffects() {
  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    const handleBackToTopScroll = throttle(() => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }, 100);

    window.addEventListener("scroll", handleBackToTopScroll);

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Parallax effects for hero section
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    const handleParallax = throttle(() => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = scrolled * 0.5;
      heroSection.style.transform = `translateY(${parallaxSpeed}px)`;
    }, 16); // 60fps

    window.addEventListener("scroll", handleParallax);
  }
}

function observeAnimatedElements() {
  // Observe all elements that should animate on scroll
  const animatedElements = document.querySelectorAll(
    ".service-card, .product-card, .stat-card, .contact-item, .about-content, .hero-content, .hero-visual"
  );

  animatedElements.forEach((el) => {
    animationObserver.observe(el);
  });
}

// ==========================================
// THEME TOGGLE (DARK MODE)
// ==========================================

function initializeThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  // Get saved theme or default to system preference
  const savedTheme = localStorage.getItem("theme");
  const currentTheme = savedTheme || (prefersDark.matches ? "dark" : "light");

  // Apply initial theme
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      const newTheme = isDark ? "light" : "dark";

      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);

      // Animate the toggle button
      themeToggle.style.transform = "scale(0.8)";
      setTimeout(() => {
        themeToggle.style.transform = "scale(1)";
      }, 150);
    });
  }

  // Listen for system theme changes
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

function applyTheme(theme) {
  const themeToggle = document.querySelector(".theme-toggle");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
}

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

function initializeFormValidation() {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) return;

  const formFields = {
    name: {
      element: document.getElementById("name"),
      validators: [
        { rule: "required", message: "Name is required" },
        {
          rule: "minLength",
          value: 2,
          message: "Name must be at least 2 characters",
        },
      ],
    },
    email: {
      element: document.getElementById("email"),
      validators: [
        { rule: "required", message: "Email is required" },
        { rule: "email", message: "Please enter a valid email address" },
      ],
    },
    message: {
      element: document.getElementById("message"),
      validators: [
        { rule: "required", message: "Message is required" },
        {
          rule: "minLength",
          value: 10,
          message: "Message must be at least 10 characters",
        },
      ],
    },
    privacy: {
      element: document.getElementById("privacy"),
      validators: [
        { rule: "required", message: "You must agree to the privacy policy" },
      ],
    },
  };

  // Real-time validation
  Object.keys(formFields).forEach((fieldName) => {
    const field = formFields[fieldName];
    if (field.element) {
      field.element.addEventListener("blur", () =>
        validateField(fieldName, field)
      );
      field.element.addEventListener(
        "input",
        debounce(() => {
          clearFieldError(fieldName);
          if (field.element.value.trim()) {
            validateField(fieldName, field);
          }
        }, 300)
      );
    }
  });

  // Form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = validateForm(formFields);

    if (isValid) {
      await submitForm(contactForm);
    } else {
      // Focus on first error field
      const firstError = contactForm.querySelector(
        ".error-message:not(:empty)"
      );
      if (firstError) {
        const fieldId = firstError.id.replace("-error", "");
        const field = document.getElementById(fieldId);
        if (field) field.focus();
      }
    }
  });
}

function validateField(fieldName, field) {
  const value = field.element.value.trim();
  const isCheckbox = field.element.type === "checkbox";

  for (const validator of field.validators) {
    let isValid = true;

    switch (validator.rule) {
      case "required":
        isValid = isCheckbox ? field.element.checked : value !== "";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        break;
      case "minLength":
        isValid = value.length >= validator.value;
        break;
    }

    if (!isValid) {
      showFieldError(fieldName, validator.message);
      return false;
    }
  }

  clearFieldError(fieldName);
  return true;
}

function validateForm(formFields) {
  let isValid = true;

  Object.keys(formFields).forEach((fieldName) => {
    const field = formFields[fieldName];
    if (!validateField(fieldName, field)) {
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const fieldElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  if (fieldElement) {
    fieldElement.classList.add("error");
    fieldElement.setAttribute("aria-invalid", "true");
  }
}

function clearFieldError(fieldName) {
  const errorElement = document.getElementById(`${fieldName}-error`);
  const fieldElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }

  if (fieldElement) {
    fieldElement.classList.remove("error");
    fieldElement.removeAttribute("aria-invalid");
  }
}

async function submitForm(form) {
  const submitBtn = form.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  // Show loading state
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success message
    showFormSuccess();
    form.reset();

    // Track form submission
    if (typeof gtag !== "undefined") {
      gtag("event", "form_submit", {
        event_category: "engagement",
        event_label: "contact_form",
      });
    }
  } catch (error) {
    console.error("Form submission error:", error);
    showFormError("Something went wrong. Please try again.");
  } finally {
    // Reset button state
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
}

function showFormSuccess() {
  const message = document.createElement("div");
  message.className = "alert alert-success";
  message.innerHTML = `
        <strong>Success!</strong> Your message has been sent. We'll get back to you soon.
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;

  const form = document.getElementById("contact-form");
  form.parentNode.insertBefore(message, form);

  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

function showFormError(errorMessage) {
  const message = document.createElement("div");
  message.className = "alert alert-error";
  message.innerHTML = `
        <strong>Error!</strong> ${errorMessage}
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;

  const form = document.getElementById("contact-form");
  form.parentNode.insertBefore(message, form);

  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

// ==========================================
// PRODUCTS SECTION
// ==========================================

function initializeProductsSection() {
  const productsGrid = document.getElementById("products-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const currentPageSpan = document.getElementById("current-page");
  const totalPagesSpan = document.getElementById("total-pages");

  let currentPage = 1;
  let currentFilter = "all";
  const itemsPerPage = 6;

  // Sample products data
  const products = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "web",
      price: "$2,499",
      features: [
        "Responsive Design",
        "Payment Integration",
        "Admin Dashboard",
        "SEO Optimized",
      ],
      icon: "🛒",
    },
    {
      id: 2,
      title: "Portfolio Website",
      category: "web",
      price: "$899",
      features: [
        "Modern Design",
        "CMS Integration",
        "Contact Forms",
        "Fast Loading",
      ],
      icon: "💼",
    },
    {
      id: 3,
      title: "iOS Mobile App",
      category: "mobile",
      price: "$4,999",
      features: [
        "Native iOS",
        "Push Notifications",
        "Offline Support",
        "App Store Ready",
      ],
      icon: "📱",
    },
    {
      id: 4,
      title: "Android App",
      category: "mobile",
      price: "$4,499",
      features: [
        "Material Design",
        "Google Services",
        "Play Store Ready",
        "Analytics",
      ],
      icon: "🤖",
    },
    {
      id: 5,
      title: "SaaS Dashboard",
      category: "saas",
      price: "$6,999",
      features: [
        "Multi-tenant",
        "Real-time Data",
        "API Integration",
        "Custom Reports",
      ],
      icon: "📊",
    },
    {
      id: 6,
      title: "CRM System",
      category: "saas",
      price: "$8,499",
      features: [
        "Lead Management",
        "Email Integration",
        "Sales Pipeline",
        "Analytics",
      ],
      icon: "📈",
    },
    {
      id: 7,
      title: "Corporate Website",
      category: "web",
      price: "$1,799",
      features: ["Professional Design", "Multi-language", "CMS", "SEO Ready"],
      icon: "🏢",
    },
    {
      id: 8,
      title: "Cross-Platform App",
      category: "mobile",
      price: "$7,999",
      features: [
        "React Native",
        "iOS & Android",
        "Push Notifications",
        "Cloud Sync",
      ],
      icon: "🔄",
    },
    {
      id: 9,
      title: "Project Management Tool",
      category: "saas",
      price: "$5,999",
      features: [
        "Task Management",
        "Team Collaboration",
        "Time Tracking",
        "Reports",
      ],
      icon: "📋",
    },
  ];

  // Initialize products
  renderProducts();
  updatePagination();

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active filter
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = filter;
      currentPage = 1;

      renderProducts();
      updatePagination();
    });
  });

  // Pagination functionality
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
        updatePagination();
        scrollToProducts();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        updatePagination();
        scrollToProducts();
      }
    });
  }

  function getFilteredProducts() {
    if (currentFilter === "all") {
      return products;
    }
    return products.filter((product) => product.category === currentFilter);
  }

  function renderProducts() {
    const filteredProducts = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    if (!productsGrid) return;

    // Clear existing products
    productsGrid.innerHTML = "";

    // Add products with stagger animation
    currentProducts.forEach((product, index) => {
      const productCard = createProductCard(product);
      productCard.style.opacity = "0";
      productCard.style.transform = "translateY(20px)";
      productsGrid.appendChild(productCard);

      // Animate in with delay
      setTimeout(() => {
        productCard.style.transition = "all 0.5s ease";
        productCard.style.opacity = "1";
        productCard.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <div class="product-image">
                <span class="product-icon">${product.icon}</span>
            </div>
            <div class="product-content">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price}</div>
                <ul class="product-features">
                    ${product.features
                      .map((feature) => `<li>${feature}</li>`)
                      .join("")}
                </ul>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="openProductModal(${
                      product.id
                    })">
                        <span>Learn More</span>
                        <span class="btn-icon">→</span>
                    </button>
                    <button class="btn btn-secondary" onclick="contactAboutProduct('${
                      product.title
                    }')">
                        <span>Get Quote</span>
                        <span class="btn-icon">💬</span>
                    </button>
                </div>
            </div>
        `;
    return card;
  }

  function updatePagination() {
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  function scrollToProducts() {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// ==========================================
// MODAL FUNCTIONALITY
// ==========================================

function initializeModals() {
  const modal = document.getElementById("service-modal");

  if (!modal) return;

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Close button
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
}

function openServiceModal(serviceType) {
  const modal = document.getElementById("service-modal");
  const modalBody = document.getElementById("modal-body");

  if (!modal || !modalBody) return;

  const serviceContent = getServiceContent(serviceType);
  modalBody.innerHTML = serviceContent;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus management
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();

  // Track modal opening
  if (typeof gtag !== "undefined") {
    gtag("event", "modal_open", {
      event_category: "engagement",
      event_label: serviceType,
    });
  }
}

function closeModal() {
  const modal = document.getElementById("service-modal");

  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // Return focus to trigger element
  const activeElement = document.activeElement;
  if (activeElement && activeElement.blur) {
    activeElement.blur();
  }
}

function getServiceContent(serviceType) {
  const services = {
    web: {
      title: "Web Development",
      description: "Custom web solutions built with modern technologies",
      features: [
        "Responsive Design",
        "Progressive Web Apps",
        "E-commerce Solutions",
        "CMS Integration",
        "Performance Optimization",
        "SEO Implementation",
      ],
      technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
      ],
      timeline: "4-12 weeks",
      price: "Starting from $2,500",
    },
    mobile: {
      title: "Mobile Development",
      description: "Native and cross-platform mobile applications",
      features: [
        "iOS & Android Apps",
        "React Native Development",
        "Flutter Applications",
        "App Store Optimization",
        "Push Notifications",
        "Offline Functionality",
      ],
      technologies: ["Swift", "Kotlin", "React Native", "Flutter", "Firebase"],
      timeline: "8-16 weeks",
      price: "Starting from $5,000",
    },
    design: {
      title: "UI/UX Design",
      description: "User-centered design for exceptional experiences",
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Visual Design",
        "Usability Testing",
        "Design Systems",
        "Accessibility Design",
      ],
      technologies: ["Figma", "Sketch", "Adobe XD", "Principle", "InVision"],
      timeline: "3-8 weeks",
      price: "Starting from $1,500",
    },
    cloud: {
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment",
      features: [
        "AWS/Azure/GCP Setup",
        "DevOps & CI/CD",
        "Serverless Architecture",
        "Container Orchestration",
        "Security Implementation",
        "Monitoring & Analytics",
      ],
      technologies: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
      timeline: "2-6 weeks",
      price: "Starting from $3,000",
    },
  };

  const service = services[serviceType];

  if (!service) return "<p>Service not found</p>";

  return `
        <div class="modal-header">
            <h2>${service.title}</h2>
            <p class="service-description">${service.description}</p>
        </div>
        
        <div class="modal-content-grid">
            <div class="service-details">
                <h3>What's Included</h3>
                <ul class="service-features-list">
                    ${service.features
                      .map((feature) => `<li>${feature}</li>`)
                      .join("")}
                </ul>
                
                <h3>Technologies Used</h3>
                <div class="technology-tags">
                    ${service.technologies
                      .map((tech) => `<span class="tech-tag">${tech}</span>`)
                      .join("")}
                </div>
            </div>
            
            <div class="service-info">
                <div class="info-card">
                    <h4>Timeline</h4>
                    <p>${service.timeline}</p>
                </div>
                
                <div class="info-card">
                    <h4>Investment</h4>
                    <p>${service.price}</p>
                </div>
                
                <button class="btn btn-primary" onclick="contactAboutService('${
                  service.title
                }')">
                    <span>Get Started</span>
                    <span class="btn-icon">🚀</span>
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const headerHeight = document.querySelector(".header").offsetHeight;
  const sectionTop = section.offsetTop - headerHeight;

  window.scrollTo({
    top: sectionTop,
    behavior: "smooth",
  });
}

function animateNumber(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000;
  const start = Date.now();
  const startValue = 0;

  function updateNumber() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(
      startValue + (target - startValue) * easeOutQuart
    );

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = target;
    }
  }

  updateNumber();
}

function openProductModal(productId) {
  console.log(`Opening product modal for product ${productId}`);
  // Implementation would open a detailed product modal
}

function contactAboutProduct(productTitle) {
  const serviceSelect = document.getElementById("service");
  const messageTextarea = document.getElementById("message");

  if (serviceSelect) {
    serviceSelect.value = "web"; // or determine based on product
  }

  if (messageTextarea) {
    messageTextarea.value = `I'm interested in learning more about ${productTitle}. Please provide more details.`;
  }

  scrollToSection("contact");
}

function contactAboutService(serviceTitle) {
  const serviceSelect = document.getElementById("service");
  const messageTextarea = document.getElementById("message");

  if (serviceSelect) {
    const serviceValue = serviceTitle.toLowerCase().includes("web")
      ? "web"
      : serviceTitle.toLowerCase().includes("mobile")
      ? "mobile"
      : serviceTitle.toLowerCase().includes("design")
      ? "design"
      : serviceTitle.toLowerCase().includes("cloud")
      ? "cloud"
      : "";
    serviceSelect.value = serviceValue;
  }

  if (messageTextarea) {
    messageTextarea.value = `I'm interested in ${serviceTitle} services. Please provide more information.`;
  }

  closeModal();
  scrollToSection("contact");
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

function initializeAccessibility() {
  // Skip link functionality
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("main-content");
      if (target) {
        target.focus();
        target.scrollIntoView();
      }
    });
  }

  // Keyboard navigation for custom elements
  document.addEventListener("keydown", (e) => {
    // Custom keyboard handlers
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-navigation");
  });

  // Announce dynamic content changes to screen readers
  const announceToScreenReader = (message) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Make announcements available globally
  window.announceToScreenReader = announceToScreenReader;
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

function initializePerformanceOptimizations() {
  // Lazy load images
  const lazyImages = document.querySelectorAll("img[data-src]");
  lazyImages.forEach((img) => {
    lazyImageObserver.observe(img);
  });

  // Preload critical resources
  const preloadResources = [
    { href: "style.css", as: "style" },
    { href: "script.js", as: "script" },
  ];

  preloadResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });

  // Optimize scroll performance
  let ticking = false;
  function optimizedScrollHandler() {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Scroll-dependent operations
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", optimizedScrollHandler);

  // Monitor performance
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
        }
        if (entry.entryType === "first-input") {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
      });
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input"],
    });
  }
}

// ==========================================
// SERVICE WORKER (PWA)
// ==========================================

function initializeServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered: ", registration);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content available
              showUpdateNotification();
            }
          });
        });
      } catch (registrationError) {
        console.log("SW registration failed: ", registrationError);
      }
    });
  }
}

function showUpdateNotification() {
  const notification = document.createElement("div");
  notification.className = "update-notification";
  notification.innerHTML = `
        <div class="notification-content">
            <span>New version available!</span>
            <button onclick="window.location.reload()">Update</button>
            <button onclick="this.parentElement.parentElement.remove()">Later</button>
        </div>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);
}

// ==========================================
// ERROR HANDLING & FALLBACKS
// ==========================================

window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error);

  // Report errors to analytics
  if (typeof gtag !== "undefined") {
    gtag("event", "exception", {
      description: e.error.toString(),
      fatal: false,
    });
  }
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

// ==========================================
// BROWSER COMPATIBILITY CHECKS
// ==========================================

function checkBrowserCompatibility() {
  const features = {
    fetch: "fetch" in window,
    intersectionObserver: "IntersectionObserver" in window,
    customElements: "customElements" in window,
    serviceWorker: "serviceWorker" in navigator,
  };

  Object.keys(features).forEach((feature) => {
    if (!features[feature]) {
      console.warn(`${feature} not supported`);
      // Load polyfills or provide fallbacks
    }
  });
}

// Initialize compatibility checks
checkBrowserCompatibility();

// ==========================================
// EXPORT FOR GLOBAL ACCESS
// ==========================================

// Make certain functions globally available
window.scrollToSection = scrollToSection;
window.openServiceModal = openServiceModal;
window.closeModal = closeModal;
window.openProductModal = openProductModal;
window.contactAboutProduct = contactAboutProduct;
window.contactAboutService = contactAboutService;

console.log("CodeWave Web App - All modules loaded successfully");
