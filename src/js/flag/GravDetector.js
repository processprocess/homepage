const isMobile = require('ismobilejs'); // https://github.com/kaimallea/isMobile

module.exports = class GravDetector {
  constructor({ x, y, z }){
    this.x = x;
    this.y = y;
    this.z = z;
    this.onMobile = this.checkMobile();
  }
  setGravity(e) {
    let x = e.accelerationIncludingGravity.x * 36;
  	let y = e.accelerationIncludingGravity.y * 36;
  	let z = e.accelerationIncludingGravity.z * 36;
  	if(window.innerHeight > window.innerWidth) {
  		this.x = x;
  		this.y = y;
  		this.z = z;
  	} else {
  		this.x = -y;
  		this.y = x;
  		this.z = z;
  	}
  }
  checkMobile() {
    if(isMobile.any){
      this.init();
      return true;
    } else {
      return false;
    }
  }
  init() {
    window.addEventListener('devicemotion',(e) => {
    	this.setGravity(e);
    })
  }
}