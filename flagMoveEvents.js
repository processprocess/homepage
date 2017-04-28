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


// check if mobile
// https://github.com/kaimallea/isMobile
let mobileDevice = false;
function checkMobile() {
	!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);
	if (isMobile.any) {
		mobileDevice = true;
	}
}
checkMobile()


// set gravity on orientation change
function setGravity(e) {
	let x = e.accelerationIncludingGravity.x * 36;
	let y = e.accelerationIncludingGravity.y * 36;
	let z = e.accelerationIncludingGravity.z * 36;
	if(window.innerHeight > window.innerWidth) {
		gravity.x = x;
		gravity.y = y;
		gravity.z = z;
	} else {
		gravity.x = -y;
		gravity.y = x;
		gravity.z = z;
	}
}

window.addEventListener('devicemotion',(e) => {
	if (!mobileDevice) return;
	setGravity(e)
})
