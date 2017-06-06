import ScrollToPlugin from "gsap/ScrollToPlugin";
import gsap from 'gsap';

export default function scrollToTarget(domNode, target) {
  domNode.addEventListener("touchend", scroll);
  domNode.addEventListener("click", scroll);

  function scroll() {
    TweenLite.to(window, 1.5, {
      autoKill:false,
      scrollTo:target,
      ease: Power2.easeInOut
    });
  }
}