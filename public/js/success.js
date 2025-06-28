document.addEventListener('DOMContentLoaded', function() {
    // Initialize Schools Chart with modern design
    const schoolsCtx = document.getElementById('schoolsChart').getContext('2d');
    new Chart(schoolsCtx, {
        type: 'bar',
        data: {
            labels: ['October STEM', 'Maadi STEM', 'Alexandria STEM', 'Dakahlia STEM', 'Kafr El Sheikh STEM'],
            datasets: [{
                label: 'Acceptance Rate (%)',
                data: [85, 80, 75, 72, 70],
                backgroundColor: [
                    'rgba(94, 67, 126, 0.9)',
                    'rgba(77, 173, 121, 0.9)',
                    'rgba(173, 216, 230, 0.9)',
                    'rgba(126, 94, 67, 0.9)',
                    'rgba(67, 126, 94, 0.9)'
                ],
                borderRadius: 6,
                borderSkipped: false,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });    // Enhanced Testimonials Carousel with fade effect

    // Enhanced stat animation with IntersectionObserver and counter animation
    const statsSection = document.querySelector('.stats-section');
    const statCards = document.querySelectorAll('.stat-card');
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const animate = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.round(current) + (target > 100 ? '+' : '%');
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + (target > 100 ? '+' : '%');
            }
        };
        
        animate();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('animate');
                
                // Animate the stat number
                const statValue = card.querySelector('h3');
                const target = parseInt(statValue.dataset.value || statValue.textContent);
                animateCounter(statValue, target);
                
                // Unobserve after animation
                observer.unobserve(card);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    statCards.forEach(card => observer.observe(card));

    // Initialize Rankings Chart
    if (document.getElementById('rankingsChart')) {
        const rankingsCtx = document.getElementById('rankingsChart').getContext('2d');
        new Chart(rankingsCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [
                    {
                        label: 'Mathematics',
                        data: [45, 38, 32, 27, 21, 14],
                        borderColor: 'rgba(94, 67, 126, 1)',
                        backgroundColor: 'rgba(94, 67, 126, 0.1)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: 'rgba(94, 67, 126, 1)'
                    },
                    {
                        label: 'Physics',
                        data: [52, 48, 39, 34, 26, 22],
                        borderColor: 'rgba(77, 173, 121, 1)',
                        backgroundColor: 'rgba(77, 173, 121, 0.1)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: 'rgba(77, 173, 121, 1)'
                    },
                    {
                        label: 'Informatics',
                        data: [65, 57, 48, 39, 30, 19],
                        borderColor: 'rgba(173, 216, 230, 1)',
                        backgroundColor: 'rgba(173, 216, 230, 0.1)',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointBackgroundColor: 'rgba(173, 216, 230, 1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw + ' (Global Rank)';
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                },
                scales: {
                    y: {
                        reverse: true,
                        title: {
                            display: true,
                            text: 'Global Ranking',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '#' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 2
                    }
                }
            }
        });
    }

    // Animate impact counter values
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElements = entry.target.querySelectorAll('.counter-value');
                counterElements.forEach(counter => {
                    const target = parseInt(counter.dataset.value);
                    const duration = 2000;
                    let start = 0;
                    let increment = target / (duration / 16);
                    
                    if (counter.classList.contains('animated')) return;
                    counter.classList.add('animated');
                    
                    let timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(start);
                        }
                    }, 16);
                });
                impactObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    const impactGrids = document.querySelectorAll('.impact-grid');
    impactGrids.forEach(grid => impactObserver.observe(grid));

    // Initialize testimonial indicators
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialIndicators = document.querySelectorAll('.indicator');
    
    function updateIndicators(currentIndex) {
        testimonialIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Connect indicators to the carousel
    testimonialIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            updateIndicators(currentSlide);
        });
    });
});
