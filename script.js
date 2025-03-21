document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const dashboard = document.getElementById("dashboard");
  const loginContainer = document.getElementById("login-container");
  const registerContainer = document.getElementById("register-container");
  const loadingContainer = document.getElementById("loading-container");
  const errorMessage = document.getElementById("error-message");
  const logoutButton = document.getElementById("logout");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.querySelector(".close-modal");
  const cards = document.querySelectorAll(".card");
  const chartSelect = document.getElementById("chartSelect");

  // Simulated user data (ideally fetched from an API)
  let users = [
    {
      username: "a",
      password: "a",
      token: "sampleToken123"
    }
  ];

  // Display the dashboard after loading animation
  function showDashboard(token) {
    sessionStorage.setItem("token", token);
    loadingContainer.style.display = "none";
    loginContainer.style.display = "none";
    registerContainer.style.display = "none";
    dashboard.style.display = "flex";
    document.body.style.background = "#f4f4f4";
    // Initialize chart with default (monthly) data
    initializeChart("monthly");
  }

  // Simulate loading animation with random progress updates
  function simulateLoading(token) {
    loginContainer.style.display = "none";
    registerContainer.style.display = "none";
    loadingContainer.style.display = "block";

    const progressFill = document.getElementById("progress-fill");
    const progressPercentage = document.getElementById("progress-percentage");
    let progress = 0;

    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 11) + 5;
      progress += increment;
      if (progress > 100) progress = 100;
      progressFill.style.width = progress + "%";
      progressPercentage.textContent = progress + "%";

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          showDashboard(token);
        }, 500);
      }
    }, 500);
  }

  // Handle login form submission
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      simulateLoading(user.token);
    } else {
      errorMessage.textContent = "Invalid username or password!";
    }
  });

  // Handle registration form submission
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const registerErrorMessage = document.getElementById("register-error-message");

    if (password !== confirmPassword) {
      registerErrorMessage.textContent = "Passwords do not match!";
      return;
    }

    if (users.find((user) => user.username === username)) {
      registerErrorMessage.textContent = "Username already exists!";
      return;
    }

    users.push({
      username,
      password,
      token: "newToken" + Date.now()
    });

    alert("Registration successful! Please log in.");
    registerForm.reset();
    registerErrorMessage.textContent = "";
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });

  // Toggle between registration and login forms
  showRegister.addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  });

  showLogin.addEventListener("click", function (event) {
    event.preventDefault();
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });

  // Logout event listener
  logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("token");
    dashboard.style.display = "none";
    loginContainer.style.display = "block";
    document.body.style.background =
      "linear-gradient(to right, #0072ff, #00c6ff)";
  });

  // Navigation Menu: Handle menu item clicks
  document.querySelector(".menu").addEventListener("click", function (event) {
    if (event.target.classList.contains("menu-item")) {
      document
        .querySelectorAll(".menu-item")
        .forEach((item) => item.classList.remove("active"));
      event.target.classList.add("active");
      showSection(event.target.getAttribute("data-section"));
    }
  });

  // Function to display a specific section with fade-in effect
  function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active-section", "fade-in");
      section.style.display = "none";
    });
    const activeSection = document.getElementById(sectionId);
    activeSection.style.display = "block";
    activeSection.classList.add("active-section");
    void activeSection.offsetWidth;
    activeSection.classList.add("fade-in");
  }

  // Modal functionality for non-chart card details
  cards.forEach(card => {
    card.addEventListener("click", function () {
      const detailType = card.getAttribute("data-detail");
      if (detailType === "projects" || detailType === "clients" || detailType === "services") {
        modalBody.innerHTML = `<h2>${card.querySelector("h3").textContent}</h2><p>More details about ${card.querySelector("h3").textContent} go here.</p>`;
        modal.style.display = "block";
      }
    });
  });

  // Close modal when clicking on the close button
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
  // Close modal when clicking outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Initialize Chart.js for the "Project Trends" chart with a given range
  function initializeChart(range) {
    const ctx = document.getElementById('projectsChart').getContext('2d');
    window.projectsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: getLabelsForRange(range),
        datasets: [{
          label: 'Projects Completed',
          data: getDataForRange(range),
          borderColor: '#0072ff',
          fill: false,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Helper functions to provide labels and data based on selected range
  function getLabelsForRange(range) {
    if (range === 'weekly') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (range === 'yearly') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Default monthly
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  }

  function getDataForRange(range) {
    if (range === 'weekly') return [5, 10, 8, 12, 15, 7, 9];
    if (range === 'yearly') return [12, 15, 10, 18, 20, 25, 22, 30, 28, 35, 40, 38];
    // Default monthly
    return [10, 20, 30, 25];
  }

  // Update chart data when the dropdown selection changes
  chartSelect.addEventListener('change', function() {
    const range = this.value;
    window.projectsChart.data.labels = getLabelsForRange(range);
    window.projectsChart.data.datasets[0].data = getDataForRange(range);
    window.projectsChart.update();
  });

  // Auto-login if token exists in session storage
  if (sessionStorage.getItem("token")) {
    showDashboard(sessionStorage.getItem("token"));
  }
  
  // Slider initialization code
  const sliderWrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slider-wrapper img');
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateSlider() {
    sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  // Auto slider: change slide every 2 seconds
  setInterval(() => {
    currentSlide = (currentSlide === totalSlides - 1) ? 0 : currentSlide + 1;
    updateSlider();
  }, 2000);
  
  // Add interactivity to contact cards (optional)
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', function () {
      modalBody.innerHTML = `<h2>${card.querySelector('h3').textContent}</h2>
                 <p>More details for ${card.querySelector('h3').textContent} can go here.</p>`;
      modal.style.display = "block";
    });
  });
  
  // --- New: Hide header on scroll ---
  let lastScrollPosition = 0;
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.scrollY;
    
    // Hide header when scrolling down, show when scrolling up
    if (currentScroll > lastScrollPosition) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    
    lastScrollPosition = currentScroll;
  });
});
