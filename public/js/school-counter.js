// School Acceptance Rate Counter Animation
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
    
    // Function to animate progress ring
    function animateProgressRing(element, percentage) {
        const degrees = (percentage / 100) * 360;
        element.style.setProperty('--target-percentage', `${degrees}deg`);
        element.style.setProperty('--percentage', `${degrees}deg`);
    }
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const acceptanceSection = entry.target;
                const percentageElement = acceptanceSection.querySelector('.percentage-number');
                const circleElement = acceptanceSection.querySelector('.acceptance-circle');
                
                // Get the target percentage from data attribute
                const targetPercentage = parseInt(acceptanceSection.dataset.percentage || 85);
                
                // Add animation classes
                acceptanceSection.classList.add('aos-animate');
                
                // Animate the counter
                setTimeout(() => {
                    animateCounter(percentageElement, targetPercentage, 2000);
                }, 300);
                
                // Animate the progress ring
                setTimeout(() => {
                    animateProgressRing(circleElement, targetPercentage);
                }, 500);
                
                // Add success rate class based on percentage
                if (targetPercentage >= 80) {
                    acceptanceSection.classList.add('acceptance-rate-excellent');
                } else if (targetPercentage >= 60) {
                    acceptanceSection.classList.add('acceptance-rate-good');
                } else {
                    acceptanceSection.classList.add('acceptance-rate-average');
                }
                
                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all school acceptance sections
    const acceptanceSections = document.querySelectorAll('.school-acceptance');
    acceptanceSections.forEach(section => {
        section.classList.add('aos-init');
        observer.observe(section);
    });
    
    // Add high acceptance animation for rates above 90%
    setTimeout(() => {
        acceptanceSections.forEach(section => {
            const percentage = parseInt(section.dataset.percentage || 85);
            if (percentage >= 90) {
                section.classList.add('high-acceptance');
            }
        });
    }, 3000);
});

// Additional utility functions
function updateSchoolAcceptanceRate(schoolCardElement, newPercentage) {
    const acceptanceSection = schoolCardElement.querySelector('.school-acceptance');
    const percentageElement = acceptanceSection.querySelector('.percentage-number');
    const circleElement = acceptanceSection.querySelector('.acceptance-circle');
    
    acceptanceSection.dataset.percentage = newPercentage;
    animateCounter(percentageElement, newPercentage);
    animateProgressRing(circleElement, newPercentage);
}

// Function to manually trigger animation (useful for dynamic content)
function triggerAcceptanceAnimation(acceptanceElement) {
    const percentage = parseInt(acceptanceElement.dataset.percentage || 85);
    const percentageElement = acceptanceElement.querySelector('.percentage-number');
    const circleElement = acceptanceElement.querySelector('.acceptance-circle');
    
    acceptanceElement.classList.add('aos-animate');
    animateCounter(percentageElement, percentage);
    animateProgressRing(circleElement, percentage);
}
