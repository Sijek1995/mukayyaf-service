// booking.js - VERSI DIREKOMENDASI (hanya fungsi khusus halaman booking)

// Booking Form Functionality
function initBookingForm() {
    const form = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    
    if (!form) return; // Safety check - jika form tidak ada di halaman
    
    // Set minimum date to today (mencegah pilih tanggal kemarin)
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        // Set placeholder atau value awal ke hari ini (opsional)
        // dateInput.value = today;
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
                // Reset tanggal minimum lagi setelah reset
                if (dateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.setAttribute('min', today);
                }
                // Tampilkan modal sukses
                showModal();
            } else {
                // Jika response tidak ok, lempar error
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Booking form error:', error);
            
            // FALLBACK: redirect ke WhatsApp dengan data form
            // TAMPILKAN KONFIRMASI DULU sebelum membuka WhatsApp
            const formData = new FormData(form);
            const message = generateWhatsAppMessage(formData);
            const whatsappUrl = `https://wa.me/6285210713678?text=${encodeURIComponent(message)}`;
            
            // Konfirmasi ke pengguna sebelum membuka WhatsApp
            // PERBAIKAN: Form TIDAK direset di sini, data tetap ada
            const userConfirmation = confirm(
                'Gagal mengirim form booking.\n\n' +
                'Apakah Anda ingin mengirim booking langsung via WhatsApp?\n' +
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
    function generateWhatsAppMessage(formData) {
        const data = Object.fromEntries(formData);
        
        // Format tanggal yang lebih ramah dibaca
        const formattedDate = data['preferred-date'] 
            ? new Date(data['preferred-date']).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'Belum ditentukan';
        
        return `Halo, saya ingin booking service dengan detail berikut:

📋 **DATA BOOKING**
• Nama: ${data.name}
• No. WhatsApp: ${data.phone}
• Email: ${data.email || 'Tidak disebutkan'}

📍 **LOKASI & PERANGKAT**
• Alamat: ${data.address}
• Jenis Perangkat: ${data['service-type']}
• Merk: ${data.brand || 'Tidak disebutkan'}

🔧 **JENIS SERVICE**
• Service yang dibutuhkan: ${data.problem}
• Keluhan detail: ${data['problem-details'] || 'Tidak disebutkan'}

📅 **JADWAL YANG DIMINTA**
• Tanggal: ${formattedDate}
• Waktu: ${data['preferred-time']}
${data.emergency === 'yes' ? '• 🚨 **SERVICE DARURAT** (Butuh penanganan cepat)' : ''}

Mohon konfirmasi ketersediaan teknisi dan jadwal.
Terima kasih.`;
    }
}

// Modal Functions (hanya untuk booking.html)
function showModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Auto close modal setelah 8 detik (opsional)
        setTimeout(() => {
            closeModal();
        }, 8000);
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

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// SINGLE DOMContentLoaded Event Listener
// PERBAIKAN PENTING: HANYA panggil fungsi khusus booking
// Fungsi umum (theme, menu, WhatsApp) sudah dihandle oleh script.js
document.addEventListener('DOMContentLoaded', function() {
    initBookingForm();
    
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