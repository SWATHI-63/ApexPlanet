// Global variables and state management
let currentSection = "home";
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let todoFilter = "all";
let products = [];
let filteredProducts = [];
let currentView = "grid";

// Enhanced Animated Background Particles System
class AdvancedParticleSystem {
  constructor() {
    this.particles = [];
    this.mouseParticles = [];
    this.particleCount = 80;
    this.container = document.getElementById("particles-container");
    this.mouse = { x: 0, y: 0 };
    this.colors = [
      "rgba(102, 126, 234, 0.8)",
      "rgba(118, 75, 162, 0.8)",
      "rgba(240, 147, 251, 0.8)",
      "rgba(245, 87, 108, 0.8)",
      "rgba(79, 172, 254, 0.8)",
      "rgba(0, 242, 254, 0.8)",
      "rgba(139, 69, 19, 0.6)",
      "rgba(255, 215, 0, 0.7)",
    ];
    this.shapes = ["circle", "square", "triangle", "diamond"];
    this.init();
  }

  init() {
    if (this.container) {
      this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            `;
      this.createParticles();
      this.createFloatingParticles();
      this.animateParticles();
      this.addMouseInteraction();
      this.addConnectionLines();
    }
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement("div");
      const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
      particle.className = `particle particle-${shape}`;

      const size = Math.random() * 8 + 3;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 25 + 15;
      const animationDelay = Math.random() * 25;

      let shapeStyles = "";
      switch (shape) {
        case "square":
          shapeStyles = "border-radius: 2px; transform: rotate(45deg);";
          break;
        case "triangle":
          shapeStyles = `
                        width: 0;
                        height: 0;
                        border-left: ${size / 2}px solid transparent;
                        border-right: ${size / 2}px solid transparent;
                        border-bottom: ${size}px solid ${color};
                        background: transparent;
                    `;
          break;
        case "diamond":
          shapeStyles = "border-radius: 2px; transform: rotate(45deg);";
          break;
        default: // circle
          shapeStyles = "border-radius: 50%;";
      }

      particle.style.cssText = `
                width: ${shape === "triangle" ? "0" : size + "px"};
                height: ${shape === "triangle" ? "0" : size + "px"};
                background: ${shape === "triangle" ? "transparent" : color};
                left: ${left}%;
                top: 100%;
                position: absolute;
                animation: float-particle-enhanced ${animationDuration}s infinite linear;
                animation-delay: ${animationDelay}s;
                box-shadow: 0 0 ${size * 3}px ${color};
                ${shapeStyles}
            `;

      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: left,
        y: 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 2 - 0.5,
        size: size,
        color: color,
        shape: shape,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  createFloatingParticles() {
    // Create additional floating particles that don't move upward
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";

      const size = Math.random() * 4 + 2;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const left = Math.random() * 100;
      const top = Math.random() * 100;

      particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${left}%;
                top: ${top}%;
                position: absolute;
                border-radius: 50%;
                animation: gentle-float 8s ease-in-out infinite;
                animation-delay: ${Math.random() * 8}s;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;

      this.container.appendChild(particle);
    }
  }

  addMouseInteraction() {
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 100;
      this.mouse.y = (e.clientY / window.innerHeight) * 100;

      // Create mouse trail particles
      if (Math.random() < 0.1) {
        this.createMouseParticle(e.clientX, e.clientY);
      }
    });
  }

  createMouseParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "mouse-particle";

    const size = Math.random() * 3 + 1;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${x}px;
            top: ${y}px;
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: mouse-trail 2s ease-out forwards;
        `;

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }

  addConnectionLines() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(102, 126, 234, 0.1)";
      ctx.lineWidth = 1;

      // Draw connections between nearby particles
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];

          const rect1 = p1.element.getBoundingClientRect();
          const rect2 = p2.element.getBoundingClientRect();

