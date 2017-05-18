const bodymovin = require('bodymovin')

function loadAnimations() {

  const iconHolders = Array.from(document.querySelectorAll('.iconHolder'));

  iconHolders.forEach(iconHolder => {

    let iconHolderName = iconHolder.getAttribute('name');
    let card = document.querySelector(`#${iconHolderName}`);

    var anim;
    var animData = {
        container: iconHolder,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: `${iconHolderName}Anim`,
        rendererSettings: {
            progressiveLoad:false
        },
        path: `animations/${iconHolderName}.json`
    };
    anim = bodymovin.loadAnimation(animData);

    anim.addEventListener('complete',function(e) {
      anim.goToAndStop(0, false);
      // let iconPaths = iconHolder.querySelectorAll('path');
      // iconPaths.forEach(path => {
      //   path.classList.remove('colorAnimate')
      // })
    })

    card.addEventListener('mouseenter',function(e) {
      anim.play()
      // let iconPaths = iconHolder.querySelectorAll('path');
      // iconPaths.forEach(path => {
      //   path.classList.add('colorAnimate')
      // })
    })

    window.addEventListener('scroll',function(e) {
     if (navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)
     ){
        let windowCenter = window.scrollY + (window.innerHeight / 2);
        console.log(windowCenter);
        if (windowCenter > iconHolder.offsetTop && (windowCenter-20) < (iconHolder.offsetTop)) {
          anim.play();
        }
      }
     else { return false;}
    })

  })

}

loadAnimations()