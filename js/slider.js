document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

    CustomEase.create("customBezier", "M0,0 C0.78,0 0.23,1 1,1");

    const slidesData = [
        {
            title: "Calabresa",
            modalSlug: "calabresa",
            desc: "Clássica e intensa, com calabresa selecionada, queijo derretido e um toque artesanal que equilibra sabor e textura.",
            img: "assets/img/pizza-calabresa.webp?v=15",
            mobImg: "assets/img/pizza-calabresa-mob.webp?v=15",
            experiencia: [
                "Levemente<br>picante",
                "Recheio farto<br>& artesanal",
                "Combina com<br>Vinho Tinto"
            ],
            ingredientes: [
                { name: "Mozzarela", icon: "assets/img/icone-mozzarela.svg" },
                { name: "Calabresa", icon: "assets/img/icone-calabresa.svg" },
                { name: "Molho de<br>Tomate", icon: "assets/img/icone-molho-tomate.svg" }
            ],
            rotation: -18.857
        },
        {
            title: "Frango c/ Requeijão Cremoso",
            modalSlug: "frango-c-catupiry",
            desc: "A união perfeita do frango desfiado suculento com a cremosidade do autêntico requeijão, assada ao ponto ideal.",
            img: "assets/img/pizza-frango-catupiry.webp?v=15",
            mobImg: "assets/img/pizza-frango-catupiry-mob.webp?v=15",
            experiencia: [
                "Suave &<br>cremosa",
                "Massa leve (48h)<br>& muito recheio",
                "Combina com<br>Vinho Branco"
            ],
            ingredientes: [
                { name: "Frango<br>Desfiado", icon: "assets/img/icone-frango.svg" },
                { name: "Requeijão<br>Cremoso", icon: "assets/img/icone-requeijao.svg" },
                { name: "Azeitonas<br>Pretas", icon: "assets/img/icone-azeitonas.svg" }
            ],
            rotation: -18.857
        },
        {
            title: "La Bella",
            modalSlug: "la-bella",
            desc: "A receita exclusiva da casa: tomates maduros, folhas frescas de manjericão, queijo parmesão gratinado e alho frito crocante.",
            img: "assets/img/pizza-la-bella.webp?v=15",
            mobImg: "assets/img/pizza-la-bella-mob.webp?v=15",
            experiencia: [
                "Aromática &<br>fresca",
                "Borda crocante<br>& queijo tostado",
                "Combina com<br>Vinho Seco"
            ],
            ingredientes: [
                { name: "Tomates<br>Maduros", icon: "assets/img/icone-tomate-ingrediente.svg" },
                { name: "Manjericão<br>Fresco", icon: "assets/img/icone-manjericao.svg" },
                { name: "Parmesão &<br>Alho Frito", icon: "assets/img/icone-alho.svg" }
            ],
            rotation: -18.857
        },
        {
            title: "Parma",
            modalSlug: "parma",
            desc: "Elegância da charcutaria nobre: fatias finíssimas de presunto tipo parma, queijo parmesão ralado na hora e folhas frescas de rúcula.",
            img: "assets/img/pizza-parma.webp?v=15",
            mobImg: "assets/img/pizza-parma-mob.webp?v=15",
            experiencia: [
                "Sabor nobre &<br>equilibrado",
                "Massa fininha<br>& crocante",
                "Combina com<br>Espumante Brut"
            ],
            ingredientes: [
                { name: "Presunto<br>Parma", icon: "assets/img/icone-presunto-parma.svg" },
                { name: "Parmesão<br>Ralado", icon: "assets/img/icone-parmesao.svg" },
                { name: "Rúcula<br>Fresca", icon: "assets/img/icone-rucula.svg" }
            ],
            rotation: -18.857
        }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    const DOM = {
        title: document.querySelector('.pizza-title'),
        desc: document.querySelector('.pizza-desc'),
        img: document.querySelector('.pizza-main-img'),
        source: document.querySelector('.hero-center picture source'),
        expSpans: document.querySelectorAll('.features-group:first-of-type .feature-item span'),
        ingItems: document.querySelectorAll('.features-group:last-of-type .feature-item'),
        dots: document.querySelectorAll('.dot'),
        btnNext: document.querySelector('button[aria-label="Próxima"]'),
        btnPrev: document.querySelector('button[aria-label="Anterior"]'),
        orderBtn: document.querySelector('.order-btn')
    };

    function changeSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

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

                DOM.title.innerHTML = nextData.title;
                DOM.desc.innerHTML = nextData.desc;
            }
        });

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

        const titleSplitOld = new SplitText(".pizza-title .old-text", { type: "words" });
        const titleSplitNew = new SplitText(".pizza-title .new-text", { type: "words" });
        const descSplitOld = new SplitText(".pizza-desc .old-text", { type: "words" });
        const descSplitNew = new SplitText(".pizza-desc .new-text", { type: "words" });

        const smallTextElements = [...DOM.expSpans, ...DOM.ingItems];

        gsap.set([titleSplitNew.words, descSplitNew.words], { y: 20, opacity: 0 });

        tl.to([titleSplitOld.words, descSplitOld.words], {
            y: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.in"
        }, 0);

        tl.to(smallTextElements, {
            y: -20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.in"
        }, 0);

        tl.to(DOM.img, {
            scale: 0.8,
            opacity: 0,
            rotation: "+=45",
            duration: 0.5,
            ease: "power2.in"
        }, 0);

        tl.add(() => {

            DOM.expSpans.forEach((span, i) => {
                if (nextData.experiencia[i]) span.innerHTML = nextData.experiencia[i];
            });

            DOM.ingItems.forEach((item, i) => {
                if (nextData.ingredientes[i]) {
                    const span = item.querySelector('span');
                    const img = item.querySelector('.feature-icon');
                    if (span) span.innerHTML = nextData.ingredientes[i].name;
                    if (img) {
                        img.src = nextData.ingredientes[i].icon;
                        img.alt = nextData.ingredientes[i].name.replace(/<br>/g, ' ');
                    }
                }
            });

            DOM.img.src = nextData.img;
            if (DOM.source) {
                DOM.source.srcset = nextData.mobImg || nextData.img.replace('.webp', '-mob.webp');
            }

            DOM.dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); });

            if (DOM.orderBtn) DOM.orderBtn.href = `cardápio.html?modal=${nextData.modalSlug}`;
        }, 0.5);

        tl.set(smallTextElements, { y: 20 }, 0.51);
        tl.set(DOM.img, { scale: 1.2, rotation: nextData.rotation - 45 }, 0.51);

        tl.to([titleSplitNew.words, descSplitNew.words], {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.03,
            ease: "customBezier"
        }, 0.2);

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

    DOM.btnNext.addEventListener('click', () => changeSlide('next'));
    DOM.btnPrev.addEventListener('click', () => changeSlide('prev'));

    DOM.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeSlide(index));
    });

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
