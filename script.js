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
  

  // Simulated user data (ideally fetched from an API)
  let users = [
    {
      username: "testuser",
      password: "SecurePassword123",
      token: "sampleToken123"
    }
  ];
  const hamburger = document.querySelector('.hamburger-menu');
  const sidebar = document.querySelector('.sidebar');
  hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  });

  // Display the dashboard after loading animation
  function showDashboard(token) {
  sessionStorage.setItem("token", token);
  loadingContainer.style.display = "none";
  loginContainer.style.display = "none"; // Explicitly hide login container
  registerContainer.style.display = "none"; // Explicitly hide registration container
  dashboard.style.display = "flex";
  document.body.style.background = "#f4f4f4";
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
      // Increase progress by a random value between 5 and 15
      const increment = Math.floor(Math.random() * 11) + 5;
      progress += increment;
      if (progress > 100) progress = 100;
      progressFill.style.width = progress + "%";
      progressPercentage.textContent = progress + "%";

      if (progress === 100) {
        clearInterval(interval);
        // Wait a moment before transitioning to the dashboard
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

    // Simulated login check
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

    // Add new user
    users.push({
      username,
      password,
      token: "newToken" + Date.now()
    });

    alert("Registration successful! Please log in.");
    registerForm.reset();
    registerErrorMessage.textContent = "";
    // Switch to login form
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });

  // Toggle to registration form
  showRegister.addEventListener("click", function (event) {
    event.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  });

  // Toggle to login form
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

  // Sidebar Navigation: Handle menu item clicks
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
    // Restart CSS animation for fade-in effect
    void activeSection.offsetWidth;
    activeSection.classList.add("fade-in");
  }

  // Auto-login if token exists in session storage
  if (sessionStorage.getItem("token")) {
    showDashboard(sessionStorage.getItem("token"));
  }
});
