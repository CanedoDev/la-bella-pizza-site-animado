// ==========================================================================
// CARDÁPIO DE PRODUTOS - LA BELLA PIZZA
// ==========================================================================

let pizzaJson = [
    // --- PIZZAS TRADICIONAIS (1 a 24 + Brasileira) ---
    {
        id: 1,
        category: 'Pizzas Tradicionais',
        name: 'Muçarela',
        img: 'pizzas/pizza-mussarela.webp',
        price: [54.90, 64.90, 76.90, 86.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'O clássico perfeito: generosa camada de muçarela derretida no ponto ideal sobre molho de tomate italiano artesanal e orégano aromático.'
    },
    {
        id: 2,
        category: 'Pizzas Tradicionais',
        name: 'Atum',
        img: 'pizzas/pizza-atum.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor marcante e equilibrado: atum nobre desfiado, azeitonas pretas selecionadas e fatias suaves de cebola fresca.'
    },
    {
        id: 3,
        category: 'Pizzas Tradicionais',
        name: 'Alho Torrado',
        img: 'pizzas/pizza-alho-torrado.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Para os amantes de sabor intenso: lâminas douradas e crocantes de alho torrado sobre muçarela derretida e molho de tomate.'
    },
    {
        id: 4,
        category: 'Pizzas Tradicionais',
        name: 'Calabresa',
        img: 'pizzas/pizza-calabresa.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'A queridinha da casa: fatias artesanais de calabresa defumada douradas no forno a lenha sobre queijo muçarela e molho especial.'
    },
    {
        id: 5,
        category: 'Pizzas Tradicionais',
        name: 'Margherita',
        img: 'pizzas/pizza-margherita.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'A autêntica tradição italiana: fatias de tomate fresco suculento, burrata cremosa e folhas frescas de manjericão colhidas no dia.'
    },
    {
        id: 6,
        category: 'Pizzas Tradicionais',
        name: 'Presunto',
        img: 'pizzas/pizza-de-presunto.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Suave e saborosa: fatias selecionadas de presunto cozido de primeira qualidade sobre muçarela derretida e orégano.'
    },
    {
        id: 7,
        category: 'Pizzas Tradicionais',
        name: 'Três Queijos',
        img: 'pizzas/pizza-3-queijos.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Harmonia cremosa irresistível: combinação perfeita de muçarela nobre, autêntico requeijão cremoso e parmesão ralado na hora.'
    },
    {
        id: 8,
        category: 'Pizzas Tradicionais',
        name: 'Americana',
        img: 'pizzas/pizza-presunto-c-ovos.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Combinação robusta e saborosa: cubos de bacon torrado crocante, ovos cozidos picados e rodelas de cebola sobre muçarela.'
    },
    {
        id: 9,
        category: 'Pizzas Tradicionais',
        name: 'Alho e Parmesão',
        img: 'pizzas/pizza-alho-e-parmesao.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Aroma e crocância incomparáveis: fatias de tomate fresco, alho dourado torrado, parmesão gratinado e fio de azeite extravirgem.'
    },
    {
        id: 10,
        category: 'Pizzas Tradicionais',
        name: 'Bacon',
        img: 'pizzas/pizza-3-porquinhos.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor defumado inconfundível: bacon crocante premium, anéis de cebola e um toque especial de alho torrado sobre muçarela.'
    },
    {
        id: 11,
        category: 'Pizzas Tradicionais',
        name: 'Baiana',
        img: 'pizzas/pizza-calabresa.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Toque picante na medida certa: calabresa picante moída, ovos cozidos, pimenta biquinho aromática e rodelas de cebola.'
    },
    {
        id: 12,
        category: 'Pizzas Tradicionais',
        name: 'Calabresa c/ Cebola',
        img: 'pizzas/pizza-calabresa-c-cebola.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'O clássico que nunca erra: fatias douradas de calabresa artesanal cobertas com anéis de cebola fresca e orégano aromático.'
    },
    {
        id: 13,
        category: 'Pizzas Tradicionais',
        name: 'Calabresa c/ Catupiry',
        img: 'pizzas/pizza-calabresa-c-catupiry.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Dupla perfeita: calabresa defumada fatiada combinada com a cremosidade inconfundível do legítimo requeijão cremoso.'
    },
    {
        id: 14,
        category: 'Pizzas Tradicionais',
        name: 'Frango c/ Catupiry',
        img: 'pizzas/pizza-frango-catupiry.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'A campeã absoluta de pedidos: peito de frango desfiado suculento e bem temperado, coberto com autêntico requeijão cremoso.'
    },
    {
        id: 15,
        category: 'Pizzas Tradicionais',
        name: 'Fiorentina',
        img: 'pizzas/pizza-fiorentina.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Elegante e suave: presunto cozido fatiado de alta qualidade, cogumelos champignon frescos e azeitonas pretas selecionadas.'
    },
    {
        id: 16,
        category: 'Pizzas Tradicionais',
        name: 'La Bella',
        img: 'pizzas/pizza-la-bella.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'A receita exclusiva da casa: tomates maduros, folhas frescas de manjericão, queijo parmesão gratinado e alho frito crocante.'
    },
    {
        id: 17,
        category: 'Pizzas Tradicionais',
        name: 'Presunto c/ Catupiry',
        img: 'pizzas/pizza-presunto-c-catupiry.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Textura macia e sabor aconchegante: presunto de primeira linha fatiado com generosa camada de requeijão cremoso.'
    },
    {
        id: 18,
        category: 'Pizzas Tradicionais',
        name: 'Presunto c/ Champignon',
        img: 'pizzas/pizza-presunto-c-champignon.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Equilíbrio sofisticado: presunto cozido especial harmonizado com lâminas de cogumelos champignon frescos sobre muçarela.'
    },
    {
        id: 19,
        category: 'Pizzas Tradicionais',
        name: '3 Porquinhos',
        img: 'pizzas/pizza-3-porquinhos.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'A favorita dos apaixonados por carne: trio irresistível de calabresa artesanal, presunto nobre e cubos de bacon bem crocantes.'
    },
    {
        id: 20,
        category: 'Pizzas Tradicionais',
        name: 'Portuguesa',
        img: 'pizzas/pizza-portuguesa.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Rica em tradição e sabor: presunto, fatias de calabresa, pimentão fresco, azeitonas pretas, ovos cozidos e cebola fatiada.'
    },
    {
        id: 21,
        category: 'Pizzas Tradicionais',
        name: 'Quatro Queijos',
        img: 'pizzas/pizza-4-queijos.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Explosão de sabor e cremosidade: fusão equilibrada de muçarela, gorgonzola encorpado, requeijão cremoso e parmesão ralado.'
    },
    {
        id: 22,
        category: 'Pizzas Tradicionais',
        name: 'Romanesca',
        img: 'pizzas/pizza-romanesca.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Receita nobre e encorpada: presunto fatiado, champignon fresco, bacon crocante e autêntico requeijão cremoso.'
    },
    {
        id: 23,
        category: 'Pizzas Tradicionais',
        name: 'Salaminho d\'Itália',
        img: 'pizzas/pizza-salaminho-italiano.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor refinado italiano: finas fatias de salaminho italiano curado com anéis suaves de cebola sobre base de muçarela.'
    },
    {
        id: 24,
        category: 'Pizzas Tradicionais',
        name: 'Siciliana',
        img: 'pizzas/pizza-siciliana.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Tradição rústica do sul da Itália: calabresa fatiada, lâminas de champignon fresco e toque especial de alho aromático.'
    },
    {
        id: 2401,
        category: 'Pizzas Tradicionais',
        name: 'Brasileira',
        img: 'pizzas/pizza-brasileira.webp',
        price: [62.90, 69.90, 86.90, 93.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'O melhor do sabor nacional: muçarela especial derretida, palmito macio, ovos cozidos fatiados, milho fresco, ervilhas selecionadas e orégano.'
    },

    // --- PIZZAS ESPECIAIS (25 a 51) ---
    {
        id: 25,
        category: 'Pizzas Especiais',
        name: 'À Moda do Pizzaiolo',
        img: 'pizzas/pizza-a-moda-do-pizzaiolo.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Criação exclusiva do mestre: fatias de lombo canadense nobre, champignon fresco e queijo provolone defumado gratinado.'
    },
    {
        id: 26,
        category: 'Pizzas Especiais',
        name: 'À Moda do Cheff',
        img: 'pizzas/pizza-a-moda-do-cheff.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Receita autoral marcante: calabresa defumada, bacon crocante, rodelas de tomate fresco e cebola fatiada sobre muçarela.'
    },
    {
        id: 27,
        category: 'Pizzas Especiais',
        name: 'Gorgonzola',
        img: 'pizzas/pizza-gorgonzola.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Para paladares exigentes: queijo gorgonzola de sabor marcante combinado com lâminas de cogumelos champignon frescos sobre muçarela.'
    },
    {
        id: 28,
        category: 'Pizzas Especiais',
        name: 'Imperial',
        img: 'pizzas/pizza-imperial.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Uma verdadeira experiência gastronômica: lombo canadense nobre, palmito macio, champignon, ervilhas frescas e tomate.'
    },
    {
        id: 29,
        category: 'Pizzas Especiais',
        name: 'Italiana',
        img: 'pizzas/pizza-italiana.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor rústico e acolhedor: calabresa fatiada, bacon crocante, requeijão cremoso derretido e anéis de cebola fresca.'
    },
    {
        id: 30,
        category: 'Pizzas Especiais',
        name: 'Lombo Canadense c/ Catupiry',
        img: 'pizzas/pizza-lombo-c-catupiry.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Maciez e cremosidade: fatias nobres de lombo canadense cobertas com generosa camada de legítimo requeijão cremoso.'
    },
    {
        id: 31,
        category: 'Pizzas Especiais',
        name: 'Lombo à Moda',
        img: 'pizzas/pizza-lombo-a-moda-artesanal.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Combinação nobre e completa: lombo canadense, champignon, ovos cozidos, requeijão cremoso e azeitonas pretas selecionadas.'
    },
    {
        id: 32,
        category: 'Pizzas Especiais',
        name: 'Lombo Canadense',
        img: 'pizzas/pizza-lombo-canadense.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor refinado e levemente defumado: lombo canadense fatiado de alta qualidade harmonizado com azeitonas pretas sobre muçarela.'
    },
    {
        id: 33,
        category: 'Pizzas Especiais',
        name: 'Mista',
        img: 'pizzas/pizza-mista.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'A união dos sabores favoritos: presunto fatiado, calabresa dourada no forno, rodelas de tomate fresco e azeitonas pretas.'
    },
    {
        id: 34,
        category: 'Pizzas Especiais',
        name: 'Napolitana',
        img: 'pizzas/pizza-alho-e-parmesao.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Simplicidade clássica e refinada: fatias de tomate fresco suculento, queijo parmesão gratinado e azeitonas pretas sobre muçarela.'
    },
    {
        id: 35,
        category: 'Pizzas Especiais',
        name: 'Palmito c/ Champignon',
        img: 'pizzas/pizza-palmito-c-champingnom.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Leve e sofisticada: pedaços macios de palmito nobre combinados com lâminas de cogumelos champignon frescos sobre queijo muçarela.'
    },
    {
        id: 36,
        category: 'Pizzas Especiais',
        name: 'Peito de Peru c/ Catupiry',
        img: 'pizzas/pizza-peito-de-peru-c-catupiry.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Opção leve e incrivelmente cremosa: peito de peru defumado fatiado com cobertura generosa de requeijão cremoso.'
    },
    {
        id: 37,
        category: 'Pizzas Especiais',
        name: 'Peito de Peru c/ Champignon',
        img: 'pizzas/pizza-peito-de-peru-c-champignon.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Combinação premium: peito de peru defumado, champignon fresco, bacon crocante, parmesão gratinado e requeijão cremoso.'
    },
    {
        id: 38,
        category: 'Pizzas Especiais',
        name: 'Peito de Peru c/ Palmito',
        img: 'pizzas/pizza-peito-de-peru-c-palmito.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor suave e textura impecável: fatias finas de peito de peru defumado harmonizadas com pedaços macios de palmito nobre.'
    },
    {
        id: 39,
        category: 'Pizzas Especiais',
        name: 'Pepperoni',
        img: 'pizzas/pizza-peperoni.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Intensa e irresistível: generosas fatias de pepperoni levemente apimentado, azeitonas pretas e anéis de cebola sobre muçarela.'
    },
    {
        id: 40,
        category: 'Pizzas Especiais',
        name: 'Presunto c/ Ovos',
        img: 'pizzas/pizza-presunto-c-ovos.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Clássica e reconfortante: presunto de primeira linha, ovos cozidos picados, champignon e azeitonas pretas sobre muçarela.'
    },
    {
        id: 41,
        category: 'Pizzas Especiais',
        name: 'Primavera',
        img: 'pizzas/pizza-primavera.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Cores e sabores frescos: presunto fatiado, palmito macio, champignon laminado e queijo provolone defumado gratinado.'
    },
    {
        id: 42,
        category: 'Pizzas Especiais',
        name: 'Saborosa',
        img: 'pizzas/pizza-saborosa.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Harmonia surpreendente: peito de peru defumado, tomate fresco, alho-poró refogado, cebola e requeijão cremoso.'
    },
    {
        id: 43,
        category: 'Pizzas Especiais',
        name: 'Tomate Seco c/ Rúcula',
        img: 'pizzas/pizza-tomate-seco-c-rucula.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Contraste gourmet perfeito: tomates secos artesanais com folhas frescas de rúcula sobre queijo muçarela derretido.'
    },
    {
        id: 44,
        category: 'Pizzas Especiais',
        name: 'Vitello',
        img: 'pizzas/pizza-vitello.webp',
        price: [68.90, 76.90, 89.90, 96.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Receita refinada da casa: lombo canadense, ovos cozidos, alho frito crocante, parmesão gratinado e requeijão cremoso.'
    },
    {
        id: 45,
        category: 'Pizzas Especiais',
        name: 'Brócolis',
        img: 'pizzas/pizza-brocolis.webp',
        price: [73.90, 77.90, 96.90, 103.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor marcante e nutritivo: buquês frescos de brócolis refogados no azeite combinados com queijo gorgonzola encorpado.'
    },
    {
        id: 46,
        category: 'Pizzas Especiais',
        name: '5 Queijos',
        img: 'pizzas/pizza-5-queijos.webp',
        price: [73.90, 77.90, 96.90, 103.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'O paraíso dos queijos: harmonia cremosa de muçarela, provolone defumado, gorgonzola, requeijão cremoso e parmesão.'
    },
    {
        id: 47,
        category: 'Pizzas Especiais',
        name: 'Requintada',
        img: 'pizzas/pizza-requintada.webp',
        price: [73.90, 77.90, 96.90, 103.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Experiência de alta gastronomia: peito de peru, lombo canadense, tomate fresco, palmito, parmesão gratinado e rúcula.'
    },
    {
        id: 48,
        category: 'Pizzas Especiais',
        name: 'Camarão c/ Catupiry',
        img: 'pizzas/pizza-camarao-c-catupiry.webp',
        price: [75.90, 82.90, 99.90, 105.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sofisticação do mar: camarões selecionados e salteados no azeite, cobertos com legítimo requeijão cremoso.'
    },
    {
        id: 49,
        category: 'Pizzas Especiais',
        name: 'Camarão do Cheff',
        img: 'pizzas/pizza-camarao-do-cheff.webp',
        price: [75.90, 82.90, 99.90, 105.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Especialidade exclusiva: camarões suculentos puxados no azeite com alho-poró refogado e cubos de tomate fresco.'
    },
    {
        id: 50,
        category: 'Pizzas Especiais',
        name: 'Shitake 1',
        img: 'pizzas/pizza-shitake.webp',
        price: [75.90, 82.90, 99.90, 105.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Sabor umami incomparável: cogumelos shitake frescos refogados no azeite, alho-poró suave e azeitonas pretas.'
    },
    {
        id: 51,
        category: 'Pizzas Especiais',
        name: 'Shitake 2',
        img: 'pizzas/pizza-shitake-2.webp',
        price: [75.90, 82.90, 99.90, 105.90],
        sizes: ['Média 30 cm', 'Grande 35 cm', 'Super 40 cm', 'Max 45 cm'],
        description: 'Explosão gastronômica gourmet: cogumelos shitake refogados no azeite, queijo gorgonzola encorpado, alho-poró e azeitonas pretas.'
    },

    // --- PIZZAS DOCES (52 a 59 - 30cm e 35cm) ---
    {
        id: 52,
        category: 'Pizzas Doces',
        name: 'Banana c/ Canela',
        img: 'assets/img/pizza-brasileira.png',
        price: [44.90, 49.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'Doce e perfumada: fatias de banana fresca caramelizadas com açúcar e canela aromática sobre queijo muçarela derretido.'
    },
    {
        id: 53,
        category: 'Pizzas Doces',
        name: 'Brigadeiro',
        img: 'assets/img/pizza-frango-catupiry.webp',
        price: [47.90, 51.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'A sobremesa mais amada: generosa camada de brigadeiro cremoso artesanal coberto com granulado de chocolate nobre.'
    },
    {
        id: 54,
        category: 'Pizzas Doces',
        name: 'Brigadeiro Especial',
        img: 'assets/img/pizza-calabresa.png',
        price: [49.90, 54.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'Contraste doce e salgado irresistível: brigadeiro de panela artesanal, granulado crocante e muçarela derretida.'
    },
    {
        id: 55,
        category: 'Pizzas Doces',
        name: 'Chocolate c/ Banana',
        img: 'assets/img/pizza-brasileira.png',
        price: [47.90, 51.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'Combinação clássica que conforta: chocolate cremoso meio amargo derretido com fatias doces de banana fresca.'
    },
    {
        id: 56,
        category: 'Pizzas Doces',
        name: 'Chocolate c/ Morango',
        img: 'assets/img/pizza-frango-catupiry.webp',
        price: [49.90, 54.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'A queridinha das sobremesas: chocolate nobre derretido coberto com pedaços frescos de morangos selecionados.'
    },
    {
        id: 57,
        category: 'Pizzas Doces',
        name: 'Festa',
        img: 'assets/img/pizza-calabresa.png',
        price: [49.90, 54.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'Alegre e crocante: chocolate cremoso coberto com confeitos coloridos crocantes de chocolate confeitado.'
    },
    {
        id: 58,
        category: 'Pizzas Doces',
        name: 'Prestígio',
        img: 'assets/img/pizza-brasileira.png',
        price: [49.90, 54.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'Clássico tropical inconfundível: chocolate nobre derretido com generosa cobertura de coco ralado fresco.'
    },
    {
        id: 59,
        category: 'Pizzas Doces',
        name: 'Romeu e Julieta',
        img: 'assets/img/pizza-frango-catupiry.webp',
        price: [44.90, 49.90],
        sizes: ['Média 30 cm', 'Grande 35 cm'],
        description: 'O par perfeito da doçura: goiabada cremosa cascão combinada com autêntico requeijão cremoso suave.'
    },

    // --- PIZZAS GOURMET (60 a 66 - Pomodori Pelati, Muçarela de Búfala, 35cm) ---
    {
        id: 60,
        category: 'Pizzas Gourmet',
        name: 'Abobrinha Natural',
        img: 'pizzas/pizza-abobrinha.webp',
        price: [98.90],
        sizes: ['Grande 35 cm'],
        description: 'Delicada e aromática: abobrinha fresca laminada, alho-poró, requeijão cremoso, molho pesto artesanal e manjericão fresco sobre muçarela de búfala.'
    },
    {
        id: 61,
        category: 'Pizzas Gourmet',
        name: 'Burrata',
        img: 'pizzas/pizza-burrata.webp',
        price: [98.90],
        sizes: ['Grande 35 cm'],
        description: 'Suprema sofisticação italiana: tomates cereja doces, burrata artesanal cremosa, manjericão fresco, molho pesto e orégano sobre pomodori pelati e muçarela de búfala.'
    },
    {
        id: 62,
        category: 'Pizzas Gourmet',
        name: 'Caprese',
        img: 'pizzas/pizza-caprese.webp',
        price: [98.90],
        sizes: ['Grande 35 cm'],
        description: 'Frescor e tradição mediterrânea: muçarela de búfala nobre, tomates cereja suculentos, azeitonas pretas e folhas frescas de manjericão.'
    },
    {
        id: 63,
        category: 'Pizzas Gourmet',
        name: 'Gorgonzola c/ Pêra',
        img: 'pizzas/pizza-gorgonzola-c-pera.webp',
        price: [98.90],
        sizes: ['Grande 35 cm'],
        description: 'Harmonia agridoce espetacular: queijo gorgonzola encorpado, lâminas de pêra fresca e um leve toque especial de geleia de pimenta sobre muçarela de búfala.'
    },
    {
        id: 64,
        category: 'Pizzas Gourmet',
        name: 'Margherita de Sevóia',
        img: 'pizzas/pizza-margherita-de-sevoia.webp',
        price: [104.90],
        sizes: ['Grande 35 cm'],
        description: 'Autêntica e nobre: cubos de muçarela de búfala artesanal, tomates cereja doces e folhas frescas de manjericão colhidas no dia.'
    },
    {
        id: 65,
        category: 'Pizzas Gourmet',
        name: 'Parma',
        img: 'pizzas/pizza-parma.webp',
        price: [104.90],
        sizes: ['Grande 35 cm'],
        description: 'Elegância da charcutaria nobre: fatias finíssimas de presunto serrano tipo parma, queijo parmesão ralado na hora e folhas frescas de rúcula sobre base de búfala.'
    },
    {
        id: 66,
        category: 'Pizzas Gourmet',
        name: 'Paluza de Roni',
        img: 'pizzas/pizza-paluza-de-roni.webp',
        price: [104.90],
        sizes: ['Grande 35 cm'],
        description: 'Criação autoral refinada: peito de peru defumado, alho-poró, tomates cereja doces, azeitonas pretas, manjericão fresco e orégano sobre pomodori pelati e muçarela de búfala.'
    },

    // --- COMBOS FIXOS ---
    {
        id: 67,
        category: 'Combos',
        comboId: 101,
        name: 'Combo Super + Doce + Refri',
        img: 'assets/img/banner-promocao-combo-pizza.webp',
        price: [120.00],
        sizes: ['1 Super + 1 Média Doce + 1 Refri 2L'],
        description: '1 Super Salgada (40cm) + 1 Média Doce (30cm) + 1 Refrigerante 2L'
    },
    {
        id: 68,
        category: 'Combos',
        comboId: 102,
        name: 'Combo 2 Grandes + Refri',
        img: 'assets/img/banner-promocao-la-bella-em-dobro.webp',
        price: [120.00],
        sizes: ['2 Grandes + Refri 2L'],
        description: '2 Pizzas Grandes Tradicionais (35cm) + 1 Refrigerante 2L'
    },

    // --- BEBIDAS ---
    {
        id: 69,
        category: 'Bebidas',
        name: 'Coca-Cola',
        img: 'assets/img/logo-la-bella-pizza.webp',
        price: [8.00, 14.00],
        sizes: ['600ml', '2L'],
        description: 'Refrigerante Coca-Cola original geladinho e refrescante.'
    },
    {
        id: 70,
        category: 'Bebidas',
        name: 'Pepsi',
        img: 'assets/img/logo-la-bella-pizza.webp',
        price: [8.00, 14.00],
        sizes: ['600ml', '2L'],
        description: 'Refrigerante Pepsi sabor marcante geladinho e refrescante.'
    },
    {
        id: 71,
        category: 'Bebidas',
        name: 'Guaraná Antarctica',
        img: 'assets/img/logo-la-bella-pizza.webp',
        price: [8.00, 14.00],
        sizes: ['600ml', '2L'],
        description: 'Refrigerante Guaraná Antarctica original da Amazônia geladinho.'
    },
    {
        id: 72,
        category: 'Bebidas',
        name: 'Sprite',
        img: 'assets/img/logo-la-bella-pizza.webp',
        price: [8.00, 14.00],
        sizes: ['600ml', '2L'],
        description: 'Refrigerante Sprite sabor limão bem geladinho e refrescante.'
    }
];

// ==========================================================================
// ESTRUTURA DE DADOS DOS COMBOS DINÂMICOS (Regras, Sabores e Promoções)
// ==========================================================================
let combosJson = [
    {
        id: 101,
        code: 'combo_super_doce_refri',
        name: 'Combo Super + Doce + Refri',
        category: 'Combos',
        img: 'assets/img/banner-promocao-combo-pizza.webp',
        price: 120.00,
        description: '1 Super Salgada (40cm) + 1 Média Doce (30cm) + 1 Refrigerante 2L',
        rules: {
            pizzas: [
                { size: 'S', sizeIndex: 2, sizeName: 'Super (40cm)', category: ['Pizzas Tradicionais'], label: '1ª Pizza Salgada Super (40cm)' },
                { size: 'M', sizeIndex: 0, sizeName: 'Média (30cm)', category: ['Pizzas Doces'], label: '2ª Pizza Doce Média (30cm)' }
            ],
            drinks: [
                { size: '2L', sizeIndex: 1, label: 'Refrigerante 2L' }
            ]
        }
    },
    {
        id: 102,
        code: 'combo_2_grandes_refri',
        name: 'Combo 2 Grandes + Refri',
        category: 'Combos',
        img: 'assets/img/banner-promocao-la-bella-em-dobro.webp',
        price: 120.00,
        description: '2 Pizzas Grandes Tradicionais (35cm) + 1 Refrigerante 2L',
        rules: {
            pizzas: [
                { size: 'G', sizeIndex: 1, sizeName: 'Grande (35cm)', category: ['Pizzas Tradicionais'], label: '1ª Pizza Grande (35cm)' },
                { size: 'G', sizeIndex: 1, sizeName: 'Grande (35cm)', category: ['Pizzas Tradicionais'], label: '2ª Pizza Grande (35cm)' }
            ],
            drinks: [
                { size: '2L', sizeIndex: 1, label: 'Refrigerante 2L' }
            ]
        }
    },
    // Promoção de Terça-feira: La Bella em Dobro (ativa às terças - diaDaSemana === 2)
    {
        id: 201,
        code: 'promo_terca_2_medias',
        name: 'La Bella em Dobro - 2 Médias (30cm)',
        category: 'PromocaoTerca',
        dayOfWeek: 2, // Terça-feira
        img: 'pizzas/pizza-calabresa.webp',
        price: 109.90,
        description: '2 Pizzas de 30cm (Médias) Tradicionais por R$ 109,90',
        rules: {
            pizzas: [
                { size: 'M', sizeIndex: 0, sizeName: 'Média (30cm)', category: ['Pizzas Tradicionais'], label: '1ª Pizza Média (30cm)' },
                { size: 'M', sizeIndex: 0, sizeName: 'Média (30cm)', category: ['Pizzas Tradicionais'], label: '2ª Pizza Média (30cm)' }
            ],
            drinks: []
        }
    },
    {
        id: 202,
        code: 'promo_terca_2_grandes',
        name: 'La Bella em Dobro - 2 Grandes (35cm)',
        category: 'PromocaoTerca',
        dayOfWeek: 2, // Terça-feira
        img: 'pizzas/pizza-brasileira.webp',
        price: 129.90,
        description: '2 Pizzas de 35cm (Grandes) Tradicionais por R$ 129,90',
        rules: {
            pizzas: [
                { size: 'G', sizeIndex: 1, sizeName: 'Grande (35cm)', category: ['Pizzas Tradicionais'], label: '1ª Pizza Grande (35cm)' },
                { size: 'G', sizeIndex: 1, sizeName: 'Grande (35cm)', category: ['Pizzas Tradicionais'], label: '2ª Pizza Grande (35cm)' }
            ],
            drinks: []
        }
    },
    {
        id: 203,
        code: 'promo_terca_2_super',
        name: 'La Bella em Dobro - 2 Super (40cm)',
        category: 'PromocaoTerca',
        dayOfWeek: 2, // Terça-feira
        img: 'pizzas/pizza-frango-catupiry.webp',
        price: 159.90,
        description: '2 Pizzas de 40cm (Super) Tradicionais por R$ 159,90',
        rules: {
            pizzas: [
                { size: 'S', sizeIndex: 2, sizeName: 'Super (40cm)', category: ['Pizzas Tradicionais'], label: '1ª Pizza Super (40cm)' },
                { size: 'S', sizeIndex: 2, sizeName: 'Super (40cm)', category: ['Pizzas Tradicionais'], label: '2ª Pizza Super (40cm)' }
            ],
            drinks: []
        }
    }
];