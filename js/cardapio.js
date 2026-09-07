const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

let modalKey = 0

let quantPizzas = 1

let cart = []

let pizzaPromoQuartaUm = [2, 6, 4, 5, 7, 8, 11, 14, 15, 20, 24]
let pizzaPromoQuartaDois = [26, 39, 29, 32, 42]

let termoAtual = ''

let categoriaAtual = 'all'

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if (valor) {
        return valor.toFixed(2)
    }
}

const feriadosCache = {};

function calcularPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(ano, mes - 1, dia);
}

function getFeriadosPetropolis() {
    return ['16/03', '29/06'];
}

function getFeriadosFallbackAno(ano) {
    const feriados = [];
    const fmt = (d, m) => String(d).padStart(2, '0') + '/' + String(m).padStart(2, '0');

    feriados.push(fmt(1, 1));
    feriados.push(fmt(21, 4));
    feriados.push(fmt(1, 5));
    feriados.push(fmt(7, 9));
    feriados.push(fmt(12, 10));
    feriados.push(fmt(2, 11));
    feriados.push(fmt(15, 11));
    feriados.push(fmt(20, 11));
    feriados.push(fmt(25, 12));

    feriados.push(...getFeriadosPetropolis());

    const pascoa = calcularPascoa(ano);

    const carnavalSeg = new Date(pascoa);
    carnavalSeg.setDate(pascoa.getDate() - 48);
    feriados.push(fmt(carnavalSeg.getDate(), carnavalSeg.getMonth() + 1));

    const carnavalTer = new Date(pascoa);
    carnavalTer.setDate(pascoa.getDate() - 47);
    feriados.push(fmt(carnavalTer.getDate(), carnavalTer.getMonth() + 1));

    const sextaSanta = new Date(pascoa);
    sextaSanta.setDate(pascoa.getDate() - 2);
    feriados.push(fmt(sextaSanta.getDate(), sextaSanta.getMonth() + 1));

    feriados.push(fmt(pascoa.getDate(), pascoa.getMonth() + 1));

    const corpusChristi = new Date(pascoa);
    corpusChristi.setDate(pascoa.getDate() + 60);
    feriados.push(fmt(corpusChristi.getDate(), corpusChristi.getMonth() + 1));

    return Array.from(new Set(feriados));
}

async function sincronizarFeriadosBrasilAPI(ano) {
    if (!ano) ano = new Date().getFullYear();
    const cacheKey = `feriados_brasilapi_${ano}`;

    try {
        const cacheLocal = localStorage.getItem(cacheKey);
        if (cacheLocal) {
            feriadosCache[ano] = JSON.parse(cacheLocal);
        }
    } catch (e) {}

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const dados = await response.json();
            const feriadosFormatados = dados.map(item => {
                const parts = item.date.split('-');
                return parts[2] + '/' + parts[1];
            });

            getFeriadosPetropolis().forEach(f => {
                if (!feriadosFormatados.includes(f)) feriadosFormatados.push(f);
            });

            feriadosCache[ano] = feriadosFormatados;
            try {
                localStorage.setItem(cacheKey, JSON.stringify(feriadosFormatados));
            } catch (e) {}
            return feriadosFormatados;
        }
    } catch (err) {
        console.warn(`[La Bella Pizza] BrasilAPI offline/timeout para ${ano}. Utilizando fallback algorítmico perpétuo.`, err);
    }

    return getFeriadosAno(ano);
}

function getFeriadosAno(ano) {
    if (feriadosCache[ano] && feriadosCache[ano].length > 0) {
        return feriadosCache[ano];
    }

    try {
        const cacheLocal = localStorage.getItem(`feriados_brasilapi_${ano}`);
        if (cacheLocal) {
            feriadosCache[ano] = JSON.parse(cacheLocal);
            return feriadosCache[ano];
        }
    } catch (e) {}

    return getFeriadosFallbackAno(ano);
}

(function initFeriados() {
    const anoAtual = new Date().getFullYear();
    sincronizarFeriadosBrasilAPI(anoAtual);
    sincronizarFeriadosBrasilAPI(anoAtual + 1);
})();

function isFeriadoOuVespera(dateObj) {
    const data = dateObj || new Date();
    const ano = data.getFullYear();
    const feriados = getFeriadosAno(ano);
    const fmt = (dia, m) => String(dia).padStart(2, '0') + '/' + String(m).padStart(2, '0');

    const diaHoje = fmt(data.getDate(), data.getMonth() + 1);
    if (feriados.includes(diaHoje)) {
        return true;
    }

    const amanha = new Date(data);
    amanha.setDate(data.getDate() + 1);
    const feriadosAmanha = (amanha.getFullYear() === ano) ? feriados : getFeriadosAno(amanha.getFullYear());
    const diaAmanha = fmt(amanha.getDate(), amanha.getMonth() + 1);

    return feriadosAmanha.includes(diaAmanha);
}

const getPromocaoStatus = () => {
    const agora = typeof getDiaAtualData === 'function' ? getDiaAtualData() : new Date();
    const ehFeriadoOuVespera = isFeriadoOuVespera(agora);
    const diaDaSemana = typeof getDiaAtual === 'function' ? getDiaAtual() : agora.getDay();
    return {
        diaDaSemana,
        ehFeriadoOuVespera,
        tercaFeira: (diaDaSemana === 2) && !ehFeriadoOuVespera,
        quartaFeira: (diaDaSemana === 3) && !ehFeriadoOuVespera
    };
};

