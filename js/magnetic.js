/**
 * Efeito Magnético Suave para Imagens Institucionais (La Bella Pizza)
 * Puxa a posição suavemente na direção do cursor com limite sutil (sem scale).
 */
document.addEventListener('DOMContentLoaded', () => {
    const magneticTargets = [
        { selector: '.conceito-img-left', baseRotation: -3 },
        { selector: '.conceito-img-right', baseRotation: 3 },
        { selector: '.processo-img-left', baseRotation: -2 },
        { selector: '.processo-img-right', baseRotation: 2 },
        { selector: '.sobre-img-small', baseRotation: 0 },
        { selector: '.sobre-img-large', baseRotation: 0 }
    ];

    magneticTargets.forEach(({ selector, baseRotation }) => {
        const el = document.querySelector(selector);
        if (!el) return;

        // Define a rotação base inicial mantendo padrão visual
        if (typeof gsap !== 'undefined') {
            gsap.set(el, { rotation: baseRotation, x: 0, y: 0, transformOrigin: "center center" });
        }

        const MAX_OFFSET = 14; // Limite bem baixo e elegante

        el.addEventListener('mousemove', (e) => {
            if (typeof gsap === 'undefined') return;

            const rect = el.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const normX = (mouseX - centerX) / centerX;
            const normY = (mouseY - centerY) / centerY;

            const targetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, normX * MAX_OFFSET));
            const targetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, normY * MAX_OFFSET));

            gsap.to(el, {
                x: targetX,
                y: targetY,
                rotation: baseRotation,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        el.addEventListener('mouseleave', () => {
            if (typeof gsap === 'undefined') return;

            gsap.to(el, {
                x: 0,
                y: 0,
                rotation: baseRotation,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });
});
