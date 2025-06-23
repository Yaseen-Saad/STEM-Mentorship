document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animation library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
  
  // Initialize toast notifications
  initializeToastNotifications();
  
  // Testimonials Carousel
  initializeTestimonialCarousel();
  
  // FAQ toggle functionality
  initializeFAQToggle();
  
  // Counter animation for statistics
  initializeCounters();
  
  // Form validation
  initializeFormValidation();
});

function initializeToastNotifications() {
  const toastContainer = document.getElementById('acceptanceToast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toastContainer || !toastMessage) return;
  
  // Extract acceptance data from the data attributes
  const acceptanceScript = document.querySelector('.acceptance-data');
  if (!acceptanceScript) return;
  
  try {
    // We'll use the DOM's dataset to get the data
    const acceptances = Array.from(document.querySelectorAll('[data-name]')).map(el => ({
      name: el.dataset.name,
      university: el.dataset.university,
      program: el.dataset.program
    }));
    
    if (!acceptances.length) return;
    
    // Display a random acceptance after a delay
    setTimeout(() => {
      displayRandomAcceptance(acceptances, toastMessage, toastContainer);
      
      // Set up recurring display
      setInterval(() => {
        displayRandomAcceptance(acceptances, toastMessage, toastContainer);
      }, 10000); // Show a new one every 10 seconds
      
    }, 3000); // Initial delay
  } catch (e) {
    console.error('Error initializing toast notifications:', e);
  }
}

function displayRandomAcceptance(acceptances, messageEl, containerEl) {
  const randomIndex = Math.floor(Math.random() * acceptances.length);
  const acceptance = acceptances[randomIndex];
  
  // Create the message based on language
  const isArabic = document.documentElement.lang === 'ar';
  let message;
  
  if (isArabic) {
    message = `تم قبول ${acceptance.name} في برنامج ${acceptance.program} في ${acceptance.university}!`;
  } else {
    message = `${acceptance.name} was accepted to ${acceptance.university} for ${acceptance.program}!`;
  }
  
  messageEl.textContent = message;
  containerEl.classList.remove('hidden');
  
  // Auto-hide after 6 seconds
  setTimeout(() => {
    containerEl.classList.add('hidden');
  }, 6000);
}

function dismissToast() {
  const toastContainer = document.getElementById('acceptanceToast');
  if (toastContainer) {
    toastContainer.classList.add('hidden');
  }
}

function initializeTestimonialCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  if (!carousel) return;
  
  const track = carousel.querySelector('.testimonial-track');
  const indicators = carousel.querySelectorAll('.carousel-indicators button');
  const cards = carousel.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  
  // Set initial position and indicators
  updateCarousel();
  
  // Add click event listeners to indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  function updateCarousel() {
    if (!track || cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 
                      parseInt(getComputedStyle(cards[0]).marginLeft) + 
                      parseInt(getComputedStyle(cards[0]).marginRight);
    
    track.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Auto-rotate testimonials
  let interval = setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }, 5000);
  
  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', () => {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    }, 5000);
  });
  
  // Update carousel on window resize
  window.addEventListener('resize', updateCarousel);
}

function initializeFAQToggle() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    
    question.addEventListener('click', () => {
      item.classList.toggle('active');
      const toggleIcon = item.querySelector('.toggle-icon');
      if (toggleIcon) {
        toggleIcon.textContent = item.classList.contains('active') ? 'expand_less' : 'expand_more';
      }
    });
  });
}

function initializeCounters() {
  const counterElements = document.querySelectorAll('[data-value]');
  
  if (counterElements.length === 0) return;
  
  const options = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.dataset.value);
        
        animateCounter(target, 0, finalValue, 1500);
        observer.unobserve(target);
      }
    });
  }, options);
  
  counterElements.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      element.textContent = end;
      clearInterval(timer);
    }
  }, stepTime);
}

function initializeFormValidation() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        highlightField(field, true);
      } else {
        highlightField(field, false);
      }
    });
    
    // Email validation
    const emailField = contactForm.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);
      if (!validEmail) {
        isValid = false;
        highlightField(emailField, true);
      }
    }
    
    if (isValid) {
      // In a real implementation, this would send the form data
      const lang = document.documentElement.lang;
      const successMessage = lang === 'ar' ? 
        'شكراً لتواصلك معنا! سنرد عليك قريباً.' : 
        'Thank you for contacting us! We\'ll respond soon.';
      
      alert(successMessage);
      contactForm.reset();
    }
  });
  
  function highlightField(field, isError) {
    if (isError) {
      field.classList.add('error');
    } else {
      field.classList.remove('error');
    }
  }
  
  // Real-time validation
  const formFields = contactForm.querySelectorAll('input, textarea, select');
  formFields.forEach(field => {
    field.addEventListener('blur', function() {
      if (field.hasAttribute('required') && !field.value.trim()) {
        highlightField(field, true);
      } else if (field.type === 'email' && field.value.trim()) {
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        highlightField(field, !validEmail);
      } else {
        highlightField(field, false);
      }
    });
  });
}
