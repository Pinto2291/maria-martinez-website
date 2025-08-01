document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('main section[id]'); // For active nav link highlighting

    // --- Shopping Cart Elements ---
    const cart = [];
    const servicesGrid = document.querySelector('.services-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItemCount = document.getElementById('cart-item-count');
    const shoppingCartSection = document.getElementById('shopping-cart');

    // Make sure the cart section has the correct scroll-margin-top
    const navbarHeight = document.querySelector('.header').offsetHeight;
    if (shoppingCartSection) {
        shoppingCartSection.style.scrollMarginTop = `${navbarHeight}px`;
    }

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

    // --- Shopping Cart Logic ---

    // Function to render/update the cart display
    function renderCart() {
        // Clear current cart items
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            shoppingCartSection.style.display = 'none'; // Hide section if empty
            checkoutBtn.disabled = true;
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.dataset.id = item.id;
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="btn-remove-item" aria-label="Eliminar ${item.name}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            shoppingCartSection.style.display = 'block'; // Show section
            checkoutBtn.disabled = false;
        }
        updateCartTotal();
        updateCartIcon();
    }

    // Function to update the total price
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    // Function to update the cart icon counter
    function updateCartIcon() {
        cartItemCount.textContent = cart.length;
        if (cart.length > 0) {
            cartItemCount.classList.add('active');
        } else {
            cartItemCount.classList.remove('active');
        }
    }

    // Event listener for adding items to the cart (using event delegation)
    if (servicesGrid) {
        servicesGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const serviceItem = e.target.closest('.service-item');
                const id = serviceItem.dataset.id;

                const isInCart = cart.some(item => item.id === id);
                if (isInCart) {
                    alert('Este servicio ya está en tu carrito.');
                    return;
                }

                const name = serviceItem.dataset.name;
                const price = parseFloat(serviceItem.dataset.price);

                cart.push({ id, name, price });
                renderCart();
            }
        });
    }

    // Event listener for removing items from the cart (using event delegation)
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-item')) {
                const serviceItem = e.target.closest('.cart-item');
                const id = serviceItem.dataset.id;
                
                const itemIndex = cart.findIndex(item => item.id === id);
                if (itemIndex > -1) {
                    cart.splice(itemIndex, 1);
                }
                renderCart();
            }
        });
    }

    // Event listener for the checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;

            const whatsappNumber = "584243127589"; // Maria's WhatsApp number
            let invoiceMessage = "Hola María, quisiera solicitar los siguientes servicios:\n\n";
            
            let total = 0;
            cart.forEach(item => {
                invoiceMessage += `- ${item.name}: $${item.price.toFixed(2)}\n`;
                total += item.price;
            });

            invoiceMessage += `\n*Total a Pagar: $${total.toFixed(2)}*`;
            invoiceMessage += "\n\nPor favor, confírmame la disponibilidad para agendar la cita. ¡Gracias!";

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(invoiceMessage)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
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