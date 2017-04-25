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
	timeout = setTimeout(function() { onMouseOut();  }, 200);
}

// let descriptions = [
// 	'Digital <br> Designer',
// 	// 'Web <br> Developer',
// 	// 'Visual <br> Designer',
// 	'VR <br> Enthusiast'
// 	// 'Paper <br> Engineer'
// 	// 'Motion <br> Designer'
// 	// 'Analytical <br> Observer'
// ]


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

