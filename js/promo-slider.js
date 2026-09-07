document.addEventListener('DOMContentLoaded', () => {

    const promoSlides = document.querySelector('.promo-slides');
    const promoImages = document.querySelectorAll('.promo-slide');
    const prevBtn = document.querySelector('.promo-btn.prev');
    const nextBtn = document.querySelector('.promo-btn.next');

    if(promoSlides && promoImages.length > 0) {
        let currentPromoIndex = 0;
        let promoInterval;

        function updatePromoSlider() {
            promoSlides.style.transform = `translateX(-${currentPromoIndex * 100}%)`;
        }

        function nextPromo() {
            currentPromoIndex = (currentPromoIndex + 1) % promoImages.length;
            updatePromoSlider();
        }

        function prevPromo() {
            currentPromoIndex = (currentPromoIndex - 1 + promoImages.length) % promoImages.length;
            updatePromoSlider();
        }

        function startPromoAutoPlay() {
            promoInterval = setInterval(nextPromo, 4000);
        }

        function resetPromoAutoPlay() {
            clearInterval(promoInterval);
            startPromoAutoPlay();
        }

        nextBtn.addEventListener('click', () => {
            nextPromo();
            resetPromoAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevPromo();
            resetPromoAutoPlay();
        });

        startPromoAutoPlay();

        promoImages.forEach(slide => {
            slide.addEventListener('click', (e) => {
                const promoTipo = slide.getAttribute('data-promo');
                if (!promoTipo) return;

                if (window.location.pathname.includes('card') || typeof carregarPizzas === 'function') {
                    e.preventDefault();
                    const status = typeof getPromocaoStatus === 'function' ? getPromocaoStatus() : {
                        tercaFeira: new Date().getDay() === 2,
                        quartaFeira: new Date().getDay() === 3
                    };

                    if (promoTipo === 'terca' && status.tercaFeira) {
                        const btnCombos = document.querySelector('.category-button[data-filter="combos"]');
                        if (btnCombos) {
                            btnCombos.click();
                        } else if (typeof categoriaAtual !== 'undefined') {
                            categoriaAtual = 'combos';
                            carregarPizzas();
                        }
                        const cardapioSec = document.querySelector('#cardapio') || document.querySelector('.cardapio');
                        if (cardapioSec) cardapioSec.scrollIntoView({ behavior: 'smooth' });
                    } else if (promoTipo === 'quarta' && status.quartaFeira) {
                        const btnTodos = document.querySelector('.category-button[data-filter="all"]');
                        if (btnTodos) {
                            btnTodos.click();
                        } else if (typeof categoriaAtual !== 'undefined') {
                            categoriaAtual = 'all';
                            carregarPizzas();
                        }
                        setTimeout(() => {
                            const ofertasEl = document.querySelector('.ofertas-do-dia') || document.querySelector('.cardapio');
                            if (ofertasEl) ofertasEl.scrollIntoView({ behavior: 'smooth' });
                        }, 120);
                    } else {
                        const cardapioSec = document.querySelector('#cardapio') || document.querySelector('.cardapio');
                        if (cardapioSec) cardapioSec.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                }

                const hoje = new Date();
                const diaSemana = hoje.getDay();
                const ehTerca = (diaSemana === 2);
                const ehQuarta = (diaSemana === 3);

                if (promoTipo === 'terca' && ehTerca) {
                    slide.setAttribute('href', 'cardápio.html?promo=terca#cardapio');
                } else if (promoTipo === 'quarta' && ehQuarta) {
                    slide.setAttribute('href', 'cardápio.html?promo=quarta#cardapio');
                } else {
                    slide.setAttribute('href', 'cardápio.html#cardapio');
                }
            });
        });
    }
});
