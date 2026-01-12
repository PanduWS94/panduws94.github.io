// Helper: Normalize path for comparison
function normalizePath(path) {
    path = path.replace(/\/$/, '') || '/'; // Remove trailing slash
    if (path === '/index.html') path = '/';
    return path;
}

// Set active menu based on current page
function setActiveMenuByPage() {
    const navLinks = document.querySelectorAll('a.nav-link, .sidebar-submenu a');
    const currentPath = normalizePath(window.location.pathname);

    // Store current expanded states to preserve them
    const expandedToggles = new Set();
    document.querySelectorAll('.submenu-toggle.expanded').forEach(toggle => {
        expandedToggles.add(toggle);
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) {
            link.classList.remove('active');
            return;
        }

        // Build the full URL for the link
        let linkUrl = href;
        if (!href.startsWith('/')) {
            const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
            try {
                linkUrl = new URL(href, baseUrl).pathname;
            } catch (e) {
                linkUrl = '/' + href;
            }
        }

        const normalizedLinkPath = normalizePath(linkUrl);
        const isActive = normalizedLinkPath === currentPath;

        if (isActive) {
            link.classList.add('active');

            // If submenu item, highlight parent toggle too
            const submenu = link.closest('.sidebar-submenu');
            if (submenu) {
                submenu.classList.add('active');
                const toggle = submenu.previousElementSibling;
                if (toggle?.classList.contains('submenu-toggle')) {
                    toggle.classList.add('active');
                    // Preserve expanded state
                    if (expandedToggles.has(toggle)) {
                        toggle.classList.add('expanded');
                    }
                }
            }
        } else {
            link.classList.remove('active');
        }
    });

    // Restore expanded toggles (don't auto-collapse)
    expandedToggles.forEach(toggle => {
        toggle.classList.add('expanded');
        const submenu = toggle.parentElement?.querySelector('.sidebar-submenu');
        if (submenu) {
            submenu.classList.add('active');
        }
    });
}

// Toggle mobile menu
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarMenu = document.querySelector('.sidebar-menu');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebarMenu.classList.toggle('active');
        });
    }

    // Close menu and collapse submenus when clicking main nav links
    const mainNavLinks = document.querySelectorAll('.sidebar-menu > li > a.nav-link');
    mainNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarMenu.classList.remove('active');

            // Collapse all submenus when clicking main nav (not submenu items)
            document.querySelectorAll('.sidebar-submenu').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.submenu-toggle').forEach(t => t.classList.remove('expanded'));
        });
    });

    // Smooth scroll on anchor links (for homepage)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.getElementById(link.getAttribute('href').substring(1));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Submenu toggle
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const submenu = toggle.parentElement?.querySelector('.sidebar-submenu');
            if (submenu) {
                submenu.classList.toggle('active');
                toggle.classList.toggle('expanded');
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveMenuByPage();
    initSidebar();
});

