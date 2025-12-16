// Theme Toggle Functionality (Sama seperti di script.js)
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

// Mobile Menu Functionality (Sama seperti di script.js)
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

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return; // Safety check
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Mengirim...';
        submitBtn.disabled = true;
        
        try {
            // Kirim form ke Formspree
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                showContactSuccess();
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Fallback: redirect to WhatsApp
            const formData = new FormData(form);
            const message = generateContactMessage(formData);
            const whatsappUrl = `https://wa.me/6285210713678?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Generate WhatsApp message as fallback
    function generateContactMessage(formData) {
        const data = Object.fromEntries(formData);
        return `Halo, saya ingin bertanya melalui website:

Nama: ${data.name}
No. WhatsApp: ${data.phone}
Email: ${data.email || 'Tidak disebutkan'}
Subjek: ${data.subject}
Pesan: ${data.message}

Terima kasih.`;
    }
    
    function showContactSuccess() {
        alert('Pesan berhasil dikirim! Kami akan merespon secepatnya.');
    }
}

// WhatsApp Float Functionality (Sama seperti di script.js)
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
}

// SINGLE DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    initContactForm();
    initWhatsApp();
});