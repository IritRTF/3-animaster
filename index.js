addListeners();
let inter1
let inter2
let save=[]

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            //animaster().fadeIn(block, 5000);
            animaster().addFadeIn(5000).play(block);
        });
   document.getElementById('resetFadeIn')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block)
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            //animaster().fadeOut(block, 5000);
            animaster().addFadeOut(5000).play(block)
            
        });    
    
    document.getElementById('resetfadeOutPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().resetFadeOut(block);
        
    }); 

    document.getElementById('movePlay')//////////
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //animaster().move(block, 1000, {x: 100, y: 10});
            animaster().addMove(500, {x: 20, y:20}).play(block)
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            //animaster().scale(block, 1000, 1.25);
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            //animaster().moveAndHide(block, 1000,{x: 100, y: 20});
            animaster().addMove(1000, {x: 100, y: 20}).addFadeOut(1000).play(block);
        });

    document.getElementById('moveAndHideReset')
    .addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        animaster().resetMoveAndHide(block);
    });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            //animaster().showAndHide(block, 5000);
            animaster().addFadeIn(5000/3).addDelay(5000/3).addFadeOut(5000/3).play(block);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        animaster().heartBeating().start(block, 1000, 1);
    });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        animaster().heartBeating().stop(block,1);
    });

    document.getElementById('customAnimation')
        .addEventListener('click', function() {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });
}

function animaster(){
    this.steps = [];
    return{
        resetFadeIn:function(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut:function(element){
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetMoveAndScale:function(){
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn:function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut:function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');            
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move:function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale:function (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */

        moveAndHide(element, duration, translation) {
            this.move(element, duration * 2 / 5, translation);
            this.fadeOut(element, duration * 3 / 5);
        },
        resetMoveAndHide(element) {      
            element.style.transitionDuration = null;
            element.style.transform = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */

        
        showAndHide:function(element,duration){
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },
        
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        heartBeating:function () {
                return {
                    start:function (element, duration, ratio) {
                        element.style.transitionDuration =  `${duration/2}ms`;
                        element.style.transform = getTransform(null, ratio*1.4);
                        inter1= setInterval(() =>{
                        element.style.transitionDuration =  `${duration/2}ms`;
                        element.style.transform = getTransform(null, ratio);},duration/2);
                        inter2= setInterval(() =>{
                        element.style.transitionDuration =  `${duration/2}ms`;
                        element.style.transform = getTransform(null, ratio*1.4);},duration);
                    },

                    stop:function (element,ratio){
                        clearInterval(inter1)
                        clearInterval(inter2)
                        element.style.transitionDuration =  `${0}ms`;
                        element.style.transform = getTransform(null, ratio)
                    }
                }
        },
        wait(duration) {
                    setTimeout(duration);
                },
        
        play(element,  cycled = false) {
            let sum = 0;
            for (let step of steps) {
                setTimeout(() => this[step.animation](element, step.duration, ...step.other), sum);
                sum += step.duration;
            }
        },

        addMove:function (duration, translation){
            return this.addAnimation('move', duration, translation);
        },

        addScale(duration, ratio) {
            return this.addAnimation('scale', duration, ratio);
        },

        addFadeIn(duration) {
            return this.addAnimation('fadeIn', duration);
        },

        addFadeOut(duration) {
            return this.addAnimation('fadeOut', duration);
        },

        addDelay(duration) {
            return this.addAnimation('wait', duration);
        },

        addAnimation(animation, duration, ...other) {
            steps.push({
                animation,
                duration,
                other
            });
            return this;
        }
        

    }
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        console.log(translation)
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
