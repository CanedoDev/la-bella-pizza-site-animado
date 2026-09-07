window.TESTE_DIA_SEMANA = null;

const getDiaAtual = () => {
    if (window.TESTE_DIA_SEMANA !== null && window.TESTE_DIA_SEMANA !== undefined) {
        return window.TESTE_DIA_SEMANA;
    }
    return new Date().getDay();
};

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

const obterPizzasParaRegra = (regraPizza) => {
    return pizzaJson.filter(item => {
        const categoriaValida = regraPizza.category.includes(item.category);
        const tamanhoValido = item.price && item.price[regraPizza.sizeIndex] !== undefined;
        return categoriaValida && tamanhoValido;
    });
};

const obterBebidasParaRegra = (regraBebida) => {
    return pizzaJson.filter(item => {
        return item.category === 'Bebidas' && item.sizes && (item.sizes.includes(regraBebida.size) || item.sizes.length > 0);
    });
};

const formatarBRL = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

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

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const estaAberto = customSelect.classList.contains('is-open');

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

        searchInput.addEventListener('click', (e) => e.stopPropagation());

        optionsList.querySelectorAll('.combo-option-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const valor = item.getAttribute('data-value');
                const nome = item.querySelector('.option-name').innerText;
                const preco = item.querySelector('.option-price').innerText;

                nativeSelect.value = valor;
                nativeSelect.dispatchEvent(new Event('change'));

                selectedText.innerText = `${nome} (${preco})`;
                optionsList.querySelectorAll('.combo-option-item').forEach(opt => opt.classList.remove('selected'));
                item.classList.add('selected');

                customSelect.classList.remove('is-open');
                menu.style.display = 'none';
            });
        });
    });
};

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

let comboAtualModal = null;

