addListeners();

function addListeners() {
    let master = animaster();

    function addAnimation(name,nameReset, ...args){
        document.getElementById(name + 'Play')
            .addEventListener('click', function () {
                const block = document.getElementById(name + 'Block');
                let func = master[name](block,...args);
                document.getElementById(name + nameReset)
                .addEventListener('click', func[nameReset.toLowerCase()]);
            });
    }

    addAnimation('fadeIn', 'Reset', 5000);
    addAnimation('fadeOut', 'Reset', 5000);
    addAnimation('move', 'Reset', 1000, {x: 100, y: 0});
    addAnimation('scale', 'Reset', 1000, 1.25);
    addAnimation('moveAndHide', 'Reset', 5000, {x: 100, y: 20});
    addAnimation('showAndHide', 'Reset', 5000);
    addAnimation('heartBeating', 'Stop', 500, 1.4);
    
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
