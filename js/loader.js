document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("global-loader");
    if (!loader) return;

    if (typeof gsap === "undefined") {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 200);
        return;
    }

    const isMobile = window.innerWidth <= 768;
    const circleDur = isMobile ? 0.25 : 0.37;
    const logoDur = isMobile ? 0.35 : 0.48;

    const dismissLoader = () => {
        document.body.style.overflow = "";
        loader.classList.add("hidden");
        setTimeout(() => {
            try { loader.remove(); } catch(e) {}
        }, 300);
    };

    const tl = gsap.timeline({
        onComplete: dismissLoader
    });

    tl.to(".eat-circle", {
        strokeDashoffset: 158,
        duration: circleDur,
        ease: "power2.inOut"
    })
    .to(".pizza-svg", {
        opacity: 0,
        scale: 0.5,
        duration: 0.09
    }, "-=0.03")
    .to(".loader-logo", {
        scale: 1,
        opacity: 1,
        duration: logoDur,
        ease: "elastic.out(1, 0.7)"
    }, "-=0.04")
    .to({}, { duration: 0.06 });

    setTimeout(dismissLoader, 1750);
});
