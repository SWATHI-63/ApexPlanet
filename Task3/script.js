/**
 * Interactive Learning Hub - Advanced Web Application
 * Features: Responsive Quiz, Image Carousel, API Integration
 * Built with modern JavaScript ES6+ and responsive design
 */

// ===========================================
// GLOBAL VARIABLES AND CONSTANTS
// ===========================================

// Quiz Configuration
const QUIZ_DATA = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language",
    ],
    correct: 0,
  },
  {
    question: "Which CSS property is used to control the text size?",
    options: ["font-weight", "text-style", "font-size", "text-size"],
    correct: 2,
  },
  {
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Integration",
      "Automated Program Interaction",
      "Application Process Integration",
    ],
    correct: 0,
  },
  {
    question:
      "Which JavaScript method is used to add an element to the end of an array?",
    options: ["append()", "push()", "add()", "insert()"],
    correct: 1,
  },
  {
    question: "What is the purpose of media queries in CSS?",
    options: [
      "To query databases",
      "To create responsive designs",
      "To load media files",
      "To optimize images",
    ],
    correct: 1,
  },
];

// Carousel Configuration
const CAROUSEL_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop",
    title: "Modern Web Development",
    description: "Building responsive and interactive web applications",
  },
  {
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    title: "Clean Code",
    description: "Writing maintainable and efficient code",
  },
  {
    url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop",
    title: "API Integration",
    description: "Connecting applications with external services",
  },
  {
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop",
    title: "Responsive Design",
    description: "Creating layouts that work on all devices",
  },
  {
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    title: "User Experience",
    description: "Designing intuitive and engaging interfaces",
  },
];

// Application State
let currentQuizQuestion = 0;
let quizScore = 0;
let selectedAnswer = null;
let quizCompleted = false;

let currentCarouselSlide = 0;
let carouselAutoplay = false;
let carouselInterval = null;

let currentJoke = null;
let currentWeather = null;

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Smooth scroll to a specific section
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
  const navList = document.querySelector(".nav-list");
  navList.classList.toggle("active");
}

/**
 * Add animation class to element
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - Animation class to add
 */
function addAnimation(element, animationClass) {
  element.classList.add(animationClass);
  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove(animationClass);
    },
    { once: true }
  );
}

/**
 * Format time in a human-readable format
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString();
}

// ===========================================
// QUIZ FUNCTIONALITY
// ===========================================

/**
 * Initialize the quiz
 */
function initializeQuiz() {
  currentQuizQuestion = 0;
  quizScore = 0;
  selectedAnswer = null;
  quizCompleted = false;

  updateQuizProgress();
  displayQuestion();
  updateQuizInfo();

  // Hide results and show quiz content
  document.getElementById("quizResults").style.display = "none";
  document.getElementById("quizContent").style.display = "block";
  document.getElementById("restartButton").style.display = "none";
}

/**
 * Display the current question and options
 */
function displayQuestion() {
  const question = QUIZ_DATA[currentQuizQuestion];
  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");

  // Update question text with animation
  questionText.textContent = question.question;
  addAnimation(questionText, "fade-in");

  // Clear previous options
  optionsContainer.innerHTML = "";

  // Create option elements
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.onclick = () => selectAnswer(index);

    // Add staggered animation
    setTimeout(() => {
      addAnimation(optionElement, "slide-in-left");
    }, index * 100);

    optionsContainer.appendChild(optionElement);
  });

  // Reset next button
  const nextButton = document.getElementById("nextButton");
  nextButton.disabled = true;
  nextButton.textContent = "Next Question";

  selectedAnswer = null;
}

/**
 * Handle answer selection
 * @param {number} selectedIndex - Index of the selected answer
 */
function selectAnswer(selectedIndex) {
  if (quizCompleted) return;

  selectedAnswer = selectedIndex;
  const options = document.querySelectorAll(".option");

  // Remove previous selections
  options.forEach((option) => {
    option.classList.remove("selected", "correct", "incorrect");
  });

  // Mark selected option
  options[selectedIndex].classList.add("selected");

  // Enable next button
  const nextButton = document.getElementById("nextButton");
  nextButton.disabled = false;

  // Add bounce animation to selected option
  addAnimation(options[selectedIndex], "bounce-in");
}

/**
 * Move to the next question or complete the quiz
 */
