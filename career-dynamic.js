// Dynamic career page population script
// This script handles loading career data and populating the career listings and detail pages

document.addEventListener('DOMContentLoaded', function() {
    // Wait for CareerDataManager to be available
    if (typeof CareerDataManager === 'undefined') {
        console.log('CareerDataManager not loaded, retrying...');
        setTimeout(function() {
            if (typeof CareerDataManager !== 'undefined') {
                initializeCareerPages();
            } else {
                console.error('CareerDataManager failed to load');
            }
        }, 100);
        return;
    }
    
    initializeCareerPages();
});

function initializeCareerPages() {
    // Check if we're on the career listing page
    if (document.querySelector('.career-list')) {
        loadCareerListings();
        setupFilters();
    }
    
    // Check if we're on the career detail page
    if (document.querySelector('.career-detail-content')) {
        loadCareerDetail();
    }
}

function loadCareerListings() {
    const careerListContainer = document.querySelector('.career-list');
    if (!careerListContainer) {
        console.log('Career list container not found');
        return;
    }

    let careers;
    try {
        careers = CareerDataManager.getAllActiveCareers();
        console.log('Loading careers:', careers.length);
    } catch (error) {
        console.error('Error loading career data:', error);
        careerListContainer.innerHTML = '<div class="col-12"><p>Error loading job listings. Please refresh the page.</p></div>';
        return;
    }
    
    if (!careers || careers.length === 0) {
        console.log('No careers found in data');
        careerListContainer.innerHTML = '<div class="col-12"><p>No job openings available at the moment.</p></div>';
        return;
    }
    
    careerListContainer.innerHTML = '';
    careerListContainer.style.minHeight = '400px'; // Ensure container has minimum height
    
    careers.forEach(career => {
        const careerItem = createCareerItem(career);
        careerListContainer.appendChild(careerItem);
    });
    
    console.log('Career list container height:', careerListContainer.offsetHeight);
    console.log('Career items loaded:', careerListContainer.children.length);
}

function createCareerItem(career) {
    const careerItem = document.createElement('div');
    careerItem.className = `col-sm-6 grid-item category-${career.category}`;
    careerItem.style.minHeight = '200px'; // Ensure minimum height
    careerItem.innerHTML = `
        <div class="job-item" style="height: 100%; display: flex; flex-direction: column;">
            <h4 class="job-item-title">
                <a href="career-detail.html?id=${career.id}">${career.title}</a>
            </h4>
            <div class="job-item-descr">${career.shortDescription}</div>
            <div class="job-item-category">${career.location} &nbsp; /&nbsp; ${career.type}</div>
        </div>
    `;
    
    return careerItem;
}

function loadCareerDetail() {
    // Get career ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const careerId = urlParams.get('id');
    
    if (!careerId) {
        // Redirect to career page if no ID provided
        window.location.href = 'career.html';
        return;
    }
    
    const career = CareerDataManager.getCareerById(careerId);
    
    if (!career) {
        // Redirect to career page if career not found
        window.location.href = 'career.html';
        return;
    }
    
    populateCareerDetail(career);
}

function populateCareerDetail(career) {
    // Update page title
    document.title = `YardnVision Enterprises - ${career.title}`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = career.shortDescription;
    }
    
    // Update main content
    const categoryElement = document.querySelector('.section-item-title-xs');
    if (categoryElement) {
        categoryElement.textContent = career.category;
    }
    
    const titleElement = document.querySelector('.h2-flash.font-libre.mb-0 strong');
    if (titleElement) {
        titleElement.textContent = career.title;
    }
    
    const locationElement = document.querySelector('.mt10.text-normal');
    if (locationElement) {
        locationElement.textContent = `${career.location} &nbsp; /&nbsp; ${career.type}`;
    }
    
    // Update description
    const descriptionElement = document.querySelector('.article-content .col-lg-10 p');
    if (descriptionElement) {
        descriptionElement.textContent = career.description;
    }
    
    // Update image
    const imageElement = document.querySelector('.article-content figure img');
    if (imageElement) {
        imageElement.src = career.image;
        imageElement.alt = career.title;
    }
    
    // Update detailed description
    const detailedDescription = document.querySelector('.article-content .fs20');
    if (detailedDescription) {
        detailedDescription.innerHTML = `
            <p>${career.description}</p>
            <p>${career.emphasis}</p>
        `;
    }
    
    // Update responsibilities
    updateListSection('What you\'ll do:', career.responsibilities);
    
    // Update requirements
    updateListSection('What you\'ll bring:', career.requirements);
    
    // Update benefits
    updateListSection('What you\'ll get:', career.benefits);
    
    // Update apply link
    const applyLink = document.querySelector('.project-next-simple a');
    if (applyLink) {
        applyLink.href = `mailto:yardnvision@gmail.com?subject=Application for ${career.title} Position`;
        applyLink.textContent = 'Apply';
    }
}