window.isFeriadoOuVespera = isFeriadoOuVespera;
window.getPromocaoStatus = getPromocaoStatus;
window.sincronizarFeriadosBrasilAPI = sincronizarFeriadosBrasilAPI;

let modalStack = [];
let ignorarProximoPopstate = false;

window.pushModalState = (tipoModal) => {
    if (modalStack[modalStack.length - 1] !== tipoModal) {
        history.pushState({ modalOpen: tipoModal }, '');
        modalStack.push(tipoModal);
    }
};

window.popModalState = (tipoModal) => {
    const idx = modalStack.lastIndexOf(tipoModal);
    if (idx > -1) {
        modalStack.splice(idx, 1);
        ignorarProximoPopstate = true;
        history.back();
    }
};

window.addEventListener('popstate', () => {
    if (ignorarProximoPopstate) {
        ignorarProximoPopstate = false;
        return;
    }

    const checkoutArea = document.querySelector('.checkoutWindowArea');
    const comboArea = document.querySelector('.comboWindowArea');
    const pizzaArea = document.querySelector('.pizzaWindowArea');
    const cartAside = document.querySelector('aside');

    if (checkoutArea && checkoutArea.style.display === 'flex' && checkoutArea.style.opacity !== '0') {
        modalStack = modalStack.filter(m => m !== 'checkout');
        fecharCheckout(false);
        setTimeout(() => {
            mostrarCarrinho();
        }, 300);
        return;
    }

    if (comboArea && comboArea.style.display === 'flex') {
        modalStack = modalStack.filter(m => m !== 'combo');
        if (typeof fecharModalCombo === 'function') fecharModalCombo(false);
        return;
    }

    if (pizzaArea && pizzaArea.style.display === 'flex') {
        modalStack = modalStack.filter(m => m !== 'pizza');
        fecharModal(false);
        return;
    }

    if (cartAside && cartAside.classList.contains('show')) {
        modalStack = modalStack.filter(m => m !== 'cart');
        esconderCarrinho(false);
        return;
    }
});

const abrirModal = () => {
    const area = seleciona('.pizzaWindowArea');
    const body = seleciona('.pizzaWindowBody');

    area.style.display = 'flex';

    gsap.to(area, { opacity: 1, duration: 0.3 });

    gsap.fromTo(body,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1, 0.4)" }
    );

    window.pushModalState('pizza');
}

const fecharModal = (syncHistory = true) => {
    const area = seleciona('.pizzaWindowArea');
    const body = seleciona('.pizzaWindowBody');

    gsap.to(body, {
        scale: 0.8,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in"
    });

    gsap.to(area, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            area.style.display = 'none';
        }
    });

    if (syncHistory) {
        window.popModalState('pizza');
    }
}

const botoesFechar = () => {
    selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
        item.addEventListener('click', fecharModal)
    })

    const pizzaArea = seleciona('.pizzaWindowArea')
    if (pizzaArea) {
        pizzaArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('pizzaWindowArea')) {
                fecharModal()
            }
        })
    }

    selecionaTodos('.comboInfo--cancelButton, .combo--cancelButton, .comboInfo--cancelMobileButton').forEach((item) => {
        item.addEventListener('click', () => {
            if (typeof fecharModalCombo === 'function') fecharModalCombo()
        })
    })

    const comboArea = seleciona('.comboWindowArea')
    if (comboArea) {
        comboArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('comboWindowArea')) {
                if (typeof fecharModalCombo === 'function') fecharModalCombo()
            }
        })
    }

    const btnAddCombo = seleciona('.comboInfo--addButton, .combo--addButton')
    if (btnAddCombo) {
        btnAddCombo.onclick = () => {
            if (typeof confirmarAdicaoCombo === 'function') confirmarAdicaoCombo()
        }
    }
}

const preencheDadosPizza = (pizzaItem, item, index) => {
    pizzaItem.setAttribute('data-key', index)
    const pizzaImg = pizzaItem.querySelector(".card-pizza-img")
    pizzaImg.src = item.img
    pizzaImg.alt = `Pizza ${item.name} artesanal`
    pizzaImg.loading = "lazy"
    pizzaImg.decoding = "async"
    pizzaImg.width = 200
    pizzaImg.height = 135
    pizzaItem.querySelector(".card-title").innerHTML = item.name
    pizzaItem.querySelector(".card-price").innerHTML = `R$ ${item.price[0].toFixed(2).replace('.', ',')}`
}

const preencherDadosModal = (item) => {
    seleciona('.pizzaBig img').src = item.img
    seleciona('.pizzaInfo h1').innerHTML = item.name
    seleciona('.pizzaInfo--desc').innerHTML = item.description
    seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[0])

    let tagText = 'TRADICIONAL'
    let tagClass = 'tag-tradicional'
    if (item.category === 'Pizzas Especiais') {
        tagText = 'ESPECIAL'
        tagClass = 'tag-especial'
    } else if (item.category === 'Pizzas Doces') {
        tagText = 'DOCE'
        tagClass = 'tag-doce'
    } else if (item.category === 'Pizzas Gourmet') {
        tagText = 'GOURMET'
        tagClass = 'tag-gourmet'
    } else if (item.category === 'Bebidas') {
        tagText = 'BEBIDA GELADA'
        tagClass = 'tag-bebida'
    }

    const tagEl = seleciona('.pizzaTag')
    if (tagEl) {
        tagEl.innerText = tagText
        tagEl.className = `pizzaTag ${tagClass}`
    }
}

