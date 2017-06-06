// require('./js/eventHandler.js');
import scrollToTarget from './js/scrollToTarget';
import clipBoardCopy from './js/clipBoardCopy';
require('./js/handleAnimation.js');
require('./js/flag/flag.js');

let aboutButton = document.querySelector("#aboutButton");
let aboutMe = document.querySelector(".aboutMe");

scrollToTarget(aboutButton, '.aboutMe');

clipBoardCopy();