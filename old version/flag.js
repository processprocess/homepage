console.clear();

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
  let banner = document.querySelector('#banner');

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

  // camera
  camera = new THREE.PerspectiveCamera( 30, banner.clientWidth / banner.clientHeight, 1, 2000 );
  // camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.x = 0;
  camera.position.y = 235; // distance from cloth
  camera.position.z = 500; // rotation around cloth put back at 500
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
  // let d = 300;
  // light.shadow.camera.left = - d;
  // light.shadow.camera.right = d;
  // light.shadow.camera.top = d;
  // light.shadow.camera.bottom = - d;
  // light.shadow.camera.far = 1000;
  scene.add( light );

  let popLight = new THREE.PointLight( 0x0000ff, 1.75 );
  popLight.position.set( -150, 60, 0 );
  scene.add( popLight );

  let popLightTwo = new THREE.PointLight( 0xff0000, 1.75 );
  popLightTwo.position.set( 150, -60, 0 );
  scene.add( popLightTwo );

  // cloth material

  let loader = new THREE.TextureLoader();
  let clothTexture = loader.load( 'textures/patterns/banner-grey.png' );
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

  // sphere

  // let ballGeo = new THREE.SphereGeometry( ballSize, 20, 20 );
  // let ballMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
  //
  // sphere = new THREE.Mesh( ballGeo, ballMaterial );
  // sphere.castShadow = true;
  // sphere.receiveShadow = true;
  // scene.add( sphere );

  // renderer

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( banner.clientWidth, banner.clientHeight );
  // renderer.setSize( 700, 400 );
  // renderer.setSize( banner.clientWidth, banner.clientHeight );
  // renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0xffffff, 0);
  // renderer.setClearColor( scene.fog.color );

  banner.appendChild( renderer.domElement );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMap.enabled = true;

  // performance monitor
  stats = new Stats();
  // document.body.appendChild( stats.dom );

  //

  // sphere.visible = true;

  window.addEventListener( 'resize', onWindowResize, false );

}

//

function onWindowResize() {
	camera.aspect = banner.clientWidth / banner.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( banner.clientWidth, banner.clientHeight );
}

//

function animate() {

  requestAnimationFrame( animate );

  let time = Date.now();

  windStrength = Math.cos( time / 7000 ) * 1 + 1;
  windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) ).normalize().multiplyScalar( windStrength );

  simulate( time );
  render();
  stats.update();

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

  // sphere.position.copy( ballPosition );

  // camera.lookAt( scene.position );

  renderer.render( scene, camera );

}