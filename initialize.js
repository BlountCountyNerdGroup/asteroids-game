var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var BACKGROUND_COLOR = '#000000';
var ASTEROID_COLOR = '#b9c0cc';

var blobs = [];
var NUM_OF_BLOBS = 5;

var gameOver = false;