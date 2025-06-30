// Resources page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeResourcesPage();
});

// Global variable to track if we're in static mode
let isStaticMode = false;
// Global variable to store resources data
let resourcesData = {};

function initializeResourcesPage() {
    // Check if we're running in static mode (no server)
    checkServerStatus().then(() => {
        // Initialize tab navigation
        initializeTabNavigation();
        
        // Load resources data from JSON file
        loadLocalResourcesData();
        
        // Initialize download handlers
        initializeDownloadHandlers();
        
        // Initialize existing functionality
        initializeMathFormulas();
        initializePracticeCards();
    });
}

// Check if server/API is available
async function checkServerStatus() {
    try {
        const response = await fetch('/health', { 
            method: 'GET',
            timeout: 5000 
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Server status:', data);
            isStaticMode = false;
        } else {
            throw new Error('Server not responding');
        }
    } catch (error) {
        console.log('Running in static mode:', error.message);
        isStaticMode = true;
        showStaticModeNotice();
    }
}

// Show notice when in static mode
function showStaticModeNotice() {
    const notice = document.createElement('div');
    notice.className = 'static-mode-notice';
    notice.style.cssText = `
        margin: 20px auto; 
        padding: 15px 20px; 
        background: linear-gradient(135deg, #fff3cd, #ffeaa7); 
        border: 2px solid #856404; 
        border-radius: 10px; 
        color: #856404; 
        text-align: center;
        max-width: 800px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    notice.innerHTML = `
        <strong>⚠️ Static Mode</strong><br>
        You're viewing a static version of this page. 
        Download tracking and statistics are not available. 
        For full functionality, visit the live site.
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(notice, container.firstChild);
    }
}

// Load resources data from local JSON file
async function loadLocalResourcesData() {
    try {
        // First, try to get resources with file sizes from the API
        if (!isStaticMode) {
            try {
                const sizesResponse = await fetch('/api/file-sizes');
                if (sizesResponse.ok) {
                    const sizesData = await sizesResponse.json();
                    if (sizesData.success) {
                        resourcesData = sizesData.data;
                        console.log('Loaded resources data with file sizes:', resourcesData);
                        
                        // Render resources using data with actual file sizes
                        renderAllResources();
                        
                        // Render resources for each subject tab
                        for (const subject in resourcesData) {
                            if (resourcesData.hasOwnProperty(subject)) {
                                renderSubjectResources(subject, resourcesData[subject]);
                            }
                        }
                        
                        return; // Exit early if we loaded from API
                    }
                }
            } catch (err) {
                console.log('Could not get file sizes from API, falling back to static JSON');
            }
        }
        
        // Fallback to static JSON if API fails or in static mode
        const response = await fetch('/js/resources-data.json');
        if (response.ok) {
            resourcesData = await response.json();
            console.log('Loaded resources data from static JSON:', resourcesData);
            
            // Render all resources initially
            renderAllResources();
            
            // Render resources for each subject tab
            for (const subject in resourcesData) {
                if (resourcesData.hasOwnProperty(subject)) {
                    renderSubjectResources(subject, resourcesData[subject]);
                }
            }
        } else {
            console.error('Failed to load resources data');
        }
    } catch (error) {
        console.error('Error loading resources data:', error);
    }
}

// Render all resources for the "All" tab
function renderAllResources() {
    const allResourcesGrid = document.querySelector('#all-content .resource-cards-grid');
    if (!allResourcesGrid) return;
    
    // Clear existing content
    allResourcesGrid.innerHTML = '';
    
    // Combine all resources
    let allResources = [];
    for (const subject in resourcesData) {
        if (resourcesData.hasOwnProperty(subject)) {
            allResources = allResources.concat(resourcesData[subject]);
        }
    }
    
    // Render all resources
    allResources.forEach((resource, index) => {
        const card = createResourceCard(resource, index);
        allResourcesGrid.appendChild(card);
    });
}

