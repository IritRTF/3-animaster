addListeners();

const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addDelay(20000)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1)
    .addFadeOut(200)
    .addFadeIn(200);

//Старая версия!
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            //animaster().fadeIn(block, 1000);
            animaster().addFadeIn(1000).play(block);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });
    
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(1000).play(block);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // animaster().move(block, 1000, {x: 100, y: 10});
            customAnimation.play(block); //Открыть при завершении
        });
    
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    // все работает, кайф :) всем бб, завтра еще раз созвонимся, в тг еще спишемся
    let elements = document.getElementsByClassName('resetMoveAndScale')
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function () {
            const block1 = document.getElementById('moveBlock');
            const block2 = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block1);
            animaster().resetMoveAndScale(block2);
        });
    }

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
        
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });
    
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            clearInterval(heartInterval);
        });

    // ++
    // document.getElementById('heartBeatingStop')
    //     .addEventListener('click', function () {
    //         const block = document.getElementById('heartBeatingBlock');
           
    // });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */

 function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

function fadeOut(element, duration){
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
}

function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
}

function moveAndHide(element, duration, translation){
    // move(element, duration*2/5, translation);
    // fadeOut(element, duration*3/5);
    animaster().addMove(duration*2/5, translation).addFadeOut(duration*3/5).play(element);
}

function showAndHide(block, duration)
{
    // fadeIn(block, duration/3);
    // setTimeout(fadeOut, duration/3, block, duration/3); //работает :)
    animaster().addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(block);
}

//один удар
function heartBeat(block)
{   
    if (block.style.getPropertyValue("transform") == "scale(1.4)") // working
        scale(block, 500, (10/14));
    else
        scale(block, 500, 1.4);
}

//много ударов
function heartBeating(block){
    obj = {};
    // heartInterval = setInterval(heartBeat, 100, block)
    animaster().addScale(500, (10/14)).addDelay(500).addScale(500, 1.4).addDelay(5000).play(block, true);
    return obj;
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

//Добавление базовых функции
function addMove(duration, translation) {
    this._steps.push(["move", duration, translation]);
    return this;
}

function addScale(duration, ratio) {
    this._steps.push(["scale", duration, ratio]);
    return this;
}

function addFadeIn(duration) {
    this._steps.push(["fadeIn", duration]);
    return this;
}

function addFadeOut(duration){
    this._steps.push(["fadeOut", duration]);
    return this;
}
  
function addDelay(duration){
    this._steps.push(["delay", duration]);
    return this;
}

function playStep(block, isCycled, animation){
    if (animation._steps.length > 0){
        step = animation._steps[0];
        if (!isCycled) 
            animation._steps.shift();
        else{
            animation._steps.push(animation._steps.shift());
            playAnimationInterval = setInterval(playStep, step[1], block, animation);
        }
        switch(step[0]) {
            case "move":    
                move(block, step[1], step[2]);
                break;
            case 'scale':
                scale(block, step[1], step[2]);
                break;               
            case 'fadeIn':
                fadeIn(block, step[1]);
                break;
            case 'fadeOut':
                fadeOut(block, step[1]);
                break;
            case 'delay':
                setTimeout(playStep, 1000, step[1], block, animation);
                break;
            default:
                break;
            }        
    }
    else 
        // clearInterval(playAnimationInterval);
        animation.reset();
}

function play(block, isCycled = false){
    playAnimationInterval = setInterval(playStep, 100, block, isCycled, this);
    obj = {
        reset: function(){return block;},
        stop: function(){return 0;}
    };
    return obj;
}

function animaster(){
    let obj = {
        _steps: [],
        //Вынести служ функции из obj?
        resetFadeIn: function(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut: function(element){
            element.style.transitionDuration = null;
            element.classList.add('show');
            element.classList.remove('hide');
        },

        resetMoveAndScale: function(element){
            element.style.transitionDuration = null;
            element.style.transform = getTransform(null, null);
            element.style.opacity = null;
        },

        resetMoveAndHide: function(element){
            console.log('click');
            element.style.transitionDuration = null;
            element.classList.add('show');
            element.classList.remove('hide');
            element.style.transform =  getTransform(null, null);
        }
    };
    obj.fadeIn = fadeIn;
    obj.fadeOut = fadeOut;
    obj.showAndHide = showAndHide;
    obj.moveAndHide = moveAndHide;
    obj.heartBeating = heartBeating;
    obj.move = move;
    obj.scale = scale;
    obj.addMove = addMove;
    obj.addScale = addScale;
    obj.addDelay = addDelay;
    obj.play = play;
    obj.addFadeIn = addFadeIn;
    obj.addFadeOut = addFadeOut;

    return obj;
}
