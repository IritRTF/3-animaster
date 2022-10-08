addListeners();

function addListeners() {
    let hearBeating;
    let moveAndHide;
    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster()
            .addMove(500, { x: 50, y: 5 })
            .addMove(500, { x: 50, y: -20 })
            .addMove(500, { x: 50, y: 20 })
            .play(block);
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().addScale(1000, 1.25).play(block);
    });
    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    document
        .getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide = animaster()
                .addMove(2000, { x: 100, y: 20 })
                .addFadeOut(3000)
                .play(block);
        });
    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHide) moveAndHide.reset();
        });
    document
        .getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
                .addFadeIn(1000)
                .addDelay(1000)
                .addFadeOut(1000)
                .play(block);
        });
    document
        .getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hearBeating = animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(block, true);
        });
    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (hearBeating) hearBeating.stop();
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

function animaster() {
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
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            let resetFadeOut = this._resetFadeOut;
            return {
                reset: function () {
                    resetFadeOut(element);
                },
            };
        },
        moveAndHide: function (element, duration) {
            this.move(element, (2 * duration) / 5, { x: 100, y: 20 });
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
                    console.log('MoveAndHide reset');
                },
            };
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, (2 * duration) / 3, element, duration / 3);
        },
        heartBeating: function (element) {
            let scale = this.scale;
            let timer = setTimeout(function tick(isScaled = false) {
                if (isScaled) {
                    scale(element, 500, 1);
                    timer = setTimeout(tick, 500);
                } else {
                    scale(element, 500, 1.4);
                    timer = setTimeout(tick, 500, true);
                }
            }, 500);
            return {
                stop: function () {
                    clearTimeout(timer);
                },
            };
        },
        addMove: function (duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                translation: translation,
            });
            return this;
        },
        addScale: function (duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                ratio: ratio,
            });
            return this;
        },
        addFadeIn: function (duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,
            });
            return this;
        },
        addFadeOut: function (duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,
            });
            return this;
        },
        addDelay: function (duration) {
            this._steps.push({
                name: 'delay',
                duration: duration,
            });
            return this;
        },
        play: function (element, isCycled = false) {
            let delay = this._steps.reduce(
                (prev, cur) => prev.duration + cur.duration
            );
            if (isCycled) {
                this._createAnimation(element, this._steps);
                let timer = setInterval(
                    this._createAnimation,
                    delay,
                    element,
                    this._steps
                );

                return;
            }
            this._createAnimation(element, this._steps);
            this._steps = [];
        },
        _steps: [],
        _createAnimation: function (element, steps) {
            console.log(steps);
            let delay = 0;
            for (let animation of steps) {
                switch (animation.name) {
                    case 'move':
                        setTimeout(
                            this.move,
                            delay,
                            element,
                            animation.duration,
                            animation.translation
                        );
                        delay += animation.duration;
                        break;
                    case 'scale':
                        setTimeout(
                            this.scale,
                            delay,
                            element,
                            animation.duration,
                            animation.ratio
                        );
                        delay += animation.duration;
                        break;
                    case 'fadeIn':
                        setTimeout(
                            this.fadeIn,
                            delay,
                            element,
                            animation.duration
                        );
                        delay += animation.duration;
                        break;
                    case 'fadeOut':
                        setTimeout(
                            this.fadeOut,
                            delay,
                            element,
                            animation.duration
                        );
                        delay += animation.duration;
                        break;
                    case 'delay':
                        delay += animation.duration;
                        setTimeout(null, delay);
                    default:
                        break;
                }
            }
        },
    };
}