function updateListSection(heading, items) {
    const sections = document.querySelectorAll('.article-content h2.fs30');
    let targetSection = null;
    
    sections.forEach(section => {
        if (section.textContent.includes(heading)) {
            targetSection = section;
        }
    });
    
    if (targetSection && targetSection.nextElementSibling) {
        const listElement = targetSection.nextElementSibling;
        listElement.innerHTML = '';
        
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            listElement.appendChild(listItem);
        });
    }
}

function setupFilters() {
    // Add filter dropdowns if they don't exist
    const filterContainer = document.querySelector('.career-filters');
    if (!filterContainer) {
        createFilterControls();
    }
    
    // Setup filter event listeners
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('career-search');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCareers);
    }
    if (locationFilter) {
        locationFilter.addEventListener('change', filterCareers);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterCareers);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterCareers);
    }
}

function createFilterControls() {
    const careerSection = document.querySelector('.section');
    if (!careerSection) return;
    
    const filterHTML = `
        <div class="career-filters mb-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <label for="category-filter">Category:</label>
                        <select id="category-filter" class="form-control">
                            <option value="">All Categories</option>
                            ${CareerDataManager.getCategories().map(cat => 
                                `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="location-filter">Location:</label>
                        <select id="location-filter" class="form-control">
                            <option value="">All Locations</option>
                            ${CareerDataManager.getLocations().map(loc => 
                                `<option value="${loc}">${loc}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="type-filter">Job Type:</label>
                        <select id="type-filter" class="form-control">
                            <option value="">All Types</option>
                            ${CareerDataManager.getJobTypes().map(type => 
                                `<option value="${type}">${type}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="career-search">Search:</label>
                        <input type="text" id="career-search" class="form-control" placeholder="Search jobs...">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    careerSection.insertAdjacentHTML('afterbegin', filterHTML);
}

function filterCareers() {
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('career-search');
    
    let filteredCareers = CareerDataManager.getAllActiveCareers();
    
    // Apply filters
    if (categoryFilter && categoryFilter.value) {
        filteredCareers = filteredCareers.filter(career => career.category === categoryFilter.value);
    }
    
    if (locationFilter && locationFilter.value) {
        filteredCareers = filteredCareers.filter(career => career.location === locationFilter.value);
    }
    
    if (typeFilter && typeFilter.value) {
        filteredCareers = filteredCareers.filter(career => career.type === typeFilter.value);
    }
    
    if (searchInput && searchInput.value) {
        filteredCareers = CareerDataManager.searchCareers(searchInput.value);
    }
    
    // Update display
    displayFilteredCareers(filteredCareers);
}

function displayFilteredCareers(careers) {
    const careerListContainer = document.querySelector('.career-list');
    if (!careerListContainer) return;
    
    careerListContainer.innerHTML = '';
    
    if (careers.length === 0) {
        careerListContainer.innerHTML = '<div class="col-12"><p class="text-center">No jobs found matching your criteria.</p></div>';
        return;
    }
    
    careers.forEach(career => {
        const careerItem = createCareerItem(career);
        careerListContainer.appendChild(careerItem);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Utility function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
