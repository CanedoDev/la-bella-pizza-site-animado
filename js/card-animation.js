gsap.registerPlugin(ScrollTrigger);

let cardsQueue = [];
let animTimer = null;

function processCardsQueue() {
    if (!cardsQueue.length) return;

    const cardsToAnimate = [...cardsQueue];
    cardsQueue = [];

    const isMobile = window.innerWidth <= 768;
    // 15% a mais no desktop (top 100%) e proporção equivalente no mobile (top 92%)
    const startVal = isMobile ? "top 92%" : "top 100%";
    const endVal = "bottom top";

    cardsToAnimate.forEach((card, idx) => {
        if (!card || card.dataset.stActive) return;
        card.dataset.stActive = "true";

        gsap.set(card, { scale: 0.4, opacity: 0 });

        ScrollTrigger.create({
            trigger: card,
            start: startVal,
            end: endVal,
            fastScrollEnd: true,
            onEnter: () => {
                gsap.to(card, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    delay: (idx % 3) * 0.08, // Stagger suave entre colunas
                    ease: "elastic.out(1, 0.75)",
                    overwrite: "auto"
                });
            },
            onLeaveBack: () => {
                gsap.set(card, { scale: 0.4, opacity: 0, overwrite: "auto" });
            }
        });
    });
}

// Função global chamada em cardápio.js para cada card criado
window.observeCard = function(card) {
    if (!card) return;
    cardsQueue.push(card);
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(processCardsQueue, 25);
};

// Observar cards estáticos já presentes no DOM (ex: na home index.html)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(card => {
        window.observeCard(card);
    });
});
