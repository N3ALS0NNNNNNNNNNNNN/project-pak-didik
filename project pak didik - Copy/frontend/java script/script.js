document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. CUSTOM CURSOR
       ========================================================================== */
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const interactiveElements = document.querySelectorAll("a, button, .tilt-element");

    // Move cursor tracking mouse position
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Instant follow for dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for outline via Web Animations API for smooth cinematic feel
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Expand cursor when hovering over interactive elements
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursorOutline.classList.add("hover-active");
        });
        el.addEventListener("mouseleave", () => {
            cursorOutline.classList.remove("hover-active");
        });
    });

    /* ==========================================================================
       2. MOUSE PARALLAX (Hero Background Text)
       ========================================================================== */
    const bgText = document.querySelector(".parallax-bg");

    window.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;
        
        bgText.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });

    /* ==========================================================================
       3. 3D TILT EFFECT (Holographic Cards)
       ========================================================================== */
    const tiltElements = document.querySelectorAll(".tilt-element");

    tiltElements.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation amount based on mouse distance from center
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset transform when mouse leaves
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = "transform 0.5s ease"; // Smooth reset
        });
        
        // Remove transition during hover for instant 1:1 tracking
        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATION (Intersection Observer)
       ========================================================================== */
    // Select elements to animate on scroll
    const revealElements = document.querySelectorAll(".reveal-text, .reveal-fade, .reveal-card");
    
    // Add initial hidden state class dynamically
    revealElements.forEach(el => el.classList.add("hidden-reveal"));

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index for grid items
                if (entry.target.classList.contains('reveal-card')) {
                    setTimeout(() => {
                        entry.target.classList.add("is-visible");
                    }, index * 100); // 100ms stagger
                } else {
                    entry.target.classList.add("is-visible");
                }
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));
});
/* ==========================================================================
   TEAM SHOWCASE INTERACTIONS (NEW)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll Reveal Animation Setup
    const showcaseObserverOptions = {
        threshold: 0.1, // Trigger slightly earlier for larger cards
        rootMargin: "0px 0px -50px 0px"
    };

    const showcaseObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, showcaseObserverOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        showcaseObserver.observe(el);
    });

    // 2. Cinematic 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        const glassLayer = card.querySelector('.card-glass');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtler, more premium rotation calculations
            const rotateX = ((y - centerY) / centerY) * -6; 
            const rotateY = ((x - centerX) / centerX) * 6;
            
            // Apply transform to the glass layer, not the whole card, to keep glow stationary
            glassLayer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            glassLayer.style.transition = 'none'; // Instant follow
        });

        card.addEventListener('mouseleave', () => {
            glassLayer.style.transform = `rotateX(0deg) rotateY(0deg)`;
            glassLayer.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; // Smooth snap back
        });
        
        // 3. Placeholder Click Interaction
        const viewBtn = card.querySelector('.view-identity-btn');
        
        viewBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump to top
            
            // Add momentary click feedback class
            card.classList.add('card-clicked');
            
            setTimeout(() => {
                card.classList.remove('card-clicked');
                // Optional: In the future, trigger a full-screen transition here
                // window.location.href = `https://member${card.querySelector('.member-id').textContent.trim()}.group.my.id`;
            }, 300);
        });
    });
});