/* ==========================================================================
   COMBOS.JS - LA BELLA PIZZA
   Módulo de Combos Dinâmicos, Detecção Automática e Promoções do Dia
   ========================================================================== */

// Variável de controle para testes rápidos de dias da semana
// 0 = Domingo, 1 = Segunda, 2 = Terça (La Bella em Dobro), 3 = Quarta (Promo Quarta), etc.
// Defina como null para usar o dia real do sistema.
window.TESTE_DIA_SEMANA = null;

const getDiaAtual = () => {
    if (window.TESTE_DIA_SEMANA !== null && window.TESTE_DIA_SEMANA !== undefined) {
        return window.TESTE_DIA_SEMANA;
    }
    return new Date().getDay();
};

/**
 * Retorna os combos ativos para o dia atual (Combos fixos + Promoções do dia)
 */
const obterCombosAtivos = () => {
    const dia = getDiaAtual();
    return combosJson.filter(combo => {
        if (combo.dayOfWeek !== undefined && combo.dayOfWeek !== null) {
            return combo.dayOfWeek === dia;
        }
        return true;
    });
};

/**
 * Retorna as pizzas de pizzaJson compatíveis com a regra do slot
 */
const obterPizzasParaRegra = (regraPizza) => {
    return pizzaJson.filter(item => {
        const categoriaValida = regraPizza.category.includes(item.category);
        const tamanhoValido = item.price && item.price[regraPizza.sizeIndex] !== undefined;
        return categoriaValida && tamanhoValido;
    });
};

/**
 * Retorna as bebidas de pizzaJson compatíveis com o tamanho exigido
 */
const obterBebidasParaRegra = (regraBebida) => {
    return pizzaJson.filter(item => {
        return item.category === 'Bebidas' && item.sizes && (item.sizes.includes(regraBebida.size) || item.sizes.length > 0);
    });
};

/**
 * Formata moeda BRL
 */
const formatarBRL = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// ==========================================================================
// MODAL DE SELEÇÃO E CUSTOMIZAÇÃO DE COMBO (Design Oficial La Bella Pizza)
// ==========================================================================
let comboAtualModal = null;

const abrirModalCombo = (combo) => {
    comboAtualModal = combo;
    const modalArea = document.querySelector('.comboWindowArea');
    const modalBody = document.querySelector('.comboWindowBody');

    if (!modalArea || !modalBody) return;

    // 1. Imagem do Combo à esquerda
    const comboImg = modalBody.querySelector('.comboBig img');
    if (comboImg) {
        comboImg.src = combo.img || 'assets/img/banner-promocao-combo-pizza.webp';
        comboImg.alt = combo.name;
    }

    // 2. Preenche cabeçalho do combo à direita
    const titleEl = modalBody.querySelector('.comboInfo h1');
    const descEl = modalBody.querySelector('.comboInfo--desc');
    const tagEl = modalBody.querySelector('.comboTag');

    if (titleEl) titleEl.innerText = combo.name;
    if (descEl) descEl.innerText = combo.description;
    if (tagEl) {
        tagEl.innerText = combo.category === 'PromocaoTerca' ? 'PROMOÇÃO DE TERÇA' : 'OFERTA ESPECIAL';
    }

    // 3. Renderiza os seletores dinâmicos de pizza e bebida
    const selectionsContainer = modalBody.querySelector('.comboSelections');
    selectionsContainer.innerHTML = '';

    // Slots de Pizzas
    if (combo.rules.pizzas && combo.rules.pizzas.length > 0) {
        combo.rules.pizzas.forEach((regraPizza, index) => {
            const pizzasDisponiveis = obterPizzasParaRegra(regraPizza);
            const slotDiv = document.createElement('div');
            slotDiv.className = 'combo-slot-group';

            let optionsHtml = '';
            pizzasDisponiveis.forEach(pizza => {
                const precoAvulso = pizza.price[regraPizza.sizeIndex];
                optionsHtml += `<option value="${pizza.id}" data-price="${precoAvulso}">${pizza.name} (${formatarBRL(precoAvulso)})</option>`;
            });

            slotDiv.innerHTML = `
                <div class="comboInfo--sector">${regraPizza.label || `Pizza ${index + 1}`}</div>
                <div class="combo-select-wrapper">
                    <select class="combo-select-pizza" data-slot-index="${index}" data-size="${regraPizza.size}" data-size-index="${regraPizza.sizeIndex}" data-size-name="${regraPizza.sizeName}">
                        ${optionsHtml}
                    </select>
                </div>
            `;
            selectionsContainer.appendChild(slotDiv);
        });
    }

    // Slots de Bebidas
    if (combo.rules.drinks && combo.rules.drinks.length > 0) {
        combo.rules.drinks.forEach((regraBebida, index) => {
            const bebidasDisponiveis = obterBebidasParaRegra(regraBebida);
            const slotDiv = document.createElement('div');
            slotDiv.className = 'combo-slot-group';

            let optionsHtml = '';
            bebidasDisponiveis.forEach(bebida => {
                const drinkSizeIndex = bebida.sizes.indexOf(regraBebida.size) >= 0 ? bebida.sizes.indexOf(regraBebida.size) : (regraBebida.sizeIndex !== undefined ? regraBebida.sizeIndex : 1);
                const precoBebida = bebida.price[drinkSizeIndex] || bebida.price[bebida.price.length - 1];
                optionsHtml += `<option value="${bebida.id}" data-price="${precoBebida}">${bebida.name} ${regraBebida.size} (${formatarBRL(precoBebida)})</option>`;
            });

            slotDiv.innerHTML = `
                <div class="comboInfo--sector">${regraBebida.label || `Bebida ${index + 1}`}</div>
                <div class="combo-select-wrapper">
                    <select class="combo-select-drink" data-slot-index="${index}" data-size="${regraBebida.size}">
                        ${optionsHtml}
                    </select>
                </div>
            `;
            selectionsContainer.appendChild(slotDiv);
        });
    }

    // Atualiza resumo financeiro
    atualizarResumoPrecoCombo();

    // Eventos de mudança nos selects
    selectionsContainer.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', atualizarResumoPrecoCombo);
    });

    // Exibe modal com animação suave GSAP
    modalArea.style.display = 'flex';
    gsap.to(modalArea, { opacity: 1, duration: 0.3 });
    gsap.fromTo(modalBody,
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" }
    );
};

