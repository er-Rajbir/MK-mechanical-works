/**
 * MK INDUSTRIES — NEXT-GEN INDUSTRIAL MANUFACTURING SCRIPT
 * Features:
 * - 60fps Interactive 3D Canvas (Interlocking Metallic Gears, Wireframe Polyhedra, Ambient Particles)
 * - 3D Tilt Effect on Industrial Cards
 * - Smooth Intersection-based Number Counters
 * - Magnetic Micro-interactions on Buttons
 * - Responsive Navbar & Fullscreen Mobile Drawer
 * - Fullscreen Gallery Lightbox with Keyboard Navigation
 * - Instant Dynamic Product & Gallery Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    init3DTilt();
    initCounters();
    initMagneticButtons();
    initNavbar();
    initMobileDrawer();
    initLightbox();
    initCategoryFilters();
    initSmoothAnchors();
});

/* ==========================================================================
   1. HERO 3D CANVAS (Metallic Gears, Wireframe Geometry, Reactive Particles)
   ========================================================================== */
function initHeroCanvas() {
    const canvas = document.getElementById('heroInteractiveCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animationFrameId;

    // Mouse coordinates with smoothing
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        if (mouse.x === -1000) {
            mouse.x = width * 0.65;
            mouse.y = height * 0.45;
            mouse.targetX = mouse.x;
            mouse.targetY = mouse.y;
        }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
    }, { passive: true });

    // Floating metallic particles
    const particleCount = Math.min(width > 768 ? 65 : 30, 80);
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.8,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            alpha: Math.random() * 0.6 + 0.2,
            isLime: Math.random() > 0.75
        });
    }

    // 3D Polyhedron (Octahedron / Icosahedron) wireframe vertices
    const polyVertices = [
        [1, 0, 0], [-1, 0, 0],
        [0, 1, 0], [0, -1, 0],
        [0, 0, 1], [0, 0, -1]
    ];
    const polyEdges = [
        [0, 2], [2, 1], [1, 3], [3, 0], // equator
        [0, 4], [2, 4], [1, 4], [3, 4], // top pyramid
        [0, 5], [2, 5], [1, 5], [3, 5]  // bottom pyramid
    ];

    let polyAngleX = 0;
    let polyAngleY = 0;
    let polyAngleZ = 0;

    let gearRotation = 0;

    // Helper: Draw precision industrial gear with teeth and axle
    function drawGear(cx, cy, radius, teeth, toothHeight, angle, colorScheme) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        const step = (Math.PI * 2) / teeth;
        const halfStep = step / 2;
        const quarterStep = step / 4;

        for (let i = 0; i < teeth; i++) {
            const a = i * step;
            // Base arc start
            const rBase = radius;
            const rTip = radius + toothHeight;

            const a0 = a;
            const a1 = a + quarterStep * 0.7;
            const a2 = a + quarterStep * 1.3;
            const a3 = a + halfStep;

            if (i === 0) {
                ctx.moveTo(Math.cos(a0) * rBase, Math.sin(a0) * rBase);
            } else {
                ctx.lineTo(Math.cos(a0) * rBase, Math.sin(a0) * rBase);
            }
            ctx.lineTo(Math.cos(a1) * rTip, Math.sin(a1) * rTip);
            ctx.lineTo(Math.cos(a2) * rTip, Math.sin(a2) * rTip);
            ctx.lineTo(Math.cos(a3) * rBase, Math.sin(a3) * rBase);
        }
        ctx.closePath();

        // Metallic Rim Gradient
        const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
        if (colorScheme === 'lime') {
            grad.addColorStop(0, 'rgba(0, 240, 118, 0.45)');
            grad.addColorStop(0.5, 'rgba(0, 240, 118, 0.12)');
            grad.addColorStop(1, 'rgba(0, 240, 118, 0.35)');
            ctx.strokeStyle = 'rgba(0, 240, 118, 0.6)';
        } else {
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
            grad.addColorStop(0.5, 'rgba(148, 163, 184, 0.05)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        }
        ctx.fillStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Inner cutouts / spokes
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(7, 10, 16, 0.85)';
        ctx.fill();
        ctx.stroke();

        // Inner axle hub
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = colorScheme === 'lime' ? 'rgba(0, 240, 118, 0.25)' : 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
        ctx.strokeStyle = colorScheme === 'lime' ? '#00f076' : 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Small center bolt
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
    }

    // Helper: 3D point rotation and projection
    function project3D(v, size, cx, cy) {
        let x = v[0];
        let y = v[1];
        let z = v[2];

        // Rotate around X
        const cosX = Math.cos(polyAngleX);
        const sinX = Math.sin(polyAngleX);
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;

        // Rotate around Y
        const cosY = Math.cos(polyAngleY);
        const sinY = Math.sin(polyAngleY);
        let x2 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;

        // Rotate around Z
        const cosZ = Math.cos(polyAngleZ);
        const sinZ = Math.sin(polyAngleZ);
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;

        // Perspective projection
        const fov = 350;
        const distance = 4;
        const scale = fov / (distance + z2);

        return {
            x: cx + x3 * size * scale,
            y: cy + y3 * size * scale,
            z: z2
        };
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Smooth mouse lag
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // 1. Draw Subtle Interactive Spotlight
        if (mouse.x > 0 && mouse.y > 0) {
            const spotGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 350);
            spotGrad.addColorStop(0, 'rgba(0, 240, 118, 0.06)');
            spotGrad.addColorStop(0.5, 'rgba(0, 212, 255, 0.02)');
            spotGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = spotGrad;
            ctx.fillRect(0, 0, width, height);
        }

        // 2. Render Rotating Gears
        gearRotation += 0.004;
        const gear1X = width * 0.78;
        const gear1Y = height * 0.38;
        const gear1R = Math.min(width * 0.12, 130);

        const gear2X = gear1X - gear1R * 1.55;
        const gear2Y = gear1Y + gear1R * 1.15;
        const gear2R = gear1R * 0.72;

        // Gear 1 (Main Titanium Gear)
        drawGear(gear1X, gear1Y, gear1R, 18, 16, gearRotation, 'silver');
        // Gear 2 (Interlocking Lime Gear rotating opposite direction)
        drawGear(gear2X, gear2Y, gear2R, 12, 12, -gearRotation * (18 / 12) + 0.2, 'lime');

        // 3. Render Floating 3D Geometric Polyhedron
        polyAngleX += 0.008;
        polyAngleY += 0.012;
        polyAngleZ += 0.006;

        const polyCX = width * 0.22;
        const polyCY = height * 0.65;
        const polySize = Math.min(width * 0.06, 65);

        const projected = polyVertices.map(v => project3D(v, polySize, polyCX, polyCY));

        // Draw wireframe edges
        ctx.lineWidth = 1.2;
        polyEdges.forEach(([i1, i2]) => {
            const p1 = projected[i1];
            const p2 = projected[i2];
            const avgZ = (p1.z + p2.z) / 2;
            const alpha = Math.max(0.15, Math.min(0.85, (avgZ + 1.2) * 0.35));

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 118, ${alpha})`;
            ctx.stroke();
        });

        // Draw glowing vertices
        projected.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#00f076';
            ctx.shadowColor = '#00f076';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        });

        // 4. Render Reactive Floating Dust Particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce on canvas borders
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse proximity interaction (particles push gently away from mouse)
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                p.x += (dx / dist) * force * 1.5;
                p.y += (dy / dist) * force * 1.5;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.isLime
                ? `rgba(0, 240, 118, ${p.alpha})`
                : `rgba(255, 255, 255, ${p.alpha * 0.7})`;
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   2. 3D TILT EFFECT ON INDUSTRIAL CARDS
   ========================================================================== */
function init3DTilt() {
    const cards = document.querySelectorAll('.mk-machine-card, .mk-feature-card, .mk-stat-card, .mk-hero-visual-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter, .mk-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));

    function animateNumber(el) {
        const raw = el.textContent.trim();
        const suffix = raw.replace(/[0-9.]/g, ''); // "+", "%", etc.
        const target = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
        const duration = 1600;
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // EaseOutCubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * easeOut);

            el.innerHTML = `${current}<span class="counter-suffix">${suffix}</span>`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.innerHTML = `${target}<span class="counter-suffix">${suffix}</span>`;
            }
        }

        requestAnimationFrame(step);
    }
}

/* ==========================================================================
   4. MAGNETIC BUTTON EFFECT
   ========================================================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-mk-primary, .btn-mk-outline, .mk-brand-logo-wrap');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* ==========================================================================
   5. NAVBAR & ACTIVE NAVIGATION
   ========================================================================== */
function initNavbar() {
    const navbar = document.querySelector('.mk-navbar');
    const backTop = document.getElementById('mkBackToTop');

    function onScroll() {
        const scrollY = window.scrollY;

        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (backTop) {
            if (scrollY > 400) {
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ==========================================================================
   6. RESPONSIVE MOBILE DRAWER
   ========================================================================== */
function initMobileDrawer() {
    const toggle = document.querySelector('.mk-menu-toggle');
    const drawer = document.querySelector('.mk-mobile-drawer');
    const overlay = document.querySelector('.mk-drawer-overlay');
    const closeBtn = document.querySelector('.mk-drawer-close');

    if (!toggle || !drawer || !overlay) return;

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

/* ==========================================================================
   7. FULLSCREEN GALLERY LIGHTBOX
   ========================================================================== */
function initLightbox() {
    const items = document.querySelectorAll('.mk-gallery-item');
    if (!items.length) return;

    // Create lightbox DOM element if not existing
    let lightbox = document.querySelector('.mk-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'mk-lightbox';
        lightbox.innerHTML = `
            <button class="mk-lightbox-close" aria-label="Close Lightbox">&times;</button>
            <div class="mk-lightbox-content">
                <img src="" alt="" class="mk-lightbox-img">
                <div class="mk-lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const img = lightbox.querySelector('.mk-lightbox-img');
    const caption = lightbox.querySelector('.mk-lightbox-caption');
    const closeBtn = lightbox.querySelector('.mk-lightbox-close');

    function open(src, title) {
        img.src = src;
        caption.textContent = title || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    items.forEach(item => {
        item.addEventListener('click', () => {
            const itemImg = item.querySelector('img');
            const title = item.querySelector('h5')?.textContent || itemImg.alt;
            open(itemImg.src, title);
        });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            close();
        }
    });
}

/* ==========================================================================
   8. DYNAMIC PRODUCT & GALLERY CATEGORY FILTERS
   ========================================================================== */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.mk-filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetFilter = btn.getAttribute('data-filter');
            const parent = btn.closest('section');
            if (!parent) return;

            // Update active button state in group
            parent.querySelectorAll('.mk-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items
            const items = parent.querySelectorAll('[data-category]');
            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if (targetFilter === 'all' || category === targetFilter) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s ease';
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   9. SMOOTH ANCHOR SCROLLING
   ========================================================================== */
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}
