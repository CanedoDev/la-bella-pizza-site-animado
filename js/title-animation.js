gsap.registerPlugin(ScrollTrigger, SplitText);

function animateTitle(title) {
    if (!title) return;

    if (title._split) {
        try { title._split.revert(); } catch(e) {}
    }

    const split = new SplitText(title, { type: "words,chars", wordsClass: "split-word" });
    title._split = split;

    const rect = title.getBoundingClientRect();
    const isAlreadyInView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

    gsap.set(split.chars, { opacity: 0, y: 40, scale: 0.4 });

    const tween = gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.75)",
        stagger: 0.04,
        overwrite: "auto",
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
        }
    });

    if (isAlreadyInView) {
        tween.play();
    }
}

// Função global para animar títulos criados dinamicamente (ex: category-title no cardápio)
window.animateTitle = animateTitle;

document.addEventListener("DOMContentLoaded", () => {
    const titles = document.querySelectorAll(".section-title, .sobre-main-title, .clientes-title");

    titles.forEach(title => {
        animateTitle(title);
    });
});
