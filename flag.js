// console.clear();

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

let container, stats;
let camera, scene, renderer;

let clothGeometry;
let sphere;
let flag;
pins = 18;

init();
animate();

function init() {
  let flagContainer = document.querySelector('#flagContainer');

  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera( 30, flagContainer.clientWidth / flagContainer.clientHeight, 1, 2000 );
  camera.position.x = 0;
  camera.position.y = 155;
  camera.position.z = 525;
  scene.add( camera );

  // lights

  let light, materials;

  scene.add( new THREE.AmbientLight( 0x666666 ) );

  light = new THREE.DirectionalLight( 0xffffff, 1.75 );
  light.position.set( 50, 200, 100 );
  light.position.multiplyScalar( 1.3 );

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  scene.add( light );

  let popLight = new THREE.PointLight( 0x0000ff, 1.75 );
  popLight.position.set( -150, 60, 0 );
  scene.add( popLight );

  let popLightTwo = new THREE.PointLight( 0xff0000, 1.75 );
  popLightTwo.position.set( 150, -60, 0 );
  scene.add( popLightTwo );

  // cloth material

  let loader = new THREE.TextureLoader();
  let clothTexture = loader.load( 'images/flag.png' );
  clothTexture.minFilter = THREE.LinearFilter;
  clothTexture.flipY = true;
  clothTexture.anisotropy = 16;

  let clothMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x030303,
    map: clothTexture,
    side: THREE.DoubleSide,
    alphaTest: 0.5
  } );

  // cloth geometry
  clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
  clothGeometry.dynamic = true;

  let uniforms = { texture:  { value: clothTexture } };

  let vertexShader =
  `varying vec2 vUV;
   void main() {
    vUV = 0.75 * uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }`;

  let fragmentShader =
  `#include <packing>
   uniform sampler2D texture;
   varying vec2 vUV;
   void main() {
    vec4 pixel = texture2D( texture, vUV );
    if ( pixel.a < 0.5 ) discard;
    gl_FragData[ 0 ] = packDepthToRGBA( gl_FragCoord.z );
  }`;

  // cloth mesh

  flag = new THREE.Mesh( clothGeometry, clothMaterial );
  flag.position.set( 0, 0, 0 );
  flag.castShadow = true;
  scene.add( flag );

  flag.customDepthMaterial = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
  } );

  // renderer

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( flagContainer.clientWidth, flagContainer.clientHeight );
  renderer.setClearColor(0xffffff, 0);
  flagContainer.appendChild( renderer.domElement );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	camera.aspect = flagContainer.clientWidth / flagContainer.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( flagContainer.clientWidth, flagContainer.clientHeight );
}

function animate() {
  requestAnimationFrame( animate );
  let time = Date.now();
  // windStrength = Math.cos( time / 7000 ) * 1 + 1;
  // windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) ).normalize().multiplyScalar( windStrength );
  simulate( time );
  render();
}

function render() {
  let p = cloth.particles;
  for ( let i = 0, il = p.length; i < il; i ++ ) {
    clothGeometry.vertices[ i ].copy( p[ i ].position );
  }
  clothGeometry.computeFaceNormals();
  clothGeometry.computeVertexNormals();
  clothGeometry.normalsNeedUpdate = true;
  clothGeometry.verticesNeedUpdate = true;
  renderer.render( scene, camera );
}