(function() {
  let start = new Date().getTime();

  const originPosition = { x: 0, y: 0 };

  const last = {
      starTimestamp: start,
      starPosition: originPosition,
      mousePosition: originPosition
  }

  const config = {
      starAnimationDuration: 1500,
      minimumTimeBetweenStars: 250,
      minimumDistanceBetweenStars: 75,
      glowDuration: 75,
      maximumGlowPointSpacing: 10,
      colors: ["249, 146, 253", "252, 254, 255"],
      sizes: ["1.4rem", "1rem", "0.6rem"],
      animations: ["Mousyffects-fall-1", "Mousyffects-fall-2", "Mousyffects-fall-3"]
  }

  let count = 0;

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        selectRandom = items => items[rand(0, items.length - 1)];

  const withUnit = (value, unit) => `${value}${unit}`,
        px = value => withUnit(value, "px"),
        ms = value => withUnit(value, "ms");

  const calcDistance = (a, b) => {
      const diffX = b.x - a.x,
            diffY = b.y - a.y;

      return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  }

  const calcElapsedTime = (start, end) => end - start;

  const appendElement = element => document.body.appendChild(element),
        removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);

  const createStar = position => {
      const star = document.createElement("span"),
            color = selectRandom(config.colors);

      star.className = "Mousyffects-star";
      star.style.left = px(position.x);
      star.style.top = px(position.y);
      star.style.fontSize = selectRandom(config.sizes);
      star.style.color = `rgb(${color})`;
      star.style.animationName = config.animations[count++ % config.animations.length];
      star.style.animationDuration = ms(config.starAnimationDuration);
      star.style.zIndex = 9999

      appendElement(star);
      removeElement(star, config.starAnimationDuration);
  }

  const createGlowPoint = position => {
      const glow = document.createElement("div");

      glow.className = "Mousyffects-glow-point";
      glow.style.left = px(position.x);
      glow.style.top = px(position.y);

      appendElement(glow);
      removeElement(glow, config.glowDuration);
  }

  const determinePointQuantity = distance => Math.max(
      Math.floor(distance / config.maximumGlowPointSpacing),
      1
  );

  const createGlow = (last, current) => {
      const distance = calcDistance(last, current),
            quantity = determinePointQuantity(distance);

      const dx = (current.x - last.x) / quantity,
            dy = (current.y - last.y) / quantity;

      Array.from({ length: quantity }, (_, index) => {
          const x = last.x + dx * index,
                y = last.y + dy * index;

          createGlowPoint({ x, y });
      });
  }

  const updateLastStar = position => {
      last.starTimestamp = new Date().getTime();
      last.starPosition = position;
  }

  const updateLastMousePosition = position => last.mousePosition = position;

  const adjustLastMousePosition = position => {
      if(last.mousePosition.x === 0 && last.mousePosition.y === 0) {
          last.mousePosition = position;
      }
  };

  window.onpointermove = e => {
      const mousePosition = { x: e.clientX, y: e.clientY }

      adjustLastMousePosition(mousePosition);

      const now = new Date().getTime(),
            hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
            hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;

      if(hasMovedFarEnough || hasBeenLongEnough) {
          createStar(mousePosition);
          updateLastStar(mousePosition);
      }

      createGlow(last.mousePosition, mousePosition);
      updateLastMousePosition(mousePosition);
  }

  document.body.onmouseleave = () => updateLastMousePosition(originPosition);
})();