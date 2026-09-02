// js/loader.js

document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("global-loader");
    if (!loader) return;

    // Checa se a página acabou de carregar do zero e o loader está presente
    // O loader roda de forma ultrarrápida e limpa em todas as páginas.

    // Verifica se o GSAP foi carregado
    if (typeof gsap === "undefined") {
        console.warn("GSAP não encontrado. O loader será ocultado sem animação.");
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 300);
        return;
    }

    // Impede rolagem enquanto o loader estiver ativo
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
        onComplete: () => {
            // Desbloqueia a rolagem do site
            document.body.style.overflow = "";
            
            // Oculta o loader suavemente via CSS opacity
            loader.classList.add("hidden");
            
            // Remove do DOM após a transição CSS (0.4s) terminar para limpar memória
            setTimeout(() => loader.remove(), 400);
        }
    });

    // 1. A Pizza é "devorada" em círculo (alterando stroke-dashoffset de 0 a 158 na máscara)
    tl.to(".eat-circle", {
        strokeDashoffset: 158,
        duration: 0.55,
        ease: "power2.inOut"
    })
    
    // 2. Esconde o prato/resto da pizza
    .to(".pizza-svg", {
        opacity: 0,
        scale: 0.5,
        duration: 0.15
    }, "-=0.05")
    
    // 3. EXPLOSÃO DA LOGO ELÁSTICA (Gelatina suave e visível)
    .to(".loader-logo", {
        scale: 1,
        opacity: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.05")
    
    // 4. Pausa confortável para fixação da marca
    .to({}, { duration: 0.15 }); 
});
