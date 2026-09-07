gsap.registerPlugin(ScrollTrigger);

let cardsQueue = [];
let animTimer = null;

function processCardsQueue() {
    if (!cardsQueue.length) return;

    const cardsToAnimate = [...cardsQueue];
    cardsQueue = [];

    const isMobile = window.innerWidth <= 768;

    const startVal = isMobile ? "top 92%" : "top 100%";
    const endVal = "bottom top";

    cardsToAnimate.forEach((card, idx) => {
        if (!card || card.closest('.models')) return;
        card.removeAttribute('data-st-active');
        card.dataset.stActive = "true";

        const animateCardIn = (delayOffset = 0) => {
            gsap.to(card, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                delay: delayOffset,
                ease: "elastic.out(1, 0.75)",
                overwrite: "auto"
            });
        };

        const animateCardOut = () => {
            gsap.to(card, {
                scale: 0.4,
                opacity: 0,
                duration: 0.35,
                ease: "power2.in",
                overwrite: "auto"
            });
        };

        gsap.set(card, { scale: 0.4, opacity: 0 });

        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 1.05 && rect.bottom > 0;

        if (isInViewport) {

            const staggerDelay = (idx % 3) * 0.08;
            animateCardIn(staggerDelay);
        }

        ScrollTrigger.create({
            trigger: card,
            start: startVal,
            end: endVal,
            fastScrollEnd: true,
            onEnter: () => {
                const staggerDelay = (idx % 3) * 0.08;
                animateCardIn(staggerDelay);
            },
            onEnterBack: () => {
                const staggerDelay = (idx % 3) * 0.08;
                animateCardIn(staggerDelay);
            },
            onLeaveBack: () => {
                animateCardOut();
            }
        });
    });

    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 60);
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
