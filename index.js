addListeners();

function addListeners() {
    let cycledAnimation = 0;
    let cycledAnimation2 = 0;
    const worryAnimationHandler = animaster()
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .buildHandler();

    document.getElementById('worryAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('worryAnimationBlock');
            cycledAnimation2 = animaster().addMove(1000,{x: 100, y: 0}).addMove(1000,{x: -100, y: 0}).play(block,true);
        });

    document.getElementById('worryAnimationStop')
        .addEventListener('click', function () {
            cycledAnimation2.stop();
        });

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000,1.25).play(block);
        });

    document.getElementById('fadeOutPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().addFadeOut(5000).play(block);
    });

    document.getElementById('moveAndHidePlay')
    .addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        animaster().moveAndHide(block, 5000);
    });

    document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 3000);
    });

    document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        cycledAnimation = animaster().heartBeating(block);
    });

    document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
        cycledAnimation.stop();
    });

    document.getElementById('moveAndHideReset')
    .addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        animaster().resetMoveAndHide(block);
    })

    document.getElementById('customAnimationPlay')
    .addEventListener('click', function () {
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
    })
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */


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
    let _steps = [];

    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.style.opacity = null;
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
        element.style.opacity = null;
    }

    function resetMoveAndScale(element){   
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.style.opacity = null;
    }

    function resetMoveAndHide(element){
        resetMoveAndScale(element);
        resetFadeIn(element);
    }

    function fadeIn() {
        element = arguments[0];
        duration = arguments[1];
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move() {
        element = arguments[0];
        duration = arguments[1];
        translation = arguments[2];
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale() {
        element = arguments[0];
        duration = arguments[1];
        ratio = arguments[2];
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
    
    function fadeOut() {
        element = arguments[0];
        duration = arguments[1];
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function moveAndHide(){   
        element = arguments[0];
        duration = arguments[1];
        firstPart = duration/5 * 2;
        secondPart = duration/5 * 3;
        this.addMove(firstPart,{x: 100,y: 20})
            .addFadeOut(secondPart)
            .play(element);
    }

    function showAndHide(element,duration){   
        this.addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
    }

    function doNothing(){   
        console.log("Nothing is happend");
    }

    function heartBeating(element){    
        return this.addScale(500,1.4)
        .addScale(500,1)
        .play(element,true);
    }

    function addMove(duration,translation){
        this._steps.push([move,duration,translation]);
        return this;
    }

    function addDelay(duration){   
        this._steps.push([doNothing,duration,]);
        return this;
    }

    function addScale(duration,ratio){
        this._steps.push([scale,duration,ratio]);
        return this;
    }

    function addFadeIn(duration){   
        this._steps.push([fadeIn,duration,]);
        return this;
    }
    function addFadeOut(duration){    
        this._steps.push([fadeOut,duration,]);
        return this;
    }

    function playstep(list,indexer,delay,element,cycled){
        if(cycled)
        {
            let length = 0
            for (let i = 0; i<list.length;i++){            
                length += list[i][1];
            }
            return setInterval(playstep,length,list,0,0,element,false);
        }
        else{
            setTimeout(list[indexer][0],delay,element,list[indexer][1],list[indexer][2],cycled);
            if(indexer + 1 != list.length){           
                playstep(list,indexer+1,delay+list[indexer][1],element,cycled);
            } 
        }
    }

    function play(element,cycled){
        interval_number = playstep(_steps,0,0,element,cycled)
        function stop(){   
            clearInterval(interval_number);
            resetMoveAndScale(element);
        }
        return {
            stop:stop
        }
    }

    function buildHandler(){
        _steps = this._steps;
        return this.play
    }

    return {
        fadeIn:fadeIn,
        move:move,
        scale:scale,
        fadeOut:fadeOut,
        moveAndHide:moveAndHide,
        showAndHide:showAndHide,
        heartBeating:heartBeating,
        resetMoveAndHide:resetMoveAndHide,
        addMove:addMove,
        addScale:addScale,
        addFadeIn:addFadeIn,
        addFadeOut:addFadeOut,
        play:play,
        addDelay:addDelay,
        buildHandler:buildHandler,
        _steps:_steps
    }
}