const fecharModalCombo = () => {
    const modalArea = document.querySelector('.comboWindowArea');
    const modalBody = document.querySelector('.comboWindowBody');

    if (!modalArea || !modalBody) return;

    gsap.to(modalBody, { scale: 0.8, opacity: 0, duration: 0.25, ease: "power2.in" });
    gsap.to(modalArea, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            modalArea.style.display = 'none';
            comboAtualModal = null;
        }
    });
};

/**
 * Calcula a soma dos itens avulsos selecionados no modal de combo
 */
const calcularPrecoOriginalModal = () => {
    let precoOriginal = 0;
    const selects = document.querySelectorAll('.comboSelections select');
    selects.forEach(select => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
            precoOriginal += parseFloat(selectedOption.getAttribute('data-price')) || 0;
        }
    });
    return precoOriginal;
};

/**
 * Atualiza os valores 'De / Por / Economia' no modal
 */
const atualizarResumoPrecoCombo = () => {
    if (!comboAtualModal) return;

    const precoOriginal = calcularPrecoOriginalModal();
    const precoCombo = comboAtualModal.price;
    const economia = Math.max(0, precoOriginal - precoCombo);

    const originalPriceEl = document.querySelector('.comboOriginalPrice');
    const finalPriceEl = document.querySelector('.comboFinalPrice');
    const savingsEl = document.querySelector('.comboSavingsBadge');

    if (originalPriceEl) originalPriceEl.innerHTML = `De: <s>${formatarBRL(precoOriginal)}</s>`;
    if (finalPriceEl) finalPriceEl.innerHTML = formatarBRL(precoCombo);
    if (savingsEl) {
        savingsEl.innerHTML = `Economia de ${formatarBRL(economia)}`;
    }
};

/**
 * Adiciona o combo selecionado no modal ao carrinho
 */
