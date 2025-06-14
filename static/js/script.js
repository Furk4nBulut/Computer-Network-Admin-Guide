function showSection(sectionId) {
    try {
        console.log("Show section called with id:", sectionId);

        // Hide all sections and remove active class
        document.querySelectorAll('.article-section').forEach(section => {
            section.classList.remove('active-section');
        });

        // Show the selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active-section');
            applyColumnLayout(); // Apply column layout to the active section
        } else {
            console.warn(`Section with id ${sectionId} not found`);
        }

        // Remove active class from all navigation and sidebar links
        document.querySelectorAll('.nav-link, .article-link, .sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to the corresponding nav, article, and sidebar links
        const activeLinks = document.querySelectorAll(`.nav-link[href="#${sectionId}"], .article-link[href="#${sectionId}"], .sidebar-link[href="#${sectionId}"]`);
        activeLinks.forEach(link => {
            link.classList.add('active');
        });

        // Load dynamic sidebar content for articles
        if (sectionId.startsWith('article')) {
            loadArticleSidebar(sectionId);
        } else {
            // Clear dynamic sidebar for non-article sections
            const targetDiv = document.getElementById('dynamic-article-sidebar');
            if (targetDiv) targetDiv.innerHTML = '';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error in showSection:', error);
    }
}

function toggleDarkMode() {
    try {
        document.documentElement.classList.toggle('dark-mode');
        const icon = document.querySelector('.dark-mode-toggle i');
        if (document.documentElement.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark-mode'));
    } catch (error) {
        console.error('Error in toggleDarkMode:', error);
    }
}

function scrollToTop() {
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error in scrollToTop:', error);
    }
}

function toggleColumnLayout() {
    try {
        const isSingleColumn = document.querySelector('.article-section.active-section')?.classList.contains('single-column');
        const newLayout = isSingleColumn ? 'double' : 'single';

        // Update all article sections
        document.querySelectorAll('.article-section').forEach(section => {
            if (newLayout === 'single') {
                section.classList.add('single-column');
            } else {
                section.classList.remove('single-column');
            }
        });

        // Update button label
        const label = document.getElementById('column-label');
        if (label) {
            label.textContent = newLayout === 'single' ? '1 Column' : '2 Columns';
        }

        // Store preference
        localStorage.setItem('columnLayout', newLayout);
    } catch (error) {
        console.error('Error in toggleColumnLayout:', error);
    }
}

function applyColumnLayout() {
    try {
        const layout = localStorage.getItem('columnLayout') || 'double'; // Default to double
        document.querySelectorAll('.article-section').forEach(section => {
            if (layout === 'single') {
                section.classList.add('single-column');
            } else {
                section.classList.remove('single-column');
            }
        });

        // Update button label
        const label = document.getElementById('column-label');
        if (label) {
            label.textContent = layout === 'single' ? '1 Column' : '2 Columns';
        }
    } catch (error) {
        console.error('Error in applyColumnLayout:', error);
    }
}

function loadArticleSidebar(sectionId) {
    try {
        const targetDiv = document.getElementById('dynamic-article');
        if (!targetDiv) {
            console.error('Sidebar container not found!');
            return;
        }
        const url = `/static/sidebar_${sectionId}.html`;
        console.log("Fetching sidebar from:", url);

        fetch(url)
            .then(response => {
                console.log("Fetch response:", response.status);
                if (!response.ok) {
                    throw new Error('Sidebar not found');
                }
                return response.text();
            })
            .then(html => {
                targetDiv.innerHTML = html;
                // Re-attach event listeners to new sidebar links
                document.querySelectorAll('#dynamic-article-sidebar .sidebar-link').forEach(link => {
                    const href = link.getAttribute('href').substring(1); // Remove '#'
                    link.addEventListener('click', () => scrollToAnchor(href));
                });
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                targetDiv.innerHTML = '<p>Sidebar content unavailable.</p>';
            });
    } catch (error) {
        console.error('Error in loadArticleSidebar:', error);
    }
}

function scrollToAnchor(anchorId) {
    try {
        // Remove active class from all sidebar links
        document.querySelectorAll('#dynamic-article-sidebar .sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to the clicked link
        const activeLink = document.querySelector(`#dynamic-article-sidebar .sidebar-link[href="#${anchorId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Scroll to the anchor within the active section
        const element = document.getElementById(anchorId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.warn('Warning: `Anchor with id ${anchorId} not found`');
        }
    } catch(error) {
        console.error('Error in scrollToAnchor:', error);
    }
}

function toggleMenu() {
    try {
        const navLinks = document.getElementById("navLinks");
        navLinks.classList.toggle("show");
    } catch(error) {
        console.error('Error in toggleMenu:', error);
    }
}

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    try {
        showSection('home');
        applyColumnLayout(); // Apply layout on load
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark-mode');
            const icon = document.querySelector('.dark-mode-toggle i');
            if (icon) {
                icon.classList.replace('fa-moon', 'fa-sun');
            }
        }
    } catch(error) {
        console.error('Error in DOMContentLoaded:', error);
    }
});

// Back to top button visibility
window.addEventListener('scroll', () => {
    try {
        const button = document.querySelector('.back-to-top');
        button.classList.toggle('visible', window.scrollY > 200);
    } catch(error) {
        console.error('Error in scroll event listener:', error);
    }
});