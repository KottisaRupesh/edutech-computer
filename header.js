/* =========================================
   EduTech Computer - Header/Navbar Scripts
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================
       1. UPDATE NAVBAR AUTH STATE
       ========================================= */
    function updateNavbarAuthState() {
        const currentUser = JSON.parse(localStorage.getItem('edutechCurrentUser'));
        const navLogin = document.getElementById('navLogin');
        const navProfile = document.getElementById('navProfile');

        if (!navLogin || !navProfile) return;

        if (currentUser) {
            navLogin.classList.add('d-none');
            navProfile.classList.remove('d-none');
        } else {
            navLogin.classList.remove('d-none');
            navProfile.classList.add('d-none');
        }
    }

    updateNavbarAuthState();

    /* =========================================
       2. LOGOUT FUNCTIONALITY
       ========================================= */
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('edutechCurrentUser');
            alert('You have been logged out successfully.');
            window.location.href = 'index.html';
        });
    }

    /* =========================================
       3. HIGHLIGHT ACTIVE NAV LINK
       ========================================= */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarMain');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }

        link.addEventListener('click', function () {
            if (window.innerWidth < 992 && navbarCollapse && navbarCollapse.classList.contains('show')) {
                if (window.bootstrap && bootstrap.Collapse) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

});