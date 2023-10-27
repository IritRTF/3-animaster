addListeners();
let inter1
let inter2
let save=[]


function addListeners() {
    const fadeInPlayBtn = document.getElementById('fadeInPlay');
    const resetFadeInBtn = document.getElementById('resetFadeIn');
    const fadeOutPlayBtn = document.getElementById('fadeOutPlay');
    const resetFadeOutBtn = document.getElementById('resetfadeOutPlay');
    const movePlayBtn = document.getElementById('movePlay');
    const scalePlayBtn = document.getElementById('scalePlay');
    const moveAndHidePlayBtn = document.getElementById('moveAndHidePlay');
    const moveAndHideResetBtn = document.getElementById('moveAndHideReset');
    const showAndHidePlayBtn = document.getElementById('showAndHidePlay');
    const heartBeatingPlayBtn = document.getElementById('heartBeatingPlay');
    const heartBeatingStopBtn = document.getElementById('heartBeatingStop');
    const customAnimationBtn = document.getElementById('customAnimation');
  
    const fadeInBlock = document.getElementById('fadeInBlock');
    const fadeOutBlock = document.getElementById('fadeOutBlock');
    const moveBlock = document.getElementById('moveBlock');
    const scaleBlock = document.getElementById('scaleBlock');
    const moveAndHideBlock = document.getElementById('moveAndHideBlock');
    const showAndHideBlock = document.getElementById('showAndHideBlock');
    const heartBeatingBlock = document.getElementById('heartBeatingBlock');
    const customAnimationBlock = document.getElementById('customAnimationBlock');
  
    fadeInPlayBtn.addEventListener('click', function () {
      animaster().addFadeIn(5000).play(fadeInBlock);
    });
  
    resetFadeInBtn.addEventListener('click', function () {
      animaster().resetFadeIn(fadeInBlock);
    });
  
    fadeOutPlayBtn.addEventListener('click', function () {
      animaster().addFadeOut(5000).play(fadeOutBlock);
    });
  
    resetFadeOutBtn.addEventListener('click', function () {
      animaster().resetFadeOut(fadeOutBlock);
    });
  
    movePlayBtn.addEventListener('click', function () {
      animaster().addMove(500, { x: 20, y: 20 }).play(moveBlock);
    });
  
    scalePlayBtn.addEventListener('click', function () {
      animaster().addScale(1000, 1.25).play(scaleBlock);
    });
  
    moveAndHidePlayBtn.addEventListener('click', function () {
      animaster()
        .addMove(1000, { x: 100, y: 20 })
        .addFadeOut(1000)
        .play(moveAndHideBlock);
    });
  
    moveAndHideResetBtn.addEventListener('click', function () {
      animaster().resetMoveAndHide(moveAndHideBlock);
    });
  
    showAndHidePlayBtn.addEventListener('click', function () {
      animaster()
        .addFadeIn(5000 / 3)
        .addDelay(5000 / 3)
        .addFadeOut(5000 / 3)
        .play(showAndHideBlock);
    });
  
    heartBeatingPlayBtn.addEventListener('click', function () {
      animaster().heartBeating().start(heartBeatingBlock, 1000, 1);
    });
  
    heartBeatingStopBtn.addEventListener('click', function () {
      animaster().heartBeating().stop(heartBeatingBlock, 1);
    });
  
    customAnimationBtn.addEventListener('click', function () {
      const customAnimation = animaster()
        .addMove(200, { x: 40, y: 40 })
        .addScale(800, 1.3)
        .addMove(200, { x: 80, y: 0 })
        .addScale(800, 1)
        .addMove(200, { x: 40, y: -40 })
        .addScale(800, 0.7)
        .addMove(200, { x: 0, y: 0 })
        .addScale(800, 1);
      customAnimation.play(customAnimationBlock);
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
         * @param element 
         * @param duration 
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
                        const halfDuration = duration / 2;
                        const transformRatio = 1.4;
            
                        element.style.transitionDuration = `${halfDuration}ms`;
                        element.style.transform = getTransform(null, transformRatio);

            inter1 = setInterval(() => {
                element.style.transitionDuration = `${halfDuration}ms`;
                element.style.transform = getTransform(null, ratio);
            }, halfDuration);
            
            inter2 = setInterval(() => {
                element.style.transitionDuration = `${halfDuration}ms`;
                element.style.transform = getTransform(null, transformRatio);
            }, duration);
                    },

                    stop:function (element,ratio){
                        clearInterval(inter1);
                        clearInterval(inter2);
                        element.style.transitionDuration = '0ms';
                        element.style.transform = getTransform(null, ratio);
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
