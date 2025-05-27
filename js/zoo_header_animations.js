// ===== ZOO HEADER SPECTACULAR ANIMATIONS JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {

    // Get header element
    const header = document.getElementById('header');
    if (!header) return;

    // Create all animated elements
    createAnimatedBackground();
    createInteractiveElements();
    setupMouseInteractions();
    createHelpIcon();

    // Function to create the animated background elements
    function createAnimatedBackground() {

        // Create particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'header-particles';
        header.appendChild(particlesContainer);

        // Generate floating particles (leaves, sparkles)
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createParticle(particlesContainer);
            }, i * 400); // Stagger particle creation
        }

        // Create safari grass at bottom
        createSafariGrass();

        // Create moving animal silhouettes
        createAnimalSilhouettes();

        // Create safari sun
        createSafariSun();

        // Create floating clouds
        createSafariClouds();

        // Create ambient sound pulse indicator
        createSoundPulse();
    }

    // Function to create individual particles
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';

        // Random particle colors (nature themed)
        const colors = [
            'rgba(255, 255, 255, 0.8)',
            'rgba(76, 175, 80, 0.6)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(139, 69, 19, 0.5)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);

        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle(container);
            }
        }, 6000);
    }

    // Function to create safari grass
    function createSafariGrass() {
        const grassContainer = document.createElement('div');
        grassContainer.className = 'safari-grass';
        header.appendChild(grassContainer);

        // Create individual grass blades
        for (let i = 0; i < 30; i++) {
            const grassBlade = document.createElement('div');
            grassBlade.className = 'grass-blade';
            grassBlade.style.left = (i * 3.33) + '%';
            grassBlade.style.height = (8 + Math.random() * 7) + 'px';
            grassBlade.style.animationDelay = Math.random() * 4 + 's';
            grassBlade.style.animationDuration = (3 + Math.random() * 2) + 's';
            grassContainer.appendChild(grassBlade);
        }
    }

    // Function to create moving animal silhouettes
    function createAnimalSilhouettes() {
        const animalContainer = document.createElement('div');
        header.appendChild(animalContainer);

        // Create 3 different animal silhouettes
        for (let i = 0; i < 3; i++) {
            const animal = document.createElement('div');
            animal.className = 'animal-silhouette';
            animalContainer.appendChild(animal);
        }
    }

    // Function to create safari sun
    function createSafariSun() {
        const sun = document.createElement('div');
        sun.className = 'safari-sun';
        header.appendChild(sun);
    }

    // Function to create floating clouds
    function createSafariClouds() {
        for (let i = 0; i < 2; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'safari-cloud';
            header.appendChild(cloud);
        }
    }

    // Function to create sound pulse indicator
    function createSoundPulse() {
        const pulse = document.createElement('div');
        pulse.className = 'sound-pulse';
        header.appendChild(pulse);
    }

    // Function to create interactive elements
    function createInteractiveElements() {

        // Create cursor follower
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        header.appendChild(cursorFollower);

        // Create multiple glow orbs for trailing effect
        const glowOrbs = [];
        for (let i = 0; i < 3; i++) {
            const orb = document.createElement('div');
            orb.className = 'glow-orb';
            header.appendChild(orb);
            glowOrbs.push(orb);
        }

        // Store references for mouse interaction
        header.cursorFollower = cursorFollower;
        header.glowOrbs = glowOrbs;
    }

    // Function to setup mouse interactions
    function setupMouseInteractions() {
        let mouseX = 0;
        let mouseY = 0;
        let isMouseInHeader = false;

        // Mouse enter header
        header.addEventListener('mouseenter', function() {
            isMouseInHeader = true;
            header.style.cursor = 'none';
            if (header.cursorFollower) {
                header.cursorFollower.style.opacity = '1';
            }
            // Show glow orbs with delay
            header.glowOrbs.forEach((orb, index) => {
                setTimeout(() => {
                    orb.style.opacity = '1';
                }, index * 200);
            });
        });

        // Mouse leave header
        header.addEventListener('mouseleave', function() {
            isMouseInHeader = false;
            header.style.cursor = 'default';
            if (header.cursorFollower) {
                header.cursorFollower.style.opacity = '0';
            }
            // Hide glow orbs
            header.glowOrbs.forEach(orb => {
                orb.style.opacity = '0';
            });
        });

        // Mouse move in header
        header.addEventListener('mousemove', function(e) {
            if (!isMouseInHeader) return;

            const rect = header.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            // Update cursor follower position
            if (header.cursorFollower) {
                header.cursorFollower.style.left = mouseX - 10 + 'px';
                header.cursorFollower.style.top = mouseY - 10 + 'px';
            }

            // Update glow orbs with trailing effect
            header.glowOrbs.forEach((orb, index) => {
                const delay = index * 100;
                setTimeout(() => {
                    const offsetX = (index + 1) * 15; // Offset each orb
                    const offsetY = (index + 1) * 8;
                    orb.style.left = (mouseX - 30 - offsetX) + 'px';
                    orb.style.top = (mouseY - 30 - offsetY) + 'px';

                    // Add slight size variation based on movement speed
                    const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
                    const scale = 1 + (speed * 0.01);
                    orb.style.transform = `scale(${Math.min(scale, 1.3)})`;
                }, delay);
            });

            // Create temporary sparkles on fast movement
            const movementSpeed = Math.abs(e.movementX) + Math.abs(e.movementY);
            if (movementSpeed > 5) {
                createSparkle(mouseX, mouseY);
            }
        });

        // Logo hover effects
        const logo = header.querySelector('img');
        if (logo) {
            logo.addEventListener('mouseenter', function() {
                // Create particles around logo on hover
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createLogoParticle(logo);
                    }, i * 100);
                }
            });
        }
    }

    // Function to create temporary sparkles on fast mouse movement
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'rgba(255, 193, 7, 0.9)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '8';
        sparkle.style.animation = 'sparkleEffect 0.6s ease-out forwards';

        // Add sparkle animation
        const sparkleStyle = document.createElement('style');
        sparkleStyle.textContent = `
            @keyframes sparkleEffect {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.5) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(sparkleStyle);

        header.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 600);
    }

    // Function to create particles around logo on hover
    function createLogoParticle(logo) {
        const particle = document.createElement('div');
        const logoRect = logo.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();

        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = 'rgba(76, 175, 80, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9';

        // Position around logo
        const centerX = (logoRect.left + logoRect.width / 2) - headerRect.left;
        const centerY = (logoRect.top + logoRect.height / 2) - headerRect.top;
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 20;

        particle.style.left = (centerX + Math.cos(angle) * distance) + 'px';
        particle.style.top = (centerY + Math.sin(angle) * distance) + 'px';
        particle.style.animation = 'logoParticleEffect 1s ease-out forwards';

        // Add logo particle animation
        const logoParticleStyle = document.createElement('style');
        logoParticleStyle.textContent = `
            @keyframes logoParticleEffect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0) translateY(-20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(logoParticleStyle);

        header.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    // Performance optimization: throttle particle creation
    let lastParticleTime = 0;
    const originalCreateParticle = createParticle;
    createParticle = function(container) {
        const now = Date.now();
        if (now - lastParticleTime > 100) { // Limit to 10 particles per second
            lastParticleTime = now;
            originalCreateParticle(container);
        }
    };

    // Function to create help icon and modal
    function createHelpIcon() {
        // Create help icon
        const helpIcon = document.createElement('div');
        helpIcon.className = 'help-icon';
        helpIcon.innerHTML = '?';
        helpIcon.title = 'Click to learn about header animations';
        header.appendChild(helpIcon);

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'help-modal-overlay';
        modalOverlay.style.display = 'none';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'help-modal-content';
        modalContent.innerHTML = `
            <div class="help-modal-header">
                <h2>🎉 Spectacular Zoo Header Animation Guide</h2>
                <button class="help-close-btn" title="Close">&times;</button>
            </div>
            <div class="help-modal-body">
                <p><strong>This page explains all the animated header features. Move your mouse over the header to see the interactive effects!</strong></p>

                <h3>✨ What You Should See:</h3>
                <ul>
                    <li><strong>Floating Particles:</strong> Small colored dots floating upward across the header</li>
                    <li><strong>Safari Grass:</strong> Green grass blades swaying at the bottom of the header</li>
                    <li><strong>Animal Silhouettes:</strong> Dark shapes moving across the header (elephant, giraffe, etc.)</li>
                    <li><strong>Safari Sun:</strong> Glowing yellow sun in the top-right corner</li>
                    <li><strong>Floating Clouds:</strong> White clouds drifting across the header</li>
                    <li><strong>Sound Pulse:</strong> Green pulsing dot in the bottom-left corner</li>
                </ul>

                <h3>🖱️ Interactive Features (when you hover over the header):</h3>
                <ul>
                    <li><strong>Cursor Follower:</strong> Golden glow that follows your mouse</li>
                    <li><strong>Glow Orbs:</strong> Green orbs that trail behind your mouse movement</li>
                    <li><strong>Sparkles:</strong> Fast mouse movement creates temporary sparkles</li>
                    <li><strong>Logo Effects:</strong> Hover over the logo to see particle effects</li>
                </ul>

                <h3>🎨 Visual Effects:</h3>
                <ul>
                    <li><strong>Gradient Background:</strong> Beautiful green gradient instead of plain white</li>
                    <li><strong>Enhanced Shadow:</strong> Deeper shadow for more depth</li>
                    <li><strong>Smooth Animations:</strong> All elements animate smoothly</li>
                    <li><strong>Performance Optimized:</strong> Throttled particle creation for smooth performance</li>
                </ul>

                <div class="help-modal-footer">
                    <button class="back-to-home-btn" onclick="window.location.href='index.html'">
                        <i class="fas fa-home"></i> Back to Home
                    </button>
                </div>
            </div>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Help icon click event
        helpIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            modalOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Close modal events
        const closeBtn = modalContent.querySelector('.help-close-btn');
        closeBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close modal when clicking overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
                modalOverlay.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });
    }

});

// ===== UTILITY FUNCTIONS =====

// Function to detect reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Apply reduced motion if user prefers it
if (prefersReducedMotion()) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
}