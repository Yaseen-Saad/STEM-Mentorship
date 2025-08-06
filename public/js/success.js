document.addEventListener('DOMContentLoaded', function() {
    // Initialize Schools Pie Chart with real data from last season
    const schoolsCtx = document.getElementById('schoolsChart').getContext('2d');
    new Chart(schoolsCtx, {
        type: 'pie',
        data: {
            labels: [
                'Maadi STEM (31)', 'Red Sea STEM (28)', 'October STEM (22)', 'Ismailia STEM (21)', 'Alexandria STEM (20)',
                'Assiut STEM (19)', 'Gharbia STEM (17)', 'New Cairo STEM (15)', 'Dakahlia STEM (15)', 'Qena STEM (14)', 
                'Obour STEM (13)', 'Beni Suef STEM (12)', 'Sharqia STEM (10)', 'Menoufia STEM (10)', 'Menoufia Girls STEM (10)', '11th District STEM (10)',
                'Kafr El Sheikh STEM (9)', 'Luxor STEM (7)', 'Sadat STEM (5)', 'Sohag STEM (5)', 'Minya STEM (2)'
            ],
            datasets: [{
                label: 'Students Accepted',
                data: [31, 28, 22, 21, 20, 19, 17, 15, 15, 14, 13, 12, 10, 10, 10, 10, 9, 7, 5, 5, 2], // Actual numbers
                backgroundColor: [
                    '#5E437E', // Maadi - Purple
                    '#4DAD79', // Red Sea - Green
                    '#3B82F6', // October - Blue
                    '#F59E0B', // Ismailia - Amber
                    '#EF4444', // Alexandria - Red
                    '#8B5CF6', // Assiut - Violet
                    '#22C55E', // Gharbia - Green
                    '#06B6D4', // New Cairo - Cyan
                    '#F97316', // Dakahlia - Orange
                    '#84CC16', // Qena - Lime
                    '#EC4899', // Obour - Pink
                    '#6366F1', // Beni Suef - Indigo
                    '#10B981', // Sharqia - Emerald
                    '#F472B6', // Menoufia - Rose
                    '#DC2626', // Menoufia Girls - Red
                    '#14B8A6', // 11th District - Teal
                    '#A855F7', // Kafr El Sheikh - Purple
                    '#F59E0B', // Luxor - Yellow
                    '#6B7280', // Sadat - Gray
                    '#8B5A3C', // Sohag - Brown
                    '#9CA3AF'  // Minya - Light Gray
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const percentage = ((value / total) * 100).toFixed(1);
                                return {
                                    text: `${label} - ${percentage}%`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    pointStyle: 'circle',
                                    index: i
                                };
                            });
                        }
                    }
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
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} students (${percentage}%)`;
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
