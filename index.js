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
            fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale(block, 1000, 1.25);
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
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
