document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("global-loader");
    if (!loader) return;

    if (typeof gsap === "undefined") {
        console.warn("GSAP não encontrado. O loader será ocultado sem animação.");
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 300);
        return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
        onComplete: () => {

            document.body.style.overflow = "";

            loader.classList.add("hidden");

            setTimeout(() => loader.remove(), 400);
        }
    });

    tl.to(".eat-circle", {
        strokeDashoffset: 158,
        duration: 0.55,
        ease: "power2.inOut"
    })

    .to(".pizza-svg", {
        opacity: 0,
        scale: 0.5,
        duration: 0.15
    }, "-=0.05")

    .to(".loader-logo", {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.05")

    .to({}, { duration: 0.15 });
});
