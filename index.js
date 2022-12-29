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

    let moveAndHide = null;

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide.resetMoveAndHide(block);
        });

    let widthGrowAndMove = null;

    document.getElementById('widthGrowAndMovePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('widthGrowAndMoveBlock');
            widthGrowAndMove = animaster().widthGrowAndMove(block, 1000);
        });

    document.getElementById('widthGrowAndMoveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('widthGrowAndMoveBlock');
            widthGrowAndMove.resetWidthGrowAndMove(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    let heartBeating = null;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
        });

    const rocknrollAnimationHandler = new animaster()
        .addWidthGrowAndMove(500)
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1)
        .addMoveAndHide(1000)
        .addShowAndHide(1000)
        .addFadeIn(500)
        .addHeartBeating()
        .buildHandler();

    document
        .getElementById('rocknrollBlockWithBuilder')
        .addEventListener('click', rocknrollAnimationHandler);

    let rocknroll = null;

    document.getElementById('rocknrollPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('rocknrollBlock');
            rocknroll = new animaster()
            .addWidthGrowAndMove(500)
            .addMove(200, {x: 40, y: 40})
            .addScale(800, 1.3)
            .addMove(200, {x: 80, y: 0})
            .addScale(800, 1)
            .addMove(200, {x: 40, y: -40})
            .addScale(800, 0.7)
            .addMove(200, {x: 0, y: 0})
            .addScale(800, 1)
            .addMoveAndHide(1000)
            .addShowAndHide(1000)
            .addFadeIn(500)
            .addHeartBeating()
            rocknroll.play(block);
        });

    document.getElementById('rocknrollStop')
        .addEventListener('click', function () {
            const block = document.getElementById('rocknrollBlock');
            rocknroll.stop(block);
        });
}


function animaster() {

    this._steps = [];
    
    this.fadeIn = (element, duration) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    
    this.fadeOut = (element, duration) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    this.move = (element, duration, translation) => {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    this.scale = (element, duration, ratio) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    let moveAndHideTimer = null;

    this.moveAndHide = (element, duration) => {
        const firstAnimationTime = duration * 0.4;
        const secondAnimationTime = duration * 0.6;
        this.move(element, firstAnimationTime, {x: 100, y: 20});
        moveAndHideTimer = setTimeout(() => {
            this.fadeOut(element, secondAnimationTime);
        }, firstAnimationTime);
        return this;
    }

    let showAndHideTimer = null;

    this.showAndHide = (element, duration) => {
        const firstAnimationTime = duration * 0.333;
        const secondAnimationTime = duration * 0.666;
        this.fadeIn(element, firstAnimationTime);
        showAndHideTimer = setTimeout(() => {
            this.fadeOut(element, firstAnimationTime);
        }, secondAnimationTime);
    }

    this.widthGrow = (element, duration, width) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.width = `${width}px`;
    }

    let widthGrowAndMoveTimer = null;

    this.widthGrowAndMove = (element, duration) => {
        const animationStep = duration * 0.5;
        this.widthGrow(element, animationStep, 300)
        widthGrowAndMoveTimer = setTimeout(() => {
            this.move(element, animationStep, {x: 200, y: 0});
            this.widthGrow(element, animationStep, 100)
        }, animationStep);
        return this;
    }

    let heartBeatingTimer = null;

    this.heartBeating = (element) => {
        const animationStep = 500;
        this.scale(element, animationStep, 1.4);
        heartBeatingTimer = setTimeout(() => {
            this.scale(element, animationStep, 1);
            heartBeatingTimer = setTimeout(() => {this.heartBeating(element)}, animationStep);
        }, animationStep);
        this.stop = () => {
            this.resetHearthBeating(element);
        }
        return this;
    }

    // reset

    this.resetFadeIn = (element) => {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    this.resetFadeOut = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.resetMove = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    this.resetScale = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    this.resetWidthGrow = (element) => {
        element.style.transitionDuration = null;
        element.style.width = null;
    }

    this.resetMoveAndHide = (element) => {
        this.resetMove(element);
        this.resetFadeOut(element);
        clearTimeout(moveAndHideTimer);
    }

    this.resetHearthBeating = (element) => {
        this.resetScale(element);
        clearTimeout(heartBeatingTimer);
    }

    this.resetShowAndHide = (element) => {
        this.resetFadeOut(element);
        this.resetFadeIn(element);
        clearTimeout(showAndHideTimer);
    }

    this.resetWidthGrowAndMove = (element) => {
        this.resetWidthGrow(element);
        this.resetMove(element);
        clearTimeout(widthGrowAndMoveTimer);
    }

    this.createAnimation = (name, duration, data) => {
        const animation = {
            name: name,
            duration: duration,
            data: data,
        }
        return animation;
    }

    // add

    this.addMove = (duration, data) => {
        this._steps.push( this.createAnimation('move', duration, data) );
        return this;
    }

    this.addScale = (duration, data) => {
        this._steps.push( this.createAnimation('scale', duration, data) );
        return this;
    }

    this.addFadeIn = (duration, data) => {
        this._steps.push( this.createAnimation('fadeIn', duration, data) );
        return this;
    }

    this.addFadeOut = (duration, data) => {
        this._steps.push( this.createAnimation('fadeOut', duration, data) );
        return this;
    }

    this.addMoveAndHide = (duration, data) => {
        this._steps.push( this.createAnimation('moveAndHide', duration, data) );
        return this;
    }

    this.addShowAndHide = (duration, data) => {
        this._steps.push( this.createAnimation('showAndHide', duration, data) );
        return this;
    }

    this.addHeartBeating = (duration, data) => {
        this._steps.push( this.createAnimation('heartBeating', duration, data) );
        return this;
    }

    this.addWidthGrow = (duration, data) => {
        this._steps.push( this.createAnimation('widthGrow', duration, data) );
        return this;
    }

    this.addWidthGrowAndMove = (duration, data) => {
        this._steps.push( this.createAnimation('widthGrowAndMove', duration, data) );
        return this;
    }

    // play

    let animationStep = 0;

    this.play = (element, isInfinite) => {
        const stepsItem = this._steps[animationStep];
        if (animationStep < this._steps.length) {
            this[stepsItem.name](element, stepsItem.duration, stepsItem.data); //animation call
            animationStep += 1;
            setTimeout(() => {
                this.play(element);
            }, stepsItem.duration);
        } else {
            animationStep = 0;
            if (!isInfinite) return;
        }
        this.stop = (element) => {
            this._steps = [];
            const resetFuncName = ['reset'];
            const firstLetter = stepsItem.name.substring(0, 1).toUpperCase();
            resetFuncName.push(firstLetter);
            const letter = stepsItem.name.substring(1);
            resetFuncName.push(letter);
            console.log(resetFuncName.join(''));
            console.log(this[`${resetFuncName.join('')}`]);
            this[`${resetFuncName.join('')}`](element)
        }
        return this;
    }

    // builder

    this.buildHandler = () => {
        const that = this;
        return function () { 
            const element = this;
            const playFunc = () => { that.play(element) }
            playFunc();
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

    return this;

}