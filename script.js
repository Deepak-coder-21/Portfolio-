// ==========================================================================
// DEEPAK KUMAR - PORTFOLIO INTERACTIVITY & LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Typed.js Animated Headline ---
    if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
        new Typed('.typed-text', {
            strings: [
                'Full-Stack Developer',
                'MERN Stack Enthusiast',
                'Frontend Developer',
                'Problem Solver',
                'BCA 2025 Graduate'
            ],
            typeSpeed: 70,
            backSpeed: 45,
            backDelay: 1800,
            loop: true
        });
    }

    // --- 2. Mobile Navigation Toggle ---
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.querySelector('.nav-links');

    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav-active');
            burgerBtn.classList.toggle('toggle');
        });

        // Close mobile nav when any link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                burgerBtn.classList.remove('toggle');
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('nav-active') && !navLinks.contains(e.target) && !burgerBtn.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                burgerBtn.classList.remove('toggle');
            }
        });
    }

    // --- 3. Header Scroll Effect & Back-to-Top Button ---
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky Header styling
        if (header) {
            if (scrollPos > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back-to-top button visibility
        if (backToTopBtn) {
            if (scrollPos > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 4. ScrollSpy Active Link Tracking ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightActiveNav() {
        const scrollY = window.pageYOffset + 150;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav);

    // --- 5. Skills Category Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // --- 6. Copy to Clipboard Functionality ---
    const copyButtons = document.querySelectorAll('.copy-btn[data-copy]');
    const toastNotice = document.getElementById('toastNotice');
    const toastText = document.getElementById('toastText');
    let toastTimeout;

    function showToast(message) {
        if (!toastNotice) return;
        if (toastText) toastText.textContent = message;

        toastNotice.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotice.classList.remove('show');
        }, 2800);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast(`Copied "${textToCopy}" to clipboard!`);
            } catch (err) {
                // Fallback method
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(`Copied to clipboard!`);
            }
        });
    });

    // --- 7. Contact Form AJAX Submission ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!submitBtn) return;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>';

            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.style.display = 'none';
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    if (formStatus) {
                        formStatus.textContent = '🎉 Thank you! Your message has been sent successfully. I will get back to you soon.';
                        formStatus.classList.add('success');
                        formStatus.style.display = 'block';
                    }
                    showToast('Message sent successfully!');
                } else {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.error || 'Oops! There was a problem sending your message.');
                }
            } catch (err) {
                if (formStatus) {
                    formStatus.textContent = err.message || 'Error sending message. Please email me directly at deepakkumarmdb2004@gmail.com.';
                    formStatus.classList.add('error');
                    formStatus.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }
});
