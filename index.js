addListeners();

const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
	
function addListeners() {
	
	/*fadeImPlay And RESET*/
    document.getElementById('fadeInPlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
			animaster().fadeIn(block, 5000);
        });
	document.getElementById('fadeInPlayReset')
        .addEventListener('click', function(){
            const block = document.getElementById('fadeInBlock')
            block.fadeIn.reset();
        });
		
	/*movePlay And RESET*/
    document.getElementById('movePlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y:10}).play(block);
        });
	document.getElementById('movePlayReset')
        .addEventListener('click', function(){
            const block = document.getElementById('moveBlock')
            block.move.reset();
        });
	
	/*scalePlay And RESET*/
    document.getElementById('scalePlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
			animaster().addScale(1000, 1.25).play(block);
        });
	document.getElementById('scalePlayReset')
        .addEventListener('click', function(){
            const block = document.getElementById('scaleBlock')
            block.scale.reset();
        });
	
	/*fadeOutPlay And RESET*/
	document.getElementById('fadeOutPlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
	document.getElementById('fadeOutPlayReset')
        .addEventListener('click', function(){
            const block = document.getElementById('fadeOutBlock')
            block.fadeOut.reset();
        });
	
	/*...............*/
	document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function(){
            const block = document.getElementById('moveAndHideBlock')
            block.moveAndHide.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();
		
    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);		
}

function animaster(){
    let _steps = [];

    function fadeIn(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
	
	function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOut(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
	
	function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
		element.style.transitionDuration =  `${duration}ms`;
		element.style.transform = getTransform(null, ratio);
		
    }

    function moveAndHide(element, duration){
        let moveHide = animaster().addMove(duration*0.4,{x: 100, y: 20}).addFadeOut(duration*0.6).play(element);
        return{ reset(){ moveHide.reset();}}
    }

    function showAndHide(element, duration){
        animaster().addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
    }

    function heartBeating(element){
        animaster().addScale(500,1.4).addScale(500,1).play(element, true);
        return{ stop(){ animaster().play().stop();}}
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = getTransform({ x: 0, y: 0 }, 1);
    }

    function addMove(duration, translation){
        this._steps.push({name: 'move', duration: duration, arg: translation});
        return this;
    }

    function addScale(duration, ratio){
        this._steps.push({name: 'scale', duration: duration, arg: ratio})
        return this;
    }

    function addFadeIn(duration){
        this._steps.push({name: 'fadeIn', duration: duration});
        return this;
    }

    function addFadeOut(duration){
        this._steps.push({name: 'fadeOut', duration: duration});
        return this;
    }

    function addDelay(duration){
        this._steps.push({name: 'delay', duration: duration});
        return this;
    }

    function play(element, cycled){
        timeout = 0;
        if (cycled){
            interval = setInterval(() => {
                play(element)
            }, 1000);
        }

        _steps.forEach((operation)=>{
            switch (operation.name){
                case 'move':
                    setTimeout(()=>move(element, operation.duration, operation.arg), timeout);
                    timeout += operation.duration;
                    break;
                case 'scale':
                    setTimeout(()=>scale(element, operation.duration, operation.arg), timeout);
                    timeout += operation.duration;
                    break;
                case 'fadeIn':
                    setTimeout(()=>fadeIn(element, operation.duration), timeout);
                    timeout += operation.duration;
                    break;
                case 'fadeOut':
                    setTimeout(()=>fadeOut(element, operation.duration), timeout);
                    timeout += operation.duration;
                    break;
                case 'delay':
                    setTimeout(()=>{element.style.transitionDuration = `${operation.duration}ms`;},timeout);
                    timeout += operation.duration;
                    break;
            }
        })
        return{
            stop(){
                clearInterval(interval);
            },
            reset(){
                resetMoveAndScale(element);
                if (_steps.findIndex(step=> step.name === 'fadeOut') >=_steps.findIndex(step=> step.name === 'fadeIn')){
                    resetFadeOut(element);
                }else{
                    resetFadeIn(element);
                }
            }
        }
    }

    function buildHandler() {
        return (e) => this.play(e.target)
    }
	
	function changeHeigth(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.style.height = `0`;
    }
	
    return {_steps, fadeIn, fadeOut, scale, move, moveAndHide, showAndHide, heartBeating, addMove, addScale, addFadeIn, addFadeOut, addDelay, play, buildHandler, changeHeigth};
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