function nextQuestion() {
  if (selectedAnswer === null) return;

  const question = QUIZ_DATA[currentQuizQuestion];
  const options = document.querySelectorAll(".option");

  // Show correct/incorrect answers
  options.forEach((option, index) => {
    if (index === question.correct) {
      option.classList.add("correct");
    } else if (index === selectedAnswer && index !== question.correct) {
      option.classList.add("incorrect");
    }
  });

  // Update score
  if (selectedAnswer === question.correct) {
    quizScore++;
    // Add success animation
    addAnimation(options[selectedAnswer], "bounce-in");
  }

  // Update progress and info
  updateQuizProgress();
  updateQuizInfo();

  // Wait for animation before proceeding
  setTimeout(() => {
    currentQuizQuestion++;

    if (currentQuizQuestion < QUIZ_DATA.length) {
      displayQuestion();
    } else {
      completeQuiz();
    }
  }, 1500);
}

/**
 * Complete the quiz and show results
 */
function completeQuiz() {
  quizCompleted = true;

  // Hide quiz content and show results
  document.getElementById("quizContent").style.display = "none";
  document.getElementById("quizResults").style.display = "block";
  document.getElementById("restartButton").style.display = "inline-block";

  // Update final score
  const finalScore = document.getElementById("finalScore");
  const scoreMessage = document.getElementById("scoreMessage");

  finalScore.textContent = `Your Score: ${quizScore}/${QUIZ_DATA.length}`;

  // Generate score message
  const percentage = (quizScore / QUIZ_DATA.length) * 100;
  let message = "";

  if (percentage >= 90) {
    message = "🎉 Excellent! You're a web development expert!";
  } else if (percentage >= 70) {
    message = "👏 Great job! You have solid knowledge!";
  } else if (percentage >= 50) {
    message = "👍 Good effort! Keep learning and improving!";
  } else {
    message = "📚 Don't give up! Practice makes perfect!";
  }

  scoreMessage.textContent = message;

  // Add animation to results
  addAnimation(document.getElementById("quizResults"), "fade-in");
}

/**
 * Restart the quiz
 */
function restartQuiz() {
  initializeQuiz();
  addAnimation(document.getElementById("quizContent"), "fade-in");
}

/**
 * Update quiz progress bar
 */
function updateQuizProgress() {
  const progress = ((currentQuizQuestion + 1) / QUIZ_DATA.length) * 100;
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = `${progress}%`;
}

/**
 * Update quiz information display
 */
function updateQuizInfo() {
  const questionCounter = document.getElementById("questionCounter");
  const scoreDisplay = document.getElementById("scoreDisplay");

  questionCounter.textContent = `Question ${currentQuizQuestion + 1} of ${
    QUIZ_DATA.length
  }`;
  scoreDisplay.textContent = `Score: ${quizScore}`;
}

// ===========================================
// CAROUSEL FUNCTIONALITY
// ===========================================

/**
 * Initialize the image carousel
 */
function initializeCarousel() {
  const carouselTrack = document.getElementById("carouselTrack");
  const carouselIndicators = document.getElementById("carouselIndicators");

  // Create slides
  carouselTrack.innerHTML = "";
  CAROUSEL_IMAGES.forEach((image, index) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";
    slide.innerHTML = `
            <img src="${image.url}" alt="${image.title}" loading="lazy" 
                 onerror="this.src='https://via.placeholder.com/800x400/6366f1/ffffff?text=Image+${
                   index + 1
                 }'">
            <div class="slide-content">
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </div>
        `;
    carouselTrack.appendChild(slide);
  });

  // Create indicators
  carouselIndicators.innerHTML = "";
  CAROUSEL_IMAGES.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.className = `indicator ${index === 0 ? "active" : ""}`;
    indicator.onclick = () => goToSlide(index);
    carouselIndicators.appendChild(indicator);
  });

  updateCarouselPosition();
}

/**
 * Go to next slide
 */
function nextSlide() {
  currentCarouselSlide = (currentCarouselSlide + 1) % CAROUSEL_IMAGES.length;
  updateCarouselPosition();
  addSlideAnimation("slide-in-right");
}

/**
 * Go to previous slide
 */
function previousSlide() {
  currentCarouselSlide =
    (currentCarouselSlide - 1 + CAROUSEL_IMAGES.length) %
    CAROUSEL_IMAGES.length;
  updateCarouselPosition();
  addSlideAnimation("slide-in-left");
}

