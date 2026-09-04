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
    const ehFeriado = (typeof window.isFeriadoOuVespera === 'function') ? window.isFeriadoOuVespera() : false;
    return combosJson.filter(combo => {
        if (combo.dayOfWeek !== undefined && combo.dayOfWeek !== null) {
            if (ehFeriado) return false;
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
// SEARCHABLE DROPDOWNS PARA OS COMBOS
// ==========================================================================
const inicializarSearchableSelects = (container) => {
    const customSelects = container.querySelectorAll('.combo-searchable-select');

    customSelects.forEach(customSelect => {
        const trigger = customSelect.querySelector('.combo-select-trigger');
        const menu = customSelect.querySelector('.combo-dropdown-menu');
        const searchInput = customSelect.querySelector('.combo-search-input');
        const optionsList = customSelect.querySelector('.combo-options-list');
        const noResults = customSelect.querySelector('.combo-no-results');
        const nativeSelect = customSelect.querySelector('select');
        const selectedText = customSelect.querySelector('.combo-selected-text');

        // Abre / Fecha dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const estaAberto = customSelect.classList.contains('is-open');

            // Fecha outros dropdowns abertos
            document.querySelectorAll('.combo-searchable-select.is-open').forEach(s => {
                if (s !== customSelect) {
                    s.classList.remove('is-open');
                    const m = s.querySelector('.combo-dropdown-menu');
                    if (m) m.style.display = 'none';
                }
            });

            if (estaAberto) {
                customSelect.classList.remove('is-open');
                menu.style.display = 'none';
            } else {
                customSelect.classList.add('is-open');
                menu.style.display = 'flex';
                searchInput.value = '';
                optionsList.querySelectorAll('.combo-option-item').forEach(opt => {
                    opt.style.display = 'flex';
                });
                if (noResults) noResults.style.display = 'none';
                setTimeout(() => searchInput.focus(), 50);
            }
        });

        // Filtragem ao digitar no campo de busca
        searchInput.addEventListener('input', (e) => {
            e.stopPropagation();
            const termo = searchInput.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
            const items = optionsList.querySelectorAll('.combo-option-item');
            let visiveis = 0;

            items.forEach(item => {
                const searchTarget = (item.getAttribute('data-search') || item.innerText).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (termo === '' || searchTarget.includes(termo)) {
                    item.style.display = 'flex';
                    visiveis++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (noResults) {
                noResults.style.display = visiveis === 0 ? 'block' : 'none';
            }
        });

        // Previne fechamento ao clicar dentro do input de busca
        searchInput.addEventListener('click', (e) => e.stopPropagation());

        // Clique em opção
        optionsList.querySelectorAll('.combo-option-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const valor = item.getAttribute('data-value');
                const nome = item.querySelector('.option-name').innerText;
                const preco = item.querySelector('.option-price').innerText;

                // Atualiza select nativo
                nativeSelect.value = valor;
                nativeSelect.dispatchEvent(new Event('change'));

                // Atualiza texto visível
                selectedText.innerText = `${nome} (${preco})`;
                optionsList.querySelectorAll('.combo-option-item').forEach(opt => opt.classList.remove('selected'));
                item.classList.add('selected');

                // Fecha menu
                customSelect.classList.remove('is-open');
                menu.style.display = 'none';
            });
        });
    });
};

// Fecha dropdowns ao clicar fora
if (!window.comboDropdownListenerAdded) {
    document.addEventListener('click', () => {
        document.querySelectorAll('.combo-searchable-select.is-open').forEach(s => {
            s.classList.remove('is-open');
            const m = s.querySelector('.combo-dropdown-menu');
            if (m) m.style.display = 'none';
        });
    });
    window.comboDropdownListenerAdded = true;
}

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
            let customItemsHtml = '';
            let defaultText = '';

            pizzasDisponiveis.forEach((pizza, pIdx) => {
                const precoAvulso = pizza.price[regraPizza.sizeIndex];
                const itemFormatado = `${pizza.name} (${formatarBRL(precoAvulso)})`;
                if (pIdx === 0) defaultText = itemFormatado;
                const isSelected = pIdx === 0 ? 'selected' : '';
                optionsHtml += `<option value="${pizza.id}" data-price="${precoAvulso}">${itemFormatado}</option>`;

                const searchClean = (pizza.name + ' ' + (pizza.description || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                customItemsHtml += `
                    <div class="combo-option-item ${isSelected}" data-value="${pizza.id}" data-price="${precoAvulso}" data-search="${searchClean}">
                        <span class="option-name">${pizza.name}</span>
                        <span class="option-price">${formatarBRL(precoAvulso)}</span>
                    </div>
                `;
            });

            slotDiv.innerHTML = `
                <div class="comboInfo--sector">${regraPizza.label || `Pizza ${index + 1}`}</div>
                <div class="combo-select-wrapper">
                    <div class="combo-searchable-select" data-slot-index="${index}">
                        <div class="combo-select-trigger" tabindex="0">
                            <span class="combo-selected-text">${defaultText}</span>
                            <span class="combo-select-arrow">&#9662;</span>
                        </div>
                        <div class="combo-dropdown-menu" style="display: none;">
                            <div class="combo-search-box">
                                <input type="text" class="combo-search-input" placeholder="Buscar sabor (ex: calabresa, frango)..." autocomplete="off" />
                            </div>
                            <div class="combo-options-list">
                                ${customItemsHtml}
                            </div>
                            <div class="combo-no-results" style="display: none;">Nenhum sabor encontrado</div>
                        </div>
                        <select class="combo-select-pizza" style="display: none;" data-slot-index="${index}" data-size="${regraPizza.size}" data-size-index="${regraPizza.sizeIndex}" data-size-name="${regraPizza.sizeName}">
                            ${optionsHtml}
                        </select>
                    </div>
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
            let customItemsHtml = '';
            let defaultText = '';

            bebidasDisponiveis.forEach((bebida, bIdx) => {
                const drinkSizeIndex = bebida.sizes.indexOf(regraBebida.size) >= 0 ? bebida.sizes.indexOf(regraBebida.size) : (regraBebida.sizeIndex !== undefined ? regraBebida.sizeIndex : 1);
                const precoBebida = bebida.price[drinkSizeIndex] || bebida.price[bebida.price.length - 1];
                const itemFormatado = `${bebida.name} ${regraBebida.size} (${formatarBRL(precoBebida)})`;
                if (bIdx === 0) defaultText = itemFormatado;
                const isSelected = bIdx === 0 ? 'selected' : '';
                optionsHtml += `<option value="${bebida.id}" data-price="${precoBebida}">${itemFormatado}</option>`;

                const searchClean = (bebida.name + ' ' + regraBebida.size).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                customItemsHtml += `
                    <div class="combo-option-item ${isSelected}" data-value="${bebida.id}" data-price="${precoBebida}" data-search="${searchClean}">
                        <span class="option-name">${bebida.name} ${regraBebida.size}</span>
                        <span class="option-price">${formatarBRL(precoBebida)}</span>
                    </div>
                `;
            });

            slotDiv.innerHTML = `
                <div class="comboInfo--sector">${regraBebida.label || `Bebida ${index + 1}`}</div>
                <div class="combo-select-wrapper">
                    <div class="combo-searchable-select" data-slot-index="${index}">
                        <div class="combo-select-trigger" tabindex="0">
                            <span class="combo-selected-text">${defaultText}</span>
                            <span class="combo-select-arrow">&#9662;</span>
                        </div>
                        <div class="combo-dropdown-menu" style="display: none;">
                            <div class="combo-search-box">
                                <input type="text" class="combo-search-input" placeholder="Buscar bebida (ex: coca, guaraná)..." autocomplete="off" />
                            </div>
                            <div class="combo-options-list">
                                ${customItemsHtml}
                            </div>
                            <div class="combo-no-results" style="display: none;">Nenhuma bebida encontrada</div>
                        </div>
                        <select class="combo-select-drink" style="display: none;" data-slot-index="${index}" data-size="${regraBebida.size}">
                            ${optionsHtml}
                        </select>
                    </div>
                </div>
            `;
            selectionsContainer.appendChild(slotDiv);
        });
    }

    // Inicializa lógica interativa dos Searchable Selects
    inicializarSearchableSelects(selectionsContainer);

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

    if (typeof window.pushModalState === 'function') {
        window.pushModalState('combo');
    }
};

const fecharModalCombo = (syncHistory = true) => {
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

    if (syncHistory && typeof window.popModalState === 'function') {
        window.popModalState('combo');
    }
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

    fecharModalCombo(false);
    
    // Abre explicitamente o carrinho na lateral
    if (typeof mostrarCarrinho === 'function') {
        mostrarCarrinho();
    } else {
        const aside = document.querySelector('aside');
        if (aside) aside.classList.add('show');
    }
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
            // 'M' (Média 30cm, index 0), 'G' (Grande 35cm, index 1), 'S' (Super 40cm, index 2), 'MX' (Max 45cm, index 3)
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
                // '2L' ou index 1 ou 'G'/'M' (botão de tamanho correspondente)
                const is2L = (regraBebida.size === '2L') && (item.size === '2L' || item.size === 'G' || item.size === 'M' || item.sizeIndex === 1 || item.size === 'Grande 35 cm');
                const is600ml = (regraBebida.size === '600ml') && (item.size === '600ml' || item.size === 'M' || item.size === 'P' || item.sizeIndex === 0 || item.size === 'Média 30 cm');
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
