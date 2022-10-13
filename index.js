addListeners();

/*
* move + scale - НЕ РАБОТАЮТ!!! (изза того что, в move в ratio передается нулл, а в scale, translation = null)
* поэтому либо их нужно менять, либо менять работу getTransformer, чтобы он просто не менял
* исходное местоположение и исходный размер
*/


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

    //проверка работспособности 16 пункта
    const a = animaster().addMove(111, {x: 10, y: -10})
    const b = a.addFadeOut(400);

    function addAnimation(animation, name, nameReset, cycled = false){
        const block = document.getElementById(name + 'Block');
        document.getElementById(name + 'Play')
            .addEventListener('click', () =>  animation.play(block, cycled));
        document.getElementById(name + nameReset)
            .addEventListener('click', () => animation.reset(block));
    }

    const FADE_IN = animaster().addFadeIn(5000);
    const FADE_OUT = animaster().addFadeOut(5000);
    const MOVE = animaster().addMove(500, { x: 50, y: 5 }).addMove(500, { x: 50, y: -20 }).addMove(500, { x: 50, y: 20 });
    const SCALE = animaster().addScale(1000, 1.25);
    const ROTATE = animaster().addRotate(2000, 180);
    const MOVE_AND_HIDE = animaster().addMove(1000, { x: 100, y: 20 }).addFadeOut(1500);
    const SHOW_AND_HIDE = animaster().addFadeIn(1000).addDelay(1000).addFadeOut(1000);
    const HEART_BEATING = animaster().addScale(500, 1.4).addScale(500, 1);
    
    const customAnimation = animaster()
                .addMove(800, {x: 40, y: 40})
                .addMove(800, {x: 80, y: 0})
                .addMove(800, {x: 40, y: -40})
                .addMove(800, {x: 0, y: 0})

    addAnimation(FADE_IN,'fadeIn', 'Reset');
    addAnimation(FADE_OUT, 'fadeOut', 'Reset');
    addAnimation(MOVE,'move', 'Reset');
    addAnimation(SCALE, 'scale', 'Reset');
    addAnimation(ROTATE, "rotate", "Reset");
    addAnimation(MOVE_AND_HIDE, 'moveAndHide','Reset', true);
    addAnimation(SHOW_AND_HIDE, 'showAndHide', 'Reset', true);
    addAnimation(HEART_BEATING, 'heartBeating', 'Stop', true);
    addAnimation(customAnimation, "custom", "Reset", true);
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
        _cycledTimer: null,
        _resets: [],
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
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {reset(){resetMoveAndScale(element)}};
        },
        
        rotate(element, duration, angle){
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = `rotate(${-angle}deg)`;
            return {reset(){resetMoveAndScale(element)}}
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

        //по факту реализации - это заглушка, чтоб ошибок не было, смысла сюда что то писать не имеет - 
        //только засоряет стек(ну, если бы в js было бы что то вроде Thread.Slepp, то, наверное, этот метод
        // имел смысл)
        delay(duration){
        },

        _addAnimation(name, duration, ...args){
            let clone = this._getClone();
            clone._steps.push({
                name: name,
                duration: duration,
                args: args,
            });
            return clone;
        },

        addMove(duration, translation) {
            return this._addAnimation('move', duration, translation);
        },

        addScale(duration, ratio) {
            return this._addAnimation('scale', duration, ratio);
        },

        addFadeIn (duration) {
            return this._addAnimation('fadeIn', duration);
        },

        addFadeOut (duration) {
            return this._addAnimation('fadeOut', duration);
        },

        addDelay (duration) {
            return this._addAnimation('delay', duration);
        },

        addRotate(duration, angle){
            return this._addAnimation('rotate', duration, angle);
        },

        play(element, cycled = false){

            if (!cycled){
                this._createAnimation(element);
                return {reset: () => this.reset(element)};
            }

            let clear = () => {
                console.log(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
                this._timers.reverse().forEach(timer => clearInterval(timer));
                this._resets.reverse().forEach(resetFunc => resetFunc(element));
                this._timers = [];
                this._resets = [];
            }

            let delay = this._createAnimation(element);
            this._timers.push(setTimeout(clear, delay));
            
            this._cycledTimer = setInterval(() =>{
                this._createAnimation(element);                    
                this._timers.push(setTimeout(clear, delay + 15))
            }, delay + 50);
            
            return {reset: () => this.reset(element)};
        },

        reset(element){
            this._timers.reverse().forEach(timer => clearInterval(timer));
            this._resets.reverse().forEach(resetFunc => resetFunc(element));
            clearInterval(this._cycledTimer);
        },

        _createAnimation(element){
            let delay = 0;
            for (let animation of this._steps) {
                if( animation.name === 'fadeOut'){
                    this._resets.push(resetFadeOut)
                }
                else if( animation.name === 'fadeIn'){
                    this._resets.push(resetFadeIn)
                }
                else if(animation.name == 'scale' || animation.name == 'move' || animation.name == 'rotate'){
                    this._resets.push(resetMoveAndScale);
                }
                this._timers.push(setTimeout(this[animation.name], delay, element, animation.duration, ...animation.args));
                delay += animation.duration;
            }
            return delay;
        },

        _getClone(){
            let clone = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
            clone._steps = []
            clone._timers = []
            this._steps.forEach(step => clone._steps.push(step));
            this._timers.forEach(timer => clone._timers.push(timer));
            return clone;
        }
    }
}