          const dx = rect1.left - rect2.left;
          const dy = rect1.top - rect2.top;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = 1 - distance / 150;
            ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.2})`;
            ctx.beginPath();
            ctx.moveTo(
              rect1.left + rect1.width / 2,
              rect1.top + rect1.height / 2
            );
            ctx.lineTo(
              rect2.left + rect2.width / 2,
              rect2.top + rect2.height / 2
            );
            ctx.stroke();
          }
        }
      }
    }, 100);

    // Handle window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  animateParticles() {
    setInterval(() => {
      this.particles.forEach((particle, index) => {
        const time = Date.now() * 0.001;

        // Pulsing effect
        particle.pulse += 0.02;
        const scale = 1 + Math.sin(particle.pulse) * 0.1;

        // Mouse attraction effect
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          particle.vx += dx * 0.0001;
          particle.vy += dy * 0.0001;
        }

        // Apply physics
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundaries
        if (particle.x < 0 || particle.x > 100) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 100) particle.vy *= -1;

        // Apply transforms
        particle.element.style.transform = `scale(${scale})`;
        particle.element.style.left = `${Math.max(
          0,
          Math.min(100, particle.x)
        )}%`;
      });
    }, 50);
  }
}

// Initialize enhanced particle system
let particleSystem;

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    category: "electronics",
    rating: 4.5,
    image: "🎧",
  },
  {
    id: 2,
    name: "Smartphone Case",
    price: 19.99,
    category: "electronics",
    rating: 4.2,
    image: "📱",
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    price: 24.99,
    category: "clothing",
    rating: 4.0,
    image: "👕",
  },
  {
    id: 4,
    name: "JavaScript Programming Book",
    price: 39.99,
    category: "books",
    rating: 4.8,
    image: "📚",
  },
  {
    id: 5,
    name: "Coffee Mug",
    price: 12.99,
    category: "home",
    rating: 4.3,
    image: "☕",
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 29.99,
    category: "electronics",
    rating: 4.1,
    image: "🖱️",
  },
  {
    id: 7,
    name: "Denim Jeans",
    price: 59.99,
    category: "clothing",
    rating: 4.4,
    image: "👖",
  },
  {
    id: 8,
    name: "Plant Pot",
    price: 15.99,
    category: "home",
    rating: 4.6,
    image: "🪴",
  },
  {
    id: 9,
    name: "Learning React Book",
    price: 44.99,
    category: "books",
    rating: 4.7,
    image: "📖",
  },
  {
    id: 10,
    name: "LED Desk Lamp",
    price: 34.99,
    category: "home",
    rating: 4.2,
    image: "💡",
  },
];

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize Application
function initializeApp() {
  // Initialize enhanced animated background
  particleSystem = new AdvancedParticleSystem();

  // Initialize navigation
  initializeNavigation();

  // Initialize todo app
  initializeTodoApp();

  // Initialize products
  initializeProducts();

  // Initialize contact form
  initializeContactForm();

  // Show loading spinner briefly
  showLoadingSpinner(500);

  // Set initial section
  showSection("home");

  // Initialize typing effect
  initializeTypingEffect();
}

// Navigation Functions
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  // Navigation link click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.getAttribute("data-section");
      showSection(section);
      updateActiveNavLink(this);

      // Close mobile menu if open
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      this.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.remove("active");
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    setTimeout(() => {
      targetSection.classList.add("active");
    }, 150);
  }

  currentSection = sectionId;

  // Update page title
  updatePageTitle(sectionId);

  // Animate skill bars if about section
  if (sectionId === "about") {
    setTimeout(animateSkillBars, 500);
  }
}

function updateActiveNavLink(activeLink) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));
  activeLink.classList.add("active");
}

function updatePageTitle(section) {
  const titles = {
    home: "DevPortfolio - Web Developer",
    about: "About - DevPortfolio",
    projects: "Projects - DevPortfolio",
    todo: "Todo App - DevPortfolio",
    products: "Product Store - DevPortfolio",
    contact: "Contact - DevPortfolio",
  };
  document.title = titles[section] || "DevPortfolio";
}

function scrollToSection(sectionId) {
  showSection(sectionId);
  const navLink = document.querySelector(`[data-section="${sectionId}"]`);
  if (navLink) {
    updateActiveNavLink(navLink);
  }
}

// Typing Effect
function initializeTypingEffect() {
  const typingText = document.querySelector(".typing-text");
  const texts = [
    "Web Developer",
    "Frontend Expert",
    "UI/UX Designer",
    "Full-Stack Dev",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeText() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 100 : 150;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }

    setTimeout(typeText, typeSpeed);
  }

  typeText();
}

// Skill Bars Animation
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar) => {
    const width = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = width;
    }, 200);
  });
}

// Todo App Functions
function initializeTodoApp() {
  const todoInput = document.getElementById("todoInput");
  const addTodoBtn = document.getElementById("addTodoBtn");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Add todo event listeners
  if (addTodoBtn) {
    addTodoBtn.addEventListener("click", addTodo);
  }

  if (todoInput) {
    todoInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addTodo();
      }
    });
  }

  // Filter button event listeners
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      todoFilter = this.getAttribute("data-filter");
      renderTodos();
    });
  });

  // Initial render
  renderTodos();
}

function addTodo() {
  const todoInput = document.getElementById("todoInput");
  const text = todoInput.value.trim();

  if (text === "") {
    showNotification("Please enter a todo item", "error");
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.unshift(todo);
  saveTodos();
  todoInput.value = "";
  renderTodos();
  showNotification("Todo added successfully!", "success");
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
    showNotification(
      todo.completed ? "Todo completed!" : "Todo uncompleted!",
      "info"
    );
  }
}

function deleteTodo(id) {
  if (confirm("Are you sure you want to delete this todo?")) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    renderTodos();
    showNotification("Todo deleted!", "success");
  }
}

function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    const newText = prompt("Edit todo:", todo.text);
    if (newText !== null && newText.trim() !== "") {
      todo.text = newText.trim();
      saveTodos();
      renderTodos();
      showNotification("Todo updated!", "success");
    }
  }
}

function renderTodos() {
  const todoList = document.getElementById("todoList");
  if (!todoList) return;

  let filteredTodos = todos;

  // Apply filter
  if (todoFilter === "completed") {
    filteredTodos = todos.filter((t) => t.completed);
  } else if (todoFilter === "pending") {
    filteredTodos = todos.filter((t) => !t.completed);
  }

  // Update stats
  updateTodoStats();

  // Render todos
  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
            <div class="todo-item" style="justify-content: center; opacity: 0.5;">
                <span>No todos found</span>
            </div>
        `;
    return;
  }

  todoList.innerHTML = filteredTodos
    .map(
      (todo) => `
        <div class="todo-item ${todo.completed ? "completed" : ""}">
            <div class="todo-checkbox ${
              todo.completed ? "checked" : ""
            }" onclick="toggleTodo(${todo.id})">
                ${todo.completed ? '<i class="fas fa-check"></i>' : ""}
            </div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="todo-action-btn edit-btn" onclick="editTodo(${
                  todo.id
                })" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-action-btn delete-btn" onclick="deleteTodo(${
                  todo.id
                })" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function updateTodoStats() {
  const totalTasks = document.getElementById("totalTasks");
  const pendingTasks = document.getElementById("pendingTasks");
  const completedTasks = document.getElementById("completedTasks");

  if (totalTasks) totalTasks.textContent = todos.length;
  if (pendingTasks)
    pendingTasks.textContent = todos.filter((t) => !t.completed).length;
  if (completedTasks)
    completedTasks.textContent = todos.filter((t) => t.completed).length;
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Products Functions
function initializeProducts() {
  products = [...sampleProducts];
  filteredProducts = [...products];

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortBy = document.getElementById("sortBy");
  const viewBtns = document.querySelectorAll(".view-btn");

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", debounce(filterProducts, 300));
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
  }

  if (sortBy) {
    sortBy.addEventListener("change", filterProducts);
  }

  // View toggle buttons
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      viewBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentView = this.getAttribute("data-view");
      updateProductsView();
    });
  });

  // Initial render
  renderProducts();
}

function filterProducts() {
  const searchTerm =
    document.getElementById("searchInput")?.value.toLowerCase() || "";
  const category = document.getElementById("categoryFilter")?.value || "";
  const sort = document.getElementById("sortBy")?.value || "name";

  // Filter products
  filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  switch (sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default: // name
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts();
}

function renderProducts() {
  const productsContainer = document.getElementById("productsContainer");
  if (!productsContainer) return;

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
    return;
  }

  productsContainer.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); addToCart(${
                      product.id
                    })">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); viewProduct(${
                      product.id
                    })">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function updateProductsView() {
  const productsContainer = document.getElementById("productsContainer");
  if (productsContainer) {
    productsContainer.className = `products-grid ${
      currentView === "list" ? "list-view" : ""
    }`;
  }
}

function generateStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star star"></i>';
    } else if (i - 0.5 <= rating) {
      stars += '<i class="fas fa-star-half-alt star"></i>';
    } else {
      stars += '<i class="far fa-star star empty"></i>';
    }
  }
  return stars;
}

function viewProduct(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    alert(
      `Product: ${product.name}\nPrice: $${product.price}\nCategory: ${product.category}\nRating: ${product.rating}/5`
    );
  }
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    showNotification(`${product.name} added to cart!`, "success");
  }
}

// Contact Form Functions
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleContactSubmit();
    });
  }
}

function handleContactSubmit() {
  const name = document.getElementById("contactName")?.value.trim();
  const email = document.getElementById("contactEmail")?.value.trim();
  const subject = document.getElementById("contactSubject")?.value.trim();
  const message = document.getElementById("contactMessage")?.value.trim();

  // Validation
  if (!name || !email || !subject || !message) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Simulate form submission
  showLoadingSpinner(2000);

  setTimeout(() => {
    // Reset form
    document.getElementById("contactForm").reset();
    showNotification("Message sent successfully!", "success");
  }, 2000);
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showLoadingSpinner(duration = 1000) {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.style.display = "flex";
    setTimeout(() => {
      spinner.style.display = "none";
    }, duration);
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;

  // Set background color based on type
  const colors = {
    success: "#059669",
    error: "#dc2626",
    info: "#2563eb",
    warning: "#d97706",
  };
  notification.style.background = colors[type] || colors.info;

  // Add icon based on type
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
  };

  notification.innerHTML = `
        <i class="${icons[type] || icons.info}" style="margin-right: 8px;"></i>
        ${escapeHtml(message)}
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Smooth scroll for anchor links
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey) {
    const sections = [
      "home",
      "about",
      "projects",
      "todo",
      "products",
      "contact",
    ];
    const currentIndex = sections.indexOf(currentSection);

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex =
          (currentIndex - 1 + sections.length) % sections.length;
        showSection(sections[prevIndex]);
        updateActiveNavLink(
          document.querySelector(`[data-section="${sections[prevIndex]}"]`)
        );
        break;
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sections.length;
        showSection(sections[nextIndex]);
        updateActiveNavLink(
          document.querySelector(`[data-section="${sections[nextIndex]}"]`)
        );
        break;
    }
  }
});

// Window resize handler
window.addEventListener("resize", function () {
  // Close mobile menu on resize
  const navMenu = document.querySelector(".nav-menu");
  const navToggle = document.querySelector(".nav-toggle");
  if (window.innerWidth > 768) {
    navMenu?.classList.remove("active");
    navToggle?.classList.remove("active");
  }
});

// Service Worker registration (if available)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Optional: Register service worker for PWA features
    console.log("Service Worker support detected");
  });
}
