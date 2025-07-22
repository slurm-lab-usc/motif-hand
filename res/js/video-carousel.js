document.addEventListener("DOMContentLoaded", function () {
  const scenes = document.querySelectorAll(".video-scene");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  let currentScene = 0;

  function showScene(index) {
    scenes[currentScene].classList.remove("active");
    scenes[index].classList.add("active");
    currentScene = index;
  }

  leftArrow.addEventListener("click", function () {
    let newIndex = currentScene - 1;
    if (newIndex < 0) newIndex = scenes.length - 1;
    showScene(newIndex);
  });

  rightArrow.addEventListener("click", function () {
    let newIndex = (currentScene + 1) % scenes.length;
    showScene(newIndex);
  });
});