// Render resources for a specific subject
function renderSubjectResources(subject, resources) {
    const container = document.getElementById(`${subject}-content`);
    if (!container) return;
    
    const resourcesGrid = container.querySelector('.resource-cards-grid');
    if (!resourcesGrid) return;
    
    // Clear existing content
    resourcesGrid.innerHTML = '';
    
    // Add resources
    resources.forEach((resource, index) => {
        const card = createResourceCard(resource, index);
        resourcesGrid.appendChild(card);
    });
}

// Create a resource card element from template
function createResourceCard(resource, index) {
    const template = document.getElementById('resource-card-template');
    const card = document.importNode(template.content, true).querySelector('.resource-card');
    
    // Set delay for animation
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    // Set card content
    card.querySelector('.resource-title').textContent = resource.fileName.replace('.pdf', '');
    card.querySelector('.resource-category').textContent = resource.category;
    card.querySelector('.file-size').textContent = resource.fileSize || 'PDF';
    card.querySelector('.count').textContent = isStaticMode ? 'Static' : resource.downloadCount;
    
    // Set button attributes for download
    const button = card.querySelector('.resource-link');
    button.setAttribute('data-resource', resource.fileId);
    button.setAttribute('data-file-path', resource.filePath);
    
    return card;
}

// Tab Navigation
function initializeTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-content`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Initialize download handlers
function initializeDownloadHandlers() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('resource-link') || e.target.closest('.resource-link')) {
            e.preventDefault();
            const button = e.target.classList.contains('resource-link') ? e.target : e.target.closest('.resource-link');
            const resourceId = button.getAttribute('data-resource');
            
            // Find resource in our data
            const resourceItem = getResourceById(resourceId);
            
            if (resourceItem) {
                if (isStaticMode) {
                    // Direct download in static mode
                    console.log('Static mode: Direct download', resourceItem.filePath);
                    // Create a temporary anchor to force download
                    const a = document.createElement('a');
                    a.href = resourceItem.filePath;
                    a.download = resourceItem.fileName || 'download.pdf'; // Forces download instead of navigation
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    // Use tracking API in dynamic mode
                    trackAndDownload(resourceItem);
                }
            } else {
                console.error('Resource not found:', resourceId);
            }
        }
    });
}

// Helper function to find a resource by ID
function getResourceById(fileId) {
    for (const subject in resourcesData) {
        if (resourcesData.hasOwnProperty(subject)) {
            const resource = resourcesData[subject].find(item => item.fileId === fileId);
            if (resource) return resource;
        }
    }
    return null;
}

// Track download and initiate download of the file (not just opening it)
function trackAndDownload(resource) {
    const subject = resource.fileId.split('-')[0];
    const topic = resource.fileId.split('-').slice(1).join('-');
    
    // Show loading state on the button if possible
    const button = document.querySelector(`[data-resource="${resource.fileId}"]`);
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
    }
    
    fetch(`/api/track-resource?type=pdf&subject=${subject}&topic=${topic}`)
        .finally(() => {
            // Create a temporary anchor to trigger download
            const a = document.createElement('a');
            a.href = resource.filePath;
            a.download = resource.fileName || 'download.pdf'; // Forces download instead of navigation
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Update UI after download starts
            setTimeout(() => {
                if (button) {
                    button.classList.remove('loading');
                    button.disabled = false;
                    
                    // Update download count display if not in static mode
                    if (!isStaticMode) {
                        const countElement = button.closest('.resource-card')?.querySelector('.count');
                        if (countElement) {
                            const currentCount = parseInt(countElement.textContent) || 0;
                            countElement.textContent = (currentCount + 1).toString();
                        }
                    }
                }
            }, 1000);
        });
}

// Initialize math formulas (existing functionality)
function initializeMathFormulas() {
    document.querySelectorAll('.math-formula').forEach(formula => {
        try {
            if (typeof katex !== 'undefined') {
                katex.render(formula.textContent, formula, {
                    throwOnError: false,
                    displayMode: true
                });
            }
        } catch (e) {
            console.error('Failed to render math formula:', e);
        }
    });
}

// Initialize practice cards (existing functionality)
function initializePracticeCards() {
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
}
