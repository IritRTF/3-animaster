addListeners();

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
            animaster().move(block, 1000, {x: 100, y: 10});
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

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            clearInterval(heartInterval);
        });
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
    move(element, duration*2/5, translation);
    fadeOut(element, duration*3/5);
}

function showAndHide(block, duration)
{
    fadeIn(block, duration/3);
    setTimeout(fadeOut, duration/3, block, duration/3); //работает :)
}

//один удар
function heartBeat(block)
{
    if (block.style.getPropertyValue("transform") === "scale(1.4)") // working
        scale(block, 500, (10/14));
    else
        scale(block, 500, 1.4);
}

//много ударов
function heartBeating(block){
    // obj = {};
    heartInterval = setInterval(heartBeat, 100, block)
    //return obj;
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
            element.classList.remove('show');
            element.classList.add('hide');
            element.style.opacity = null;
        },

        resetFadeOut: function(element){
            element.classList.add('show');
            element.classList.remove('hide');
            element.style.opacity = null;
        },
        resetMoveAndScale: function(element){
            element.style.transform = getTransform(null, null);
            element.style.opacity = null;
        }
    };
    obj.fadeIn = fadeIn;
    obj.fadeOut = fadeOut;
    obj.showAndHide = showAndHide;
    obj.moveAndHide = moveAndHide;
    obj.heartBeating = heartBeating;
    obj.move = move;
    obj.scale = scale;
    return obj;
}