const pegarKey = (e) => {

    let key = e.target.closest('.card').getAttribute('data-key')

    quantPizzas = 1

    modalKey = key

    return key
}

const atualizarBonusRefri = () => {
    const bonusRefriEl = seleciona('.pizzaInfo--bonusRefri')
    const selectedSize = seleciona('.pizzaInfo--size.selected')
    if (!bonusRefriEl) return
    const key = selectedSize ? selectedSize.getAttribute('data-key') : ''
    if (key === 'S' || key === 'MX') {
        bonusRefriEl.style.display = 'flex'
    } else {
        bonusRefriEl.style.display = 'none'
    }
}

const preencherTamanhos = (key) => {
    let currentSelected = seleciona('.pizzaInfo--size.selected')
    if (currentSelected) currentSelected.classList.remove('selected')

    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        if (pizzaJson[key].sizes[sizeIndex]) {
            size.style.display = 'block'
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        } else {
            size.style.display = 'none'
        }
    })

    let allSizes = selecionaTodos('.pizzaInfo--size')
    if (pizzaJson[key].sizes[1]) {
        allSizes[1].classList.add('selected')
    } else {
        allSizes[0].classList.add('selected')
    }

    atualizarBonusRefri()
}

const atualizaPreco = () => {
    let sizeIndex = [...selecionaTodos('.pizzaInfo--size')].findIndex(size => size.classList.contains('selected'))
    let precoOriginal = pizzaJson[modalKey].price[sizeIndex]

    const { quartaFeira } = getPromocaoStatus()
    let descontoPromo = 0

    if (quartaFeira && sizeIndex === 1) {
        if (pizzaPromoQuartaUm.includes(pizzaJson[modalKey].id)) {
            descontoPromo = 10
        } else if (pizzaPromoQuartaDois.includes(pizzaJson[modalKey].id)) {
            descontoPromo = 11
        }
    }

    let total = Math.max(0, (precoOriginal * quantPizzas) - descontoPromo)

    seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(total)
}

const escolherTamanho = (key) => {
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            seleciona('.pizzaInfo--size.selected').classList.remove('selected')

            size.classList.add('selected')

            atualizarBonusRefri()
            atualizaPreco()
        })
    })
}

const mudarQuantidadeModal = () => {

    seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
        quantPizzas++
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
        atualizaPreco()
    })

    seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if (quantPizzas > 0) {
            quantPizzas--
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
            atualizaPreco()

        }
    })

}

const mostrarCarrinho = (syncHistory = true) => {
    seleciona('aside').classList.add('show');
    if (syncHistory) {
        window.pushModalState('cart');
    }
};

const esconderCarrinho = (syncHistory = true) => {
    seleciona('aside').classList.remove('show');
    if (syncHistory) {
        window.popModalState('cart');
    }
};

const abrirCarrinho = () => {
    if (cart.length > 0) {
        mostrarCarrinho();
    }
    seleciona('.menu-openner').addEventListener('click', () => {
        mostrarCarrinho();
    });
};

const fecharCarrinho = () => {

    seleciona('.menu-closer').addEventListener('click', () => {
        esconderCarrinho();
    });

    document.addEventListener('click', (e) => {
        const carrinhoAberto = seleciona('aside').classList.contains('show');

        if (carrinhoAberto) {
            if (!document.body.contains(e.target)) return;

            const clicouForaDoCarrinho = !e.target.closest('aside');

            const clicouNoBotaoAbrirCarrinho = e.target.closest('.menu-openner');
            const clicouNoAdicionar = e.target.closest('.pizzaInfo--addButton');

            if (clicouForaDoCarrinho && !clicouNoBotaoAbrirCarrinho && !clicouNoAdicionar) {
                esconderCarrinho();
            }
        }
    });

    const pedirMaisBtn = seleciona('.cart--pedirmais');
    if (pedirMaisBtn) {
        pedirMaisBtn.addEventListener('click', () => {
            esconderCarrinho();
        });
    }
};

const mostrarPopupAvisoPromo = () => {
    const popup = seleciona('#promoAlertModal')
    if (popup) {
        popup.style.display = 'flex'
        popup.style.opacity = '1'
    }
}

const configurarPopupAvisoPromo = () => {
    const popup = seleciona('#promoAlertModal')
    const btnClose = seleciona('#promoAlertCloseBtn')
    if (btnClose && popup) {
        btnClose.addEventListener('click', () => {
            popup.style.display = 'none'
        })
    }
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none'
            }
        })
    }
}