/**
 * Go to specific slide
 * @param {number} slideIndex - Index of the slide to go to
 */
function goToSlide(slideIndex) {
  if (slideIndex === currentCarouselSlide) return;

  const direction =
    slideIndex > currentCarouselSlide ? "slide-in-right" : "slide-in-left";
  currentCarouselSlide = slideIndex;
  updateCarouselPosition();
  addSlideAnimation(direction);
}

/**
 * Update carousel position and indicators
 */
function updateCarouselPosition() {
  const carouselTrack = document.getElementById("carouselTrack");
  const indicators = document.querySelectorAll(".indicator");

  // Update track position
  const translateX = -currentCarouselSlide * 100;
  carouselTrack.style.transform = `translateX(${translateX}%)`;

  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentCarouselSlide);
  });
}

/**
 * Add animation to current slide
 * @param {string} animationClass - Animation class to add
 */
function addSlideAnimation(animationClass) {
  const slides = document.querySelectorAll(".carousel-slide");
  if (slides[currentCarouselSlide]) {
    addAnimation(slides[currentCarouselSlide], animationClass);
  }
}

/**
 * Toggle carousel autoplay
 */
function toggleAutoplay() {
  const playIcon = document.getElementById("playIcon");
  const autoplayText = document.getElementById("autoplayText");

  if (carouselAutoplay) {
    // Stop autoplay
    carouselAutoplay = false;
    clearInterval(carouselInterval);
    playIcon.className = "fas fa-play";
    autoplayText.textContent = "Start Autoplay";
  } else {
    // Start autoplay
    carouselAutoplay = true;
    carouselInterval = setInterval(nextSlide, 3000);
    playIcon.className = "fas fa-pause";
    autoplayText.textContent = "Stop Autoplay";
  }
}

// ===========================================
// API FUNCTIONALITY
// ===========================================

/**
 * Fetch a new joke from the API
 */
async function fetchNewJoke() {
  const jokeLoader = document.getElementById("jokeLoader");
  const jokeText = document.getElementById("jokeText");
  const jokeError = document.getElementById("jokeError");

  // Show loader
  jokeLoader.style.display = "block";
  jokeText.style.display = "none";
  jokeError.style.display = "none";

  try {
    // Fetch from JokeAPI
    const response = await fetch(
      "https://v2.jokeapi.dev/joke/Programming,Miscellaneous?type=single&amount=1"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle different joke formats
    let jokeContent = "";
    if (data.type === "single") {
      jokeContent = data.joke;
    } else if (data.type === "twopart") {
      jokeContent = `${data.setup}\n\n${data.delivery}`;
    } else {
      throw new Error("Unknown joke format");
    }

    currentJoke = jokeContent;

    // Display joke with animation
    setTimeout(() => {
      jokeLoader.style.display = "none";
      jokeText.style.display = "block";
      jokeText.textContent = jokeContent;
      addAnimation(jokeText, "fade-in");
    }, 500);
  } catch (error) {
    console.error("Error fetching joke:", error);

    // Show error message
    setTimeout(() => {
      jokeLoader.style.display = "none";
      jokeError.style.display = "block";
      addAnimation(jokeError, "fade-in");
    }, 500);
  }
}

/**
 * Share the current joke
 */
function shareJoke() {
  if (!currentJoke) {
    alert("No joke to share! Please fetch a joke first.");
    return;
  }

  // Check if Web Share API is supported
  if (navigator.share) {
    navigator
      .share({
        title: "Funny Joke from Learning Hub",
        text: currentJoke,
        url: window.location.href,
      })
      .catch((err) => console.log("Error sharing:", err));
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard
      .writeText(currentJoke)
      .then(() => {
        // Show success message
        const originalText = document.querySelector(
          ".joke-btn.secondary"
        ).innerHTML;
        const shareBtn = document.querySelector(".joke-btn.secondary");
        shareBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        shareBtn.style.background = "var(--success-color)";

        setTimeout(() => {
          shareBtn.innerHTML = originalText;
          shareBtn.style.background = "";
        }, 2000);
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err);
        alert("Could not copy joke to clipboard");
      });
  }
}

/**
 * Fetch weather data
 */
