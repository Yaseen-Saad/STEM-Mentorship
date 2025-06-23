document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        // Hide all tabs and remove active class
        tabContents.forEach(tab => tab.classList.remove('active'));
        tabButtons.forEach(button => button.classList.remove('active'));

        // Show selected tab and add active class
        document.getElementById(`${tabId}-content`).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });

    // Render Math Formulas
    document.querySelectorAll('.math-formula').forEach(formula => {
        try {
            katex.render(formula.textContent, formula, {
                throwOnError: false,
                displayMode: true
            });
        } catch (e) {
            console.error('Failed to render math formula:', e);
        }
    });

    // Add hover effects to practice cards
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-md)';
        });
    });
});