const confirmarAdicaoCombo = () => {
    if (!comboAtualModal) return;

    const pizzasSelecionadas = [];
    const bebidasSelecionadas = [];

    // Coleta pizzas
    document.querySelectorAll('.combo-select-pizza').forEach(select => {
        const pizzaId = parseInt(select.value);
        const pizzaObj = pizzaJson.find(p => p.id === pizzaId);
        const selectedOption = select.options[select.selectedIndex];
        const preco = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        const size = select.getAttribute('data-size');
        const sizeName = select.getAttribute('data-size-name') || size;

        pizzasSelecionadas.push({
            id: pizzaId,
            name: pizzaObj ? pizzaObj.name : 'Pizza',
            size: size,
            sizeName: sizeName,
            price: preco
        });
    });

    // Coleta bebidas
    document.querySelectorAll('.combo-select-drink').forEach(select => {
        const drinkId = parseInt(select.value);
        const drinkObj = pizzaJson.find(d => d.id === drinkId);
        const selectedOption = select.options[select.selectedIndex];
        const preco = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        const size = select.getAttribute('data-size');

        bebidasSelecionadas.push({
            id: drinkId,
            name: drinkObj ? drinkObj.name : 'Bebida',
            size: size,
            price: preco
        });
    });

    const precoOriginal = calcularPrecoOriginalModal();
    const precoCombo = comboAtualModal.price;
    const desconto = Math.max(0, precoOriginal - precoCombo);

    const dynamicName = gerarNomeDinamicoCombo(comboAtualModal, pizzasSelecionadas, bebidasSelecionadas);

    const comboCartItem = {
        identificador: `combo_${comboAtualModal.id}_${Date.now()}`,
        isCombo: true,
        comboId: comboAtualModal.id,
        comboCode: comboAtualModal.code,
        name: comboAtualModal.name,
        dynamicName: dynamicName,
        img: comboAtualModal.img || 'assets/img/banner-promocao-combo-pizza.webp',
        price: precoCombo,
        originalPrice: precoOriginal,
        discount: desconto,
        pizzas: pizzasSelecionadas,
        drinks: bebidasSelecionadas,
        qt: 1
    };

    cart.push(comboCartItem);

    fecharModalCombo();
    
    // Abre explicitamente o carrinho na lateral
    const aside = document.querySelector('aside');
    if (aside) {
        aside.classList.add('show');
    }
    if (typeof abrirCarrinho === 'function') abrirCarrinho();
    if (typeof atualizarCarrinho === 'function') atualizarCarrinho();
};

/**
 * Gera dinamicamente o resumo de sabores do combo
 * Ex: "2x Grandes (Muçarela e Calabresa) + 1x Pepsi 2L"
 */
const gerarNomeDinamicoCombo = (combo, pizzas, drinks) => {
    let partes = [];

    // Agrupa pizzas
    if (pizzas && pizzas.length > 0) {
        const qtdPizzas = pizzas.length;
        const nomesSabores = pizzas.map(p => p.name).join(' e ');
        const tamanhoNome = pizzas[0].sizeName ? pizzas[0].sizeName.split(' ')[0] : 'Pizzas';
        partes.push(`${qtdPizzas}x ${tamanhoNome} (${nomesSabores})`);
    }

    // Agrupa bebidas
    if (drinks && drinks.length > 0) {
        drinks.forEach(d => {
            partes.push(`1x ${d.name} ${d.size}`);
        });
    }

    return partes.join(' + ');
};

// ==========================================================================
// DETECÇÃO AUTOMÁTICA DE COMBOS NO CARRINHO
// ==========================================================================
/**
 * Analisa os itens avulsos no carrinho e agrupa automaticamente em combo
 * caso satisfaçam os requisitos e gerem economia para o cliente.
 */
const detectarEAplicarCombos = (carrinhoAtual) => {
    let alterouCarrinho = false;
    const combosDisponiveis = obterCombosAtivos();

    // Loop para tentar aplicar combos enquanto houver correspondência
    let continuarVerificando = true;
    while (continuarVerificando) {
        continuarVerificando = false;

        // Separa itens avulsos por unidade (desmembrando qt > 1 em instâncias individuais)
        let itensAvulsos = [];
        carrinhoAtual.forEach((cartItem, cartIndex) => {
            if (!cartItem.isCombo && cartItem.qt > 0) {
                const pizzaItem = pizzaJson.find(p => p.id === cartItem.id);
                if (pizzaItem) {
                    for (let q = 0; q < cartItem.qt; q++) {
                        itensAvulsos.push({
                            cartIndex: cartIndex,
                            id: cartItem.id,
                            name: pizzaItem.name,
                            category: pizzaItem.category,
                            size: cartItem.size,
                            sizeIndex: cartItem.sizeIndex,
                            price: cartItem.price,
                            itemRef: cartItem
                        });
                    }
                }
            }
        });

        // Testa cada combo ativo
        for (let combo of combosDisponiveis) {
            const match = tentarCombinarItensParaCombo(combo, itensAvulsos);
            if (match) {
                const precoOriginalSoma = match.itensCasados.reduce((sum, it) => sum + it.price, 0);
                if (precoOriginalSoma >= combo.price) {
                    // Consome os itens avulsos do carrinho
                    match.itensCasados.forEach(itemCasado => {
                        itemCasado.itemRef.qt--;
                    });

                    // Remove itens do carrinho cuja quantidade zerou
                    for (let i = carrinhoAtual.length - 1; i >= 0; i--) {
                        if (!carrinhoAtual[i].isCombo && carrinhoAtual[i].qt <= 0) {
                            carrinhoAtual.splice(i, 1);
                        }
                    }

                    // Monta o novo item único de combo no carrinho
                    const dynamicName = gerarNomeDinamicoCombo(combo, match.pizzasCasadas, match.bebidasCasadas);
                    const comboCartItem = {
                        identificador: `combo_${combo.id}_${Date.now()}`,
                        isCombo: true,
                        comboId: combo.id,
                        comboCode: combo.code,
                        name: combo.name,
                        dynamicName: dynamicName,
                        img: combo.img || 'assets/img/banner-promocao-combo-pizza.webp',
                        price: combo.price,
                        originalPrice: precoOriginalSoma,
                        discount: Math.max(0, precoOriginalSoma - combo.price),
                        pizzas: match.pizzasCasadas,
                        drinks: match.bebidasCasadas,
                        qt: 1
                    };

                    carrinhoAtual.push(comboCartItem);
                    alterouCarrinho = true;
                    continuarVerificando = true; // Tenta casar novos combos restantes
                    break;
                }
            }
        }
    }

    return alterouCarrinho;
};

