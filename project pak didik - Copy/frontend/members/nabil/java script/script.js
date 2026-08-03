/* ==========================================================================
   NABIL PROFILE INTERACTIONS (NEW INDEPENDENT FILE)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Cursor & Magnetic Hover Logic
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    
    window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Instant follow for dot
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        
        // Smooth follow for ring
        ring.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 400, fill: "forwards" });
    });

    // Cursor Expansion on Interactive Elements
    const interactives = document.querySelectorAll("a, button, .gallery-item");
    interactives.forEach(el => {
        el.addEventListener("mouseenter", () => ring.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => ring.classList.remove("cursor-hover"));
    });

    // 2. Cinematic Scroll Reveals (Intersection Observer)
    const revealOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                
                // Trigger Skill Bars if intersecting
                if (entry.target.classList.contains('skills-section')) {
                    const fills = entry.target.querySelectorAll('.skill-fill');
                    fills.forEach(fill => {
                        fill.style.width = fill.getAttribute('data-target');
                    });
                }
                
                // Only animate once
                if(!entry.target.classList.contains('lyrics-section')) {
                   observer.unobserve(entry.target); 
                }
            }
        });
    }, revealOptions);

    document.querySelectorAll('.fade-up, .story-text, .skills-section').forEach(el => {
        scrollObserver.observe(el);
    });

    // 3. Audio Player Logic
    const playBtn = document.getElementById("play-btn");
    const audio = document.getElementById("bgm-audio");
    const playIcon = document.querySelector(".play-icon");
    const pauseIcon = document.querySelector(".pause-icon");
    const albumArt = document.querySelector(".album-art");
    const waveform = document.querySelector(".waveform");

    let isPlaying = false;

    playBtn.addEventListener("click", () => {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            // audio.play(); // Uncomment when real audio source is added
            playIcon.style.display = "none";
            pauseIcon.style.display = "inline";
            albumArt.classList.add("playing");
            waveform.classList.add("playing");
        } else {
            // audio.pause(); // Uncomment when real audio source is added
            playIcon.style.display = "inline";
            pauseIcon.style.display = "none";
            albumArt.classList.remove("playing");
            waveform.classList.remove("playing");
        }
    });

    // 4. Scroll-Triggered Lyrics Experience
    const lyricLines = document.querySelectorAll('.lyric-line');
    
    window.addEventListener('scroll', () => {
        const viewportCenter = window.innerHeight / 2;
        
        lyricLines.forEach(line => {
            const rect = line.getBoundingClientRect();
            const lineCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(viewportCenter - lineCenter);
            
            // Activate line if it's within 150px of viewport center
            if (distance < 150) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    });

    // 5. Easter Egg: Bouncing DVD Logo Logic
    const dvdContainer = document.getElementById("dvd-container");
    const dvdLogo = document.getElementById("dvd-logo");
    
    let x = 0, y = 0;
    let dirX = 2, dirY = 2; // Speed

    function animateDVD() {
        const boxRect = dvdContainer.getBoundingClientRect();
        const logoRect = dvdLogo.getBoundingClientRect();

        x += dirX;
        y += dirY;

        // Collision detection with container bounds
        if (x + logoRect.width >= boxRect.width || x <= 0) {
            dirX *= -1;
            changeColor();
        }
        if (y + logoRect.height >= boxRect.height || y <= 0) {
            dirY *= -1;
            changeColor();
        }

        dvdLogo.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(animateDVD);
    }

    function changeColor() {
        // Subtle color shifts keeping within the premium palette
        const colors = ['#DC5000', '#F6E0C6', '#6C5F51', '#00F0FF'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        dvdLogo.style.color = randomColor;
        dvdLogo.style.borderColor = randomColor;
        dvdLogo.style.textShadow = `0 0 10px ${randomColor}`;
        dvdLogo.style.boxShadow = `inset 0 0 20px ${randomColor}33, 0 0 20px ${randomColor}33`; // 33 is 20% opacity hex
    }

    // Start DVD Animation when section is intersecting
    let dvdStarted = false;
    const dvdObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !dvdStarted) {
            dvdStarted = true;
            animateDVD();
        }
    });
    
    dvdObserver.observe(dvdContainer);
});