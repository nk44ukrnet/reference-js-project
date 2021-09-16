'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
    btn.addEventListener('click', openModal);
})

// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


// smoth scroll

const btnScrollTo = document.querySelector('.btn--scroll-to'),
    section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', (e) => {
    e.preventDefault();
    const s1coords = section1.getBoundingClientRect();

    console.log(`Current srolled pixels form left/top (X/Y): ${window.pageXOffset} / ${window.pageYOffset}`);
    console.log(`Client viewport height/width: ${document.documentElement.clientHeight} / ${document.documentElement.clientWidth}`);

    //First LEFT than top -> scroll
    // window.scrollTo({
    //     left: section1.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth',
    // });
    section1.scrollIntoView({behavior: 'smooth'});
})

//1.add event listener to common parent element
//2.determine what the element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
    console.log(e.target);
    //matching strategy
    if (e.target.classList.contains('nav__link')) {
        e.preventDefault();
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
})


//tab
const tabs = document.querySelectorAll('.operations__tab'),
    tabsContainer = document.querySelector('.operations__tab-container'),
    tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;

    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//menu fade animation

const nav = document.querySelector('.nav');

function handleHover(e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) {
                el.style.opacity = this;
            }
        })
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleHover.bind('0.5'));
nav.addEventListener('mouseout', handleHover.bind('1'));

//sticky navigation [fires when you scroll to section--1]

const initialCords = section1.getBoundingClientRect();
//console.log(initialCords);

// window.addEventListener('scroll', e=>{
//     //console.log(window.scrollY);
//     if(window.scrollY > initialCords.top) {
//         nav.classList.add('sticky');
//     } else {
//         nav.classList.remove('sticky');
//     }
// })
//same sticky, but with new IntersectionObserver(callback=>{});
// function obsCallback(entries, observer){
//     entries.forEach(entrie=>console.log(entrie))
// }
// const obsOptions = {
//     root: null, //null -> all viewport (root)
//     treshold: [0, 0.2] // .1 = 10%
// }
//
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
    const [entry] = entries;
    //console.log(entry);
    //remove or add sticky class in case of intersecting
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const header = document.querySelector('.header'),
    headerObserver = new IntersectionObserver(stickyNav, {
        root: null,
        treshold: 0,
        rootMargin: `${navHeight}px` //px only - it is a height of navigation
    });
headerObserver.observe(header);


//reveal section with IntersectionObserver API
const allSection = document.querySelectorAll('section');

const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    treshold: 0.15,
});

allSection.forEach(section => {
    //section.classList.add('section--hidden');
    sectionObserver.observe(section);
})

//lazy loading img
const imgTargets = document.querySelectorAll('img[data-src]');

function loadImg(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', (e) => {
        entry.target.classList.remove('lazy-img');
    })
    observer.unobserve(entry.target);
}

const imageObserver = new IntersectionObserver(loadImg, {
    root: null,
    treshold: 0,
    rootMargin: '200px'
});

imgTargets.forEach(img => imageObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let currentSlide = 0;
    const maxSlides = slides.length;

    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };


    function activateDot(slide) {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }


    slides.forEach((s, i) => {
        s.style.transform = `translateX(${i * 100}%)`;
    });

    const goToSlide = (slide) => {
        slides.forEach((s, i) => {
            s.style.transform = `translateX(${(i - slide) * 100}%)`;
        });
    }


    function nextSlide() {
        if (currentSlide === maxSlides - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    function prevSlide() {
        if (currentSlide === 0) {
            currentSlide = maxSlides - 1;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    function init() {
        createDots();
        activateDot(0);
        goToSlide(0);
    }

    init();

    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        activateDot(currentSlide);
        // e.key === 'ArrowLeft' && prevSlide(); //same result
    })

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const {slide} = e.target.dataset;
            goToSlide(slide);
            activateDot(currentSlide);
        }
    })
}
slider();



//console.log('test')