const adicionarNoCarrinho = () => {
    seleciona('.pizzaInfo--addButton').addEventListener('click', () => {

        let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key')

        let sizeIndex = [...selecionaTodos('.pizzaInfo--size')].findIndex(size => size.classList.contains('selected'))

        let price = pizzaJson[modalKey].price[sizeIndex]

        let identificador = pizzaJson[modalKey].id + 't' + size

        const { quartaFeira } = getPromocaoStatus()
        const ehPromoAtual = quartaFeira && (size === 'G' || sizeIndex === 1) &&
            (pizzaPromoQuartaUm.includes(pizzaJson[modalKey].id) || pizzaPromoQuartaDois.includes(pizzaJson[modalKey].id))

        if (ehPromoAtual) {
            const promoExistente = cart.reduce((acc, it) => {
                const eh = quartaFeira && (it.size === 'G' || it.sizeIndex === 1) &&
                    (pizzaPromoQuartaUm.includes(it.id) || pizzaPromoQuartaDois.includes(it.id))
                return eh ? acc + it.qt : acc
            }, 0)

            if (promoExistente >= 1 || quantPizzas > 1) {
                mostrarPopupAvisoPromo()
            }
        }

        let enderecoDaPizza = cart.findIndex((item) => !item.isCombo && item.identificador == identificador)

        if (enderecoDaPizza > -1) {
            cart[enderecoDaPizza].qt += quantPizzas
        } else {
            let pizzaNoCarrinho = {
                identificador,
                id: pizzaJson[modalKey].id,
                size: size,
                sizeIndex: sizeIndex,
                qt: quantPizzas,
                price: price
            }
            cart.push(pizzaNoCarrinho)
        }

        if (typeof detectarEAplicarCombos === 'function') {
            detectarEAplicarCombos(cart)
        }

        fecharModal(false);
        mostrarCarrinho();
        atualizarCarrinho();

    })
}

const atualizarCarrinho = () => {
    let subtotal = 0
    let desconto = 0
    let total = 0

    const { quartaFeira } = getPromocaoStatus()
    let descontoPromoAplicado = false
    let totalPizzasPromoNoCarrinho = 0

    if (typeof detectarEAplicarCombos === 'function') {
        detectarEAplicarCombos(cart)
    }

    if (cart.length > 0) {
        seleciona('aside').classList.add('show')

        seleciona('.cart').innerHTML = ''

        cart.forEach((itemDoCarrinho) => {
            let cartItem = seleciona('.models .cart--item').cloneNode(true)

            if (itemDoCarrinho.isCombo) {

                cartItem.classList.add('is-combo')
                cartItem.querySelector('.cart--item img').src = itemDoCarrinho.img || 'assets/img/banner-promocao-combo-pizza.webp'

                const precoOriginalItem = (itemDoCarrinho.originalPrice || itemDoCarrinho.price) * itemDoCarrinho.qt
                const precoFinalItem = itemDoCarrinho.price * itemDoCarrinho.qt
                const economiaItem = (itemDoCarrinho.discount || 0) * itemDoCarrinho.qt

                cartItem.querySelector('.cart--item-nome').innerHTML = `
                    <span class="cart--item-tag-combo">Combo</span>
                    <div class="cart--item-combo-title">${itemDoCarrinho.name}</div>
                    <div class="cart--item-combo-sub">${itemDoCarrinho.dynamicName || ''}</div>
                    <div class="cart--item-prices-combo">
                        <s>${formatoReal(precoOriginalItem)}</s>
                        <strong>${formatoReal(precoFinalItem)}</strong>
                        <span class="economy-tag">Economia de ${formatoReal(economiaItem)}</span>
                    </div>
                `
                cartItem.querySelector('.cart--item--qt').innerHTML = itemDoCarrinho.qt

                subtotal += precoOriginalItem
                desconto += economiaItem
            } else {

                let pizzaItem = pizzaJson.find((item) => item.id == itemDoCarrinho.id)
                let pizzaName = pizzaItem ? `${pizzaItem.name} (${itemDoCarrinho.size})` : `Item (${itemDoCarrinho.size})`

                let refriBadge = ''
                if (itemDoCarrinho.size === 'S' || itemDoCarrinho.size === 'MX') {
                    refriBadge = `<div class="cart--item-refri">Acompanha Refri 2L Grátis</div>`
                }

                cartItem.querySelector('.cart--item img').src = pizzaItem ? pizzaItem.img : 'assets/img/logo-la-bella-pizza.webp'
                cartItem.querySelector('.cart--item-nome').innerHTML = `
                    <div>${pizzaName}</div>
                    ${refriBadge}
                `
                cartItem.querySelector('.cart--item--qt').innerHTML = itemDoCarrinho.qt

                let itemTotal = itemDoCarrinho.qt * itemDoCarrinho.price
                subtotal += itemTotal

                const ehItemPromo = quartaFeira && (itemDoCarrinho.size === 'G' || itemDoCarrinho.sizeIndex === 1) &&
                    (pizzaPromoQuartaUm.includes(itemDoCarrinho.id) || pizzaPromoQuartaDois.includes(itemDoCarrinho.id))

                if (ehItemPromo) {
                    totalPizzasPromoNoCarrinho += itemDoCarrinho.qt
                    if (!descontoPromoAplicado) {
                        if (pizzaPromoQuartaUm.includes(itemDoCarrinho.id)) {
                            desconto += 10
                        } else if (pizzaPromoQuartaDois.includes(itemDoCarrinho.id)) {
                            desconto += 11
                        }
                        descontoPromoAplicado = true
                    }
                }
            }

            seleciona('.menu-openner span').innerHTML = cart.length

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                const ehItemPromo = quartaFeira && (itemDoCarrinho.size === 'G' || itemDoCarrinho.sizeIndex === 1) &&
                    (pizzaPromoQuartaUm.includes(itemDoCarrinho.id) || pizzaPromoQuartaDois.includes(itemDoCarrinho.id))
                if (ehItemPromo) {
                    mostrarPopupAvisoPromo()
                }
                itemDoCarrinho.qt++
                atualizarCarrinho()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (itemDoCarrinho.qt > 1) {
                    itemDoCarrinho.qt--
                } else {
                    let indexDoItem = cart.findIndex(cartItem => cartItem.identificador === itemDoCarrinho.identificador)
                    if (indexDoItem > -1) {
                        cart.splice(indexDoItem, 1)
                    }
                }
                atualizarCarrinho()
            })

            seleciona('.cart').append(cartItem)
        })

        const promoAlertEl = seleciona('.cart--promo-alert')
        if (promoAlertEl) {
            promoAlertEl.style.display = totalPizzasPromoNoCarrinho > 1 ? 'block' : 'none'
        }

        total = Math.max(0, subtotal - desconto)

        seleciona('.menu-openner span').innerHTML = cart.length
        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
        seleciona('.total span:last-child').innerHTML = formatoReal(total)
    } else {
        const promoAlertEl = seleciona('.cart--promo-alert')
        if (promoAlertEl) {
            promoAlertEl.style.display = 'none'
        }
        seleciona('aside').classList.remove('show')
        seleciona('.cart').innerHTML = ''
        seleciona('.menu-openner span').innerHTML = 0
        seleciona('.subtotal span:last-child').innerHTML = 'R$ --'
        seleciona('.desconto span:last-child').innerHTML = 'R$ --'
        seleciona('.total span:last-child').innerHTML = 'R$ --'
    }

}

