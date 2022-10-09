addListeners();

function addListeners() {
    let master = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            let fadeIn = master.fadeIn(block, 5000);
            document.getElementById('fadeInReset')
            .addEventListener('click', fadeIn.reset);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            let fadeOut = master.fadeOut(block, 5000);
            document.getElementById('fadeOutReset')
            .addEventListener('click', fadeOut.reset);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            let move = master.move(block, 1000, {x: 100, y: 0});
            document.getElementById('moveReset')
            .addEventListener('click', move.reset);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            let scale = master.scale(block, 1000, 1.25);
            document.getElementById('scaleReset')
            .addEventListener('click', scale.reset);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            
            let moveAndHide = master.moveAndHide(block, 5000, {x: 100, y: 20});
            document.getElementById('moveAndHideReset')
            .addEventListener('click', moveAndHide.reset);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            let showAndHide = master.showAndHide(block, 3000);
            document.getElementById('showAndHideReset')
            .addEventListener('click', showAndHide.reset);
        });
        document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let heartBeating = master.heartBeating(block, 500, 1.4);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', heartBeating.stop);
        });
    
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

function animaster(){
    const resetFadeIn = function (element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };
    const resetFadeOut = function (element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };
    const resetMoveAndScale = function (element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };

    return {
        /**
        * Блок плавно появляется из прозрачного.
        * @param element — HTMLElement, который надо анимировать
        * @param duration — Продолжительность анимации в миллисекундах
        */
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('show');
            element.classList.remove('hide');
            return {reset(){resetFadeIn(element)}};
        },

        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {reset(){resetFadeOut(element)}};
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {reset(){resetMoveAndScale(element)}};
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {reset(){resetMoveAndScale(element)}};
        },
        
        moveAndHide: function (element, duration, translation) {
            this.move(element, (2 * duration) / 5, translation);
            let timer = setTimeout(
                this.fadeOut,
                (2 * duration) / 5,
                element,
                (3 * duration) / 5
            );
            return {
                reset: function () {
                    clearTimeout(timer);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                },
            };
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            let timer = setTimeout(this.fadeOut, (2 * duration) / 3, element, duration / 3);
            return {
                 reset(){
                    resetFadeIn(element);
                    clearTimeout(timer);
                }};
        },

        heartBeating(element, step, ratio) {
            let tick = () =>{this.scale(element, step, ratio);
                setTimeout(this.scale, step, element, step, 1);
            }
            tick()
            let heartBeating = setInterval(tick, step * 3 );
            return {stop() {
                clearInterval(heartBeating)
            }}
        },

    }
}
