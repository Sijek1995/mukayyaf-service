// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Services Tab Functionality
function initServices() {
    const serviceTabs = document.querySelectorAll('.service-tab');
    const serviceCategories = document.querySelectorAll('.service-category');
    
    if (serviceTabs.length === 0) return; // Skip if no services section
    
    // Auto-scroll functionality
    let autoScrollInterval;
    let currentTabIndex = 0;
    
    function switchTab(tabIndex) {
        // Update tabs
        serviceTabs.forEach(tab => tab.classList.remove('active'));
        serviceTabs[tabIndex].classList.add('active');
        
        // Update content
        serviceCategories.forEach(category => category.classList.remove('active'));
        serviceCategories[tabIndex].classList.add('active');
        
        currentTabIndex = tabIndex;
    }
    
    // Manual tab click
    serviceTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchTab(index);
            resetAutoScroll();
        });
    });
    
    // Auto-scroll function
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            currentTabIndex = (currentTabIndex + 1) % serviceTabs.length;
            switchTab(currentTabIndex);
        }, 5000); // Switch every 5 seconds
    }
    
    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }
    
    // Start auto-scroll
    startAutoScroll();
    
    // Pause auto-scroll on hover
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
        servicesSection.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        
        servicesSection.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
    }
}

// Gallery Filter Functionality
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length === 0) return; // Skip if no gallery section

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// FAQ Accordion Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return; // Skip if no FAQ section

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Open first item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

// WhatsApp Float Functionality
function initWhatsApp() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (!whatsappFloat) return;
    
    // Hide WhatsApp float on scroll down, show on scroll up
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            whatsappFloat.style.transform = 'translateY(100px)';
            whatsappFloat.style.opacity = '0';
        } else {
            // Scrolling up
            whatsappFloat.style.transform = 'translateY(0)';
            whatsappFloat.style.opacity = '1';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add click tracking (optional)
    const whatsappLinks = document.querySelectorAll('.whatsapp-link, .whatsapp-option');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Bisa ditambah analytics tracking di sini
            console.log('WhatsApp clicked:', this.href);
        });
    });
}

// SINGLE DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    initServices();
    initGallery();
    initFAQ();
    initWhatsApp();
});