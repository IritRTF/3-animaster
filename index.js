addListeners();

let hb = null;
let mh;

function addListeners() {
    const customAnimation = animaster()
    .addMove(200, { x: 40, y: 40 })
    .addScale(800, 1.3)
    .addMove(200, { x: 80, y: 0 })
    .addScale(800, 1)
    .addMove(200, { x: 40, y: -40 })
    .addScale(800, 0.7)
    .addMove(200, { x: 0, y: 0 })
    .addScale(800, 1)
    .buidlHandler();

    document.getElementById('TestBlock')
        .addEventListener('click', customAnimation);

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            mh = animaster().moveAndHide(block, 4000);
        });  

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn( 5000).play(block,false);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            mh.reset();
        });
    document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        if (hb==null)
            hb = animaster().heartBeating(block);
    });
    document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
        if (hb != null)
            hb.stop();
        hb = null;
    });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 6000);
        });
    document.getElementById('fadeOutPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().addFadeOut( 5000).play(block);
    });    
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale( 1000, 1.25).play(block);
        });
}


function Step(name , duration ,resetFunc,data){
    this.name = name , 
    this.duration = duration , 
    this.resetFunc = resetFunc,
    this.data = data
}

function animaster(){

    resetFadeIn = (element) =>{
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };
    resetFadeOut = (element) =>{
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };
    resetMoveAndScale = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };

    let stepCount = 0;
    _steps = []

    addMove = function (duration, translate) {
       _steps.push(new Step('move', duration , 'resetMoveAndScale', translate));
        return this;
    }
    addScale = function (duration, ratio) {
      _steps.push(new Step('scale', duration , 'resetMoveAndScale', ratio));
        return this;
    }
    addFadeIn = function (duration) {
        _steps.push(new Step('fadeIn', duration , 'resetFadeIn'));
        return this;
    }
    addFadeOut = function (duration) {
        _steps.push(new Step('fadeOut', duration, 'resetFadeOut'));
        return this;
    }

    resetDelay = ()=>{} 

    delay = (del) => {
        setTimeout(()=>{} , del);
    }

    addDelay = function(delay){
        _steps.push(new Step('delay',delay,'resetDelay'));
    }
    let cycleTimer;
    play = (element , cycled ) => {

        let step = _steps[stepCount];
        if (stepCount < _steps.length) {
            this[step.name](element, step.duration, step.data);
            stepCount += 1;
            cycleTimer = setTimeout(() => { this.play(element,cycled) }, step.duration);
        }
        else {
            stepCount = 0;
            if (!cycled) return;
            this.play(element,true);
        }
        return {
            stop : ()=>{ clearTimeout(cycleTimer);},
            reset : ()=>{
                clearTimeout(cycleTimer);
                for (step of _steps){
                    this[step.resetFunc](element);
                }
            }
        }
    }

    resetMoveAdnHide = (element) => {
        resetMoveAndScale(element);
        resetFadeOut(element);
    }
    heartBeating = function (element) {
        this.addScale(500,1.4);
        this.addScale(500,1);
        let cycle = this.play(element,true);
        return { stop: () => {cycle.stop(element)} };
    }
    showAndHide = function (element, duration) {
        this.addFadeIn(duration / 3);
        this.addDelay(duration/3);
        this.addFadeOut(duration / 3);
        this.play(element);
    }
    moveAndHide = function (element, duration) {
        this.addMove(2 * duration / 5, { x: 100, y: 20 });
        this.addFadeOut( 3 * duration / 5);
        let play = this.play(element);  
        return {reset : ()=>{play.reset()}}  ; 
    }

    fadeOut = (element, duration) => {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    fadeIn= (element, duration) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');       
    }

    move =  (element, duration, translation) => {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    scale = (element, duration, ratio) =>{
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }   

    buidlHandler = function(){
        let that = this;
        return function () { 
            return that.play(this);
        }
    }

    return {
        buidlHandler,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        delay,
        move,
        scale,
        fadeIn,
        fadeOut,
        moveAndHide,
        resetMoveAdnHide,
        resetMoveAndScale,
        heartBeating,
        showAndHide,
        play
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
