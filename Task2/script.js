// Mobile Menu Toggle Functionality
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when clicking on nav links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Contact Form Validation with Animation
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const error = document.getElementById("formError");
  const submitBtn = this.querySelector('button[type="submit"]');

  // Clear previous error
  error.textContent = "";
  error.classList.remove("error-shake");

  if (!name || !email || !message) {
    error.textContent = "Please fill in all fields.";
    error.classList.add("error-shake");
    return;
  }

  // Simple email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    error.textContent = "Please enter a valid email address.";
    error.classList.add("error-shake");
    return;
  }

  // Animate button success
  submitBtn.style.background =
    "linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)";
  submitBtn.textContent = "✓ Sent!";

  setTimeout(() => {
    error.textContent =
      "Message sent successfully! We'll get back to you soon.";
    error.style.color = "#27ae60";
    this.reset();

    // Reset button after delay
    setTimeout(() => {
      submitBtn.style.background = "";
      submitBtn.textContent = "Send";
      error.textContent = "";
      error.style.color = "";
    }, 3000);
  }, 500);
});

// To-Do List Functionality with Enhanced DOM Manipulation
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
let taskCounter = 0;

addTaskBtn.addEventListener("click", function () {
  const task = taskInput.value.trim();
  if (task) {
    taskCounter++;

    // Create task element with animation
    const li = document.createElement("li");
    li.className = "task-item";
    li.style.opacity = "0";
    li.style.transform = "translateY(-20px)";

    // Create task content container
    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    // Add task number and text
    const taskNumber = document.createElement("span");
    taskNumber.className = "task-number";
    taskNumber.textContent = `#${taskCounter}`;

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task;

    // Create buttons container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "task-buttons";

    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✓";
    completeBtn.className = "complete-task";
    completeBtn.onclick = () => toggleComplete(li);

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.className = "remove-task";
    removeBtn.onclick = () => removeTask(li);

    // Assemble the task
    taskContent.appendChild(taskNumber);
    taskContent.appendChild(taskText);
    buttonContainer.appendChild(completeBtn);
    buttonContainer.appendChild(removeBtn);
    li.appendChild(taskContent);
    li.appendChild(buttonContainer);

    taskList.appendChild(li);

    // Animate in
    setTimeout(() => {
      li.style.transition = "all 0.3s ease";
      li.style.opacity = "1";
      li.style.transform = "translateY(0)";
    }, 10);

    taskInput.value = "";
    updateTaskCount();
  }
});

function toggleComplete(taskElement) {
  taskElement.classList.toggle("completed");
  const completeBtn = taskElement.querySelector(".complete-task");
  if (taskElement.classList.contains("completed")) {
    completeBtn.textContent = "↺";
  } else {
    completeBtn.textContent = "✓";
  }
}

function removeTask(taskElement) {
  taskElement.style.transition = "all 0.3s ease";
  taskElement.style.opacity = "0";
  taskElement.style.transform = "translateX(100%)";
  setTimeout(() => {
    taskElement.remove();
    updateTaskCount();
  }, 300);
}

function updateTaskCount() {
  const totalTasks = taskList.children.length;
  const completedTasks = taskList.querySelectorAll(".completed").length;
  const todoHeader = document.querySelector("#todo h2");
  todoHeader.textContent = `To-Do List (${completedTasks}/${totalTasks})`;
}

// Image Gallery Functionality with Enhanced Effects
const imgUrlInput = document.getElementById("imgUrlInput");
const addImgBtn = document.getElementById("addImgBtn");
const galleryList = document.getElementById("galleryList");

addImgBtn.addEventListener("click", function () {
  const url = imgUrlInput.value.trim();
  if (url) {
    // Create container with loading state
    const container = document.createElement("div");
    container.className = "gallery-img-container loading";
    container.style.opacity = "0";
    container.style.transform = "scale(0.8)";

    // Loading placeholder
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading-placeholder";
    loadingDiv.textContent = "Loading...";
    container.appendChild(loadingDiv);

    const img = document.createElement("img");
    img.className = "gallery-img";
    img.alt = "User added image";

    // Handle image load
    img.onload = function () {
      container.classList.remove("loading");
      container.removeChild(loadingDiv);
      container.appendChild(img);

      // Add remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✕";
      removeBtn.className = "remove-img";
      removeBtn.onclick = () => removeImage(container);
      container.appendChild(removeBtn);

      // Animate in
      container.style.transition = "all 0.4s ease";
      container.style.opacity = "1";
      container.style.transform = "scale(1)";
    };

    // Handle image error
    img.onerror = function () {
      container.innerHTML = `
        <div class="error-placeholder">
          <span>❌</span>
          <span>Failed to load image</span>
          <button class="remove-img" onclick="removeImage(this.parentElement)">✕</button>
        </div>
      `;
      container.classList.remove("loading");
      container.style.opacity = "1";
      container.style.transform = "scale(1)";
    };

    img.src = url;
    galleryList.appendChild(container);
    imgUrlInput.value = "";

    // Initial animation
    setTimeout(() => {
      container.style.transition = "all 0.3s ease";
      container.style.opacity = "0.7";
      container.style.transform = "scale(0.95)";
    }, 10);
  }
});

