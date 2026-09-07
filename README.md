# La Bella Pizza - Website Institucional & Sistema de Delivery Online

Aplicação web completa e interativa para pizzaria artesanal em Petrópolis/RJ. O projeto une experiência de usuário (UX) de alto padrão, animações aceleradas por GPU, engenharia de performance (Core Web Vitals) e motor de regras de negócio em JavaScript puro para promoções sazonais e fechamento de pedidos via WhatsApp.

- **Demonstracao Online:** https://labellapizzapetropolis.com.br
- **Repositório:** https://github.com/CanedoDev/Sistema-delivery-pizzaria

---

## 1. Destaques Técnicos para Avaliação

* **Vanilla JavaScript ES6+ Modular:** Implementação de ponta a ponta sem frameworks de renderização (React/Vue), garantindo First Contentful Paint (FCP) quase instantâneo e bundle size enxuto.
* **Motor de Promoções Dinâmicas e Calendário:** Sistema que avalia dinamicamente o dia da semana (ex: Terça em Dobro, Quarta da Casa), checa feriados/vésperas e manipula dinamicamente banners, CTAs de conversão e direcionamento de filtros.
* **Modal Responsivo Viewport-Adaptive:** Modal de customização de pizzas (tamanhos, bordas, adicionais e observações) projetado com técnicas modernas de CSS viewport-relative (`dvh`, `clamp`), eliminando barras de rolagem desnecessárias em telas compactas (ex: Samsung Galaxy S21 FE).
* **Animações Aceleradas por GPU (GSAP 3):** Efeitos de rolagem e interações com ScrollTrigger e transformações CSS 3D com consumo otimizado de memória e renderização a 60fps.
* **SEO Técnico e GEO (Generative Engine Optimization):** Estrutura semântica avançada com JSON-LD Schema.org (`Restaurant`, `LocalBusiness`, `OpeningHoursSpecification`, `FAQPage`), sitemap XML e suporte a `llm.txt` para mecanismos de busca por IA.

---

## 2. Tecnologias Utilizadas

### Frontend & Estilização
* **HTML5 Semântico:** Estruturação orientada a acessibilidade (WAI-ARIA) e ranqueamento orgânico.
* **CSS3 Moderno:** Design Tokens, Variáveis Nativas (`--css-vars`), Flexbox, CSS Grid, Container Queries e Glassmorphism (`backdrop-filter`).
* **Tipografia Curada:** Google Fonts (`Poppins`, `Montserrat`, `Damion`).

### Lógica & Interatividade
* **JavaScript ES6+:** Manipulação de DOM performática, delegação de eventos, manipulação de estado local e URLSearchParams para roteamento sem recarregamento.
* **GSAP (GreenSock Animation Platform 3.14):** ScrollTrigger, interpolações suaves e micro-interações.
* **Slider Customizado:** Carrossel infinito com controle de autoplay, pausado em interação e suporte a gestos de toque.

### Formatos & Otimização de Mídia
* **Google WebP:** Compressão de última geração com dimensões explícitas em todas as tags `<img>`, reduzindo Cumulative Layout Shift (CLS) a zero.
* **Cache-Busting Strategy:** Invalidação controlada de cache via query parameters nos assets críticos.

---

## 3. Arquitetura de Pastas

```text
├── assets/
│   └── img/
│       ├── instagram/      # Galeria com imagens convertidas em WebP
│       ├── pizzas/         # Catálogo completo de pizzas em formato WebP
│       ├── *.webp, *.svg   # Banners, logotipos e vetores da interface
├── css/
│   ├── style.css           # Estilos globais, tokens, tipografia e home
│   ├── cardapio.css        # Layout do catálogo, filtros e modal de pedidos
│   └── responsive.css     # Media queries para tablet e mobile
├── js/
│   ├── pizzaJson.js        # Base de dados estruturada do catálogo e variações
│   ├── cardapio.js         # Lógica do catálogo, busca, cálculos e WhatsApp
│   ├── promo-slider.js     # Motor do slider e lógica das promoções por dia
│   ├── card-animation.js   # Integrações com GSAP ScrollTrigger
│   └── nav-scrollspy.js    # Scrollspy dinâmico da navegação
├── index.html              # Landing page principal institucional
├── cardapio.html           # Interface do catálogo e fluxo de pedido
├── linkbio.html            # Página de links otimizada para redes sociais
├── robots.txt              # Diretivas de rastreamento para web crawlers
├── sitemap.xml             # Mapeamento do site para indexação no Google
└── llm.txt                 # Contexto semântico para crawlers de IA
```

---

## 4. Funcionalidades de Negócio

1. **Cardápio Interativo com Filtros e Busca:**
   * Filtragem instantânea por categoria (Tradicionais, Especiais, Doces, Bebidas, Combos).
   * Busca textual em tempo real por nome e ingredientes com tratamento de caracteres.
2. **Fluxo de Personalização e Pedido:**
   * Seleção intuitiva de tamanho (Média 30cm, Grande 35cm, Super 40cm, Max 45cm).
   * Escolha de tipo de massa, bordas recheadas e observações de preparo.
   * Totalizador de valor em tempo real com validação de campos obrigatórios.
3. **Integração com WhatsApp:**
   * Formatação automática da mensagem de pedido estruturada, incluindo itens, valores parciais, taxa, endereço e método de pagamento.
4. **Inteligência de Promoções:**
   * Identificação de regras específicas para Terça-feira (Pizzas em Dobro) e Quarta-feira (Quarta da Casa).
   * Redirecionamento contextual do banner para a categoria ou ofertas do dia.

---

## 5. Metodologia de Desenvolvimento & IA como Acelerador

Neste projeto, a inteligência artificial generativa foi empregada estrategicamente como ferramenta de aceleração e produtividade (pair programming), permitindo foco total na arquitetura e na experiência do usuário:

* **Trabalhos Repetitivos e Dados Estruturados:** Automação na estruturação em massa do catálogo de produtos em JSON, padronização de metadados e conversão de formatos de mídia para WebP.
* **Refinamento de Detalhes Visuais:** Auxílio no ajuste fino de micro-interações CSS, alinhamentos matemáticos em grids complexos e scaffolding inicial de marcações Schema.org para SEO.
* **Governança do Desenvolvedor:** Toda a tomada de decisão técnica, regras de negócio do delivery, arquitetura dos componentes em Vanilla JS, UX design e validação final de código foram conduzidos e validados pelo desenvolvedor.

Essa abordagem reflete um fluxo de trabalho contemporâneo de engenharia de software, onde ferramentas de IA atuam como amplificadores de velocidade de entrega e refinamento estético sem comprometer a qualidade e o controle do código.

---

## 6. Autor

Desenvolvido por **Canedo Web Studio** / **CanedoDev**  
* GitHub: [CanedoDev](https://github.com/CanedoDev)
* Website do Cliente: [La Bella Pizza Petrópolis](https://labellapizzapetropolis.com.br)