/**
 * Tenta encontrar no array de itens avulsos os produtos que satisfazem as regras do combo
 * Suporta correspondência flexível de tamanhos de pizzas e bebidas (por chave de tamanho e índice).
 */
const tentarCombinarItensParaCombo = (combo, itensAvulsos) => {
    let indicesUsados = new Set();
    let pizzasCasadas = [];
    let bebidasCasadas = [];
    let itensCasados = [];

    // 1. Tenta casar as pizzas
    for (let regraPizza of combo.rules.pizzas) {
        let pizzaEncontrada = null;
        for (let i = 0; i < itensAvulsos.length; i++) {
            if (indicesUsados.has(i)) continue;
            const item = itensAvulsos[i];
            const categoriaMatch = regraPizza.category.includes(item.category);
            
            // Compatibilidade inteligente de tamanho de pizza:
            // 'P' (Média 30cm, index 0), 'M' (Grande 35cm, index 1), 'G' (Super 40cm, index 2), 'Mx' (Max 45cm, index 3)
            const sizeMatch = (item.size === regraPizza.size) || 
                              (item.sizeIndex !== undefined && item.sizeIndex === regraPizza.sizeIndex);

            if (categoriaMatch && sizeMatch) {
                indicesUsados.add(i);
                pizzaEncontrada = item;
                pizzasCasadas.push({
                    id: item.id,
                    name: item.name,
                    size: item.size,
                    sizeName: regraPizza.sizeName || item.size,
                    price: item.price
                });
                itensCasados.push(item);
                break;
            }
        }
        if (!pizzaEncontrada) return null;
    }

    // 2. Tenta casar as bebidas
    if (combo.rules.drinks && combo.rules.drinks.length > 0) {
        for (let regraBebida of combo.rules.drinks) {
            let bebidaEncontrada = null;
            for (let i = 0; i < itensAvulsos.length; i++) {
                if (indicesUsados.has(i)) continue;
                const item = itensAvulsos[i];
                const ehBebida = (item.category === 'Bebidas');

                // Compatibilidade de refrigerante:
                // '2L' ou index 1 ou 'M' (segundo botão de tamanho do modal)
                const is2L = (regraBebida.size === '2L') && (item.size === '2L' || item.size === 'M' || item.sizeIndex === 1 || item.size === 'Grande 35 cm');
                const is600ml = (regraBebida.size === '600ml') && (item.size === '600ml' || item.size === 'P' || item.sizeIndex === 0 || item.size === 'Média 30 cm');
                const sizeMatch = is2L || is600ml || (item.size === regraBebida.size);

                if (ehBebida && sizeMatch) {
                    indicesUsados.add(i);
                    bebidaEncontrada = item;
                    bebidasCasadas.push({
                        id: item.id,
                        name: item.name,
                        size: regraBebida.size,
                        price: item.price
                    });
                    itensCasados.push(item);
                    break;
                }
            }
            if (!bebidaEncontrada) return null;
        }
    }

    return { pizzasCasadas, bebidasCasadas, itensCasados };
};

// Exporta para o escopo global
window.getDiaAtual = getDiaAtual;
window.obterCombosAtivos = obterCombosAtivos;
window.abrirModalCombo = abrirModalCombo;
window.fecharModalCombo = fecharModalCombo;
window.confirmarAdicaoCombo = confirmarAdicaoCombo;
window.detectarEAplicarCombos = detectarEAplicarCombos;
