/* =========================================
   EduTech Computer - Main JavaScript
   Includes:
   - Header / Footer auto-load
   - Navbar auth state
   - Enrollment form (index.html)
   - Gallery Auto Slider (Homepage — 4s)
   - Testimonial Auto Slider (10 reviews, 4.5s)
   - Smooth scroll
   - Courses Page — Search & Filter
   - Courses Page — Enrollment Modal
   - Admission Page — Form Submit
   - Exams Page — Search & Registration Modal
   - Exams Page — Result Checker
   - Gallery Page — Filter + Lightbox
   - Contact Page — Contact Form
   - Certificate Page — Verification
   - Login Page — Authentication  ✅ NEW
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================
       1. AUTO-LOAD HEADER & FOOTER
       ========================================= */

    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(res => {
                if (!res.ok) throw new Error('Header not found');
                return res.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initHeaderScripts();
            })
            .catch(err => console.error('Header load error:', err));
    }

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html?v=' + Date.now(), { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error('Footer not found');
                return res.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                initFooterScripts();
            })
            .catch(err => console.error('Footer load error:', err));
    }

    /* =========================================
       2. HEADER SCRIPTS
       ========================================= */
    function initHeaderScripts() {
        updateNavbarAuthState();

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('edutechCurrentUser');
                alert('You have been logged out successfully.');
                window.location.href = 'index.html';
            });
        }

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navbarCollapse = document.getElementById('navbarMain');

        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

            // Auto-close mobile menu on link click
            link.addEventListener('click', function () {
                if (window.innerWidth < 992 && navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (window.bootstrap && bootstrap.Collapse) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
                    }
                }
            });
        });
    }

    /* =========================================
       3. FOOTER SCRIPTS
       ========================================= */
    function initFooterScripts() {
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

    }

    /* =========================================
       4. UPDATE NAVBAR AUTH STATE
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

    /* =========================================
       5. ENROLLMENT FORM (Index Page)
       ========================================= */
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('enrollFullName').value.trim();
            const email = document.getElementById('enrollEmail').value.trim();
            const phone = document.getElementById('enrollPhone').value.trim();
            const course = document.getElementById('enrollCourse').value;
            const mode = document.getElementById('enrollMode').value;
            const startDate = document.getElementById('enrollStartDate').value;
            const terms = document.getElementById('enrollTerms').checked;
            const msgBox = document.getElementById('enrollmentMsg');

            if (!fullName || !email || !phone || !course || !mode || !startDate) {
                showMessage(msgBox, 'Please fill in all required fields marked with *.', 'danger');
                return;
            }

            if (!validateEmail(email)) {
                showMessage(msgBox, 'Please enter a valid email address.', 'danger');
                return;
            }

            if (!terms) {
                showMessage(msgBox, 'Please accept the Terms & Conditions to proceed.', 'danger');
                return;
            }

            const enrollment = {
                id: Date.now(),
                fullName: fullName,
                email: email,
                phone: phone,
                course: course,
                mode: mode,
                startDate: startDate,
                enrolledOn: new Date().toLocaleString()
            };

            let enrollments = JSON.parse(localStorage.getItem('edutechEnrollments')) || [];
            enrollments.push(enrollment);
            localStorage.setItem('edutechEnrollments', JSON.stringify(enrollments));

            showMessage(
                msgBox,
                `🎉 Thank you ${fullName}! Your enrollment for "${course}" has been submitted. Our team will contact you within 24 hours.`,
                'success'
            );

            enrollmentForm.reset();
        });
    }

    /* =========================================
       6. GALLERY AUTO IMAGE SLIDER (Homepage — 4 seconds)
       ========================================= */
    const gallerySlider = document.getElementById('gallerySlider');
    if (gallerySlider) {
        const slides = gallerySlider.querySelectorAll('.gallery-slide');
        const prevBtn = document.getElementById('sliderPrev');
        const nextBtn = document.getElementById('sliderNext');

        let currentIndex = 0;
        let autoSlideInterval = null;
        const SLIDE_DURATION = 4000;

        function goToSlide(index) {
            if (slides[currentIndex]) slides[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            if (slides[currentIndex]) slides[currentIndex].classList.add('active');
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, SLIDE_DURATION);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });
        }

        gallerySlider.addEventListener('mouseenter', stopAutoSlide);
        gallerySlider.addEventListener('mouseleave', startAutoSlide);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { nextSlide(); startAutoSlide(); }
            else if (e.key === 'ArrowLeft') { prevSlide(); startAutoSlide(); }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        gallerySlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        gallerySlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) nextSlide();
            if (touchEndX > touchStartX + swipeThreshold) prevSlide();
        }

        startAutoSlide();
    }

    /* =========================================
       7. TESTIMONIAL AUTO SLIDER (10 reviews, 4.5s)
       ========================================= */
    const testimonialSlider = document.getElementById('testimonialSlider');
    if (testimonialSlider) {
        const track = document.getElementById('testimonialTrack');
        const slides = track ? track.querySelectorAll('.testimonial-slide') : [];
        const prevBtn = document.getElementById('testimonialPrev');
        const nextBtn = document.getElementById('testimonialNext');

        let currentIndex = 0;
        let autoInterval = null;
        const AUTO_DURATION = 4500;
        let slidesPerView = getSlidesPerView();
        let totalPages = Math.max(1, slides.length - slidesPerView + 1);

        function getSlidesPerView() {
            const w = window.innerWidth;
            if (w >= 992) return 3;
            if (w >= 768) return 2;
            return 1;
        }

        function goToSlide(index) {
            slidesPerView = getSlidesPerView();
            totalPages = Math.max(1, slides.length - slidesPerView + 1);

            if (index < 0) index = totalPages - 1;
            if (index >= totalPages) index = 0;

            currentIndex = index;

            const slideEl = slides[0];
            if (!slideEl) return;
            const slideWidth = slideEl.getBoundingClientRect().width;
            const gap = 30;
            const offset = currentIndex * (slideWidth + gap);

            track.style.transform = `translateX(-${offset}px)`;
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        function startAuto() {
            stopAuto();
            autoInterval = setInterval(nextSlide, AUTO_DURATION);
        }

        function stopAuto() {
            if (autoInterval) {
                clearInterval(autoInterval);
                autoInterval = null;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAuto();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAuto();
            });
        }

        testimonialSlider.addEventListener('mouseenter', stopAuto);
        testimonialSlider.addEventListener('mouseleave', startAuto);

        let touchStartX = 0;
        let touchEndX = 0;

        testimonialSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAuto();
        }, { passive: true });

        testimonialSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) nextSlide();
            if (touchEndX > touchStartX + threshold) prevSlide();
            startAuto();
        }, { passive: true });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                slidesPerView = getSlidesPerView();
                if (currentIndex >= Math.max(1, slides.length - slidesPerView + 1)) {
                    currentIndex = 0;
                }
                goToSlide(currentIndex);
            }, 200);
        });

        goToSlide(0);
        startAuto();
    }

    /* =========================================
       8. SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    /* =========================================
       9. COURSES PAGE — Search & Filter
       ========================================= */
    const courseSearch = document.getElementById('courseSearch');
    const courseFilters = document.getElementById('courseFilters');
    const coursesGrid = document.getElementById('coursesGrid');
    const noResults = document.getElementById('noResults');
    const clearCourseSearch = document.getElementById('clearCourseSearch');
    const coursesCountText = document.getElementById('coursesCountText');
    const resetAllFilters = document.getElementById('resetAllFilters');
    const noResultsResetBtn = document.getElementById('noResultsResetBtn');

    if (coursesGrid && courseSearch && courseFilters) {
        const courseItems = coursesGrid.querySelectorAll('.course-item');
        const totalCourses = courseItems.length;
        let activeCategory = 'all';

        const categoryLabels = {
            all: 'All Courses',
            programming: 'Programming',
            design: 'Design',
            office: 'Office',
            marketing: 'Marketing'
        };

        function filterCourses() {
            const searchTerm = courseSearch.value.trim().toLowerCase();
            let visibleCount = 0;

            // Toggle clear search button
            if (clearCourseSearch) {
                clearCourseSearch.style.display = searchTerm.length > 0 ? 'inline-flex' : 'none';
            }

            courseItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const title = item.querySelector('.course-title')?.textContent.toLowerCase() || '';
                const description = item.querySelector('.course-description')?.textContent.toLowerCase() || '';

                const matchesCategory = activeCategory === 'all' || category === activeCategory;
                const matchesSearch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);

                if (matchesCategory && matchesSearch) {
                    if (item.style.display === 'none') {
                        item.classList.remove('filtering-active');
                        void item.offsetWidth; // Trigger reflow for animation
                        item.classList.add('filtering-active');
                    }
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('filtering-active');
                }
            });

            // Update status text
            if (coursesCountText) {
                const currentLabel = categoryLabels[activeCategory] || 'Courses';
                if (activeCategory === 'all' && !searchTerm) {
                    coursesCountText.innerHTML = `Showing all <strong>${totalCourses}</strong> courses`;
                } else if (searchTerm && activeCategory !== 'all') {
                    coursesCountText.innerHTML = `Found <strong>${visibleCount}</strong> ${visibleCount === 1 ? 'course' : 'courses'} in <em>${currentLabel}</em> for "<strong>${searchTerm}</strong>"`;
                } else if (searchTerm) {
                    coursesCountText.innerHTML = `Found <strong>${visibleCount}</strong> ${visibleCount === 1 ? 'course' : 'courses'} for "<strong>${searchTerm}</strong>"`;
                } else {
                    coursesCountText.innerHTML = `Showing <strong>${visibleCount}</strong> ${visibleCount === 1 ? 'course' : 'courses'} in <em>${currentLabel}</em>`;
                }
            }

            // Toggle reset buttons
            const isFiltered = activeCategory !== 'all' || searchTerm.length > 0;
            if (resetAllFilters) {
                resetAllFilters.style.display = isFiltered ? 'inline-flex' : 'none';
            }

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }

        courseSearch.addEventListener('input', filterCourses);

        // Clear search input button
        if (clearCourseSearch) {
            clearCourseSearch.addEventListener('click', function () {
                courseSearch.value = '';
                courseSearch.focus();
                filterCourses();
            });
        }

        // Reset all filters function
        function resetFilters() {
            courseSearch.value = '';
            activeCategory = 'all';
            courseFilters.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
            });
            filterCourses();
        }

        if (resetAllFilters) {
            resetAllFilters.addEventListener('click', resetFilters);
        }

        if (noResultsResetBtn) {
            noResultsResetBtn.addEventListener('click', resetFilters);
        }

        // Category filter buttons
        courseFilters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                courseFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeCategory = this.getAttribute('data-filter');
                filterCourses();
            });
        });

        // Keyboard shortcut: Press "/" to focus search
        document.addEventListener('keydown', function (e) {
            const activeElem = document.activeElement;
            const isTyping = activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || activeElem.isContentEditable);

            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                courseSearch.focus();
                courseSearch.select();
            } else if (e.key === 'Escape' && document.activeElement === courseSearch) {
                if (courseSearch.value) {
                    courseSearch.value = '';
                    filterCourses();
                } else {
                    courseSearch.blur();
                }
            }
        });
    }

    /* =========================================
       10. COURSES PAGE — Enrollment Modal
       ========================================= */
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    const enrollModalEl = document.getElementById('enrollModal');

    if (enrollButtons.length && enrollModalEl) {
        const enrollModal = new bootstrap.Modal(enrollModalEl);
        const modalForm = document.getElementById('enrollModalForm');
        const modalCourseInput = document.getElementById('modalCourse');
        const modalCourseTitle = document.getElementById('enrollCourseTitle');
        const modalMsg = document.getElementById('enrollModalMsg');

        enrollButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const course = this.getAttribute('data-course');
                const price = this.getAttribute('data-price');

                modalCourseInput.value = course;
                modalCourseTitle.textContent = `${course} • ${price}`;

                modalForm.reset();
                modalCourseInput.value = course;
                if (modalMsg) {
                    modalMsg.innerHTML = '';
                    modalMsg.className = '';
                }

                const today = new Date().toISOString().split('T')[0];
                const dateInput = document.getElementById('modalStartDate');
                if (dateInput) dateInput.setAttribute('min', today);

                enrollModal.show();
            });
        });

        if (modalForm) {
            modalForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const fullName = document.getElementById('modalFullName').value.trim();
                const email = document.getElementById('modalEmail').value.trim();
                const phone = document.getElementById('modalPhone').value.trim();
                const course = modalCourseInput.value;
                const mode = document.getElementById('modalMode').value;
                const startDate = document.getElementById('modalStartDate').value;
                const terms = document.getElementById('modalTerms').checked;

                if (!fullName || !email || !phone || !course || !mode || !startDate) {
                    showMessage(modalMsg, 'Please fill in all required fields marked with *.', 'danger');
                    return;
                }

                if (!validateEmail(email)) {
                    showMessage(modalMsg, 'Please enter a valid email address.', 'danger');
                    return;
                }

                if (!terms) {
                    showMessage(modalMsg, 'Please accept the Terms & Conditions to proceed.', 'danger');
                    return;
                }

                const enrollment = {
                    id: Date.now(),
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    course: course,
                    mode: mode,
                    startDate: startDate,
                    enrolledOn: new Date().toLocaleString()
                };

                let enrollments = JSON.parse(localStorage.getItem('edutechEnrollments')) || [];
                enrollments.push(enrollment);
                localStorage.setItem('edutechEnrollments', JSON.stringify(enrollments));

                showMessage(
                    modalMsg,
                    `🎉 Thank you ${fullName}! Your enrollment for "${course}" has been submitted. Our team will contact you within 24 hours.`,
                    'success'
                );

                modalForm.reset();
                modalCourseInput.value = course;

                setTimeout(() => {
                    enrollModal.hide();
                }, 2500);
            });
        }

        enrollModalEl.addEventListener('hidden.bs.modal', function () {
            modalForm.reset();
            if (modalMsg) {
                modalMsg.innerHTML = '';
                modalMsg.className = '';
            }
        });
    }

    /* =========================================
       11. ADMISSION PAGE — Form Submit
       ========================================= */
    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        const admStartDate = document.getElementById('admStartDate');
        const admDob = document.getElementById('admDob');

        if (admDob) {
            const maxDob = new Date();
            maxDob.setFullYear(maxDob.getFullYear() - 10);
            admDob.setAttribute('max', maxDob.toISOString().split('T')[0]);
        }

        if (admStartDate) {
            const today = new Date().toISOString().split('T')[0];
            admStartDate.setAttribute('min', today);
        }

        admissionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fullName = document.getElementById('admFullName').value.trim();
            const email = document.getElementById('admEmail').value.trim();
            const phone = document.getElementById('admPhone').value.trim();
            const dob = document.getElementById('admDob').value;
            const gender = document.getElementById('admGender').value;
            const city = document.getElementById('admCity').value.trim();
            const address = document.getElementById('admAddress').value.trim();
            const qualification = document.getElementById('admQualification').value;
            const institution = document.getElementById('admInstitution').value.trim();
            const course = document.getElementById('admCourse').value;
            const mode = document.getElementById('admMode').value;
            const batch = document.getElementById('admBatch').value;
            const startDate = document.getElementById('admStartDate').value;
            const message = document.getElementById('admMessage').value.trim();
            const terms = document.getElementById('admTerms').checked;
            const msgBox = document.getElementById('admissionMsg');

            if (!fullName || !email || !phone || !dob || !gender || !city || !address ||
                !qualification || !institution || !course || !mode || !batch || !startDate) {
                showMessage(msgBox, 'Please fill in all required fields marked with *.', 'danger');
                window.scrollTo({ top: document.getElementById('admission-form').offsetTop - 80, behavior: 'smooth' });
                return;
            }

            if (!validateEmail(email)) {
                showMessage(msgBox, 'Please enter a valid email address.', 'danger');
                return;
            }

            if (!terms) {
                showMessage(msgBox, 'Please accept the Terms & Conditions to proceed.', 'danger');
                return;
            }

            const application = {
                id: Date.now(),
                fullName: fullName,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender,
                city: city,
                address: address,
                qualification: qualification,
                institution: institution,
                course: course,
                mode: mode,
                batch: batch,
                startDate: startDate,
                message: message,
                appliedOn: new Date().toLocaleString()
            };

            let applications = JSON.parse(localStorage.getItem('edutechAdmissions')) || [];
            applications.push(application);
            localStorage.setItem('edutechAdmissions', JSON.stringify(applications));

            showMessage(
                msgBox,
                `🎉 Thank you ${fullName}! Your admission application for "${course}" has been submitted. Our team will contact you within 24 hours.`,
                'success'
            );

            admissionForm.reset();

            setTimeout(() => {
                window.scrollTo({ top: document.getElementById('admission-form').offsetTop - 80, behavior: 'smooth' });
            }, 100);
        });
    }

    /* =========================================
       12. EXAMS PAGE — Search & Registration Modal
       ========================================= */
    const examSearch = document.getElementById('examSearch');
    const examsList = document.getElementById('examsList');
    const noExamResults = document.getElementById('noExamResults');
    const examRegisterModalEl = document.getElementById('examRegisterModal');
    const examRegisterButtons = document.querySelectorAll('.btn-exam-register');

    if (examSearch && examsList) {
        const examItems = examsList.querySelectorAll('.exam-item');

        examSearch.addEventListener('input', function () {
            const term = this.value.trim().toLowerCase();
            let visibleCount = 0;

            examItems.forEach(item => {
                const courseName = item.getAttribute('data-course')?.toLowerCase() || '';
                const title = item.querySelector('.exam-title')?.textContent.toLowerCase() || '';
                const matches = !term || courseName.includes(term) || title.includes(term);

                if (matches) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (noExamResults) {
                noExamResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }

    if (examRegisterButtons.length && examRegisterModalEl) {
        const examRegisterModal = new bootstrap.Modal(examRegisterModalEl);
        const examForm = document.getElementById('examRegisterForm');
        const examCourseInput = document.getElementById('examCourse');
        const examNameInput = document.getElementById('examName');
        const examDateInput = document.getElementById('examDate');
        const examRegTitle = document.getElementById('examRegTitle');
        const examModalMsg = document.getElementById('examModalMsg');

        examRegisterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const exam = this.getAttribute('data-exam');
                const course = this.getAttribute('data-course');
                const date = this.getAttribute('data-date');

                examCourseInput.value = course;
                examNameInput.value = exam;
                examDateInput.value = date;
                examRegTitle.textContent = `${exam} • ${date}`;

                examForm.reset();
                examCourseInput.value = course;
                examNameInput.value = exam;
                examDateInput.value = date;

                if (examModalMsg) {
                    examModalMsg.innerHTML = '';
                    examModalMsg.className = '';
                }

                examRegisterModal.show();
            });
        });

        if (examForm) {
            examForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const fullName = document.getElementById('examFullName').value.trim();
                const email = document.getElementById('examEmail').value.trim();
                const phone = document.getElementById('examPhone').value.trim();
                const course = examCourseInput.value;
                const exam = examNameInput.value;
                const examDate = examDateInput.value;
                const rollNo = document.getElementById('examRollNo').value.trim();
                const center = document.getElementById('examCenter').value;
                const terms = document.getElementById('examTerms').checked;

                if (!fullName || !email || !phone || !rollNo || !center) {
                    showMessage(examModalMsg, 'Please fill in all required fields marked with *.', 'danger');
                    return;
                }

                if (!validateEmail(email)) {
                    showMessage(examModalMsg, 'Please enter a valid email address.', 'danger');
                    return;
                }

                if (!terms) {
                    showMessage(examModalMsg, 'Please accept the exam rules to proceed.', 'danger');
                    return;
                }

                const registration = {
                    id: Date.now(),
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    course: course,
                    exam: exam,
                    examDate: examDate,
                    rollNo: rollNo,
                    center: center,
                    registeredOn: new Date().toLocaleString()
                };

                let registrations = JSON.parse(localStorage.getItem('edutechExamRegistrations')) || [];
                registrations.push(registration);
                localStorage.setItem('edutechExamRegistrations', JSON.stringify(registrations));

                showMessage(
                    examModalMsg,
                    `🎉 Thank you ${fullName}! You have registered for "${exam}". Exam Date: ${examDate}. Check your email for details.`,
                    'success'
                );

                examForm.reset();
                examCourseInput.value = course;
                examNameInput.value = exam;
                examDateInput.value = examDate;

                setTimeout(() => {
                    examRegisterModal.hide();
                }, 2500);
            });
        }

        examRegisterModalEl.addEventListener('hidden.bs.modal', function () {
            examForm.reset();
            if (examModalMsg) {
                examModalMsg.innerHTML = '';
                examModalMsg.className = '';
            }
        });
    }

    /* =========================================
       13. EXAMS PAGE — Result Checker
       ========================================= */
    const resultForm = document.getElementById('resultForm');
    if (resultForm) {
        const resultDisplay = document.getElementById('resultDisplay');
        const resultMsg = document.getElementById('resultMsg');
        const checkAgainBtn = document.getElementById('checkAgainBtn');

        const demoResults = {
            'REG12345': {
                name: 'John Doe',
                course: 'Full-Stack Web Development',
                dob: '2000-05-15',
                obtained: 42,
                total: 50,
                status: 'Passed'
            },
            'REG67890': {
                name: 'Priya Sharma',
                course: 'Python for Data Science',
                dob: '1999-11-22',
                obtained: 28,
                total: 30,
                status: 'Passed'
            },
            'REG11111': {
                name: 'Rahul Verma',
                course: 'Cyber Security Essentials',
                dob: '2001-03-10',
                obtained: 48,
                total: 100,
                status: 'Failed'
            },
            // Fallback for demo STU codes
            'STU12345': {
                name: 'John Doe',
                course: 'Full-Stack Web Development',
                dob: '2000-05-15',
                obtained: 42,
                total: 50,
                status: 'Passed'
            },
            'STU67890': {
                name: 'Priya Sharma',
                course: 'Python for Data Science',
                dob: '1999-11-22',
                obtained: 28,
                total: 30,
                status: 'Passed'
            },
            'STU11111': {
                name: 'Rahul Verma',
                course: 'Cyber Security Essentials',
                dob: '2001-03-10',
                obtained: 48,
                total: 100,
                status: 'Failed'
            }
        };

        resultForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const regInput = document.getElementById('resultRegNo') || document.getElementById('resultRollNo');
            const regNo = regInput ? regInput.value.trim().toUpperCase() : '';

            if (!regNo) {
                showMessage(resultMsg, 'Please enter your Registration Number.', 'danger');
                if (resultDisplay) resultDisplay.style.display = 'none';
                return;
            }

            const result = demoResults[regNo];

            if (!result) {
                showMessage(resultMsg, '❌ No result found. Please check your Registration Number. (Demo: REG12345 or REG67890)', 'danger');
                if (resultDisplay) resultDisplay.style.display = 'none';
                return;
            }

            const percentage = ((result.obtained / result.total) * 100).toFixed(1);
            const statusClass = result.status === 'Passed' ? 'text-success' : 'text-danger';

            document.getElementById('resultStudentName').textContent = result.name;
            document.getElementById('resultStudentCourse').textContent = result.course;
            const regDisplayEl = document.getElementById('resultStudentReg');
            if (regDisplayEl) {
                regDisplayEl.textContent = 'Registration No: ' + regNo;
            }
            document.getElementById('resultObtained').textContent = result.obtained;
            document.getElementById('resultTotal').textContent = result.total;
            document.getElementById('resultPercentage').textContent = percentage + '%';
            const statusEl = document.getElementById('resultStatus');
            statusEl.textContent = result.status;
            statusEl.className = 'mark-value ' + statusClass;

            if (resultMsg) {
                resultMsg.innerHTML = '';
                resultMsg.className = '';
            }
            if (resultDisplay) {
                resultDisplay.style.display = 'block';
                setTimeout(() => {
                    resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });

        if (checkAgainBtn) {
            checkAgainBtn.addEventListener('click', function () {
                resultForm.reset();
                if (resultDisplay) resultDisplay.style.display = 'none';
                if (resultMsg) {
                    resultMsg.innerHTML = '';
                    resultMsg.className = '';
                }
                const regInput = document.getElementById('resultRegNo') || document.getElementById('resultRollNo');
                if (regInput) regInput.focus();
            });
        }

        const downloadBtn = document.querySelector('.btn-download-result');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function () {
                alert('📄 Marksheet download will start shortly. (Demo feature)');
            });
        }
    }

    /* =========================================
       14. GALLERY PAGE — Filter + Lightbox
       ========================================= */
    const galleryFilters = document.getElementById('galleryFilters');
    const galleryGrid = document.getElementById('galleryGrid');
    const noGalleryResults = document.getElementById('noGalleryResults');
    const lightbox = document.getElementById('lightbox');

    if (galleryFilters && galleryGrid) {
        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');

        galleryFilters.querySelectorAll('.gallery-filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                galleryFilters.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');
                let visibleCount = 0;

                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    const matches = filter === 'all' || category === filter;

                    if (matches) {
                        item.style.display = '';
                        item.style.animation = 'galleryFadeIn 0.5s ease';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (noGalleryResults) {
                    noGalleryResults.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }

    if (galleryGrid && lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCat = document.getElementById('lightboxCat');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        let currentItems = [];
        let currentIndex = 0;

        function getVisibleItems() {
            return Array.from(galleryGrid.querySelectorAll('.gallery-item')).filter(item => {
                return item.style.display !== 'none';
            });
        }

        function openLightbox(index) {
            currentItems = getVisibleItems();
            currentIndex = index;

            if (currentItems.length === 0) return;

            const item = currentItems[currentIndex];
            const img = item.querySelector('img');
            const cat = item.querySelector('.gallery-cat')?.textContent || '';
            const title = item.querySelector('.gallery-overlay-content h5')?.textContent || '';

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCat.textContent = cat;
            lightboxTitle.textContent = title;

            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');
        }

        function showNext() {
            if (currentItems.length === 0) return;
            currentIndex = (currentIndex + 1) % currentItems.length;
            const item = currentItems[currentIndex];
            const img = item.querySelector('img');
            const cat = item.querySelector('.gallery-cat')?.textContent || '';
            const title = item.querySelector('.gallery-overlay-content h5')?.textContent || '';

            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCat.textContent = cat;
                lightboxTitle.textContent = title;
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        function showPrev() {
            if (currentItems.length === 0) return;
            currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
            const item = currentItems[currentIndex];
            const img = item.querySelector('img');
            const cat = item.querySelector('.gallery-cat')?.textContent || '';
            const title = item.querySelector('.gallery-overlay-content h5')?.textContent || '';

            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCat.textContent = cat;
                lightboxTitle.textContent = title;
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const visible = getVisibleItems();
                const realIndex = visible.indexOf(item);
                if (realIndex !== -1) {
                    openLightbox(realIndex);
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', function (e) {
                e.stopPropagation();
                closeLightbox();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function (e) {
                e.stopPropagation();
                showNext();
            });
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function (e) {
                e.stopPropagation();
                showPrev();
            });
        }

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            else if (e.key === 'ArrowRight') showNext();
            else if (e.key === 'ArrowLeft') showPrev();
        });

        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;

            if (touchEndX < touchStartX - threshold) showNext();
            else if (touchEndX > touchStartX + threshold) showPrev();
        }, { passive: true });
    }

    /* =========================================
       15. CONTACT PAGE — Contact Form
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value.trim();
            const terms = document.getElementById('contactTerms').checked;
            const msgBox = document.getElementById('contactMsg');

            // Validate required fields
            if (!name || !email || !subject || !message) {
                showMessage(msgBox, 'Please fill in all required fields marked with *.', 'danger');
                return;
            }

            if (!validateEmail(email)) {
                showMessage(msgBox, 'Please enter a valid email address.', 'danger');
                return;
            }

            if (!terms) {
                showMessage(msgBox, 'Please accept the Privacy Policy to proceed.', 'danger');
                return;
            }

            const contact = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
                submittedOn: new Date().toLocaleString()
            };

            let contacts = JSON.parse(localStorage.getItem('edutechContacts')) || [];
            contacts.push(contact);
            localStorage.setItem('edutechContacts', JSON.stringify(contacts));

            showMessage(
                msgBox,
                `🎉 Thank you ${name}! Your message has been received. We'll get back to you at ${email} within 24 hours.`,
                'success'
            );

            contactForm.reset();

            setTimeout(() => {
                msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    }

    /* =========================================
       16. CERTIFICATE PAGE — Verification
       ========================================= */
    const certVerifyForm = document.getElementById('certVerifyForm');
    if (certVerifyForm) {
        const certDisplay = document.getElementById('certificateDisplay');
        const certMsg = document.getElementById('certMsg');
        const certAgainBtn = document.getElementById('certAgainBtn');
        const certStatusBadge = document.getElementById('certStatusBadge');
        const certStatusText = document.getElementById('certStatusText');

        // Demo certificate records
        const demoCertificates = {
            'STU12345': {
                certId: 'CERT-2024-001',
                name: 'John Doe',
                course: 'Full-Stack Web Development',
                grade: 'A+',
                issued: '15 June 2024'
            },
            'STU67890': {
                certId: 'CERT-2024-002',
                name: 'Priya Sharma',
                course: 'Python for Data Science',
                grade: 'A',
                issued: '20 July 2024'
            },
            'STU11111': {
                certId: 'CERT-2024-003',
                name: 'Rahul Verma',
                course: 'Cyber Security Essentials',
                grade: 'B+',
                issued: '05 August 2024'
            }
        };

        // Interactive demo chips click
        document.querySelectorAll('.demo-enroll-chip').forEach(chip => {
            chip.addEventListener('click', function () {
                const code = this.getAttribute('data-code');
                const rollInput = document.getElementById('certRollNo');
                if (rollInput && code) {
                    rollInput.value = code;
                    certVerifyForm.dispatchEvent(new Event('submit'));
                }
            });
        });

        certVerifyForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const rollNoInput = document.getElementById('certRollNo');
            const rollNo = rollNoInput ? rollNoInput.value.trim().toUpperCase() : '';

            if (!rollNo) {
                showMessage(certMsg, 'Please enter an Enrollment Number to verify.', 'danger');
                return;
            }

            const record = demoCertificates[rollNo];

            if (!record) {
                showMessage(certMsg, `❌ No certificate record found for Enrollment Number "${rollNo}". Please check your Enrollment Number and try again.`, 'danger');
                return;
            }

            // Populate certificate details
            document.getElementById('certStudentName').textContent = record.name;
            document.getElementById('certCourseName').textContent = record.course;
            document.getElementById('certRollValue').textContent = rollNo;
            document.getElementById('certIdValue').textContent = record.certId;
            document.getElementById('certGradeValue').textContent = record.grade;
            document.getElementById('certIssuedValue').textContent = record.issued;

            // Update status badge & text
            if (certStatusBadge) {
                certStatusBadge.className = 'cert-status-badge badge-verified';
                certStatusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Official Verified Certificate';
            }
            if (certStatusText) {
                certStatusText.textContent = `Certificate verified successfully for ${record.name}.`;
            }

            showMessage(certMsg, `✅ Certificate Verified Successfully for ${record.name}!`, 'success');

            if (certDisplay) {
                certDisplay.style.display = 'block';
                setTimeout(() => {
                    certDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
            }
        });

        // Verify another / Reset
        if (certAgainBtn) {
            certAgainBtn.addEventListener('click', function () {
                certVerifyForm.reset();
                if (certMsg) {
                    certMsg.innerHTML = '';
                    certMsg.className = '';
                }
                if (certStatusBadge) {
                    certStatusBadge.className = 'cert-status-badge badge-demo';
                    certStatusBadge.innerHTML = '<i class="fas fa-eye"></i> Demo Certificate Preview';
                }
                if (certStatusText) {
                    certStatusText.textContent = 'Showing sample preview. Enter your Enrollment Number above to verify.';
                }

                // Reset back to initial demo sample
                document.getElementById('certStudentName').textContent = 'John Doe';
                document.getElementById('certCourseName').textContent = 'Full-Stack Web Development';
                document.getElementById('certRollValue').textContent = 'STU12345';
                document.getElementById('certIdValue').textContent = 'CERT-2024-001';
                document.getElementById('certGradeValue').textContent = 'A+';
                document.getElementById('certIssuedValue').textContent = '15 June 2024';

                const rollNoInput = document.getElementById('certRollNo');
                if (rollNoInput) rollNoInput.focus();

                window.scrollTo({
                    top: document.getElementById('verify').offsetTop - 80,
                    behavior: 'smooth'
                });
            });
        }

        // Download (demo)
        const certDownloadBtn = document.getElementById('certDownloadBtn');
        if (certDownloadBtn) {
            certDownloadBtn.addEventListener('click', function () {
                alert('📄 Certificate PDF download will start shortly. (Demo feature)');
            });
        }

        // Print — triggers the print stylesheet
        const certPrintBtn = document.getElementById('certPrintBtn');
        if (certPrintBtn) {
            certPrintBtn.addEventListener('click', function () {
                window.print();
            });
        }
    }

    /* =========================================
       17. LOGIN PAGE — Authentication
       ========================================= */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginMsg = document.getElementById('loginMsg');
        const togglePassword = document.getElementById('togglePassword');
        const togglePasswordIcon = document.getElementById('togglePasswordIcon');
        const passwordInput = document.getElementById('loginPassword');

        // Demo users — in production this would be a real backend
        const demoUsers = {
            'john@example.com':   { password: 'john123',   name: 'John Doe' },
            'priya@example.com':  { password: 'priya123',  name: 'Priya Sharma' },
            'rahul@example.com':  { password: 'rahul123',  name: 'Rahul Verma' },
            'admin@edutech.com':  { password: 'admin123',  name: 'Admin' }
        };

        // Toggle password visibility
        if (togglePassword && passwordInput && togglePasswordIcon) {
            togglePassword.addEventListener('click', function () {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                togglePasswordIcon.classList.toggle('fa-eye');
                togglePasswordIcon.classList.toggle('fa-eye-slash');
                togglePassword.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            });
        }

        // Handle login submit
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = passwordInput.value;
            const remember = document.getElementById('rememberMe').checked;

            if (!email || !password) {
                showMessage(loginMsg, 'Please enter both email and password.', 'danger');
                return;
            }

            if (!validateEmail(email)) {
                showMessage(loginMsg, 'Please enter a valid email address.', 'danger');
                return;
            }

            const user = demoUsers[email];

            if (!user || user.password !== password) {
                showMessage(loginMsg, '❌ Invalid email or password. Please try again.', 'danger');
                return;
            }

            // Save current user
            const currentUser = {
                email: email,
                name: user.name,
                loginTime: new Date().toLocaleString()
            };
            localStorage.setItem('edutechCurrentUser', JSON.stringify(currentUser));

            // Remember me (optional — store email)
            if (remember) {
                localStorage.setItem('edutechRememberEmail', email);
            } else {
                localStorage.removeItem('edutechRememberEmail');
            }

            showMessage(loginMsg, `✅ Welcome back, ${user.name}! Redirecting...`, 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });

        // Pre-fill remembered email
        const rememberedEmail = localStorage.getItem('edutechRememberEmail');
        if (rememberedEmail) {
            document.getElementById('loginEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }

    /* =========================================
       18. HELPER FUNCTIONS
       ========================================= */
    function showMessage(element, message, type) {
        if (!element) return;
        element.className = `alert alert-${type} mt-3`;
        element.textContent = message;
        element.style.display = 'block';

        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 6000);
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

});