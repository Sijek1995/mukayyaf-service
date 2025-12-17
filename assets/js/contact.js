// contact.js - VERSI DIREKOMENDASI (hanya fungsi khusus halaman contact)

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return; // Safety check - jika form tidak ada di halaman
    
    // Format input nomor telepon (hapus karakter non-angka)
    const phoneInput = document.getElementById('contact-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Hapus semua karakter non-angka
            this.value = this.value.replace(/[^\d]/g, '');
            
            // Batasi maksimal 13 digit (kode negara + nomor)
            if (this.value.length > 13) {
                this.value = this.value.slice(0, 13);
            }
        });
        
        // Validasi saat blur (keluar dari input)
        phoneInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 10) {
                this.setCustomValidity('Nomor WhatsApp minimal 10 digit');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validasi form HTML5 sebelum diproses
        if (!form.checkValidity()) {
            // Trigger pesan error HTML5
            form.reportValidity();
            return;
        }
        
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
                // PERBAIKAN PENTING: Reset form HANYA jika sukses
                form.reset();
                // Tampilkan notifikasi sukses (bukan alert biasa)
                showCustomSuccessNotification('Pesan berhasil dikirim! Kami akan merespon secepatnya.');
            } else {
                // Jika response tidak ok, lempar error
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            
            // FALLBACK: redirect ke WhatsApp dengan data form
            // TAMPILKAN KONFIRMASI DULU sebelum membuka WhatsApp
            const formData = new FormData(form);
            const message = generateContactMessage(formData);
            const whatsappUrl = `https://wa.me/6285210713678?text=${encodeURIComponent(message)}`;
            
            // Konfirmasi ke pengguna sebelum membuka WhatsApp
            // PERBAIKAN: Form TIDAK direset di sini, data tetap ada
            const userConfirmation = confirm(
                'Gagal mengirim form kontak.\n\n' +
                'Apakah Anda ingin mengirim pesan langsung via WhatsApp?\n' +
                'Data yang sudah Anda isi akan dikirim sebagai pesan WhatsApp.'
            );
            
            if (userConfirmation) {
                window.open(whatsappUrl, '_blank');
            }
        } finally {
            // Reset button state (selalu dijalankan, sukses atau error)
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Generate WhatsApp message as fallback
    function generateContactMessage(formData) {
        const data = Object.fromEntries(formData);
        
        // Map nilai subject ke label yang lebih mudah dibaca
        const subjectMap = {
            'konsultasi': 'Konsultasi Service',
            'booking': 'Booking Jadwal',
            'harga': 'Tanya Harga',
            'garansi': 'Klaim Garansi',
            'lainnya': 'Lainnya'
        };
        
        const subjectLabel = subjectMap[data.subject] || data.subject;
        
        return `Halo, saya ingin bertanya melalui website:

📋 **DATA KONTAK**
• Nama: ${data.name}
• No. WhatsApp: ${data.phone}
• Email: ${data.email || 'Tidak disebutkan'}

📬 **PESAN**
• Subjek: ${subjectLabel}
• Pesan: ${data.message}

Mohon dibalas untuk informasi lebih lanjut.
Terima kasih.`;
    }
    
    // Fungsi untuk menampilkan notifikasi sukses yang lebih baik
    function showCustomSuccessNotification(message) {
        // Cek apakah sudah ada notifikasi sebelumnya
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Buat elemen notifikasi
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            max-width: 350px;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 1.5rem;">✅</span>
            <div>
                <strong style="display: block; margin-bottom: 0.25rem;">Sukses!</strong>
                <span style="font-size: 0.9rem; opacity: 0.9;">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Tambahkan style animasi jika belum ada
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto remove setelah 5 detik
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Tambahkan tombol close manual (opsional)
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        notification.appendChild(closeBtn);
    }
}

// SINGLE DOMContentLoaded Event Listener
// PERBAIKAN PENTING: HANYA panggil fungsi khusus contact
// Fungsi umum (theme, menu, WhatsApp) sudah dihandle oleh script.js
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    
    // Cek apakah script.js sudah di-load (untuk fungsi umum)
    // Jika tidak ada script.js, kita bisa load fallback sederhana
    if (typeof initTheme === 'undefined') {
        console.warn('script.js not loaded. Loading minimal theme functionality...');
        loadMinimalTheme();
    }
});

// Fallback minimal theme jika script.js tidak ada (safety net)
function loadMinimalTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}