const capturarDadosDoPedido = () => {
    let pedido = {
        itens: [],
        subtotal: 0,
        desconto: 0,
        total: 0
    }

    const { quartaFeira } = getPromocaoStatus()
    let descontoPromoAplicado = false

    cart.forEach((itemDoCarrinho) => {
        if (itemDoCarrinho.isCombo) {
            const precoFinal = itemDoCarrinho.price * itemDoCarrinho.qt
            const precoOriginal = (itemDoCarrinho.originalPrice || itemDoCarrinho.price) * itemDoCarrinho.qt
            const economia = (itemDoCarrinho.discount || 0) * itemDoCarrinho.qt

            pedido.itens.push({
                isCombo: true,
                nome: itemDoCarrinho.name,
                detalhes: itemDoCarrinho.dynamicName || '',
                tamanho: 'Combo',
                quantidade: itemDoCarrinho.qt,
                preco: itemDoCarrinho.price,
                totalPizza: precoFinal,
                desconto: economia,
                brindeRefri: false
            })

            pedido.subtotal += precoOriginal
            pedido.desconto += economia
        } else {
            let pizzaItem = pizzaJson.find((item) => item.id == itemDoCarrinho.id)
            let pizzaName = pizzaItem ? pizzaItem.name : 'Item'
            let pizzaSize = itemDoCarrinho.size
            let pizzasQt = itemDoCarrinho.qt
            let pizzaPrice = itemDoCarrinho.price
            let pizzaTotal = pizzasQt * pizzaPrice
            let itemDesconto = 0

            const ehItemPromo = quartaFeira && (itemDoCarrinho.size === 'G' || itemDoCarrinho.sizeIndex === 1) &&
                (pizzaPromoQuartaUm.includes(itemDoCarrinho.id) || pizzaPromoQuartaDois.includes(itemDoCarrinho.id))

            if (ehItemPromo && !descontoPromoAplicado) {
                if (pizzaPromoQuartaUm.includes(itemDoCarrinho.id)) {
                    itemDesconto = 10
                } else if (pizzaPromoQuartaDois.includes(itemDoCarrinho.id)) {
                    itemDesconto = 11
                }
                descontoPromoAplicado = true
                pedido.desconto += itemDesconto
            }

            const brindeRefri = (itemDoCarrinho.size === 'S' || itemDoCarrinho.size === 'MX')

            pedido.itens.push({
                isCombo: false,
                nome: pizzaName,
                tamanho: pizzaSize,
                quantidade: pizzasQt,
                preco: pizzaPrice,
                totalPizza: pizzaTotal,
                desconto: itemDesconto,
                brindeRefri: brindeRefri
            })

            pedido.subtotal += pizzaTotal
        }
    })

    pedido.total = Math.max(0, pedido.subtotal - pedido.desconto)
    return pedido
}

const abrirCheckout = () => {

    esconderCarrinho(false);

    seleciona('.checkoutWindowArea').style.opacity = 0;
    seleciona('.checkoutWindowArea').style.display = 'flex';

    setTimeout(() => {
        seleciona('.checkoutWindowArea').style.opacity = 1;

        seleciona('#checkout-nome').focus();
    }, 200);

    window.pushModalState('checkout');
};

const fecharCheckout = (syncHistory = true) => {

    seleciona('.checkoutWindowArea').style.opacity = 0;

    setTimeout(() => {
        seleciona('.checkoutWindowArea').style.display = 'none';
    }, 500);

    if (syncHistory) {
        window.popModalState('checkout');
    }
};

