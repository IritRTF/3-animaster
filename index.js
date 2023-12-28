addListeners();

function addListeners() {
    document.getElementById('fadeInPlay') // запускает fadein
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block,3000);
        });

    document.getElementById('movePlay') // запускает move
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 500, {x: 20, y: 20});
        });

    document.getElementById('scalePlay') // запускает scale
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 500, .8)
        });

    document.getElementById('fadeOutPlay') // запускает fadeout
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block,3000);
        });

    document.getElementById('moveAndHide') // запускает moveandhide
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide().start(block, 3000, { x: 100, y: 20 });
        });

    document.getElementById('showAndHide') // запускает showandhide
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingStart') // запускает heartbeating
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating().start(block);
        });

    document.getElementById('heartBeatingStop') //останавливает heart beating
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating().stop(block);
        });
    
    document.getElementById('fadeInReset') // обнуляет fadein
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster()._resetFadeIn(block);
        });
    
    document.getElementById('moveReset') // обнуляет move
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()._resetMoveAndScale(block);
        });
    
    document.getElementById('scaleReset') // обнуляет scale
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster()._resetMoveAndScale(block);
        });

    document.getElementById('fadeOutReset') // обнуляет fadeout
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster()._resetFadeOut(block);
        });

    document.getElementById('resetMoveAndHide') // обнуляет moveandhide
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide().stop(block);
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

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function moveAndHide() {
        return {
            start: function (element, duration, translation) {
                const move = duration * (2 / 5)
                element.style.transitionDuration = `${move}ms`
                element.style.transform = getTransform(translation, null)
                time = setTimeout(() => {
                    fadeOut(element, duration * (3 / 5))
                }, move)
            },

            stop: function (element) {
                element.transitionDuration = null
                element.style.transform = null
                clearTimeout(time)
                fadeIn(element, 0)
            }
        }
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration * (1 / 3))
        setTimeout(() => {
            fadeOut(element, duration * (1 / 3))
        }, duration * (2 / 3))
    }

    function heartBeating() {
        return {
            start: function (element) {
                scale(element, 500, 1.4)
                increases = setInterval(() => {
                    scale(element, 500, 1)
                }, 500)
                Decreases = setInterval(() => {
                    scale(element, 500, 1.4)
                }, 1000)
            }, stop: function (element) {
                clearInterval(increases)
                clearInterval(Decreases)
                scale(element, 500, 1)
            }
        }
    }

    function _resetFadeIn(element) {
        element.classList.remove('show')
        element.classList.add('hide')
        element.style.transitionDuration = null
    }

    function _resetFadeOut(element) {
        element.style.transitionDuration = null
        element.classList.remove('hide')
        element.classList.add('show')
    }

    function _resetMoveAndScale(element) {
        element.style.transform = null
    }  

    return {
        fadeIn,
        move,
        scale,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        _resetFadeIn,
        _resetFadeOut,
        _resetMoveAndScale,
    }
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
