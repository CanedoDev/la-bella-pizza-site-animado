// Registrar o plugin CustomEase do GSAP para uso do bezier customizado.
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase)

    // Curva Exponencial Besizer solicitada: 0.78, 0, 0.23, 1
    CustomEase.create("customBezier", "M0,0 C0.78,0 0.23,1 1,1");

    // Dataset das pizzas exatamente com a ordem pedida
    const slidesData = [
        {
            title: "Calabresa",
            modalSlug: "calabresa",
            desc: "Clássica e intensa, com calabresa selecionada, queijo derretido e um toque artesanal que equilibra sabor e textura.",
            img: "assets/img/pizza-calabresa.png",
            experiencia: ["Picante", "Muito recheio", "Combina<br>com vinho"],
            ingredientes: ["Mozzarela", "Calabresa", "Molho de<br>Tomate"],
            rotation: -18.857
        },
        {
            title: "Frango c/ Requeijão Cremoso",
            modalSlug: "frango-c-catupiry",
            desc: "A união perfeita do frango desfiado suculento com a cremosidade do autêntico requeijão, assada ao ponto ideal.",
            img: "assets/img/pizza-frango-catupiry.webp",
            experiencia: ["Cremosa", "Muito recheio", "Saborosa"],
            ingredientes: ["Frango", "Requeijão Cremoso", "Azeitonas"],
            rotation: -18.857
        },
        {
            title: "La Bella",
            modalSlug: "la-bella",
            desc: "A receita exclusiva da casa: tomates maduros, folhas frescas de manjericão, queijo parmesão gratinado e alho frito crocante.",
            img: "assets/img/pizza-calabresa.png",
            experiencia: ["Exclusiva", "Aromática", "Combina<br>com vinho"],
            ingredientes: ["Tomates", "Manjericão", "Parmesão & Alho"],
            rotation: -18.857
        },
        {
            title: "Parma",
            modalSlug: "parma",
            desc: "Elegância da charcutaria nobre: fatias finíssimas de presunto tipo parma, queijo parmesão ralado na hora e folhas frescas de rúcula.",
            img: "assets/img/pizza-brasileira.png",
            experiencia: ["Gourmet", "Sofisticada", "Combina<br>com vinho"],
            ingredientes: ["Presunto Parma", "Parmesão", "Rúcula Fresca"],
            rotation: -18.857
        }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    // Seletores do DOM
    const DOM = {
        title: document.querySelector('.pizza-title'),
        desc: document.querySelector('.pizza-desc'),
        img: document.querySelector('.pizza-main-img'),
        expSpans: document.querySelectorAll('.features-group:first-of-type .feature-item span'),
        ingSpans: document.querySelectorAll('.features-group:last-of-type .feature-item span'),
        dots: document.querySelectorAll('.dot'),
        btnNext: document.querySelector('button[aria-label="Próxima"]'),
        btnPrev: document.querySelector('button[aria-label="Anterior"]'),
        orderBtn: document.querySelector('.order-btn')
    };

    // Lógica de transição de Slide
    function changeSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        // Calcular o próximo index
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % slidesData.length;
        } else if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
        } else if (typeof direction === 'number') {
            if (currentIndex === direction) {
                isAnimating = false;
                return;
            }
            currentIndex = direction;
        }

        const nextData = slidesData[currentIndex];

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                // Clean up DOM: Remove crossfade wrapper and keep only the raw new texts
                DOM.title.innerHTML = nextData.title;
                DOM.desc.innerHTML = nextData.desc;
            }
        });

        // 1. Setup Crossfade Wrappers for Title and Desc
        const oldTitleHTML = DOM.title.innerHTML;
        const oldDescHTML = DOM.desc.innerHTML;

        DOM.title.innerHTML = `
        <div class="crossfade-wrapper">
            <div class="old-text">${oldTitleHTML}</div>
            <div class="new-text">${nextData.title}</div>
        </div>
    `;

        DOM.desc.innerHTML = `
        <div class="crossfade-wrapper">
            <div class="old-text">${oldDescHTML}</div>
            <div class="new-text">${nextData.desc}</div>
        </div>
    `;

        // 2. Perform SplitText
        const titleSplitOld = new SplitText(".pizza-title .old-text", { type: "words" });
        const titleSplitNew = new SplitText(".pizza-title .new-text", { type: "words" });
        const descSplitOld = new SplitText(".pizza-desc .old-text", { type: "words" });
        const descSplitNew = new SplitText(".pizza-desc .new-text", { type: "words" });

        const smallTextElements = [...DOM.expSpans, ...DOM.ingSpans];

        // Setup initial state for New elements entering
        gsap.set([titleSplitNew.words, descSplitNew.words], { y: 20, opacity: 0 });

        // 3. --- ANIMATE OUT ---

        // Words fade out & move up
        tl.to([titleSplitOld.words, descSplitOld.words], {
            y: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.in"
        }, 0);

        // Spans out
        tl.to(smallTextElements, {
            y: -20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.in"
        }, 0);

        // Image out
        tl.to(DOM.img, {
            scale: 0.8,
            opacity: 0,
            rotation: "+=45",
            duration: 0.5,
            ease: "power2.in"
        }, 0);

        // 4. --- UPDATE DOM FOR SPANS/IMG OVERLAY ---
        tl.add(() => {
            // Spans da Experiência
            DOM.expSpans.forEach((span, i) => { if (nextData.experiencia[i]) span.innerHTML = nextData.experiencia[i]; });
            // Spans dos Ingredientes
            DOM.ingSpans.forEach((span, i) => { if (nextData.ingredientes[i]) span.innerHTML = nextData.ingredientes[i]; });
            // Imagem
            DOM.img.src = nextData.img;
            // Atualizar Dots
            DOM.dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); });
            // Atualizar link do pedido
            if (DOM.orderBtn) DOM.orderBtn.href = `cardápio.html?modal=${nextData.modalSlug}`;
        }, 0.5); // Executa logo apos o fade out deles


        // 5. --- ANIMATE IN ---

        // Reset spans & img positions before showing
        tl.set(smallTextElements, { y: 20 }, 0.51);
        tl.set(DOM.img, { scale: 1.2, rotation: nextData.rotation - 45 }, 0.51);

        // Fade in new words
        tl.to([titleSplitNew.words, descSplitNew.words], {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.03,
            ease: "customBezier"
        }, 0.2); // Começa um pouco antes de terminar a saida dos velhos

        tl.to(smallTextElements, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "customBezier"
        }, 0.55);

        tl.to(DOM.img, {
            scale: 1,
            opacity: 1,
            rotation: nextData.rotation,
            duration: 1.2,
            ease: "customBezier"
        }, 0.55);
    }

    // Event Listeners
    DOM.btnNext.addEventListener('click', () => changeSlide('next'));
    DOM.btnPrev.addEventListener('click', () => changeSlide('prev'));

    DOM.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeSlide(index));
    });


    // ScrollTrigger para o SVG text
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".marquee-textPath", {
        attr: { startOffset: "-50%" },
        duration: 2,
        scrollTrigger: {
            trigger: ".svg-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
        }
    });
});

