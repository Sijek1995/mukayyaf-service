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

// Booking Form Functionality
function initBookingForm() {
    const form = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    
    if (!form) return; // Safety check
    
    // Set minimum date to today
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Form submission handler
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
                // Show success modal
                showModal();
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Fallback: redirect to WhatsApp dengan data form
            const formData = new FormData(form);
            const message = generateWhatsAppMessage(formData);
            const whatsappUrl = `https://wa.me/6285210713678?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Generate WhatsApp message as fallback
    function generateWhatsAppMessage(formData) {
        const data = Object.fromEntries(formData);
        return `Halo, saya ingin booking service dengan detail berikut:

Nama: ${data.name}
No. WhatsApp: ${data.phone}
Alamat: ${data.address}
Perangkat: ${data['service-type']}
Merk: ${data.brand || 'Tidak disebutkan'}
Service: ${data.problem}
Keluhan: ${data['problem-details'] || 'Tidak disebutkan'}
Tanggal: ${data['preferred-date']}
Waktu: ${data['preferred-time']}
${data.emergency ? '🚨 SERVICE DARURAT' : ''}

Silakan konfirmasi ketersediaan jadwal. Terima kasih.`;
    }
}

// Modal Functions
function showModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        closeModal();
    }
});

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
    initBookingForm();
    initWhatsApp();
});