const abrirModalCombo = (combo) => {
    comboAtualModal = combo;
    const modalArea = document.querySelector('.comboWindowArea');
    const modalBody = document.querySelector('.comboWindowBody');

    if (!modalArea || !modalBody) return;

    const comboImg = modalBody.querySelector('.comboBig img');
    if (comboImg) {
        comboImg.src = combo.img || 'assets/img/banner-promocao-combo-pizza.webp';
        comboImg.alt = combo.name;
    }

    const titleEl = modalBody.querySelector('.comboInfo h1');
    const descEl = modalBody.querySelector('.comboInfo--desc');
    const tagEl = modalBody.querySelector('.comboTag');

    if (titleEl) titleEl.innerText = combo.name;
    if (descEl) descEl.innerText = combo.description;
    if (tagEl) {
        tagEl.innerText = combo.category === 'PromocaoTerca' ? 'PROMOÇÃO DE TERÇA' : 'OFERTA ESPECIAL';
    }

    const selectionsContainer = modalBody.querySelector('.comboSelections');
    selectionsContainer.innerHTML = '';

    if (combo.rules.pizzas && combo.rules.pizzas.length > 0) {
        combo.rules.pizzas.forEach((regraPizza, index) => {
            const pizzasDisponiveis = obterPizzasParaRegra(regraPizza);
            const pizzaPadrao = pizzasDisponiveis[0] || (pizzaJson && pizzaJson[0]);
            const precoAvulso = (pizzaPadrao && pizzaPadrao.price && pizzaPadrao.price[regraPizza.sizeIndex] !== undefined)
                ? pizzaPadrao.price[regraPizza.sizeIndex]
                : (pizzaPadrao ? pizzaPadrao.price[pizzaPadrao.price.length - 1] : 0);

            const slotDiv = document.createElement('div');
            slotDiv.className = 'combo-slot-group';

            let optionsHtml = '';
            pizzasDisponiveis.forEach((pizza) => {
                const precoP = (pizza.price && pizza.price[regraPizza.sizeIndex] !== undefined)
                    ? pizza.price[regraPizza.sizeIndex]
                    : pizza.price[pizza.price.length - 1];
                optionsHtml += `<option value="${pizza.id}" data-price="${precoP}">${pizza.name}</option>`;
            });

            const labelTitle = regraPizza.label || `Pizza ${index + 1}`;

            slotDiv.innerHTML = `
                <div class="comboInfo--sector">${labelTitle}</div>
                <div class="combo-flavor-slot" data-slot-index="${index}" tabindex="0" role="button" aria-label="Escolher sabor para ${labelTitle}">
                    <div class="combo-flavor-slot-left">
                        <img src="${pizzaPadrao ? pizzaPadrao.img : 'assets/img/pizzas/pizza-calabresa.webp'}" alt="${pizzaPadrao ? pizzaPadrao.name : 'Pizza'}" class="combo-flavor-slot-img" />
                        <div class="combo-flavor-slot-details">
                            <h4 class="combo-flavor-slot-name">${pizzaPadrao ? pizzaPadrao.name : 'Escolher Sabor'}</h4>
                            <span class="combo-flavor-slot-size">${regraPizza.sizeName || regraPizza.size || ''} (${formatarBRL(precoAvulso)})</span>
                        </div>
                    </div>
                    <span class="combo-flavor-slot-btn">Alterar</span>
                </div>
                <select class="combo-select-pizza" style="display: none;" data-slot-index="${index}" data-size="${regraPizza.size}" data-size-index="${regraPizza.sizeIndex}" data-size-name="${regraPizza.sizeName}">
                    ${optionsHtml}
                </select>
            `;

            const formatarTituloModalSabor = (regra, idx, totalPizzas) => {
                const cats = regra.category || [];
                const ehApenasDoce = cats.length === 1 && cats[0] === 'Pizzas Doces';
                const ehSalgada = cats.length > 0 && !cats.includes('Pizzas Doces');

                if (ehApenasDoce) return "Escolha a Doce";
                if (ehSalgada) {
                    return totalPizzas > 1 ? `Escolha a ${idx + 1}ª Salgada` : "Escolha a Salgada";
                }

                const labelLower = (regra.label || '').toLowerCase();
                if (labelLower.includes('doce')) return "Escolha a Doce";
                if (labelLower.includes('salgada')) {
                    return totalPizzas > 1 ? `Escolha a ${idx + 1}ª Salgada` : "Escolha a Salgada";
                }

                return totalPizzas > 1 ? `Escolha a ${idx + 1}ª Pizza` : "Escolha a Pizza";
            };

            slotDiv.querySelector('.combo-flavor-slot').addEventListener('click', () => {
                const selectPizza = slotDiv.querySelector('.combo-select-pizza');
                const atualId = parseInt(selectPizza.value);
                if (typeof window.abrirSeletorSaboresUnico === 'function') {
                    window.abrirSeletorSaboresUnico({
                        title: formatarTituloModalSabor(regraPizza, index, combo.rules.pizzas.length),
                        stepText: `Pizza ${index + 1}`,
                        subtitle: "Toque no sabor para selecionar",
                        allowedCategories: regraPizza.category || [],
                        sizeIndex: regraPizza.sizeIndex,
                        selectedId: atualId,
                        onSelect: (novaPizza) => {
                            selectPizza.value = novaPizza.id;
                            selectPizza.dispatchEvent(new Event('change'));
                            const novoPreco = (novaPizza.price && novaPizza.price[regraPizza.sizeIndex] !== undefined)
                                ? novaPizza.price[regraPizza.sizeIndex]
                                : novaPizza.price[novaPizza.price.length - 1];

                            slotDiv.querySelector('.combo-flavor-slot-img').src = novaPizza.img;
                            slotDiv.querySelector('.combo-flavor-slot-name').innerText = novaPizza.name;
                            slotDiv.querySelector('.combo-flavor-slot-size').innerText = `${regraPizza.sizeName || regraPizza.size} (${formatarBRL(novoPreco)})`;
                            atualizarResumoPrecoCombo();
                        }
                    });
                }
            });

            selectionsContainer.appendChild(slotDiv);
        });

        if (combo.rules.pizzas.length > 1) {
            const btnEscolherTodos = document.createElement('button');
            btnEscolherTodos.type = 'button';
            btnEscolherTodos.className = 'meio-choose-all-btn';
            btnEscolherTodos.innerText = 'Escolher os Sabores do Combo';
            btnEscolherTodos.style.marginTop = '4px';
            btnEscolherTodos.style.marginBottom = '8px';
            btnEscolherTodos.addEventListener('click', () => {
                const formatarTituloStep = (regra, idx, totalPizzas) => {
                    const cats = regra.category || [];
                    const ehApenasDoce = cats.length === 1 && cats[0] === 'Pizzas Doces';
                    const ehSalgada = cats.length > 0 && !cats.includes('Pizzas Doces');

                    if (ehApenasDoce) return "Escolha a Doce";
                    if (ehSalgada) {
                        return totalPizzas > 1 ? `Escolha a ${idx + 1}ª Salgada` : "Escolha a Salgada";
                    }

                    const labelLower = (regra.label || '').toLowerCase();
                    if (labelLower.includes('doce')) return "Escolha a Doce";
                    if (labelLower.includes('salgada')) {
                        return totalPizzas > 1 ? `Escolha a ${idx + 1}ª Salgada` : "Escolha a Salgada";
                    }

                    return `Escolha a ${idx + 1}ª Pizza`;
                };

                const stepsConfig = combo.rules.pizzas.map((regra, pIdx) => {
                    const selectEl = selectionsContainer.querySelectorAll('.combo-select-pizza')[pIdx];
                    return {
                        title: formatarTituloStep(regra, pIdx, combo.rules.pizzas.length),
                        stepText: `Passo ${pIdx + 1} de ${combo.rules.pizzas.length}`,
                        subtitle: `Tamanho: ${regra.sizeName || regra.size}`,
                        allowedCategories: regra.category || [],
                        sizeIndex: regra.sizeIndex,
                        selectedId: selectEl ? parseInt(selectEl.value) : null
                    };
                });

                if (typeof window.iniciarFluxoSelecaoSabores === 'function') {
                    window.iniciarFluxoSelecaoSabores({
                        steps: stepsConfig,
                        onComplete: (saboresEscolhidos) => {
                            saboresEscolhidos.forEach((novaPizza, pIdx) => {
                                const selectEl = selectionsContainer.querySelectorAll('.combo-select-pizza')[pIdx];
                                const slotEl = selectionsContainer.querySelectorAll('.combo-flavor-slot')[pIdx];
                                if (selectEl && novaPizza) {
                                    selectEl.value = novaPizza.id;
                                    selectEl.dispatchEvent(new Event('change'));
                                    const regra = combo.rules.pizzas[pIdx];
                                    const novoPreco = (novaPizza.price && novaPizza.price[regra.sizeIndex] !== undefined)
                                        ? novaPizza.price[regra.sizeIndex]
                                        : novaPizza.price[novaPizza.price.length - 1];

                                    if (slotEl) {
                                        slotEl.querySelector('.combo-flavor-slot-img').src = novaPizza.img;
                                        slotEl.querySelector('.combo-flavor-slot-name').innerText = novaPizza.name;
                                        slotEl.querySelector('.combo-flavor-slot-size').innerText = `${regra.sizeName || regra.size} (${formatarBRL(novoPreco)})`;
                                    }
                                }
                            });
                            atualizarResumoPrecoCombo();
                        }
                    });
                }
            });
            selectionsContainer.appendChild(btnEscolherTodos);
        }
    }

    if (combo.rules.drinks && combo.rules.drinks.length > 0) {
        combo.rules.drinks.forEach((regraBebida, index) => {
            const bebidasDisponiveis = obterBebidasParaRegra(regraBebida);
            const slotDiv = document.createElement('div');
            slotDiv.className = 'combo-slot-group';

            let optionsHtml = '';
            bebidasDisponiveis.forEach((bebida, bIdx) => {
                const drinkSizeIndex = bebida.sizes.indexOf(regraBebida.size) >= 0 ? bebida.sizes.indexOf(regraBebida.size) : (regraBebida.sizeIndex !== undefined ? regraBebida.sizeIndex : 1);
                const precoBebida = bebida.price[drinkSizeIndex] || bebida.price[bebida.price.length - 1];
                const itemFormatado = `${bebida.name} ${regraBebida.size} (${formatarBRL(precoBebida)})`;
                const isSelected = bIdx === 0 ? 'selected' : '';
                optionsHtml += `<option value="${bebida.id}" data-price="${precoBebida}" ${isSelected}>${itemFormatado}</option>`;
            });

            slotDiv.innerHTML = `
                <div class="comboInfo--sector">${regraBebida.label || `Bebida ${index + 1}`}</div>
                <div class="bonus-select-wrap">
                    <select class="combo-select-drink pizzaInfo--refriSelect" style="display: block; width: 100%;" data-slot-index="${index}" data-size="${regraBebida.size}">
                        ${optionsHtml}
                    </select>
                </div>
            `;
            selectionsContainer.appendChild(slotDiv);
        });
    }

    atualizarResumoPrecoCombo();

    selectionsContainer.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', atualizarResumoPrecoCombo);
    });

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

