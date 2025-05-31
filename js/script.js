document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('main section[id]'); // For active nav link highlighting

    // Navbar toggle for mobile
    if (navbarToggler && navbarMenu) {
        navbarToggler.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbarToggler.classList.toggle('active');
            const isExpanded = navbarMenu.classList.contains('active');
            navbarToggler.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    navbarToggler.classList.remove('active');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth scrolling for anchor links (if not fully handled by CSS scroll-behavior)
    // And active link highlighting
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.6 // 60% of section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // Contact Form to WhatsApp
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !message) {
                alert('Por favor, completa tu nombre y el mensaje.');
                return;
            }

            // Replace with Maria's actual WhatsApp number including country code (e.g., 58412XXXXXXX for Venezuela)
            const whatsappNumber = "584243127589"; // IMPORTANT: REPLACE THIS

            let whatsappMessage = `Hola María, mi nombre es ${name}. `;
            if (phone) {
                whatsappMessage += `Mi teléfono es ${phone}. `;
            }
            if (service) {
                whatsappMessage += `Estoy interesado/a en ${service}. `;
            }
            whatsappMessage += `Mensaje: ${message}`;

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            // Open WhatsApp link in a new tab
            window.open(whatsappUrl, '_blank');

            // Optionally, reset the form
            // contactForm.reset();
        });
    }


    // Simple scroll animations for elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const animateObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Optional: stop observing once animated
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        animatedElements.forEach(el => {
            animateObserver.observe(el);
        });
    }

    // Add .animate-on-scroll class to sections or elements you want to animate in HTML
    // Example: <section id="services" class="services-section section-padding animate-on-scroll">

});

// Header scroll effect (optional: make navbar slightly transparent or smaller on scroll)
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) { // After scrolling 50px
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)'; // Slightly more transparent black
        header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    } else {
        header.style.backgroundColor = 'var(--dark-color)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
});