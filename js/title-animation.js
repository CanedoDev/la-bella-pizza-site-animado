gsap.registerPlugin(ScrollTrigger, SplitText);

function animateTitle(title) {
    if (!title) return;

    if (title._split) {
        try { title._split.revert(); } catch(e) {}
    }

    const split = new SplitText(title, { type: "words,chars", wordsClass: "split-word" });
    title._split = split;

    gsap.set(split.chars, { opacity: 0, y: 30, scale: 0.8 });

    gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.75)",
        stagger: 0.03,
        overwrite: "auto",
        scrollTrigger: {
            trigger: title,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true
        }
    });
}

window.animateTitle = animateTitle;

function initAllTitles() {
    const titles = document.querySelectorAll(".section-title, .sobre-main-title, .clientes-title");
    titles.forEach(title => {
        animateTitle(title);
    });
}

if (document.readyState === 'complete') {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initAllTitles, { timeout: 1200 });
    } else {
        setTimeout(initAllTitles, 200);
    }
} else {
    window.addEventListener('load', () => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initAllTitles, { timeout: 1200 });
        } else {
            setTimeout(initAllTitles, 200);
        }
    });
}
