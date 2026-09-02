// SVGs das estrelas na ordem da bandeira italiana (sempre as 5, fixas)
const STARS_HTML = `
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
`;

// Dados dos depoimentos reais do Google Maps
const testimonials = [
    {
        text: "Confesso que estou arrependida... Arrependida de nunca ter ido antes nessa pizzaria! Que pizza maravilhosa, massa fina, recheio na medida e ambiente muito acolhedor. O atendimento do Sr. Edu foi fantástico, nos apresentou vários azeites que deixaram tudo ainda mais saboroso!",
        author: "Juliana Mulano",
        badge: "Avaliação 5 estrelas no Google"
    },
    {
        text: "The best pizza I've ever eaten! Pizza was amazing, really delicious. We got few olive oils to taste. The owner Eduardo explained everything about his pizzas and offered a special pizza to try. Best service ever!",
        author: "Adam Adamek",
        badge: "Avaliação 5 estrelas no Google"
    },
    {
        text: "Minhas pizzas chegaram bem quentes e saborosas. O refri, bem gelado. Valeu! Nota dez em comida, serviço e entrega!",
        author: "Kelly Soares",
        badge: "Local Guide · Google"
    },
    {
        text: "Pizza deliciosa, ambiente limpíssimo, ótimo atendimento e preço justo. Recomendo muito para quem visita ou mora em Petrópolis!",
        author: "Lucymeri Valente",
        badge: "Local Guide · Google"
    },
    {
        text: "Pizza muito gostosa, fiz o pedido e em 15 minutos já podia buscar. Atendimento rápido, eficiente e pizza de qualidade máxima!",
        author: "Felippe Nunes",
        badge: "Local Guide · Google"
    },
    {
        text: "Melhor pizza da vida! E o atendimento é maravilhoso. Pode ir, que não vão se arrepender :)",
        author: "Crias2022 Dias",
        badge: "Avaliação 5 estrelas no Google"
    },
    {
        text: "PIZZA MARAVILHOSA 😋 Achei pelo Google pelas ótimas avaliações. Com certeza voltarei quando estiver em Petrópolis! Massa de fermentação natural, recheio delicioso e atendimento top!",
        author: "Camilla Rocha",
        badge: "Local Guide · Google"
    }
];

let currentTestimonial = 0;
let isTransitioning = false;

function buildSlide(data) {
    const slide = document.createElement('div');
    slide.className = 'testimonial-slide';
    slide.innerHTML = `
        <div class="stars-row">${STARS_HTML}</div>
        <p class="testimonial-text">"${data.text}"</p>
        <span class="testimonial-author">${data.author}</span>
        ${data.badge ? `<span class="testimonial-badge" style="display:block; font-size:12px; opacity:0.8; margin-top:2px;">${data.badge}</span>` : ''}
    `;
    return slide;
}

function updateTrackHeight(track, slide) {
    if (!track || !slide) return;
    const slideHeight = slide.offsetHeight;
    if (slideHeight > 0) {
        gsap.to(track, {
            minHeight: Math.max(280, slideHeight + 45),
            duration: 0.35,
            ease: "power2.out"
        });
    }
}

function showTestimonial(index, direction = 1) {
    const track = document.querySelector('.testimonial-track');
    if (!track || isTransitioning) return;
    isTransitioning = true;

    const newSlide = buildSlide(testimonials[index]);

    // Posição inicial fora da tela
    gsap.set(newSlide, { x: direction * 80, opacity: 0 });
    track.appendChild(newSlide);

    // Ajusta altura do container para nunca cortar as estrelas
    requestAnimationFrame(() => {
        updateTrackHeight(track, newSlide);
    });

    const oldSlide = track.querySelector('.testimonial-slide:first-child');

    // Saída do slide antigo
    if (oldSlide && oldSlide !== newSlide) {
        gsap.to(oldSlide, {
            x: direction * -80,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => oldSlide.remove()
        });
    }

    // Entrada do novo slide
    gsap.to(newSlide, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.1,
        onComplete: () => { isTransitioning = false; }
    });
}

function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    if (!track) return;

    // Renderiza o primeiro sem animação
    const firstSlide = buildSlide(testimonials[0]);
    track.appendChild(firstSlide);
    requestAnimationFrame(() => {
        updateTrackHeight(track, firstSlide);
    });

    document.querySelector('.testimonial-btn-next').addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial, 1);
    });

    document.querySelector('.testimonial-btn-prev').addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial, -1);
    });
}

document.addEventListener('DOMContentLoaded', initTestimonials);