async function fetchWeatherData() {
  const weatherLoader = document.getElementById("weatherLoader");
  const weatherData = document.getElementById("weatherData");

  // Show loader
  weatherLoader.style.display = "block";
  weatherData.style.display = "none";

  try {
    // Using a mock weather API or you can replace with a real weather API
    // For demo purposes, we'll simulate weather data
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

    // Mock weather data
    const mockWeatherData = {
      location: "San Francisco, CA",
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      description: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][
        Math.floor(Math.random() * 4)
      ],
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      icon: "☀️",
    };

    currentWeather = mockWeatherData;
    displayWeatherData(mockWeatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherLoader.style.display = "none";
    // Could show error state here
  }
}

/**
 * Display weather data
 * @param {Object} data - Weather data object
 */
function displayWeatherData(data) {
  const weatherLoader = document.getElementById("weatherLoader");
  const weatherDataElement = document.getElementById("weatherData");

  weatherDataElement.innerHTML = `
        <div class="weather-info">
            <div>
                <div class="weather-temp">${data.temperature}°C</div>
                <div class="weather-desc">${data.description}</div>
            </div>
            <div class="weather-icon">${data.icon}</div>
        </div>
        <div class="weather-details">
            <div>Humidity: ${data.humidity}%</div>
            <div>Wind: ${data.windSpeed} km/h</div>
            <div>Location: ${data.location}</div>
            <div>Updated: ${new Date().toLocaleTimeString()}</div>
        </div>
    `;

  setTimeout(() => {
    weatherLoader.style.display = "none";
    weatherDataElement.style.display = "block";
    addAnimation(weatherDataElement, "fade-in");
  }, 500);
}

/**
 * Refresh weather data
 */
function refreshWeather() {
  fetchWeatherData();
}

// ===========================================
// EVENT LISTENERS AND INITIALIZATION
// ===========================================

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeQuiz();
  initializeCarousel();
  fetchNewJoke();
  fetchWeatherData();

  // Add smooth scrolling to navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);

      // Close mobile menu if open
      const navList = document.querySelector(".nav-list");
      navList.classList.remove("active");
    });
  });

  // Add intersection observer for section animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });

  // Handle keyboard navigation for accessibility
  document.addEventListener("keydown", function (e) {
    // Quiz navigation
    if (e.key >= "1" && e.key <= "4" && !quizCompleted) {
      const optionIndex = parseInt(e.key) - 1;
      const options = document.querySelectorAll(".option");
      if (options[optionIndex]) {
        selectAnswer(optionIndex);
      }
    }

    // Carousel navigation
    if (e.key === "ArrowLeft") {
      previousSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }

    // API shortcuts
    if (e.key === "j" && e.ctrlKey) {
      e.preventDefault();
      fetchNewJoke();
    }

    if (e.key === "w" && e.ctrlKey) {
      e.preventDefault();
      refreshWeather();
    }
  });

  // Handle window resize for responsive behavior
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Update carousel if needed
      updateCarouselPosition();
    }, 250);
  });

  // Handle visibility change for autoplay
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && carouselAutoplay) {
      clearInterval(carouselInterval);
    } else if (!document.hidden && carouselAutoplay) {
      carouselInterval = setInterval(nextSlide, 3000);
    }
  });

  // Add loading states and error handling for images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", function () {
      this.classList.add("loaded");
    });

    img.addEventListener("error", function () {
      this.classList.add("error");
      console.warn("Failed to load image:", this.src);
    });
  });

  console.log("🚀 Interactive Learning Hub initialized successfully!");
  console.log("📋 Keyboard shortcuts:");
  console.log("  • 1-4: Select quiz answer");
  console.log("  • ←/→: Navigate carousel");
  console.log("  • Ctrl+J: Fetch new joke");
  console.log("  • Ctrl+W: Refresh weather");
});

// ===========================================
// SERVICE WORKER REGISTRATION (PWA Support)
// ===========================================

// Register service worker for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Note: Service worker file would need to be created separately
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  });
}

// ===========================================
// PERFORMANCE OPTIMIZATION
// ===========================================

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    scrollToSection,
    toggleMenu,
    initializeQuiz,
    nextQuestion,
    restartQuiz,
    nextSlide,
    previousSlide,
    fetchNewJoke,
    refreshWeather,
  };
}
