addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });
    
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function(){
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000, {x: 100, y: 20});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function(){
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 4000);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function(){
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, 500, 1.4);
        });
    
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function(){
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, stop());
        })
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

function animaster() {
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
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide(element, duration, translation) {
            this.move(element, 2 * duration / 5, translation);
            let timerToMove = setTimeout(this.fadeOut, 2 * duration / 5, element, 3 * duration / 5);
            push(timerToMove);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            let timerToMove = setTimeout(this.fadeOut, 2 * duration / 3, element, duration / 3);
            push(timerToMove);
        },

        heartBeating(element, duration, ratio) {
            let beat = () => {this.scale(element, duration, ratio);
            setTimeout(this.scale, duration, element, duration, 1);} /*возвращение в default*/
            beat();
            let heartBeating = setInterval(beat, duration * 3);
            push(heartBeating);
            return {stop() {clearInterval(heartBeating)}}
        }
    }
}