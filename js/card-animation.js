let cardsQueue = [];
let animTimer = null;

let cardObserver = null;
if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    cardObserver = new IntersectionObserver((entries, obs) => {
        const visibleCards = [];
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleCards.push(entry.target);
                obs.unobserve(entry.target);
            }
        });
        if (visibleCards.length && typeof gsap !== 'undefined') {
            gsap.to(visibleCards, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.04,
                ease: "back.out(1.4)",
                overwrite: "auto"
            });
        }
    }, {
        rootMargin: '60px 0px',
        threshold: 0.05
    });
}

function processCardsQueue() {
    if (!cardsQueue.length) return;

    const cardsToAnimate = cardsQueue.filter(card => card && !card.closest('.models') && !card.dataset.stActive);
    cardsQueue = [];

    if (!cardsToAnimate.length) return;

    cardsToAnimate.forEach(c => {
        c.dataset.stActive = "true";
    });

    if (cardObserver && typeof gsap !== 'undefined') {
        gsap.set(cardsToAnimate, { scale: 0.85, opacity: 0 });
        cardsToAnimate.forEach(c => cardObserver.observe(c));
    } else if (typeof gsap !== 'undefined') {
        gsap.set(cardsToAnimate, { scale: 1, opacity: 1 });
    }
}

window.observeCard = function(card) {
    if (!card || card.closest('.models')) return;
    cardsQueue.push(card);
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(processCardsQueue, 30);
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.cards-grid .card').forEach(card => {
        window.observeCard(card);
    });
});