const configurarCheckout = () => {

    let inputsFormulario = document.querySelectorAll('.checkout-form input, .checkout-form select')
    inputsFormulario.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()

                if (index < inputsFormulario.length - 1) {
                    inputsFormulario[index + 1].focus()
                } else {

                    seleciona('.checkoutInfo--confirmButton').click()
                }
            }
        })
    })

    seleciona('.checkoutInfo--cancelMobileButton').addEventListener('click', () => {
        fecharCheckout();
        setTimeout(() => {
            mostrarCarrinho();
        }, 300);
    });

    seleciona('.checkoutInfo--cancelButton').addEventListener('click', () => {
        fecharCheckout();
        setTimeout(() => {
            mostrarCarrinho();
        }, 300);
    });

    let campoCep = seleciona('#checkout-cep')

    campoCep.addEventListener('input', () => {
        campoCep.value = campoCep.value.replace(/[^0-9]/g, "")
    })

    campoCep.addEventListener('blur', () => {
        if (campoCep.value.length !== 8) {
            alert('CEP inválido! O CEP deve conter 8 números.')
            return
        } else {
            fetch(`https://viacep.com.br/ws/${campoCep.value}/json/`)
                .then(resposta => {
                    if (!resposta.ok) {
                        throw new Error('Erro no status do servidor: ' + resposta.status)
                    }
                    return resposta.json();
                })
                .then(data => {
                    if (data.erro) {
                        alert('CEP não encontrado!')
                        return
                    } else {

                        seleciona('#checkout-endereco').value = data.logradouro
                        seleciona('#checkout-bairro').value = data.bairro

                        seleciona('#checkout-numero').focus()
                    }
                })
        }
    })

    seleciona('.checkoutInfo--confirmButton').addEventListener('click', () => {

        let nomePessoa = seleciona('#checkout-nome').value
        let telefonePessoa = seleciona('#checkout-telefone').value
        let enderecoPessoa = seleciona('#checkout-endereco').value
        let numeroCasaPessoa = seleciona('#checkout-numero').value
        let bairroPessoa = seleciona('#checkout-bairro').value
        let complementoPessoa = seleciona('#checkout-complemento').value
        let formaPagamento = seleciona('#checkout-pagamento').value

        if (!nomePessoa || !telefonePessoa || !enderecoPessoa || !numeroCasaPessoa || !bairroPessoa) {
            alert('Atenção: Parece que você esqueceu de preencher algum campo obrigatório!')
            return
        }

        let pedido = capturarDadosDoPedido()

        let mensagem = `*NOVO PEDIDO - LA BELLA PIZZA*\n`
        mensagem += `━━━━━━━━━━━━━━━━━━━━\n\n`
        mensagem += `*ITENS DO PEDIDO:*\n\n`

        pedido.itens.forEach((item) => {
            if (item.isCombo) {
                mensagem += `• *${item.nome}* (${item.quantidade}x)\n`
                if (item.detalhes) {
                    mensagem += `  ↳ ${item.detalhes}\n`
                }
                mensagem += `  ↳ Valor: ${formatoReal(item.totalPizza)}`
                if (item.desconto > 0) {
                    mensagem += ` _(Economia: ${formatoReal(item.desconto)})_`
                }
                mensagem += `\n\n`
            } else {
                mensagem += `• *${item.nome}* (${item.tamanho}) - ${item.quantidade}x\n`
                if (item.brindeRefri) {
                    mensagem += `  ↳ *Acompanha Refrigerante 2L Grátis*\n`
                }
                mensagem += `  ↳ Valor: ${formatoReal(item.totalPizza)}`
                if (item.desconto > 0) {
                    mensagem += ` _(Desconto: -${formatoReal(item.desconto)})_`
                }
                mensagem += `\n\n`
            }
        })

        mensagem += `━━━━━━━━━━━━━━━━━━━━\n`
        mensagem += `*RESUMO FINANCEIRO:*\n`
        mensagem += `• *Subtotal:* ${formatoReal(pedido.subtotal)}\n`
        if (pedido.desconto > 0) {
            mensagem += `• *Desconto / Economia:* -${formatoReal(pedido.desconto)}\n`
        }
        mensagem += `• *TOTAL DO PEDIDO:* *${formatoReal(pedido.total)}*\n`
        mensagem += `━━━━━━━━━━━━━━━━━━━━\n\n`

        mensagem += `*DADOS PARA ENTREGA:*\n`
        mensagem += `• *Nome:* ${nomePessoa}\n`
        mensagem += `• *Telefone:* ${telefonePessoa}\n`
        mensagem += `• *Endereço:* ${enderecoPessoa}, Nº ${numeroCasaPessoa} - ${bairroPessoa}\n`
        if (complementoPessoa && complementoPessoa.trim() !== '') {
            mensagem += `• *Complemento:* ${complementoPessoa.trim()}\n`
        }
        mensagem += `• *Forma de Pagamento:* ${formaPagamento}\n`
        mensagem += `━━━━━━━━━━━━━━━━━━━━`

        let mensagemFinal = encodeURIComponent(mensagem)

        let url = `https://wa.me/5524999323962?text=${mensagemFinal}`

        window.open(url, '_blank')

        cart = []
        fecharCheckout()
        atualizarCarrinho()
    })

}

const enviarPedido = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        if (cart.length > 0) {
            abrirCheckout()
        }
    })
    configurarCheckout()
}

const limparCarrinho = () => {
    const btnLimpar = seleciona('.cart--limpar')
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            cart = []
            seleciona('.menu-openner span').innerHTML = 0
            atualizarCarrinho()
        })
    }
}

