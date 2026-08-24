gsap.registerPlugin(ScrollTrigger, SplitText);

function animateTitle(title) {
    const split = new SplitText(title, { type: "words,chars", wordsClass: "split-word" });

    gsap.set(split.chars, { opacity: 0, y: 40, scale: 0.4 });

    gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.75)",
        stagger: 0.04,
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
}

// Função global para animar títulos criados dinamicamente (ex: category-title no cardápio)
window.animateTitle = animateTitle;

document.addEventListener("DOMContentLoaded", () => {
    const titles = document.querySelectorAll(".section-title, .sobre-main-title, .clientes-title");

    titles.forEach(title => {
        animateTitle(title);
    });
});
