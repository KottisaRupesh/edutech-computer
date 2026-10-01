/* =========================================
   EduTech Computer - Footer Scripts (Premium)
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================
       1. NEWSLETTER FORM
       ========================================= */
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('newsletterEmail');
            const msgBox = document.getElementById('newsletterMsg');
            const email = emailInput.value.trim().toLowerCase();

            if (!email || !validateEmail(email)) {
                showMessage(msgBox, 'Please enter a valid email address.', 'danger');
                return;
            }

            let subscribers = JSON.parse(localStorage.getItem('edutechSubscribers')) || [];

            if (subscribers.includes(email)) {
                showMessage(msgBox, 'You are already subscribed!', 'info');
                return;
            }

            subscribers.push(email);
            localStorage.setItem('edutechSubscribers', JSON.stringify(subscribers));

            showMessage(msgBox, 'Subscribed successfully! 🎉', 'success');
            emailInput.value = '';
        });
    }


    /* =========================================
       3. HELPER FUNCTIONS
       ========================================= */
    function showMessage(element, message, type) {
        if (!element) return;
        element.className = `alert alert-${type} mt-2 py-2 small`;
        element.textContent = message;
        element.style.display = 'block';

        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 4000);
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

});