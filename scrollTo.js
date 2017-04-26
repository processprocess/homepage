console.log('test');

let aboutButton = document.querySelector('#aboutButton');

aboutButton.addEventListener('click',() => {
  TweenLite.to(window, .75, {
    scrollTo:'.aboutMe',
    ease: Power2.easeOut
  });
})
