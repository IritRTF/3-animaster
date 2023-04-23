addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 3000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster()._resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 3000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster()._resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()._resetMoveAndScale(block);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster()._resetMoveAndScale(block);
        });

    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000, {x: 100, y: 20});
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });
    
    document.getElementById('heartBeatingStart')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating().start(block);
        });

    document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        animaster().heartBeating().stop(block);
    });
    
}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function _resetFadeIn(element) {
        element.classList.remove('show')
        element.classList.add('hide')
        element.style.transitionDuration = null
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function _resetFadeOut(element) {
        element.style.transitionDuration = null
        element.classList.remove('hide')
        element.classList.add('show')
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function _resetMoveAndScale(element) {
        element.style.transform = null
    }

    function moveAndHide(element, duration, translation) {
        const firstPhase = duration * (2 / 5)
        element.style.transitionDuration = `${firstPhase}ms`
        element.style.transform = getTransform(translation, null)
        setTimeout(() => {fadeOut(element,duration * (3 / 5))}, firstPhase)
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration*(1/3))
        setTimeout(() => {fadeOut(element, duration * (1/3))}, duration * (2/3))
    }

    function heartBeating() {
        return {
            start: function(element){
                scale(element, 500, 1.4)
                phase1 = setInterval(()=> {scale(element,500,1)},500)
                phase2 = setInterval(() => {scale(element,500,1.4)}, 1000)
            },
            stop: function(element){
                clearInterval(phase1)
                clearInterval(phase2)
                //Возвращаем в исходное состояние с анимацией. Можно и без
                scale(element, 500, 1)
            }
        }
    }

    return {fadeIn, move, scale, fadeOut, moveAndHide, showAndHide, heartBeating, _resetFadeIn, _resetFadeOut, _resetMoveAndScale}
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
