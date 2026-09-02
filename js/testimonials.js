// SVGs das estrelas na ordem da bandeira italiana (sempre as 5, fixas)
const STARS_HTML = `
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
    <img src="assets/img/estrela-avaliacao.svg" alt="Avaliação 5 estrelas" class="star-svg">
`;

// Dados dos depoimentos
const testimonials = [
    {
        text: "A melhor pizza que já comi na vida! Massa fininha, crocante e o recheio é generoso. Voltarei sempre!",
        author: "Ana Paula M."
    },
    {
        text: "Atendimento impecável e pizza maravilhosa. A de Quatro Queijos derreteu meu coração. Recomendo demais!",
        author: "Carlos R."
    },
    {
        text: "Cada mordida parecia um abraço quente num dia frio. A melhor pizza artesanal de Petrópolis!",
        author: "Marina K."
    },
    {
        text: "A massa de fermentação lenta faz toda a diferença. Sabor incrível, deu pra sentir a qualidade dos ingredientes.",
        author: "Bruno S."
    },
    {
        text: "Pedi pelo delivery e chegou quentinha e perfeita. A Calabresa é simplesmente irresistível. Já pedi três vezes esse mês!",
        author: "Fernanda L."
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
    `;
    return slide;
}

function showTestimonial(index, direction = 1) {
    const track = document.querySelector('.testimonial-track');
    if (!track || isTransitioning) return;
    isTransitioning = true;

    const newSlide = buildSlide(testimonials[index]);

    // Posição inicial fora da tela
    gsap.set(newSlide, { x: direction * 80, opacity: 0 });
    track.appendChild(newSlide);

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
    track.appendChild(buildSlide(testimonials[0]));

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