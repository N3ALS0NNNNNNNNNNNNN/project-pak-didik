document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CEK APAKAH PERANGKAT MOBILE
    // Kita mematikan efek kursor dan tilt 3D di mobile agar tidak nge-bug/berat
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    // 2. CUSTOM CURSOR (Hanya jalan di Desktop)
    if (!isMobile) {
        const cursorDot = document.querySelector(".cursor-dot");
        const cursorOutline = document.querySelector(".cursor-outline");
        const interactives = document.querySelectorAll("a, button, .tilt-element");

        // Set style dasar kursor via JS agar lebih aman
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

    // 3. MOUSE PARALLAX (Teks Raksasa di Belakang)
    const bgText = document.querySelector(".parallax-bg");
    if (bgText && !isMobile) {
        window.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 90;
            const y = (window.innerHeight - e.pageY * 2) / 90;
            bgText.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
    }

    // 4. EFEK 3D TILT (Hanya Desktop)
    if (!isMobile) {
        const tiltElements = document.querySelectorAll(".tilt-element");
        tiltElements.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10; 
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = "none"; 
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = "transform 0.5s ease"; 
            });
        });
    }

    // 5. ANIMASI MUNCUL SAAT DI-SCROLL (Reveal on Scroll - Jalan di Mobile & Desktop)
    const revealElements = document.querySelectorAll(".reveal-text, .reveal-fade, .reveal-card");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Memberikan delay bertahap untuk card (efek bergelombang)
                if (entry.target.classList.contains('reveal-card')) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, index * 100); // Jeda 100ms per kartu
                } else {
                    entry.target.classList.add("is-visible");
                }
                observer.unobserve(entry.target); // Animasi hanya berjalan 1 kali
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));
});
