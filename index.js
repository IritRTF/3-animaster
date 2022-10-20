addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const fadeInAnimation = animaster().fadeIn(block, 5000);
            document.getElementById('fadeInReset')
                .addEventListener('click', fadeInAnimation.reset());
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const fadeOutAnimation = animaster().fadeOut(block, 5000);
            document.getElementById('fadeOutReset')
                .addEventListener('click', fadeOutAnimation.reset());
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const heartBeatingAnimation = animaster().heartBeating(block);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    heartBeatingAnimation.stop();
                });
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const moveAnimation = animaster().move(block, 1000, {x: 100, y: 10});
            document.getElementById('moveReset')
                .addEventListener('click', moveAnimation.reset());
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const moveAndHideAnimation = animaster().moveAndHide(block, 5000);
            document.getElementById('moveAndHideReset')
                .addEventListener('click', moveAndHideAnimation.reset());
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const scaleAnimation = animaster().scale(block, 1000, 1.25);
            document.getElementById('scaleReset')
                .addEventListener('click', scaleAnimation.reset());
        });
    
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            const showAndHideAnimation = animaster().showAndHide(block, 5000);
            document.getElementById('showAndHideReset')
                .addEventListener('click', showAndHideAnimation.reset());
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

function animaster () {
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
        fadeIn (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return {
                reset () {
                    resetFadeIn(element);
                }
            };
        },

        /**
         * Блок плавно исчезает в прозрачное.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {
                reset () {
                    resetFadeOut(element);
                }
            };
        },

        /**
         * Блок начинает увеличиваться и уменьшаться, подобно сердцу.
         * @param element — HTMLElement, который надо анимировать
         */
        heartBeating (element) {
            const scaleUpAndDown = function (element) {
                animaster().scale(element, 500, 1.4);
                setTimeout(animaster().scale, 500, element, 500, 1);
            };
            scaleUpAndDown(element);
            const heartBeatingTimer = setInterval(scaleUpAndDown, 1000, element);
            return {
                stop () {
                    clearInterval(heartBeatingTimer);
                }
            };
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {
                reset () {
                    resetMoveAndScale(element);
                }
            };
        },

        /**
         * Блок плавно передвигается, а затем плавно исчезает в прозрачное 
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide (element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            setTimeout(this.fadeOut, duration * 2 / 5, element, duration * 3 / 5);
            return {
                reset () {
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            };
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {
                reset () {
                    resetMoveAndScale(element);
                }
            };
        },

        /**
         * Блок плавно появляется из прозрачного, а затем плавно исчезает в прозрачное 
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        showAndHide (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration / 3, element, duration / 3);
            return {
                reset () {
                    resetFadeIn(element);
                    resetFadeOut(element);
                }
            };
        }
    };
}