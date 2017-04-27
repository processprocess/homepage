var aboutClick = document.querySelector("#aboutButton");
var emailMeButtons = document.querySelectorAll(".emailMe");

aboutClick.addEventListener("touchend", aboutScroll, false);
aboutClick.addEventListener("click", aboutScroll, false);

function aboutScroll() {
  TweenLite.to(window, .75, {
    autoKill:false,
    scrollTo:'.aboutMe',
    ease: Power2.easeOut
  });
  event.preventDefault();
  return false;
}

emailMeButtons.forEach(emailMe => {
  emailMe.addEventListener("touchend", function(e) {
    emailMeClip();
    successFeedback(e);
  });
  emailMe.addEventListener("click", function(e) {
    emailMeClip();
    successFeedback(e);
  });
})

function emailMeClip() {
  var clipboard = new Clipboard('.emailMe', {
    text: function() {
      return 'philip.hunter.bell@gmail.com';
    }
  });
}

function successFeedback(e) {
  let elParent = e.target.parentNode
  let el = e.target;
  let x = el.offsetLeft;
  let y = el.offsetTop;
  let height = el.offsetHeight;
  let successDiv = generateSuccessDiv(e);

  TweenLite.set(successDiv, {
    x: x,
    y: y + height + 10,
  })

  TweenLite.to(successDiv, .25, {
    opacity: 0,
    onComplete: ()=> successDiv.remove(),
    delay: 1,
  })

}

function generateSuccessDiv(e) {
  let elParent = e.target.parentNode
  let successDiv = document.createElement('div');
  successDiv.classList.add('copySuccess');
  successDiv.textContent = `Phil's email copied to clipboard`
  elParent.append(successDiv);
  return successDiv
}
