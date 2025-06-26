// Impact Section Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    // Function to animate counter
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const impactItem = entry.target;
                const counterElement = impactItem.querySelector('.counter-value');
                
                if (counterElement) {
                    // Get the target value from data attribute
                    const targetValue = parseInt(counterElement.dataset.value || 0);
                    
                    // Add animation classes
                    impactItem.classList.add('aos-animate');
                    
                    // Animate the counter with delay
                    setTimeout(() => {
                        animateCounter(counterElement, targetValue, 2000);
                    }, 300);
                    
                    // Add special effects for high numbers
                    if (targetValue >= 1000) {
                        impactItem.setAttribute('data-special', 'true');
                    }
                    
                    // Stop observing this element
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all impact items
    const impactItems = document.querySelectorAll('.impact-item');
    impactItems.forEach(item => {
        observer.observe(item);
    });
    
    // Add staggered animation delays
    impactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Additional utility functions for impact section
function updateImpactValue(impactItemElement, newValue) {
    const counterElement = impactItemElement.querySelector('.counter-value');
    if (counterElement) {
        counterElement.dataset.value = newValue;
        animateCounter(counterElement, newValue);
    }
}

// Function to manually trigger animation (useful for dynamic content)
function triggerImpactAnimation(impactElement) {
    const counterElement = impactElement.querySelector('.counter-value');
    if (counterElement) {
        const value = parseInt(counterElement.dataset.value || 0);
        impactElement.classList.add('aos-animate');
        animateCounter(counterElement, value);
    }
}