const confirmarAdicaoCombo = () => {
    if (!comboAtualModal) return;

    const pizzasSelecionadas = [];
    const bebidasSelecionadas = [];

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

    if (typeof mostrarCarrinho === 'function') {
        mostrarCarrinho();
    } else {
        const aside = document.querySelector('aside');
        if (aside) aside.classList.add('show');
    }
    if (typeof atualizarCarrinho === 'function') atualizarCarrinho();
};

const gerarNomeDinamicoCombo = (combo, pizzas, drinks) => {
    let partes = [];

    if (pizzas && pizzas.length > 0) {
        const qtdPizzas = pizzas.length;
        const nomesSabores = pizzas.map(p => p.name).join(' e ');
        const tamanhoNome = pizzas[0].sizeName ? pizzas[0].sizeName.split(' ')[0] : 'Pizzas';
        partes.push(`${qtdPizzas}x ${tamanhoNome} (${nomesSabores})`);
    }

    if (drinks && drinks.length > 0) {
        drinks.forEach(d => {
            partes.push(`1x ${d.name} ${d.size}`);
        });
    }

    return partes.join(' + ');
};

const detectarEAplicarCombos = (carrinhoAtual) => {
    let alterouCarrinho = false;
    const combosDisponiveis = obterCombosAtivos();

    let continuarVerificando = true;
    while (continuarVerificando) {
        continuarVerificando = false;

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

        for (let combo of combosDisponiveis) {
            const match = tentarCombinarItensParaCombo(combo, itensAvulsos);
            if (match) {
                const precoOriginalSoma = match.itensCasados.reduce((sum, it) => sum + it.price, 0);
                if (precoOriginalSoma >= combo.price) {

                    match.itensCasados.forEach(itemCasado => {
                        itemCasado.itemRef.qt--;
                    });

                    for (let i = carrinhoAtual.length - 1; i >= 0; i--) {
                        if (!carrinhoAtual[i].isCombo && carrinhoAtual[i].qt <= 0) {
                            carrinhoAtual.splice(i, 1);
                        }
                    }

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
                    continuarVerificando = true;
                    break;
                }
            }
        }
    }

    return alterouCarrinho;
};

const tentarCombinarItensParaCombo = (combo, itensAvulsos) => {
    let indicesUsados = new Set();
    let pizzasCasadas = [];
    let bebidasCasadas = [];
    let itensCasados = [];

    for (let regraPizza of combo.rules.pizzas) {
        let pizzaEncontrada = null;
        for (let i = 0; i < itensAvulsos.length; i++) {
            if (indicesUsados.has(i)) continue;
            const item = itensAvulsos[i];
            const categoriaMatch = regraPizza.category.includes(item.category);

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

    if (combo.rules.drinks && combo.rules.drinks.length > 0) {
        for (let regraBebida of combo.rules.drinks) {
            let bebidaEncontrada = null;
            for (let i = 0; i < itensAvulsos.length; i++) {
                if (indicesUsados.has(i)) continue;
                const item = itensAvulsos[i];
                const ehBebida = (item.category === 'Bebidas');

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

window.getDiaAtual = getDiaAtual;
window.obterCombosAtivos = obterCombosAtivos;
window.abrirModalCombo = abrirModalCombo;
window.fecharModalCombo = fecharModalCombo;
window.confirmarAdicaoCombo = confirmarAdicaoCombo;
window.detectarEAplicarCombos = detectarEAplicarCombos;
