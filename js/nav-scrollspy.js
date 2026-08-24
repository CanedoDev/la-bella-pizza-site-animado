// ==========================================================================
// SCROLLSPY E NAVEGAÇÃO ATIVA EM TEMPO REAL
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.header .nav-link');
    if (!navLinks.length) return;

    // A Home possui .hero-section; a página de cardápio não possui .hero-section
    const isHomePage = !!document.querySelector('.hero-section');

    const setActive = (sectionName) => {
        navLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            if (section === sectionName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    const updateActiveNav = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // Se estiver bem no final da página (rodapé), ativa Contato
        if (scrollY + windowHeight >= docHeight - 80) {
            setActive('contato');
            return;
        }

        const threshold = windowHeight * 0.45; // 45% do topo da janela

        if (isHomePage) {
            const promocoes = document.getElementById('promocoes') || document.querySelector('.promocao');
            const sobre = document.getElementById('sobre') || document.querySelector('.sobre');
            const footer = document.getElementById('contato') || document.querySelector('footer');

            const promoTop = promocoes ? promocoes.getBoundingClientRect().top : Infinity;
            const sobreTop = sobre ? sobre.getBoundingClientRect().top : Infinity;
            const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

            if (footerTop <= threshold) {
                setActive('contato');
            } else if (sobreTop <= threshold) {
                setActive('sobre');
            } else if (promoTop <= threshold) {
                setActive('promocoes');
            } else {
                setActive('inicio');
            }
        } else {
            // Página Cardápio: toda a página conta como Cardápio, exceto o rodapé
            const footer = document.getElementById('contato') || document.querySelector('footer');
            const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

            if (footerTop <= threshold) {
                setActive('contato');
            } else {
                setActive('cardapio');
            }
        }
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav, { passive: true });
    updateActiveNav();
});
