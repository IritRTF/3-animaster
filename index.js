function animaster() {
    const steps = [];
    let cycled = false;
    let animationInterval;
  
    function runNextStep(element) {
      if (steps.length === 0) {
        if (cycled) {
          steps.push(...steps.slice(1).reverse());
        } else {
          clearInterval(animationInterval);
        }
        return;
      }
  
      const step = steps.shift();
      switch (step.type) {
        case "fadeIn":
          fadeIn(element, step.duration);
          break;
        case "fadeOut":
          fadeOut(element, step.duration);
          break;
        case "move":
          move(element, step.duration, step.translation);
          break;
        case "scale":
          scale(element, step.duration, step.ratio);
          break;
        case "delay":
          setTimeout(() => runNextStep(element), step.duration);
          break;
      }
      if (cycled) {
        steps.push(step);
      }
    }
  
    return {
      fadeIn(element, duration) {
        steps.push({ type: "fadeIn", duration });
        return this;
      },
      fadeOut(element, duration) {
        steps.push({ type: "fadeOut", duration });
        return this;
      },
      move(element, duration, translation) {
        steps.push({ type: "move", duration, translation });
        return this;
      },
      scale(element, duration, ratio) {
        steps.push({ type: "scale", duration, ratio });
        return this;
      },
      addDelay(duration) {
        steps.push({ type: "delay", duration });
        return this;
      },
      play(element) {
        runNextStep(element);
        animationInterval = setInterval(() => runNextStep(element), 1000);
      },
      cycled() {
        cycled = true;
        return this;
      },
      stop() {
        clearInterval(animationInterval);
        return this;
      },
      addMove(duration, translation) {
        return this.move(null, duration, translation);
      },
      addFadeOut(duration) {
        return this.fadeOut(null, duration);
      },
    };
  }
  
  // Применение для кнопок и элементов
  addListeners();
  
  function addListeners() {
    const elementFadeIn = document.getElementById('fadeInBlock');
    const elementMove = document.getElementById('moveBlock');
    const elementScale = document.getElementById('scaleBlock');
    const elementHeartBeating = document.getElementById('heartBeatingBlock');
    const elementMoveAndHide = document.getElementById('moveBlock');
    const elementShowAndHide = document.getElementById('showAndHideBlock');
  
    const animationCycled = animaster().fadeIn(elementFadeIn, 2000).addDelay(1000).fadeOut(elementFadeIn, 2000).cycled();
    document.getElementById('fadeInPlay').addEventListener('click', () => animationCycled.play(elementFadeIn));
  
    const animationMove = animaster().move(elementMove, 1000, { x: 100, y: 10 }).addDelay(1000).move(elementMove, 1000, { x: 0, y: 0 });
    document.getElementById('movePlay').addEventListener('click', () => animationMove.play(elementMove));
  
    const animationScale = animaster().scale(elementScale, 1000, 1.25).addDelay(1000).scale(elementScale, 1000, 1);
    document.getElementById('scalePlay').addEventListener('click', () => animationScale.play(elementScale));
  
    const heartBeating = animaster().scale(elementHeartBeating, 500, 1.4).addDelay(500).scale(elementHeartBeating, 500, 1).cycled();
    document.getElementById('heartBeatingPlay').addEventListener('click', () => heartBeating.play(elementHeartBeating));
    document.getElementById('heartBeatingStop').addEventListener('click', () => heartBeating.stop());
  
    const moveAndHideAnimation = animaster().addMove(1000, { x: 100, y: 20 }).addFadeOut(1000);
    document.getElementById('moveAndHidePlay').addEventListener('click', () => {
      const elementMoveAndHide = document.getElementById('moveBlock');
      moveAndHideAnimation.play(elementMoveAndHide);
    });
    document.getElementById('moveAndHideReset').addEventListener('click', () => resetMoveAndScale(elementMoveAndHide));
  
    const showAndHide = animaster().fadeIn(elementShowAndHide, 1000).addDelay(1000).fadeOut(elementShowAndHide, 1000);
    document.getElementById('showAndHidePlay').addEventListener('click', () => showAndHide.play(elementShowAndHide));
  }
  
  function fadeIn(element, duration) {
    element.style.transitionDuration = `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
  }
  
  function fadeOut(element, duration) {
    element.style.transitionDuration = `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
  }
  
  function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
  }
  
  function scale(element, duration, ratio) {
    element.style.transitionDuration = `${duration}ms`;
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
  
  function resetMoveAndScale(element) {
    element.style.transitionDuration = '0ms';
    element.style.transform = 'translate(0px, 0px) scale(1)';
  }
  
