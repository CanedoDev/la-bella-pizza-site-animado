function initCookieBanner() {
    const consent = localStorage.getItem('cookie_consent');
    if (consent) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner-wrapper';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Consentimento de Cookies');

    banner.innerHTML = `
        <div class="cookie-banner-content">
            <p class="cookie-banner-text">
                Utilizamos cookies e tecnologias semelhantes para aprimorar sua experiência de navegação, lembrar preferências e analisar o uso do nosso cardápio. Para saber mais, acesse nossa <a href="privacidade.html">Política de Privacidade</a>.
            </p>
            <div class="cookie-banner-actions">
                <button type="button" class="cookie-btn cookie-btn-reject" id="cookie-btn-reject">Recusar</button>
                <button type="button" class="cookie-btn cookie-btn-accept" id="cookie-btn-accept">Aceitar</button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => {
        banner.classList.add('show');
    }, 400);

    const fecharBanner = (tipo) => {
        localStorage.setItem('cookie_consent', tipo);
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 400);

        if (tipo === 'accepted' && typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const btnAccept = document.getElementById('cookie-btn-accept');
    const btnReject = document.getElementById('cookie-btn-reject');

    if (btnAccept) {
        btnAccept.addEventListener('click', () => fecharBanner('accepted'));
    }

    if (btnReject) {
        btnReject.addEventListener('click', () => fecharBanner('rejected'));
    }
}

if (document.readyState === 'complete') {
    setTimeout(() => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initCookieBanner, { timeout: 2000 });
        } else {
            initCookieBanner();
        }
    }, 1500);
} else {
    window.addEventListener('load', () => {
        setTimeout(() => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(initCookieBanner, { timeout: 2000 });
            } else {
                initCookieBanner();
            }
        }, 1500);
    });
}
