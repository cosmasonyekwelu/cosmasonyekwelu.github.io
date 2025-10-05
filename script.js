// Performance optimization - Load after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  // DOM Elements
  const themeToggle = document.getElementById('themeToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.querySelector('.nav-links');
  const contactForm = document.getElementById('contactForm');
  const themeOptions = document.querySelectorAll('.theme-option');
  const currentYear = new Date().getFullYear();
  
  // Initialize the theme based on user preference
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'blue';
    setTheme(savedTheme);
  }
  
  // Set theme function
  function setTheme(theme) {
    // Remove any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
    
    // Set the selected theme
    if (theme === 'black') {
      document.documentElement.setAttribute('data-theme', 'black');
    }
    
    // Update active state of theme options
    themeOptions.forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-theme') === theme) {
        option.classList.add('active');
      }
    });
    
    // Update theme toggle icon
    updateThemeToggleIcon(theme);
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }
  
  // Update theme toggle icon based on current theme
  function updateThemeToggleIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (!themeIcon) return;
    
    const sunIcon = themeIcon.querySelector('.fa-sun');
    const moonIcon = themeIcon.querySelector('.fa-moon');
    
    if (theme === 'blue') {
      // Light mode - show moon
      if (sunIcon) sunIcon.style.opacity = '0';
      if (moonIcon) moonIcon.style.opacity = '1';
    } else {
      // Black mode - show sun
      if (sunIcon) sunIcon.style.opacity = '1';
      if (moonIcon) moonIcon.style.opacity = '0';
    }
  }
  
  // Toggle between blue and black themes
  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'blue';
    const newTheme = currentTheme === 'blue' ? 'black' : 'blue';
    setTheme(newTheme);
  }
  
  // Initialize theme selector
  function initThemeSelector() {
    themeOptions.forEach(option => {
      option.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        setTheme(theme);
      });
    });
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  }
  
  // Close mobile menu when clicking on a link
  function closeMobileMenu() {
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
  }
  
  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          closeMobileMenu();
          
          // Calculate header height for offset
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
  }
  
  // Add scroll reveal animations with Intersection Observer
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-title, .project-card, .skill-category, .stat');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial styles and observe elements
    revealElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
    
    // Add CSS for revealed state
    const style = document.createElement('style');
    style.textContent = `
      .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Update copyright year
  function updateCopyrightYear() {
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
      copyrightElement.textContent = `© 2016–${currentYear} Cosmas Onyekwelu. All rights reserved.`;
    }
  }
  
  // Add header scroll effect
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = 'var(--shadow)';
      } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = 'none';
      }
    });
  }
  
  // Optimize images - Lazy load non-critical images
  function optimizeImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      // Add error handling
      img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
      });
    });
  }
  
  // Initialize all functionality
  function init() {
    // Initialize theme
    initTheme();
    
    // Initialize theme selector
    initThemeSelector();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Optimize images
    optimizeImages();
    
    // Add event listeners
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Handle form submission
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }
  
  // Initialize when DOM is ready
  init();
});

// Performance optimization - Load non-critical resources after page load
window.addEventListener('load', function() {
  // Preload images that are below the fold
  const belowFoldImages = document.querySelectorAll('img[loading="lazy"]');
  
  belowFoldImages.forEach(img => {
    if (img.complete) return;
    
    const imgSrc = img.getAttribute('src');
    if (imgSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imgSrc;
      document.head.appendChild(link);
    }
  });
});