const pesquisar = () => {
    const searchBar = seleciona('.search-bar')
    const searchInput = seleciona('#search-input')
    const searchOpenner = seleciona('.search-openner')
    const searchCloser = seleciona('.search-closer')
    const navActions = seleciona('.nav-actions')

    searchOpenner.addEventListener('click', () => {
        searchBar.style.display = 'flex'
        navActions.classList.add('search-active')
        setTimeout(() => {
            searchBar.classList.add('show')
            searchInput.focus()
        }, 10)
    })

    searchInput.addEventListener('input', (e) => {
        termoAtual = e.target.value
        carregarPizzas(termoAtual)
    })

    searchCloser.addEventListener('click', () => {
        searchBar.classList.remove('show')
        navActions.classList.remove('search-active')
        searchInput.value = ''
        termoAtual = ''
        carregarPizzas()
        setTimeout(() => {
            searchBar.style.display = 'none'
        }, 400)
    })
}

const filtro = () => {
    let botoes = selecionaTodos('.category-button');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const isCurrentlyActive = botao.classList.contains('active');

            botoes.forEach(b => b.classList.remove('active'));

            if (isCurrentlyActive) {

                categoriaAtual = 'all';
                const btnTodos = [...botoes].find(b => b.getAttribute('data-filter') === 'all');

                if (btnTodos) btnTodos.classList.add('active');

            } else {

                botao.classList.add('active');
                categoriaAtual = botao.getAttribute('data-filter');
            }

            carregarPizzas();

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

const carregarPizzas = () => {
    let grid = seleciona('.cards-grid');

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger && grid.contains(st.trigger)) {
                st.kill();
            }
        });
    }

    grid.innerHTML = '';

    const { diaDaSemana, ehFeriadoOuVespera, tercaFeira, quartaFeira } = getPromocaoStatus();

    const promoSection = document.querySelector('.promocao');
    if (promoSection) {
        if (termoAtual !== '') {
            promoSection.style.display = 'none';
        } else {
            promoSection.style.display = '';
        }
    }

    let pizzasPromo = [];
    let pizzasNormais = [];

    const destacarOfertasDoDia = quartaFeira && categoriaAtual === 'all' && termoAtual === '';

    pizzaJson.forEach((item, originalIndex) => {
        let ehPromo = destacarOfertasDoDia && (pizzaPromoQuartaUm.includes(item.id) || pizzaPromoQuartaDois.includes(item.id));
        if (ehPromo) {
            pizzasPromo.push({ item, index: originalIndex });
        } else {
            pizzasNormais.push({ item, index: originalIndex });
        }
    });

    let ultimaCategoria = '';

    const desenharCard = ({ item, index }, ehPromoSection) => {
        const categoriaSlug = item.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

        let nomeBate = item.name.toLowerCase().includes(termoAtual.toLowerCase());
        let categoriaBate = categoriaAtual === 'all' || categoriaAtual === categoriaSlug;

        if (!nomeBate || !categoriaBate) {
            return;
        }

        let pizzaItem = seleciona('.models .card').cloneNode(true);
        pizzaItem.removeAttribute('data-st-active');
        pizzaItem.classList.add(categoriaSlug);

        if (!ehPromoSection) {
            if (item.category && item.category !== ultimaCategoria) {
                ultimaCategoria = item.category;

                let titulo = document.createElement('h2');
                titulo.classList.add('category-title');
                titulo.classList.add(categoriaSlug);
                titulo.innerHTML = ultimaCategoria;
                grid.append(titulo);
                if (window.animateTitle) window.animateTitle(titulo);
            }
        }

        const cores = ['card-red', 'card-white', 'card-green'];
        const cor = cores[index % 3];
        pizzaItem.classList.add(cor);

        if (cor === 'card-white') {
            const btn = pizzaItem.querySelector('.card-btn');
            if (btn) btn.classList.add('btn-outline');
        }

        grid.append(pizzaItem);
        if (window.observeCard) window.observeCard(pizzaItem);

        preencheDadosPizza(pizzaItem, item, index);

        if (ehPromoSection) {
            let precoBase = item.price[1] || item.price[0];
            if (pizzaPromoQuartaUm.includes(item.id)) {
                precoBase -= 10;
            } else if (pizzaPromoQuartaDois.includes(item.id)) {
                precoBase -= 11;
            }

            pizzaItem.querySelector(".card-price").innerHTML = `R$ ${precoBase.toFixed(2).replace('.', ',')}`;
        }

        pizzaItem.querySelector('.card-btn').addEventListener('click', (e) => {
            e.preventDefault();

            if (item.category === 'Combos' || item.comboId) {
                const comboObj = (typeof combosJson !== 'undefined')
                    ? combosJson.find(c => c.id === item.comboId || c.id === item.id) || item
                    : item;
                if (typeof abrirModalCombo === 'function') {
                    abrirModalCombo(comboObj);
                    botoesFechar();
                    return;
                }
            }

            let chave = pegarKey(e);
            abrirModal();
            preencherDadosModal(item);
            preencherTamanhos(chave);
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;
            escolherTamanho(chave);
            atualizaPreco();
        });

        botoesFechar();
    };

    if (tercaFeira && typeof combosJson !== 'undefined') {
        const combosTerca = combosJson.filter(c => c.category === 'PromocaoTerca');
        if (combosTerca.length > 0 && (categoriaAtual === 'all' || categoriaAtual === 'combos')) {
            let tituloTerca = document.createElement('h2');
            tituloTerca.classList.add('category-title');
            tituloTerca.innerHTML = "La Bella em Dobro";
            grid.append(tituloTerca);
            if (window.animateTitle) window.animateTitle(tituloTerca);

            combosTerca.forEach((combo, idx) => {
                let comboItem = seleciona('.models .card').cloneNode(true);
                comboItem.removeAttribute('data-st-active');
                const coresTerca = ['card-red', 'card-white', 'card-green'];
                const corTerca = coresTerca[idx % coresTerca.length];
                comboItem.classList.add('combos', corTerca);

                if (corTerca === 'card-white') {
                    const btnCard = comboItem.querySelector('.card-btn');
                    if (btnCard) btnCard.classList.add('btn-outline');
                }

                const comboImg = comboItem.querySelector(".card-pizza-img");
                comboImg.src = combo.img;
                comboImg.alt = combo.name;
                comboImg.loading = "lazy";
                comboImg.decoding = "async";
                comboImg.width = 200;
                comboImg.height = 135;
                comboItem.querySelector(".card-title").innerHTML = combo.name;
                comboItem.querySelector(".card-price").innerHTML = `R$ ${combo.price.toFixed(2).replace('.', ',')}`;

                const btn = comboItem.querySelector('.card-btn');
                btn.innerText = "Montar Promoção";
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof abrirModalCombo === 'function') {
                        abrirModalCombo(combo);
                        botoesFechar();
                    }
                });

                grid.append(comboItem);
                if (window.observeCard) window.observeCard(comboItem);
            });
        }
    }

    if (pizzasPromo.length > 0) {
        let temPromoPraMostrar = pizzasPromo.some(({ item }) => {
            const catSlug = item.category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            return item.name.toLowerCase().includes(termoAtual.toLowerCase()) &&
                (categoriaAtual === 'all' || categoriaAtual === catSlug);
        });

        if (temPromoPraMostrar) {
            let tituloPromo = document.createElement('h2');
            tituloPromo.classList.add('category-title', 'ofertas-do-dia');
            tituloPromo.innerHTML = "Ofertas do Dia";
            grid.append(tituloPromo);
            if (window.animateTitle) window.animateTitle(tituloPromo);

            pizzasPromo.forEach(obj => desenharCard(obj, true));
        }
    }

    pizzasNormais.forEach(obj => desenharCard(obj, false));

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}

