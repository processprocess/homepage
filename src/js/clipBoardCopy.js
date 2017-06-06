import Clipboard from 'clipboard';
import gsap from 'gsap';
import CSSPlugin from "gsap/CSSPlugin";

export default function clipBoardCopy() {

  let emailMeButtons = document.querySelectorAll(".emailMe");

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
    let clipboard = new Clipboard('.emailMe', {
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

}