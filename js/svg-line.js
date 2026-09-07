gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {

        const pathMob = document.getElementById("stroke-path-mob");
        if (!pathMob) return;

        const Lm = pathMob.getTotalLength();
        pathMob.style.strokeDasharray = Lm;
        pathMob.style.strokeDashoffset = Lm;

        const tlMob = gsap.timeline({
            scrollTrigger: {
                trigger: ".content-wrapper",
                start: "top 80%",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        tlMob.to(pathMob, { strokeDashoffset: Lm * 0.90, ease: "none", duration: 18 })
             .to(pathMob, { strokeDashoffset: Lm * 0.85, ease: "none", duration: 8 })
             .to(pathMob, { strokeDashoffset: Lm * 0.65, ease: "none", duration: 5 })
             .to(pathMob, { strokeDashoffset: Lm * 0.50, ease: "none", duration: 10 })
             .to(pathMob, { strokeDashoffset: Lm * 0.35, ease: "none", duration: 21 })
             .to(pathMob, { strokeDashoffset: Lm * 0.18, ease: "none", duration: 20 })
             .to(pathMob, { strokeDashoffset: 0,          ease: "none", duration: 11 });

    } else {

        const path = document.getElementById("stroke-path");
        if (!path) return;

        const L = path.getTotalLength();
        path.style.strokeDasharray = L;
        path.style.strokeDashoffset = L;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".content-wrapper",
                start: "top 80%",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        tl.to(path, { strokeDashoffset: L * 0.90, ease: "none", duration: 10 })
            .to(path, { strokeDashoffset: L * 0.80, ease: "none", duration: 18 })
            .to(path, { strokeDashoffset: L * 0.70, ease: "none", duration: 4 })
            .to(path, { strokeDashoffset: L * 0.60, ease: "none", duration: 5 })
            .to(path, { strokeDashoffset: L * 0.40, ease: "none", duration: 20 })
            .to(path, { strokeDashoffset: L * 0.20, ease: "none", duration: 22 })
            .to(path, { strokeDashoffset: 0,         ease: "none", duration: 12 });
    }
});
