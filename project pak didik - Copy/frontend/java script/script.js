document.addEventListener("DOMContentLoaded", () => {

    // 0. CEK PERANGKAT & PREFERENSI USER
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. CUSTOM CURSOR (Hanya jalan di Desktop)
    if (!isMobile) {
        const cursorDot = document.querySelector(".cursor-dot");
        const cursorOutline = document.querySelector(".cursor-outline");
        const interactives = document.querySelectorAll("a, button, .tilt-element");

        Object.assign(cursorDot.style, { position: 'fixed', top: '0', left: '0', width: '6px', height: '6px', background: '#00F0FF', borderRadius: '50%', pointerEvents: 'none', zIndex: '9999', transform: 'translate(-50%, -50%)' });
        Object.assign(cursorOutline.style, { position: 'fixed', top: '0', left: '0', width: '40px', height: '40px', border: '1px solid rgba(0, 240, 255, 0.5)', borderRadius: '50%', pointerEvents: 'none', zIndex: '9999', transform: 'translate(-50%, -50%)', transition: 'width 0.2s, height 0.2s, background-color 0.2s' });

        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });

        interactives.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorOutline.style.width = "60px";
                cursorOutline.style.height = "60px";
                cursorOutline.style.backgroundColor = "rgba(0, 240, 255, 0.1)";
                cursorOutline.style.borderColor = "transparent";
            });
            el.addEventListener("mouseleave", () => {
                cursorOutline.style.width = "40px";
                cursorOutline.style.height = "40px";
                cursorOutline.style.backgroundColor = "transparent";
                cursorOutline.style.borderColor = "rgba(0, 240, 255, 0.5)";
            });
        });
    }

    // 2. AMBIENT MOTION — teks raksasa "cupcake" sekarang gerak halus terus-menerus
    //    (idle float) DAN ikut posisi scroll. Sebelumnya cuma jalan pas mouse gerak
    //    (jadi mati total di HP). Sekarang jalan di semua device.
    const bgText = document.querySelector(".parallax-bg");
    let mouseX = 0, mouseY = 0;
    let scrollY = window.scrollY;

    if (bgText && !isMobile) {
        window.addEventListener("mousemove", (e) => {
            mouseX = (window.innerWidth - e.pageX * 2) / 90;
            mouseY = (window.innerHeight - e.pageY * 2) / 90;
        });
    }

    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    }, { passive: true });

    if (bgText && !prefersReducedMotion) {
        const renderBgText = (time) => {
            const t = time / 1000;
            // idle float halus, jalan terus walau ga ada input sama sekali
            const floatX = Math.sin(t * 0.4) * (isMobile ? 14 : 8);
            const floatY = Math.cos(t * 0.3) * (isMobile ? 12 : 8);
            // parallax ikut posisi scroll -> makanya "hidup" lagi pas discroll naik/turun
            const scrollShift = scrollY * 0.08;

            bgText.style.transform = `translate(-50%, -50%) translate(${mouseX + floatX}px, ${mouseY + floatY - scrollShift}px)`;
            requestAnimationFrame(renderBgText);
        };
        requestAnimationFrame(renderBgText);
    }

    // 3. EFEK 3D TILT — Desktop pakai mouse, Mobile pakai sentuhan (touch).
    //    Sebelumnya tilt di-skip total di HP, sekarang ada versi sentuhnya.
    if (!prefersReducedMotion) {
        const tiltElements = document.querySelectorAll(".tilt-element");

        const applyTilt = (card, clientX, clientY) => {
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const intensity = isMobile ? 6 : 10;
            const rotateX = ((y - centerY) / centerY) * -intensity;
            const rotateY = ((x - centerX) / centerX) * intensity;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = "none";
        };

        const resetTilt = (card) => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s ease";
        };

        tiltElements.forEach(card => {
            if (!isMobile) {
                card.addEventListener("mousemove", (e) => applyTilt(card, e.clientX, e.clientY));
                card.addEventListener("mouseleave", () => resetTilt(card));
            } else {
                // Di HP ga ada hover, jadi "hover state" (glow, warna nomor, dll)
                // disamain lewat sentuhan pakai class .is-touched
                card.addEventListener("touchstart", () => {
                    card.classList.add("is-touched");
                }, { passive: true });

                card.addEventListener("touchmove", (e) => {
                    const touch = e.touches[0];
                    applyTilt(card, touch.clientX, touch.clientY);
                }, { passive: true });

                card.addEventListener("touchend", () => {
                    resetTilt(card);
                    card.classList.remove("is-touched");
                });
            }
        });
    }

    // 4. ANIMASI SCROLL REVEAL — sekarang toggle nyala/mati tiap kali elemen
    //    keluar-masuk viewport. Jalan pas discroll ke BAWAH maupun ke ATAS,
    //    jadi ga cuma muncul sekali doang pas awal buka web.
    const revealElements = document.querySelectorAll(".reveal-text, .reveal-fade, .reveal-card");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
});