function removeImage(container) {
  container.style.transition = "all 0.3s ease";
  container.style.opacity = "0";
  container.style.transform = "scale(0.8) rotate(5deg)";
  setTimeout(() => {
    container.remove();
  }, 300);
}

// Allow Enter key to add tasks
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

// Allow Enter key to add images
imgUrlInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addImgBtn.click();
  }
});

// Responsive Layout Demo Functionality
document.addEventListener("DOMContentLoaded", function () {
  const viewportButtons = document.querySelectorAll(".viewport-btn");
  const currentViewport = document.getElementById("current-viewport");
  const screenWidth = document.getElementById("screen-width");
  const layoutType = document.getElementById("layout-type");
  const gridContainer = document.querySelector(".grid-container");

  // Viewport data
  const viewportData = {
    desktop: {
      name: "Desktop",
      width: "1200px+",
      layout: "Multi-column Grid",
      class: "desktop-view",
    },
    tablet: {
      name: "Tablet",
      width: "768px - 1199px",
      layout: "Single Column Layout",
      class: "tablet-view",
    },
    mobile: {
      name: "Mobile",
      width: "320px - 767px",
      layout: "Stacked Mobile Layout",
      class: "mobile-view",
    },
  };

  // Update viewport display
  function updateViewportDisplay(viewport) {
    const data = viewportData[viewport];
    if (currentViewport) currentViewport.textContent = data.name;
    if (screenWidth) screenWidth.textContent = data.width;
    if (layoutType) layoutType.textContent = data.layout;

    // Remove all viewport classes
    Object.values(viewportData).forEach((item) => {
      if (gridContainer) gridContainer.classList.remove(item.class);
    });

    // Add current viewport class
    if (gridContainer) gridContainer.classList.add(data.class);

    // Update active button
    viewportButtons.forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector(`[data-viewport="${viewport}"]`)
      .classList.add("active");
  }

  // Add click event listeners to viewport buttons
  viewportButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const viewport = this.getAttribute("data-viewport");
      updateViewportDisplay(viewport);

      // Add visual feedback
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });

  // Real-time viewport detection
  function detectViewport() {
    const width = window.innerWidth;
    let viewport;

    if (width >= 1200) {
      viewport = "desktop";
    } else if (width >= 768) {
      viewport = "tablet";
    } else {
      viewport = "mobile";
    }

    // Update the actual screen width display
    if (screenWidth) {
      screenWidth.textContent = `${width}px`;
    }

    return viewport;
  }

  // Update viewport on window resize
  window.addEventListener("resize", function () {
    const currentActualViewport = detectViewport();
    // Optionally auto-update the demo based on actual viewport
    // updateViewportDisplay(currentActualViewport);
  });

  // Initialize with current viewport
  const initialViewport = detectViewport();
  updateViewportDisplay("desktop"); // Start with desktop view for demo
});

// Enhanced smooth scrolling for responsive layout section
document.querySelectorAll('a[href="#responsive-layout"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector("#responsive-layout");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Add a subtle animation to highlight the section
      target.style.transform = "scale(1.02)";
      setTimeout(() => {
        target.style.transform = "";
      }, 300);
    }
  });
});

// Section Navigation Functionality
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Update active nav dot
    updateNavDots(sectionId);
  }
}

function updateNavDots(activeSectionId) {
  const navDots = document.querySelectorAll(".nav-dot");
  const sections = ["contact", "todo", "gallery", "responsive-layout"];

  navDots.forEach((dot, index) => {
    dot.classList.remove("active");
    if (sections[index] === activeSectionId) {
      dot.classList.add("active");
    }
  });
}

// Auto-update nav dots on scroll
function handleScroll() {
  const sections = document.querySelectorAll(".grid-item[id]");
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
      updateNavDots(section.id);
    }
  });
}

// Throttled scroll handler for performance
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(handleScroll, 100);
});

// Enhanced section transitions
document.addEventListener("DOMContentLoaded", function () {
  // Initialize intersection observer for section animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -20% 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all grid items
  document.querySelectorAll(".grid-item").forEach((item) => {
    sectionObserver.observe(item);
  });
});
