class Animaster {
    constructor() {
        this._steps = []
    }

    static #getTransform(translation = null, ratio = null, angle = null) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        if (angle) {
            result.push(`rotate(${angle}deg)`);
        }

        return result.join(' ');
    }

    static #setFade(element, show) {
        element.classList.remove(show ? 'hide' : 'show');
        element.classList.add(show ? 'show' : 'hide');
    }

    static #setCustom (element, scale = null, radius = null) {
        element.style.transform = `scale(${scale})`;
        element.style.borderRadius = `${radius}%`;
    }

    play(element, cycled = false) {
        let tick;
        let timerId = setTimeout(tick = index => {
            element.style.transitionDuration = `${this._steps[index].duration}ms`;
            this._steps[index].action(element);
            if (cycled === true || index < this._steps.length - 1)
                timerId = setTimeout(tick, Math.round(this._steps[index].duration),
                    (index + 1) % this._steps.length);
        }, 0, 0);
        return {
            stop: () => {
                clearTimeout(timerId);
            },

            reset: () => {
                element.style.transitionDuration = null;
                this._steps.slice().reverse().forEach(s => s.undo(element));
            }
        }
    }

    buildHandler() {
        let animasterObj = this;
        return function () {
            return animasterObj.play(this);
        };
    }

    clone() {
        let newAnimaster = new Animaster();
        newAnimaster._steps = this._steps.slice();
        return newAnimaster;
    }

    addFadeIn(duration) {
        let clone = this.clone();
        clone._steps.push({
            duration,
            action: element => Animaster.#setFade(element, true),
            undo: element => Animaster.#setFade(element, false)
        });
        return clone;
    }

    addFadeOut(duration) {
        let clone = this.clone();
        clone._steps.push({
            duration,
            action: element => Animaster.#setFade(element, false),
            undo: element => Animaster.#setFade(element, true)
        });
        return clone;
    }

    addMove(duration, translation) {
        let clone = this.clone();
        clone._steps.push({
            duration,
            action: element => element.style.transform = Animaster.#getTransform(translation),
            undo: element => element.style.transform = Animaster.#getTransform()
        });
        return clone;
    }

    addScale(duration, ratio) {
        let clone = this.clone();
        clone._steps.push({
            duration,
            action: element => element.style.transform = Animaster.#getTransform(null, ratio),
            undo: element => element.style.transform = Animaster.#getTransform()
        });
        return clone;
    }

    addDelay(duration) {
        let clone = this.clone();
        clone._steps.push({
            duration,
            action: () => null,
            undo: () => null
        });
        return clone;
    }

    addCustom(duration, scale, radius) {
        let clone = this.clone();
        clone._steps.push({
            duration,
            action: element => Animaster.#setCustom(element, scale, radius),
            undo: element => Animaster.#setCustom(element)
        });
        return clone;
    }

    fadeIn(duration) {
        return this.addFadeIn(duration);
    }

    fadeOut(duration) {
        return this.addFadeOut(duration);
    }

    move(duration, translation) {
        return this.addMove(duration, translation);
    }

    scale(duration, ratio) {
        return this.addScale(duration, ratio);
    }

    moveAndHide(duration, translation) {
        return this
            .addMove(duration, translation)
            .addFadeOut(duration)
    }

    showAndHide(duration) {
        return this
            .addFadeIn(duration / 2)
            .addDelay(duration / 2)
            .addFadeOut(duration / 2)
    }

    heartBeating() {
        return this
            .addScale(250, 1.4)
            .addScale(250, 1)
            .addDelay(25)
            .addScale(250, 1.4)
            .addScale(250, 1)
            .addDelay(500)
    }
}

function addListeners(cycled, ...listeners) {
    for (let listener of listeners) {
        let block = document.getElementById(listener[0] + 'Block');
        let execute = document.getElementById(listener[0] + (cycled ? 'Stop' : 'Reset'));
        let animasterObj = new Animaster()[listener[0]](...listener.slice(1))
        document.getElementById(listener[0] + 'Play')
            .addEventListener('click', function () {
                let executor = animasterObj.play(block, cycled);
                execute.addEventListener('click', cycled ? executor.stop : executor.reset)
            });
    }
}

addListeners(false,
    ['fadeIn', 5000],
    ['fadeOut', 5000],
    ['move', 1000, {x: 100, y: 10}],
    ['scale', 1000, 1.25],
    ['moveAndHide', 1000, {x: 100, y: 10}],
    ['showAndHide', 1000]);

addListeners(true, ['heartBeating']);

const worryAnimationHandler = new Animaster()
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .buildHandler();

document
    .getElementById('worryAnimationBlock')
    .addEventListener('click', worryAnimationHandler);

const customHandler = new Animaster()
    .addCustom(500, 2, 50)
    .addDelay(200)
    .addCustom(500, 1, 0)
    .buildHandler();

document
    .getElementById('customBlock')
    .addEventListener('click', customHandler);