// const THREE = import THREE from 'three';
const THREE = require('three')
const GravDetector = require('./GravDetector')
/*
 * Cloth Simulation using a relaxed constraints solver
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

let DAMPING = 0.03;
let DRAG = 1 - DAMPING;
let MASS = 0.3;
let restDistance = 25;

let xSegs = 18;
let ySegs = 7;

export let clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

export let cloth = new Cloth( xSegs, ySegs );

let max = 360;
let speed = 0.0001;
let num = 0;

// creative gravity and use gravity detector
let gravityVect = new THREE.Vector3( 0, -360, 0 );
let gravity = new GravDetector(gravityVect);

let TIMESTEP = 18 / 1000;
let TIMESTEP_SQ = TIMESTEP * TIMESTEP;


let pins = 18;

export let ballPosition = new THREE.Vector3( 300, 300, 60 );
let ballSize = 70;

let tmpForce = new THREE.Vector3();

let lastTime;


function plane( width, height ) {
	return function( u, v ) {
		let x = ( u - 0.5 ) * width;
		let y = ( v + 0.5 ) * height;
		let z = 0;
		return new THREE.Vector3( x, y, z );
	};
}

function Particle( x, y, z, mass ) {

	this.position = clothFunction( x, y ); // position
	this.previous = clothFunction( x, y ); // previous
	this.original = clothFunction( x, y );
	this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
	this.mass = mass;
	this.invMass = 1 / mass;
	this.tmp = new THREE.Vector3();
	this.tmp2 = new THREE.Vector3();

}

// Force -> Acceleration

Particle.prototype.addForce = function( force ) {

	this.a.add(
		this.tmp2.copy( force ).multiplyScalar( this.invMass )
	);

};


// Performs Verlet integration

Particle.prototype.integrate = function( timesq ) {

	let newPos = this.tmp.subVectors( this.position, this.previous );
	newPos.multiplyScalar( DRAG ).add( this.position );
	newPos.add( this.a.multiplyScalar( timesq ) );

	this.tmp = this.previous;
	this.previous = this.position;
	this.position = newPos;

	this.a.set( 0, 0, 0 );

};


let diff = new THREE.Vector3();

function satisifyConstraints( p1, p2, distance ) {

	diff.subVectors( p2.position, p1.position );
	let currentDist = diff.length();
	if ( currentDist === 0 ) return; // prevents division by 0
	let correction = diff.multiplyScalar( 1 - distance / currentDist );
	let correctionHalf = correction.multiplyScalar( 0.5 );
	p1.position.add( correctionHalf );
	p2.position.sub( correctionHalf );

}

function Cloth( w, h ) {

	w = w || 10;
	h = h || 10;
	this.w = w;
	this.h = h;

	let particles = [];
	let constraints = [];

	let u, v;

	// Create particles
	for ( v = 0; v <= h; v ++ ) {
		for ( u = 0; u <= w; u ++ ) {
			particles.push(
				new Particle( u / w, v / h, 0, MASS )
			);
		}
	}

	// Structural

	for ( v = 0; v < h; v ++ ) {
		for ( u = 0; u < w; u ++ ) {
			constraints.push( [
				particles[ index( u, v ) ],
				particles[ index( u, v + 1 ) ],
				restDistance
			] );
			constraints.push( [
				particles[ index( u, v ) ],
				particles[ index( u + 1, v ) ],
				restDistance
			] );
		}
	}

	for ( u = w, v = 0; v < h; v ++ ) {
		constraints.push( [
			particles[ index( u, v ) ],
			particles[ index( u, v + 1 ) ],
			restDistance
		] );
	}

	for ( v = h, u = 0; u < w; u ++ ) {
		constraints.push( [
			particles[ index( u, v ) ],
			particles[ index( u + 1, v ) ],
			restDistance
		] );
	}

	this.particles = particles;
	this.constraints = constraints;

	function index( u, v ) {
		return u + v * ( w + 1 );
	}

	this.index = index;

}

export function simulate( time ) {

	if ( ! lastTime ) {
		lastTime = time;
		return;
	}

	let i, il, particles, particle, pt, constraints, constraint;

	// Aerodynamics forces
	for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {
		particle = particles[ i ];
		particle.addForce( gravity );
		particle.integrate( TIMESTEP_SQ );
	}

	// Start Constraints
	constraints = cloth.constraints;
	il = constraints.length;

	for ( i = 0; i < il; i ++ ) {
		constraint = constraints[ i ];
		satisifyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
	}

	// Ball Constraints
	for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {
		particle = particles[ i ];
		let pos = particle.position;
		diff.subVectors( pos, ballPosition );
		if ( diff.length() < ballSize ) {
			// collided
			diff.normalize().multiplyScalar( ballSize );
			pos.copy( ballPosition ).add( diff );
		}
	}

	// Pin Constraints
	for ( i = (particles.length - 1) - pins, il = (particles.length - 1); i <= il; i ++ ) {
		let xy = i;
		let p = particles[ xy ];
		p.position.copy( p.original );
		p.previous.copy( p.original );
	}

}



// // check if mobile
// // https://github.com/kaimallea/isMobile
// // break into mobile component
// const isMobile = require('ismobilejs');
// let mobileDevice = false;
//
// if (isMobile.any) {
// 	mobileDevice = true;
// }
//
// // set gravity on orientation change
// function setGravity(e) {
// 	let x = e.accelerationIncludingGravity.x * 36;
// 	let y = e.accelerationIncludingGravity.y * 36;
// 	let z = e.accelerationIncludingGravity.z * 36;
// 	if(window.innerHeight > window.innerWidth) {
// 		gravity.x = x;
// 		gravity.y = y;
// 		gravity.z = z;
// 	} else {
// 		gravity.x = -y;
// 		gravity.y = x;
// 		gravity.z = z;
// 	}
// }
//
// window.addEventListener('devicemotion',(e) => {
// 	if (!mobileDevice) return;
// 	setGravity(e)
// })