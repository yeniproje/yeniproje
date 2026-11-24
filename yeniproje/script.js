// 1. GSAP ve ScrollTrigger Eklenti Kaydı
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('hero-video');
    const heroSection = document.getElementById('kapak');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 2. Hareketi Azaltmayı Tercih Eden Kullanıcılar
    if (prefersReducedMotion) {
        if (video) video.pause();
        return;
    }

    // 3. Mobil Cihazlar (< 768px): Videoyu Kaydırmaya Bağlama, Döngüde Oynat
    if (isMobile) {
        if (video) {
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.play().catch(() => {});
        }
    } else {
        // 4. Masaüstü: Video Hazır Olunca ScrollTrigger ile Kaydırmaya Bağla
        function initScrollTrigger() {
            if (!video || !heroSection) return;

            // Video ilerlemesini kaydırma oranına (scrub) bağlayan ScrollTrigger
            ScrollTrigger.create({
                trigger: heroSection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => {
                    if (video.duration) {
                        video.currentTime = self.progress * video.duration;
                    }
                }
            });

            // 5. Sırayla Belirip Kaybolan Üç Yazı Zaman Çizelgesi
            const textTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            });

            // 1. Yazı (Adım): Başlangıçta görünür, kaydırdıkça yukarı kaybolur
            textTimeline.to('.hero-step-1', { opacity: 0, y: -30, ease: 'power1.inOut', duration: 0.2 }, 0.15);

            // 2. Yazı (Tanıtım): Ortada belirir ve sonra kaybolur
            textTimeline.fromTo('.hero-step-2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power1.inOut', duration: 0.15 }, 0.35)
                        .to('.hero-step-2', { opacity: 0, y: -30, ease: 'power1.inOut', duration: 0.15 }, 0.6);

            // 3. Yazı (Kapanış): Sona doğru belirir ve bölüm biterken kaybolur
            textTimeline.fromTo('.hero-step-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power1.inOut', duration: 0.15 }, 0.75)
                        .to('.hero-step-3', { opacity: 0, y: -30, ease: 'power1.inOut', duration: 0.1 }, 0.93);
        }

        // video.readyState >= 1 ise hemen, değilse loadedmetadata olayından sonra başlat
        if (video) {
            if (video.readyState >= 1) {
                initScrollTrigger();
            } else {
                video.addEventListener('loadedmetadata', initScrollTrigger);
            }
        }
    }

    // 6. Sabit Menü Yumuşak Kaydırma (Smooth Scroll)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                if (targetId === '#kapak') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        const navHeight = document.querySelector('.navbar-wrapper')?.offsetHeight || 80;
                        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 15;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            }
        });
    });
});
