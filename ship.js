// globals
var ship = {
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    width: 30,
    height: 30,
    angle: 0, // copmletely horizontal, in degrees
    getBodyShape() { // defines black triangle
        var radianAngle = getRelativeRadAngle(this.angle)

        // note that we are centering the center of the triangle, not top left of ship
        var pts = {
            pt1: new Point(this.x - this.width / 2, this.y + this.height / 2), // initially top left
            pt2: new Point(this.x - this.width / 2, this.y - this.height / 2), // initially bottom left
            pt3: new Point(this.x + this.width / 2, this.y) // initially right point
        }

        var angledPtsPos = {};

        var origin = new Point(this.x, this.y);

        // transform initial points based on angle
        pts = rotatePoints(origin, pts, radianAngle);

        return pts;
    },
    move() {
        var body = this.getBodyShape();
        drawTriangle(body, '#ff0000');
    }
}

var keysDown = [];

var keys = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
}

var SHIP_ACCELERATION = .2;

function drawTriangle(bodyShape, color='#000000') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(bodyShape.pt1.x, bodyShape.pt1.y);
    ctx.lineTo(bodyShape.pt2.x, bodyShape.pt2.y);
    ctx.lineTo(bodyShape.pt3.x, bodyShape.pt3.y);
    ctx.fill();
    ctx.fillStyle = '#000000';
}

function rotatePoints(origin, pts, radianAngle) {
    for (var prop in pts) {
        var angledX = origin.x + (Math.cos(radianAngle) * (pts[prop].x - origin.x) - Math.sin(radianAngle) * (pts[prop].y - origin.y));
        var angledY = origin.y + (Math.cos(radianAngle) * (pts[prop].y - origin.y) + Math.sin(radianAngle) * (pts[prop].x - origin.x));

        pts[prop] = new Point(angledX, angledY);
    }

    return pts;
}

function Point(x, y) {
    return {
        x: x,
        y: y
    }
}

function getRelativeRadAngle(degrees) {
    // keep angle within range [0, 360]
    var relativeAngle = degrees % 360;

    // redefine in terms of degrees
    var radianAngle = relativeAngle * (Math.PI / 180);

    return radianAngle;
}

function updateShip() {
    // update acceleration
    if (keysDown.indexOf(keys.down) == -1 && keysDown.indexOf(keys.up) == -1) {
        ship.ax = 0;
        ship.ay = 0;
    }

    for (var keyCode of keysDown) {
        var angle = getRelativeRadAngle(ship.angle);

        if (keyCode == keys.up) { 
            ship.ax = SHIP_ACCELERATION * Math.cos(angle);
            ship.ay = SHIP_ACCELERATION * -Math.sin(angle);
        } 
        
        // if you want to add backwards thrust, uncomment
        /* else if (keyCode == keys.down) {
            ship.ax = -SHIP_ACCELERATION * Math.cos(angle);
            ship.ay = -SHIP_ACCELERATION * -Math.sin(angle);
        } */
        
        if (keyCode == keys.right) {  
            ship.angle += 3;
        } else if (keyCode == keys.left) {
            ship.angle -= 3;
        }
    }

    ship.vy += -ship.ay; // negative to invert javascript's positive down direction
    ship.vx += ship.ax;
    
    ship.x += ship.vx;
    ship.y += ship.vy;

    // move ship to other side of screen of ship goes off one side of screen
    if (ship.x > window.innerWidth || ship.x <= 0) {
        ship.x = window.innerWidth - ship.x;
    }
    if (ship.y > window.innerHeight || ship.y <= 0) {
        ship.y = window.innerHeight - ship.y;
    }

    ship.move();
}

// add keys not already in keysDown to keysDown when pressed
addEventListener('keydown', function(e) {
    var index = keysDown.indexOf(e.keyCode);
    var notAlreadyInArray = index == -1;

    if (notAlreadyInArray) {
        if (e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.up || e.keyCode == keys.down) {
            keysDown.push(e.keyCode);
        }
    }
});

// remove key from keysDown on keyup
addEventListener('keyup', function(e) {
    var index = keysDown.indexOf(e.keyCode);

    if (index != -1) {
        keysDown.splice(index, 1);
    }
})