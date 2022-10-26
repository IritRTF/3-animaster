const count = (arr) => arr.reduce((acc, num) => acc + num, 0);
addListeners();

function addListeners() {
    let a
    let b
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster()
            .addFadeIn(5000)
            .play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()
            .addMove(1000, {x: 100, y: 10})
            .play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster()
            .addScale(1000, 1.25)
            .play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster()
            .addFadeOut(5000)
            .play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            if (b === undefined) b = animaster()
                .addMove(2000, {x: 100, y: 20})
                .addFadeOut(3000)
                .play(block);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (b !== undefined) {
                b.reset()
                b = undefined
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
            .addFadeIn(1000)
            .addDelay(1000)
            .addFadeOut(1000)
            .play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (a === undefined) a = animaster()
            .addScale(500, 1.4)
            .addScale(500, 1)
            .play(block, true);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (a !== undefined) {
                a.stop()
                a = undefined
            }
        });

    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
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

    let worryAnimationHandler = animaster()
    let x = 0
    let y = 0
    for(let i = 0; i < 200; i += 0.1){
        let newX = i * 20
        let newY = Math.sin(i) * 300
        worryAnimationHandler = worryAnimationHandler.addMove(10, {x: newX, y: newY - y})
        x = newX
        y = newY
    }
    worryAnimationHandler = worryAnimationHandler.buildHandler();

    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
}

function animaster() { 
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null, element.style.transform);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio, element.style.transform);
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function delay(element) {
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null
        element.classList.remove('show') 
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null
        element.classList.remove('hide')   
        element.classList.add('show')  
    }
 
    function resetMoveAndScale(element) {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }

    let reverseActions = new Map();
    reverseActions.set(fadeIn, resetFadeIn);
    reverseActions.set(fadeOut, resetFadeOut);
    reverseActions.set(move, resetMoveAndScale);
    reverseActions.set(scale, resetMoveAndScale);
    reverseActions.set(delay, delay);

    function addAction(obj, action) {
        let newObj = Object.assign({}, obj);
        newObj._steps = Object.assign([], obj._steps);     
        newObj._steps.push(action)  
        return newObj
    }
    
    return {
        _steps: [],
        addMove() { return addAction(this, {func: move, duration: arguments[0], param: arguments[1]}) },
        addScale() { return addAction(this, {func: scale, duration: arguments[0], param: arguments[1]}) },
        addFadeIn() { return addAction(this, {func: fadeIn, duration: arguments[0]}) },
        addFadeOut() { return addAction(this, {func: fadeOut, duration: arguments[0]}) },
        addDelay() { return addAction(this, {func: delay, duration: arguments[0]}) },
        play(element, cycled) {
            let play_actions = () => {
                let time = 0 
                for(let i= 0; i< this._steps.length; i++)
                {
                    setTimeout(() => this._steps[i].func(element, this._steps[i].duration, this._steps[i].param), time)
                    time += this._steps[i].duration
                }
            }
            
            let interval
            play_actions();
            if (cycled) interval = setInterval(() => play_actions(), this._steps.reduce((a, b) => a.duration + b.duration));

            return {
                reset: () => {
                    for(let i= 0; i< this._steps.length; i++)
                        reverseActions.get(this._steps[i].func)(element)
                    this._steps = []
                    }, 
                stop: () => {
                    clearInterval(interval);
                    }
            }
        },
        buildHandler(){
            return (event) => this.play(event.target);
        }
    }
}


function getTransform(translation, ratio, oldStr) {
    let tr 
    let sc
    if (/translate\(([^)]+)\)/.exec(oldStr) !== null) tr = /translate\(([^)]+)\)/.exec(oldStr)[0]
    if (/scale\(([^)]+)\)/.exec(oldStr) !== null) sc = /scale\(([^)]+)\)/.exec(oldStr)[0]

    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    else if (tr != undefined) result.push(tr)
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    else if (sc != undefined) result.push(sc)
    return result.join(' ');
}
