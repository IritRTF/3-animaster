addListeners();

function addListeners() {
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y:20}).play(block);
            this.disabled = true;
            document.getElementById('moveReset')
                .addEventListener('click', function () {
                    animaster().addResetMove().play(block);
                    document.getElementById('movePlay').disabled = false;
                });
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().addMoveAndHide(1000, {x: 100, y: 20}).play(block);
            this.disabled = true;
            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    animaster().addResetMoveAndHide().play(block);
                    document.getElementById('moveAndHidePlay').disabled = false;
                });
            
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
            this.disabled = true;
            document.getElementById('scalePlayReset')
                .addEventListener('click', function () {
                    animaster().addResetScale().play(block);
                    document.getElementById('scalePlay').disabled = false;
                });
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(1000).play(block);
            this.disabled = true;
            document.getElementById('fadeOutReset')
                .addEventListener('click', function () {
                    animaster().addResetFadeOut().play(block);
                    document.getElementById('fadeOutPlay').disabled = false;
                });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().addShowAndHide(1000).play(block);
        });

    document.getElementById('fadeInPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().addFadeIn(1000).play(block);
        this.disabled = true;
        document.getElementById('fadeInReset')
            .addEventListener('click', function () {
                animaster().addResetFadeIn().play(block);
                document.getElementById('fadeInPlay').disabled = false;
            });
    });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
          const block = document.getElementById('heartBeatingBlock');
          animaster().addHeartBeating(1000).play(block);
          this.disabled = true;
        });
        
    document.getElementById('customAnimationPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('customAnimationBlock');
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
        this.disabled = true;
    });
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
    let beatingInterval;
    let _steps = [];
    return{
        addResetMoveAndHide: function(){
            this._steps.push({
                operation: 'resetMoveAndHide',
            })
            return this;
        },

        addMoveAndHide: function(duration, translation){
            this._steps.push({
                operation: 'moveAndHide',
                duration: duration,
                translation: translation,
            })
            return this;
        },

        addMove: function(duration, translation){
            this._steps.push({
                operation: 'move',
                duration: duration,
                translation: translation,
            })
            return this;
        },

        addResetMove: function(){
            this._steps.push({
                operation: 'resetMove',
            })
            return this;
        },

        addFadeIn: function(duration){
            this._steps.push({
                operation: 'fadeIn',
                duration: duration,
            })
            return this;
        },

        addResetFadeIn: function(){
            this._steps.push({
                operation: 'resetFadeIn',
            })
            return this;
        },

        addFadeOut: function(duration){
            this._steps.push({
                operation: 'fadeOut',
                duration: duration,
            })
            return this;
        },

        addResetFadeOut: function(){
            this._steps.push({
                operation: 'resetFadeOut',
            })
            return this;
        },

        addScale: function(duration, ratio){
            this._steps.push({
                operation: 'scale',
                duration: duration,
                ratio: ratio,
            })
            return this;
        },

        addResetScale: function(){
            this._steps.push({
                operation: 'resetScale',
            })
            return this;
        },
        
        heartBeating: function(element, duration) {
            clearInterval(beatingInterval);
            beatingInterval = setInterval(() => {
                this.scale(element, duration, 1.4);
                setTimeout(() => {
                    this.scale(element, duration, 1);
                }, duration);
            }, duration*2);

            const stop = () => {
                clearInterval(beatingInterval);
            };
            return stop;
        },

        addHeartBeating: function(duration) {
            this._steps.push({
                operation: 'heartBeating',
                duration: duration,
            })
            return this;
        },


        addShowAndHide: function(duration){
            this._steps.push({
                operation: 'showAndHide',
                duration: duration,
            })
            return this;
        },

        addDelay: function(delay){
            return new Promise(resolve => {
                setTimeout(resolve, delay);
              });
        },


        play: function(element, cycled = false) {
            let currentStep = 0;

            const playStep = () => {
                if (currentStep >= this._steps.length) {
                    if (cycled) {
                        currentStep = 0;
                    } 
                    else {
                        return;
                    }
                }

                const step = _steps[currentStep];

                switch (step.operation) {
                    case 'heartBeating':
                        element.style.transitionDuration =  `${step.duration}ms`;
                        element.style.transform = getTransform(null, 1.4);
                        this.addDelay(step.duration).then(() => {
                            element.style.transitionDuration =  `${step.duration}ms`;
                            element.style.transform = getTransform(null, 1);
                        });
                        break;
                    case 'moveAndHide':
                        duration = step.duration/5;
                        element.style.transitionDuration = `${duration*2}ms`;
                        element.style.transform = getTransform(step.translation, null);
                        element.style.transitionDuration =  `${duration*3}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                        break;
                    case 'resetMoveAndHide':
                        element.style.transitionDuration = null;
                        element.style.transform = getTransform(null, null);
                        element.classList.remove('hide');
                        element.classList.add('show');
                        break;
                    case 'showAndHide':
                        duration = step.duration / 3;
                        element.style.transitionDuration =  `${duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                        this.addDelay(duration).then(() => {
                            element.style.transitionDuration =  `${duration}ms`;
                            element.classList.remove('show');
                            element.classList.add('hide');
                        });
                        break;
                    case 'move':
                        element.style.transitionDuration = `${step.duration}ms`;
                        element.style.transform = getTransform(step.translation, null);
                        break;
                    case 'resetMove':
                        element.style.transitionDuration = null;
                        element.style.transform = getTransform(null, null);
                        break;
                    case 'fadeIn':
                        element.style.transitionDuration =  `${step.duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                        break;
                    case 'fadeOut':
                        element.style.transitionDuration =  `${step.duration}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                        break;
                    case 'scale':
                        element.style.transitionDuration =  `${step.duration}ms`;
                        element.style.transform = getTransform(null, step.ratio);
                        break;
                    case 'resetScale':
                        element.style.transitionDuration =  null;
                        element.style.transform = getTransform(null, null);
                        break;
                    case 'resetFadeIn':
                        element.style.transitionDuration = null;
                        element.classList.remove('show');
                        element.classList.add('hide');
                        break;
                    case 'resetFadeOut':
                        element.style.transitionDuration =  null;
                        element.classList.remove('hide');
                        element.classList.add('show');
                        break;
                }

                currentStep++;
                setTimeout(playStep, step.duration);
            };

            playStep();
        },
        _steps,
    }
}