const promocoes = () => {

}

const tratarParametrosURL = () => {
    const params = new URLSearchParams(window.location.search);

    const filtroParams = params.get('filter');
    if (filtroParams) {
        let categoriaSlug = `pizzas-${filtroParams}`;
        let botaoCorrespondente = [...selecionaTodos('.category-button')].find(b => b.getAttribute('data-filter') === categoriaSlug);

        if (botaoCorrespondente) {
            selecionaTodos('.category-button').forEach(b => b.classList.remove('active'));
            botaoCorrespondente.classList.add('active');
            categoriaAtual = categoriaSlug;

            carregarPizzas();
        }
    }

    const promoParams = params.get('promo');
    if (promoParams) {
        const status = typeof getPromocaoStatus === 'function' ? getPromocaoStatus() : {
            tercaFeira: new Date().getDay() === 2,
            quartaFeira: new Date().getDay() === 3
        };

        if (promoParams === 'terca' && status.tercaFeira) {
            let btnCombos = [...selecionaTodos('.category-button')].find(b => b.getAttribute('data-filter') === 'combos');
            if (btnCombos) {
                selecionaTodos('.category-button').forEach(b => b.classList.remove('active'));
                btnCombos.classList.add('active');
                categoriaAtual = 'combos';
                carregarPizzas();
                setTimeout(() => {
                    const alvo = seleciona('.cardapio');
                    if (alvo) alvo.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        } else if (promoParams === 'quarta' && status.quartaFeira) {
            let btnTodos = [...selecionaTodos('.category-button')].find(b => b.getAttribute('data-filter') === 'all');
            if (btnTodos) {
                selecionaTodos('.category-button').forEach(b => b.classList.remove('active'));
                btnTodos.classList.add('active');
                categoriaAtual = 'all';
                carregarPizzas();
                setTimeout(() => {
                    const alvo = seleciona('.ofertas-do-dia') || seleciona('.cardapio');
                    if (alvo) alvo.scrollIntoView({ behavior: 'smooth' });
                }, 200);
            }
        } else {
            setTimeout(() => {
                const alvo = seleciona('.cardapio');
                if (alvo) alvo.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        }
    }

    const modalParams = params.get('modal');
    if (modalParams) {

        let pizzaNomeBuscado = modalParams.replace(/-/g, ' ');
        const normalizeStr = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        pizzaNomeBuscado = normalizeStr(pizzaNomeBuscado);

        let indexAchado = pizzaJson.findIndex(item => {
            let nomeItem = normalizeStr(item.name);
            return nomeItem === pizzaNomeBuscado;
        });

        if (indexAchado > -1) {
            let item = pizzaJson[indexAchado];
            quantPizzas = 1;
            modalKey = indexAchado;

            abrirModal();
            preencherDadosModal(item);
            preencherTamanhos(indexAchado);
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas;
            escolherTamanho(indexAchado);
        }
    }
}

carregarPizzas()
filtro()
pesquisar()
abrirCarrinho()
mudarQuantidadeModal()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
enviarPedido()
limparCarrinho()
configurarPopupAvisoPromo()
tratarParametrosURL()
