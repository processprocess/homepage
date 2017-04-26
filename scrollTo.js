let aboutButton = document.querySelector('#aboutButton');

aboutButton.addEventListener('click', function(e) {
  console.log(e.target);
  TweenLite.to(window, .75, {
    scrollTo:'.aboutMe',
    ease: Power2.easeOut
  });
})

// function fix(){
//   var el = this;
//   var par = el.parentNode;
//   var next = el.nextSibling;
//   par.removeChild(el);
//   setTimeout(function() {par.insertBefore(el, next);}, 0)
// }
