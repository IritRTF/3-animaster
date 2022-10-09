addListeners();

function addListeners() {
/*
// старая версия

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
   */


    // новая версия

    function addAnimation(animation, name, nameReset){
        document.getElementById(name + 'Play')
            .addEventListener('click', function () {
                const block = document.getElementById(name + 'Block');
                let reset = animation.play(block);
                document.getElementById(name + nameReset)
                .addEventListener('click', reset.reset);
            });
    }

    addAnimation(animaster().addFadeIn(5000),'fadeIn', 'Reset');
    addAnimation(animaster().addFadeOut(5000), 'fadeOut', 'Reset');

    addAnimation(animaster()
                    .addMove(500, { x: 50, y: 5 })
                    .addMove(500, { x: 50, y: -20 })
                    .addMove(500, { x: 50, y: 20 }),
                'move', 'Reset');

    addAnimation(animaster().addScale(1000, 1.25), 'scale', 'Reset');

    addAnimation(animaster().addMove(2000, { x: 100, y: 20 }).addFadeOut(3000),
    'moveAndHide',
     'Reset');
     
    addAnimation(animaster()
    .addFadeIn(1000)
    .addDelay(1000)
    .addFadeOut(1000),
                'showAndHide', 'Reset');
    
    addAnimation(animaster()
    .addScale(500, 1.4)
    .addScale(500, 1),
                'heartBeating', 'Stop');

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
        _steps: [],
        _timers: [],
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
        
        moveAndHide(element, duration, translation) {
            this.move(element, (2 * duration) / 5, translation);
            let timer = setTimeout(
                this.fadeOut,
                (2 * duration) / 5,
                element,
                (3 * duration) / 5
            );
            this._timers.push(timer);
            return {
                reset: () => {
                    clearTimeout(timer);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                },
            };
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            let timer = setTimeout(this.fadeOut, (2 * duration) / 3, element, duration / 3);
            this._timers.push(timer);
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
            this._timers.push(heartBeating);
            return {stop() {
                clearInterval(heartBeating);
            }}
        },

        delay(duration){
            let timer = setTimeout(null, duration);
            return {reset(){clearTimeout(timer);}};
        },

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                args:[translation],
            });
            return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                args: [ratio],
            });
            return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        },

        addFadeIn (duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,
                args:[]
            });
            return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        },

        addFadeOut (duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,
                args:[]
            });
            return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        },

        addDelay (duration) {
            this._steps.push({
                name: 'delay',
                duration: duration,
                args:[]
            });
            return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        },

        play(element){
            console.log(this._steps);
            let delay = 0;
            let resets = []
            for (let animation of this._steps) {
                if( animation.name === 'fadeOut'){
                    resets.push(resetFadeOut)
                }
                else if( animation.name === 'fadeIn'){
                    resets.push(resetFadeIn)
                }
                else if(animation.name == 'scale' || animation.name == 'move'){
                    resets.push(resetMoveAndScale);
                }
                this._timers.push(setTimeout(this[animation.name], delay, element, animation.duration, ...animation.args));
                delay += animation.duration;
            }
            return {reset: () => {
                this._timers.forEach(timer => clearInterval(timer));
                resets.forEach(resetFunc => resetFunc(element));
            }}
        },
    }
}
