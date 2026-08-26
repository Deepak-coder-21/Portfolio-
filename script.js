var typed = new Typed('.element', {
    strings: ['Web Developer'],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

// --- Mobile Navigation ---
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    // Toggle Nav
    navLinks.classList.toggle('nav-active');

    // Burger Animation
    burger.classList.toggle('toggle');
});


// --- Smooth Scroll & Active Link Highlighting ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile nav if open
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- Header Style on Scroll ---
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(15, 15, 26, 0.95)';
    } else {
        header.style.backgroundColor = 'rgba(15, 15, 26, 0.8)';
    }
});

// --- Scroll Animations (Fade In) ---
const sections = document.querySelectorAll('section');

const options = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        // Unobserve after animation
        observer.unobserve(entry.target);
    });
}, options);

sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(section);
});

// --- Contact Form Submission ---
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);

        if (formStatus) {
            formStatus.textContent = '';
            formStatus.classList.remove('success', 'error');
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Something went wrong. Please try again.');
            }

            if (formStatus) {
                formStatus.textContent = 'Your message has been sent successfully!';
                formStatus.classList.add('success');
            }

            contactForm.reset();
        } catch (error) {
            if (formStatus) {
                formStatus.textContent = error.message || 'Please try again later.';
                formStatus.classList.add('error');
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}
