/* ==========================================================================
   LINKBIO JAVASCRIPT - LA BELLA PIZZA
   Interações e Micro-Motions Elásticos com GSAP
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Corrige viewport no Mobile
    setVH();

    // Verifica se o loader global está ativo para sincronizar as animações (~1.35s é o tempo da TL do loader)
    const loader = document.getElementById("global-loader");
    const baseDelay = (loader && !loader.classList.contains("hidden")) ? 1.35 : 0;

    // 1. ANIMAR A ENTRADA DA MINHOCA (GROW SVG WORM)
    const isMobile = window.innerWidth <= 768;
    const pathId = isMobile ? "bio-stroke-path-mob" : "bio-stroke-path-desk";
    const wormPath = document.getElementById(pathId);
    
    if (wormPath) {
        const length = wormPath.getTotalLength();
        
        // Configura propriedades iniciais do traçado
        wormPath.style.strokeDasharray = length;
        wormPath.style.strokeDashoffset = length;
        
        // Animação de crescimento elástico único no load
        gsap.to(wormPath, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.out",
            delay: baseDelay + 0.05
        });
    }

    // 2. REVELAÇÃO ESCALONADA (STAGGER) E ELÁSTICA DOS COMPONENTES

    // Animação dos Textos do Header
    gsap.from(".bio-title, .bio-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: baseDelay + 0.05
    });

    // Animação Elástica dos Botões (O "estilo elástico" da marca)
    gsap.from(".bio-btn", {
        opacity: 0,
        scale: 0.7,
        y: 35,
        duration: 0.9,
        ease: "elastic.out(1, 0.75)",
        stagger: 0.08,
        delay: baseDelay + 0.1
    });

    // Animação de Entrada do Rodapé
    gsap.from(".bio-footer", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: baseDelay + 0.35
    });


    // 3. GERENCIADOR DE CLIQUES E MOTIONS PERSONALIZADOS
    setupLinkClickAnimation("link-delivery", (btn) => {
        // --- MOTION DELIVERY (Motinha + Rastro) ---
        const wrap = btn.querySelector(".motion-delivery-wrap");
        const moto = btn.querySelector(".delivery-moto");
        
        // Exibe o contêiner de motion de forma mais suave (duration: 0.25)
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        // Vibração física mais macia da motinha
        gsap.to(moto, {
            y: -2,
            repeat: 6,
            yoyo: true,
            duration: 0.08,
            ease: "none"
        });

        // Estica as linhas de vento de trás com facilidade mais progressiva e elegante
        gsap.fromTo(btn.querySelectorAll(".rastro-line"), 
            { width: 0 }, 
            { width: "65px", duration: 0.55, stagger: 0.08, ease: "back.out(1.4)" }
        );
    }, 950);

    setupLinkClickAnimation("link-whatsapp", (btn) => {
        // --- MOTION WHATSAPP (Balão de Diálogo + 3 Pontinhos) ---
        const wrap = btn.querySelector(".motion-whatsapp-wrap");
        const dialog = btn.querySelector(".whatsapp-dialog");
        
        // Exibe o wrap de forma suave
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        // Abre o balão a partir de escala 0.7 com um bounce super elegante (back.out) em vez de snap rígido
        gsap.fromTo(dialog, 
            { scale: 0.7, rotation: -6 }, 
            { scale: 1, rotation: 0, duration: 0.55, ease: "back.out(1.7)" }
        );

        // Pontinhos de digitação mais suaves e lentos (natural e relaxante)
        gsap.fromTo(btn.querySelectorAll(".dialog-dots .dot"), 
            { y: 0, opacity: 0.25 }, 
            { y: -6, opacity: 1, duration: 0.35, repeat: -1, yoyo: true, stagger: 0.12, ease: "power1.inOut" }
        );
    }, 1100);

    setupLinkClickAnimation("link-instagram", (btn) => {
        // --- MOTION INSTAGRAM (Câmera + Corações) ---
        const wrap = btn.querySelector(".motion-instagram-wrap");
        const camera = btn.querySelector(".insta-camera-emoji");
        const container = document.getElementById("insta-hearts-container");
        
        // Exibe o wrap
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        // Escala e pulsação suave da câmera
        gsap.fromTo(camera, 
            { scale: 0.8 }, 
            { scale: 1.2, duration: 0.45, ease: "back.out(1.8)" }
        );

        // Dispara corações flutuando de forma super suave e lenta ("floaty" effect)
        for (let i = 0; i < 4; i++) {
            const heart = document.createElement("div");
            heart.className = "heart-particle";
            heart.innerText = "❤️";
            
            // Posição de origem
            heart.style.left = `${45 + (Math.random() * 10 - 5)}%`;
            heart.style.top = `${40 + (Math.random() * 20 - 10)}%`;
            
            container.appendChild(heart);
            
            // Movimento flutuante mais lento, suave e de maior amplitude
            gsap.to(heart, {
                y: -60 - Math.random() * 40,
                x: (Math.random() * 60 - 30),
                scale: 0.8 + Math.random() * 0.4,
                rotation: Math.random() * 60 - 30,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.12, // um coração de cada vez
                ease: "power1.out",
                onComplete: () => heart.remove()
            });
        }
    }, 950);

    setupLinkClickAnimation("link-website", (btn) => {
        // --- MOTION WEBSITE (Globo Rotativo) ---
        const wrap = btn.querySelector(".motion-website-wrap");
        const icon = btn.querySelector(".web-motion-icon");
        
        // Exibe o wrap suavemente
        gsap.to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" });

        // Giro 3D elástico e torção no eixo Y de forma super progressiva
        gsap.fromTo(icon, 
            { scale: 0.6, rotation: -45 }, 
            { scale: 1.15, rotation: 360, duration: 0.75, ease: "back.out(1.5)" }
        );
    }, 950);
});

/**
 * Intercepta o clique natural, impede temporariamente a navegação,
 * roda a animação e redireciona após o atraso (delayMs).
 * 
 * @param {string} idElement - ID do link
 * @param {function} animationCallback - Função de motion a ser executada
 * @param {number} delayMs - Atraso do redirecionamento
 */
function setupLinkClickAnimation(idElement, animationCallback, delayMs) {
    const link = document.getElementById(idElement);
    if (!link) return;

    link.addEventListener("click", function(event) {
        event.preventDefault();
        
        const targetUrl = this.getAttribute("href");
        const isBlank = this.getAttribute("target") === "_blank";

        // Aplica o bloqueador de clique duplo
        document.querySelectorAll(".bio-btn").forEach(b => b.classList.add("animating"));
        
        // Executa o motion individual
        animationCallback(this);

        // Navegação temporizada
        setTimeout(() => {
            if (isBlank) {
                window.open(targetUrl, "_blank");
                // Desbloqueia a página local para que o usuário não fique travado
                document.querySelectorAll(".bio-btn").forEach(b => {
                    b.classList.remove("animating");
                    const wrap = b.querySelector("[class^='motion-']");
                    if (wrap) gsap.to(wrap, { opacity: 0, duration: 0.2 });
                });
            } else {
                window.location.href = targetUrl;
            }
        }, delayMs);
    });
}

// Helper para reajuste de altura dinâmica
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', setVH);
