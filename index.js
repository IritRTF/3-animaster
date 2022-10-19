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

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            customAnimation.play(block);
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
    
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
    });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 999);
        });
        
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {

            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
            
    });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
            
    });
    // ПРОБЛЕМА ТУТ
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
    });
    
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
//Базовые функции 
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

//Добавление базовых функции
function addMove(duration, translation) {
    this.__steps.push(["move", duration, translation]);
    return this;
}

function addScale(duration, ratio) {
    this.__steps.push(["scale", duration, ratio]);
    return this;
}

function addFadeIn(duration) {
    this.__steps.push(["fadeIn", duration]);
    return this;
}

function addFadeOut(duration){
    this.__steps.push(["fadeOut", duration]);
    return this;
}
  
function addDelay(duration){
    this.__steps.push(["delay", duration]);
    return this;
}
// ПРОБЛЕМЫ ТУТ + 72319879479217 миллионов ошибок в консоле
function playStep(block, isCycled, animation){
    if (animation.__steps.length > 0){
        step = animation.__steps[0];
        if (!isCycled) 
            animation.__steps.shift();
        else{
            animation.__steps.push(animation.__steps.shift());
            playAnimationInterval=clearInterval(playStep, 1000, step[1], block, animation);}
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
                playAnimationInterval=clearInterval(playStep, 1000, step[1], block, animation);
                break;
            default:
                break;
            }         
    }
    else 
        clearInterval(playAnimationInterval); // ПРОБЛЕМА ТУТ
}

// ПРОБЛЕМЫ ТУТ
function play(block, isCycled = false){
    playAnimationInterval = setInterval(playStep, 100, block, isCycled, this);
    return obj = {
        reset(){console.log(`${block} was reseted`); return block;},
        stop(){clearInterval(playAnimationInterval);}
    }
}

function moveAndHide(element, duration, translation){
    animaster().addMove(duration*2/5, translation).addFadeOut(duration*3/5).play(element);
}

function showAndHide(element, duration){
    animaster().addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
}

function heartBeating(block){
    animaster().addScale(500, (10/14)).addDelay(500).addScale(500, 1.4).addDelay(5000).play(block, true)
    
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
    let obj = {
        resetFadeIn: function(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
            element.style.opacity = null;
        },

        resetFadeOut: function(element){
            element.style.transitionDuration = null;
            element.classList.add('show');
            element.classList.remove('hide');
            element.style.opacity = null;
        },
        resetMoveAndScale: function(element){
            element.style.transitionDuration = null;
            element.style.transform = getTransform(null, null);
            element.style.opacity = null;
        }, 
        resetMoveAndHide: function(element){
            element.style.transitionDuration = null;
            element.style.transform = getTransform(null, null);
            element.style.opacity = null;
            element.classList.add('show');
            element.classList.remove('hide');
        }
    };
    obj.__steps = [];
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
};