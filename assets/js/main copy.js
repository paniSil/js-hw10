const container = document.querySelector('#carousel');
const slides = container.querySelectorAll('.slide');
const indicatorsContainer = container.querySelector('#indicators-container');
const indicatorItems = indicatorsContainer.querySelectorAll('.indicator');
const pauseBtn = container.querySelector('#pause-btn');
const prevBtn = container.querySelector('#prev-btn');
const nextBtn = container.querySelector('#next-btn');

const SLIDES_COUNT = slides.length;
const TIMER_INTERVAL = 2000;
const CODE_ARROW_LEFT = 'ArrowLeft';
const CODE_ARROW_RIGHT = 'ArrowRight';
const CODE_SPACE = 'Space';
const FA_PAUSE = '<i class="fas fa-pause-circle"></i>';
const FA_PLAY = '<i class="fas fa-play-circle"></i>';

let currentSlide = 0;
let isPlaying = true;
let timerId = null;

let startPosX = 0;
let endPosX = 0;


function tick() {
    timerId = setInterval(goToNth, TIMER_INTERVAL);
}

function goToNth(n) {
    slides[currentSlide].classList.toggle('active');
    indicatorItems[currentSlide].classList.toggle('active')
    currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
    slides[currentSlide].classList.toggle('active');
    indicatorItems[currentSlide].classList.toggle('active');
}

function goToPrev() {
    goToNth(currentSlide - 1);
}

function goToNext() {
    goToNth(currentSlide + 1);
}

function pauseHandler() {
    if (!isPlaying) {
        return;
    }

    clearInterval(timerId);
    pause.innerHTML = FA_PLAY;
    isPlaying = false;

}

function playHandler() {
    timerId = setInterval(goToNth, TIMER_INTERVAL);
    pause.innerHTML = FA_PAUSE;
    isPlaying = true;
}

function pausePlayHandler() {
    isPlaying ? pauseHandler() : playHandler();
}

function prevHandler() {
    pauseHandler();
    goToPrev();
}

function nextHandler() {
    pauseHandler();
    goToNext();
}

// timerId = setInterval(goToNth, TIMER_INTERVAL);


function indicatorHandler(e) {
    const { target } = e; //const target = e.target;
    if (target.classList.contains('indicator')) {

        pauseHandler();
        goToNth(+target.dataset.slideTo);
    }
}

function pressKeyHandler(e) {
    const { code } = e; // const code = e.code
    if (code === CODE_ARROW_LEFT) prevHandler();
    if (code === CODE_ARROW_RIGHT) nextHandler();
    if (code === CODE_SPACE) {
        e.preventDefault();
        pausePlayHandler();
    }
}

function swipeStartHandler(e) {
    startPosX = e instanceof MouseEvent ? e.clientX : e.changeTouches[0].clientX;
}

function swipeEndHandler(e) {
    endPosX = e instanceof MouseEvent ? e.clientX : e.changeTouches[0].clientX;

    if (endPosX - startPosX > 100) prevHandler();
    if (endPosX - startPosX < -100) nextHandler();
}

function initListeners() {
    pauseBtn.addEventListener('click', pausePlayHandler);
    prevBtn.addEventListener('click', prevHandler);
    nextBtn.addEventListener('click', nextHandler);
    indicatorsContainer.addEventListener('click', indicatorHandler);
    container.addEventListener('touchstart', swipeStartHandler, { passive: true });
    container.addEventListener('mousedown', swipeStartHandler);
    container.addEventListener('touchend', swipeEndHandler);
    container.addEventListener('mouseup', swipeEndHandler);
    document.addEventListener('keydown', pressKeyHandler);
}

function init() {
    initListeners();
    tick();
}

init();
