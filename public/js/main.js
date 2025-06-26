document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS animation library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }
  
  // Initialize all components
  initializeAnimations();
  initializeTestimonialCarousel();
  initializeFAQToggle();
  initializeCounters();
  initializeFormValidation();
  initializeToastNotifications();
  initializeScrollEffects();
});

// Initialize custom animations for elements without AOS
function initializeAnimations() {
  const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  elements.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// Enhanced scroll effects
function initializeScrollEffects() {
  let ticking = false;
  
  function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
        
    // Header shadow effect
    const header = document.querySelector('header');
    if (header) {
      if (scrolled > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        header.style.backgroundColor = 'rgba(255,255,255,0.95)';
        header.style.backdropFilter = 'blur(10px)';
      } else {
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        header.style.backgroundColor = '#ffffff';
        header.style.backdropFilter = 'none';
      }
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

function initializeToastNotifications() {
  // Get all acceptances from the data divs
  const acceptanceContainer = document.querySelector('.acceptance-data');
  if (!acceptanceContainer) return;
  
  const acceptances = [];
  const acceptanceDivs = acceptanceContainer.querySelectorAll('div');
  
  acceptanceDivs.forEach(div => {
    const name = div.dataset.name;
    const university = div.dataset.university;
    const program = div.dataset.program;
    
    if (name && university && program) {
      acceptances.push({ name, university, program });
    }
  });
  
  if (acceptances.length === 0) return;
  
  // Get random acceptance
  const randomIndex = Math.floor(Math.random() * acceptances.length);
  const acceptance = acceptances[randomIndex];
  
  // Format message based on language
  const lang = document.documentElement.lang;
  const message = lang === 'ar' 
    ? `${acceptance.name} تم قبوله في ${acceptance.university} لدراسة ${acceptance.program}!` 
    : `${acceptance.name} was accepted into ${acceptance.university} to study ${acceptance.program}!`;
  
  // Set message in toast
  const toastMessage = document.getElementById('toastMessage');
  if (toastMessage) {
    toastMessage.textContent = message;
  }
  
  // Show toast after a delay
  setTimeout(showToast, 2000);
  
  // Set up automatic rotation of acceptances
  setInterval(() => {
    const newIndex = Math.floor(Math.random() * acceptances.length);
    const newAcceptance = acceptances[newIndex];
    
    const newMessage = lang === 'ar' 
      ? `${newAcceptance.name} تم قبوله في ${newAcceptance.university} لدراسة ${newAcceptance.program}!` 
      : `${newAcceptance.name} was accepted into ${newAcceptance.university} to study ${newAcceptance.program}!`;
    
    if (toastMessage) {
      toastMessage.textContent = newMessage;
    }
    
    showToast();
  }, 30000); // Show new acceptance every 30 seconds
}

function showToast() {
  const toast = document.getElementById('acceptanceToast');
  if (toast) {
    toast.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 5000);
  }
}

function dismissToast() {
  const toast = document.getElementById('acceptanceToast');
  if (toast) {
    toast.classList.add('hidden');
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
