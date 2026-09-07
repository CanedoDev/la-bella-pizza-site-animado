gsap.registerPlugin(ScrollTrigger);

let cardsQueue = [];
let animTimer = null;

function processCardsQueue() {
    if (!cardsQueue.length) return;

    const cardsToAnimate = cardsQueue.filter(card => card && !card.closest('.models') && !card.dataset.stActive);
    cardsQueue = [];

    if (!cardsToAnimate.length) return;

    cardsToAnimate.forEach(c => {
        c.dataset.stActive = "true";
    });

    gsap.set(cardsToAnimate, { scale: 0.6, opacity: 0 });

    const isMobile = window.innerWidth <= 768;

    ScrollTrigger.batch(cardsToAnimate, {
        start: isMobile ? "top 95%" : "top 98%",
        onEnter: (batch) => {
            gsap.to(batch, {
                scale: 1,
                opacity: 1,
                duration: 0.7,
                stagger: 0.05,
                ease: "elastic.out(1, 0.75)",
                overwrite: "auto"
            });
        },
        once: true
    });
}

window.observeCard = function(card) {
    if (!card || card.closest('.models')) return;
    cardsQueue.push(card);
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(processCardsQueue, 50);
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cards-grid .card').forEach(card => {
        window.observeCard(card);
    });
});
