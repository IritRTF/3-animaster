addListeners();


function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(2500).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(2500).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(2500, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(2500, 1.25).play(block);
        });


    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster()
                .addMove(2500, { x: 100, y: 20 })
                .addFadeOut(2500)
                .play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().fadeIn(block, 2500);
            let heartBeatingStop = animaster().heartBeating(block, 2500);
            document
                .getElementById("heartBeatingStop")
                .addEventListener("click", heartBeatingStop.stop);

        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
                .addFadeIn(2500)
                .addDelay(2500)
                .addFadeOut(2500)
                .play(block);
        });


    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('customAnimation')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1);
            customAnimation.play(block);
        });
}


function animaster() {
    this.steps = [];
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
            this.move(element, duration * (2 / 5), translation);
            this.fadeOut(element, duration * (3 / 5));
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration * (1 / 3));
            setTimeout(() => this.fadeOut(element, duration * (1 / 3)), duration * (1 / 3));
        },

        heartBeating(element, duration) {
            let beat = () => {
                this.scale(element, duration / 2, 1.4);
                setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
            };
            let beating = setInterval(beat, duration);

            return {
                stop() {
                    clearInterval(beating);
                }
            };
        },

        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetMoveAndHide(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        addMove(duration, translation) {
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

        play(element, cycled = false) {
            let sum = 0;
            for (let step of steps) {
                setTimeout(
                    () => this[step.animation](element, step.duration, ...step.other),
                    sum
                );
                sum += step.duration;
            }
        },

        wait(duration) {
            setTimeout(duration);
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
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}