let mouse = {x: 0, y: 0};
let targetCanvas = true;
let timeout;

let flagContainerCanvas = document.querySelector('canvas');
let headlineText = document.querySelector('.headlineText');
let headline = document.querySelector('.headline');
let flagContainerRef = document.getElementById('flagContainer');

function onMouseMove(event) {
	// console.log(flagContainer);
	if (event.target !== flagContainerCanvas) return;
	// get mouse position
	event.preventDefault();
	mouse.x = ((event.clientX - flagContainer.offsetLeft) / flagContainer.clientWidth) * 2 - 1;
	mouse.y = - ((event.clientY - flagContainer.offsetTop) / flagContainer.clientHeight) * 2 + 1;
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
flagContainerRef.addEventListener('mousemove', onMouseMove, false);
flagContainerRef.addEventListener("touchstart", touchHandler, true);
flagContainerRef.addEventListener("touchmove", touchHandler, true);
flagContainerRef.addEventListener("touchend", touchHandler, true);
flagContainerRef.addEventListener("touchcancel", touchHandler, true);

