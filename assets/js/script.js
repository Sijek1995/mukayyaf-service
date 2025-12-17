// script.js - JavaScript utama untuk semua halaman

// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icon berdasarkan theme
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
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
            
            // Toggle aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Services Tab Functionality
function initServices() {
    const serviceTabs = document.querySelectorAll('.service-tab');
    const serviceCategories = document.querySelectorAll('.service-category');
    
    // PERBAIKAN: Cek jika tidak ada atau hanya satu tab
    if (serviceTabs.length <= 1) {
        // Jika hanya satu tab, tetap aktifkan yang pertama
        if (serviceTabs.length === 1) {
            serviceTabs[0].classList.add('active');
            serviceCategories[0]?.classList.add('active');
        }
        return; // Skip auto-scroll jika hanya 0 atau 1 tab
    }
    
    // Auto-scroll functionality
    let autoScrollInterval;
    let currentTabIndex = 0;
    let isAutoScrollPaused = false;
    
    function switchTab(tabIndex) {
        // Validasi index
        if (tabIndex < 0 || tabIndex >= serviceTabs.length) return;
        
        // Update tabs
        serviceTabs.forEach(tab => tab.classList.remove('active'));
        serviceTabs[tabIndex].classList.add('active');
        
        // Update content
        serviceCategories.forEach(category => category.classList.remove('active'));
        serviceCategories[tabIndex].classList.add('active');
        
        currentTabIndex = tabIndex;
        
        // Update aria attributes for accessibility
        serviceTabs.forEach((tab, idx) => {
            tab.setAttribute('aria-selected', idx === tabIndex ? 'true' : 'false');
        });
    }
    
    // Manual tab click
    serviceTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchTab(index);
            resetAutoScroll();
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(index);
                resetAutoScroll();
            }
        });
    });
    
    // Auto-scroll function - PERBAIKAN: clear interval sebelum membuat yang baru
    function startAutoScroll() {
        // PERBAIKAN PENTING: Selalu clear interval sebelumnya
        clearInterval(autoScrollInterval);
        
        autoScrollInterval = setInterval(() => {
            if (!isAutoScrollPaused) {
                currentTabIndex = (currentTabIndex + 1) % serviceTabs.length;
                switchTab(currentTabIndex);
            }
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
            isAutoScrollPaused = true;
        });
        
        servicesSection.addEventListener('mouseleave', () => {
            isAutoScrollPaused = false;
        });
    }
    
    // Pause auto-scroll when tab is focused (for keyboard users)
    serviceTabs.forEach(tab => {
        tab.addEventListener('focus', () => {
            isAutoScrollPaused = true;
        });
        
        tab.addEventListener('blur', () => {
            isAutoScrollPaused = false;
        });
    });
    
    // Pause auto-scroll when window loses focus
    window.addEventListener('blur', () => {
        isAutoScrollPaused = true;
    });
    
    window.addEventListener('focus', () => {
        isAutoScrollPaused = false;
    });
}

