
//writting animations
window.onload = function() {
	headline.querySelector(`.icon[name='VR']`).style.display = 'block';
	let svgsToAnimate = Array.from(headline.querySelectorAll(`.icon[name='VR'] .VR`))
	setTimeout(() => {
		svgsToAnimate.forEach(function(svg, i) {
			svg.classList.add(`VR${i}`)
			console.log(svg.getTotalLength());
		})
	}, 1);
}

let mouse = {x: 0, y: 0};
let targetCanvas = true;
let timeout;

let bannerCanvas = document.querySelector('canvas');
let headlineText = document.querySelector('.headlineText')
let headline = document.querySelector('.headline')

function onMouseMove(event) {
	if (event.target !== bannerCanvas) return;
	// get mouse position
	event.preventDefault();
	mouse.x = ((event.clientX - banner.offsetLeft) / banner.clientWidth) * 2 - 1;
	mouse.y = - ((event.clientY - banner.offsetTop) / banner.clientHeight) * 2 + 1;
	// attach mouse position to vector3
	let vector = new THREE.Vector3(mouse.x, mouse.y, 0);
	vector.unproject(camera);
	let dir = vector.sub( camera.position ).normalize();
	let distance = - camera.position.z / dir.z;
	let pos = camera.position.clone().add(dir.multiplyScalar( distance));
	// mouse position to ball position
	ballPosition.x = pos.x;
	ballPosition.y = pos.y;
	// ease in ball position z
	if (ballPosition.z >= 20) {
		ballPosition.z -= 4;
	}
	// bring ball out if no mouse movement & fire events
	clearTimeout(timeout);
	timeout = setTimeout(function() { onMouseOut(); changeHeader(); }, 200);
}

let descriptions = [
	'Digital <br> Designer',
	// 'Web <br> Developer',
	// 'Visual <br> Designer',
	'VR <br> Enthusiast'
	// 'Paper <br> Engineer'
	// 'Motion <br> Designer'
	// 'Analytical <br> Observer'
]

function changeHeader() {
	headline.classList.add('fadeOut');
	headline.addEventListener('transitionend', changeHeaderText)
	// set variables for current content and icon
	let currentDescription = headlineText.innerHTML
	let currentIconName = currentDescription.split(' ')[0];
	// remove animation classes
	let svgsToAnimate = Array.from(headline.querySelectorAll(`.icon[name='${currentIconName}'] .${currentIconName}`))
	svgsToAnimate.forEach(function(svg, i) { svg.classList.remove(`${currentIconName}${i}`) })
	// change header and add animations
	function changeHeaderText() {
		let nextDescription = descriptions[Math.floor(Math.random() * descriptions.length)]
		let nextIconName = nextDescription.split(' ')[0];
		if (currentDescription !== nextDescription) {
			// switch icon
			headline.querySelector(`.icon[name='${currentIconName}']`).style.display = 'none';
			headline.querySelector(`.icon[name='${nextIconName}']`).style.display = 'block';
			// add animations
			let svgsToAnimate = Array.from(headline.querySelectorAll(`.icon[name='${nextIconName}'] .${nextIconName}`))
			setTimeout(() => {
				svgsToAnimate.forEach(function(svg, i) {
					svg.classList.add(`${nextIconName}${i}`)
				})
			}, 1);
			// switch headline
			headlineText.innerHTML = nextDescription;
			currentDescription = nextDescription;
			headline.removeEventListener('transitionend',changeHeaderText);
			headline.classList.remove('fadeOut');
		} else {
			// switch if same as last time;
			changeHeaderText()
		}
	}

}

// ease out ball position z
function onMouseOut() {
	if (ballPosition.z < 60) {
		ballPosition.z += 2;
		onMouseOut();
	}
}

// mobile mouse to touch translation
function touchHandler(event) {
  let touches = event.changedTouches,
    first = touches[0],
    type = "";
  switch(event.type) {
    case "touchstart": type = "mousedown"; break;
    case "touchmove":  type = "mousemove"; break;
    case "touchend":   type = "mouseup";   break;
    default:           return;
  }
  let simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                first.screenX, first.screenY,
                                first.clientX, first.clientY, false,
                                false, false, false, 0/*left*/, null);
  first.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}

// mouse and touch handlers
document.addEventListener('mousemove', onMouseMove, false);
document.getElementById('banner').addEventListener("touchstart", touchHandler, true);
document.getElementById('banner').addEventListener("touchmove", touchHandler, true);
document.getElementById('banner').addEventListener("touchend", touchHandler, true);
document.getElementById('banner').addEventListener("touchcancel", touchHandler, true);