// Gallery Filter Functionality
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length === 0) return; // Skip if no gallery section

    // PERBAIKAN: Gunakan CSS class untuk animasi, bukan style langsung
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter gallery items dengan transisi
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.classList.remove('hidden');
                    // Gunakan setTimeout untuk trigger reflow
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 10);
                } else {
                    item.classList.remove('visible');
                    // Tunggu transisi selesai baru sembunyikan
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
        
        // Keyboard navigation
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        // Check if image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Fallback for error
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
                this.style.opacity = '1'; // Still show placeholder
            });
        }
    });
    
    // Add CSS for gallery transitions jika belum ada
    if (!document.querySelector('#gallery-transition-styles')) {
        const style = document.createElement('style');
        style.id = 'gallery-transition-styles';
        style.textContent = `
            .gallery-item {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            .gallery-item.visible {
                opacity: 1;
                transform: scale(1);
                display: block;
            }
            .gallery-item.hidden {
                opacity: 0;
                transform: scale(0.8);
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// FAQ Accordion Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return; // Skip if no FAQ section

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        // Set initial aria attributes
        const answer = item.querySelector('.faq-answer');
        if (answer) {
            answer.setAttribute('aria-hidden', 'true');
        }
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current item
            const isActive = item.classList.toggle('active');
            
            // Update aria attributes
            if (answer) {
                answer.setAttribute('aria-hidden', !isActive);
            }
            question.setAttribute('aria-expanded', isActive);
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    // Open first item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        const firstQuestion = faqItems[0].querySelector('.faq-question');
        if (firstAnswer) {
            firstAnswer.setAttribute('aria-hidden', 'false');
        }
        if (firstQuestion) {
            firstQuestion.setAttribute('aria-expanded', 'true');
        }
    }
}

// WhatsApp Float Functionality
function initWhatsApp() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (!whatsappFloat) return;
    
    // Set initial state
    let lastScrollTop = 0;
    let isScrollingDown = false;
    let scrollTimeout;
    
    // Smooth show/hide on scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Hide at bottom of page
        if (scrollTop + windowHeight >= documentHeight - 100) {
            whatsappFloat.style.transform = 'translateY(100px)';
            whatsappFloat.style.opacity = '0';
            return;
        }
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (!isScrollingDown) {
                whatsappFloat.style.transform = 'translateY(100px)';
                whatsappFloat.style.opacity = '0';
                isScrollingDown = true;
            }
        } else {
            // Scrolling up
            if (isScrollingDown) {
                whatsappFloat.style.transform = 'translateY(0)';
                whatsappFloat.style.opacity = '1';
                isScrollingDown = false;
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Auto show after stopping scroll
        scrollTimeout = setTimeout(() => {
            whatsappFloat.style.transform = 'translateY(0)';
            whatsappFloat.style.opacity = '1';
            isScrollingDown = false;
        }, 1500);
    }
    
    // Throttle scroll events
    let scrollThrottleTimeout;
    function throttledScroll() {
        if (!scrollThrottleTimeout) {
            scrollThrottleTimeout = setTimeout(() => {
                handleScroll();
                scrollThrottleTimeout = null;
            }, 100);
        }
    }
    
    window.addEventListener('scroll', throttledScroll);
    
    // Add click tracking (optional - bisa diganti dengan analytics)
    const whatsappLinks = document.querySelectorAll('.whatsapp-link, .whatsapp-option');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Simpan di localStorage untuk tracking sederhana
            try {
                const clickCount = parseInt(localStorage.getItem('whatsapp_clicks') || '0');
                localStorage.setItem('whatsapp_clicks', (clickCount + 1).toString());
                
                // Bisa ditambah Google Analytics di sini
                // if (typeof gtag !== 'undefined') {
                //     gtag('event', 'whatsapp_click', {
                //         'event_category': 'engagement',
                //         'event_label': this.href
                //     });
                // }
            } catch (error) {
                console.log('WhatsApp click tracked:', this.href);
            }
        });
    });
    
    // Show WhatsApp float on page load
    setTimeout(() => {
        whatsappFloat.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }, 1000);
}

// Smooth scroll untuk anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip jika href hanya "#" atau link untuk tab/accordion
        if (anchor.getAttribute('href') === '#' || 
            anchor.classList.contains('service-tab') ||
            anchor.classList.contains('faq-question') ||
            anchor.classList.contains('filter-btn')) {
            return;
        }
        
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Jika internal link dengan hash
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL tanpa reload
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Lazy loading untuk gambar
function initLazyLoad() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize semua fungsi
function initAll() {
    initTheme();
    initMobileMenu();
    initServices();
    initGallery();
    initFAQ();
    initWhatsApp();
    initSmoothScroll();
    initLazyLoad();
}

// Tunggu DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Export fungsi untuk digunakan di file lain (jika perlu)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTheme,
        initMobileMenu,
        initServices,
        initGallery,
        initFAQ,
        initWhatsApp,
        initSmoothScroll,
        initLazyLoad
    };
}