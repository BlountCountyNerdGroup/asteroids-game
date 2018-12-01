for (var i = 0; i < NUM_OF_BLOBS; i++) {
    blobs.push(getNewBlob());
}

// min [inclusive], max [inclusive]
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDistBetween(pt1, pt2) {
    var dist = Math.sqrt((pt1.x - pt2.x)**2 + (pt1.y - pt2.y)**2);
    return dist;
}

function getRandomRect() {
    return {
        type: 'rect',
        width: getRandInt(15, 30),
        height: getRandInt(15, 30),
        relativeX: getRandInt(-20, 20),
        relativeY: getRandInt(-20, 20)
    }
}

function getRandomCircle() {
    return {
        type: 'circle',
        radius: getRandInt(15, 30),
        relativeX: getRandInt(-20, 20),
        relativeY: getRandInt(-20, 20)
    }
}

// returns new random blob object
function getNewBlob() {
    var blob = {
        centerX: getRandInt(0, canvas.width),
        centerY: getRandInt(0, canvas.height),
        vx: getRandInt(-3, 3),
        vy: getRandInt(-3, 3),
        data: [],
        // returns index of shape that was hit or -1 if not hit
        getIndexOfHitShape(bulletPos) {
            for (var i = 0; i < this.data.length; i++) {
                var shape = this.data[i];
                var absoluteX = this.centerX + shape.relativeX;
                var absoluteY = this.centerY + shape.relativeY;

                if (shape.type == 'circle') {
                    if (getDistBetween(bulletPos, {x: absoluteX, y: absoluteY}) <= shape.radius) {
                        return i;
                    }
                } 
                if (shape.type == 'rect') {
                    // check x
                    if (bulletPos.x > absoluteX && bulletPos.x < absoluteX + shape.width) {
                        // check y
                        if (bulletPos.y > absoluteY && bulletPos.y < absoluteY + shape.height) {
                            return i;
                        }
                    }
                }
            }

            return -1;
        }
    };

    var numOfShapesPerBlob = getRandInt(3, 8)
    for (let i = 0; i < numOfShapesPerBlob; i++) {
        if (Math.random() > .5) blob.data.push(getRandomRect());
        else blob.data.push(getRandomCircle());
    }

    return blob;
}

function drawBlob(blob) {
    ctx.fillStyle = ASTEROID_COLOR;
    for (var i=0; i < blob.data.length; i++) {
        var absoluteX = blob.centerX + blob.data[i].relativeX;
        var absoluteY = blob.centerY + blob.data[i].relativeY;

        var currentBlob = blob.data[i];
        ctx.beginPath();

        if (currentBlob.type == 'rect') {
            ctx.fillRect(absoluteX, absoluteY, 
                currentBlob.width, currentBlob.height);
        } else if (currentBlob.type == 'circle') {
            ctx.arc(absoluteX, absoluteY, currentBlob.radius, 0, Math.PI * 2)
            ctx.fill();
        }
    }
}

// deletes individual shape of an asteroid "blob"
function deleteBlobIfHit(blob, bulletPos) {
    var indexOfHitShape = blob.getIndexOfHitShape(bulletPos);

    if (indexOfHitShape != -1) {
        if (blob.data.length == 1) blobs.splice(i, 1);
        else blob.data.splice(indexOfHitShape, 1);
    }
}

function checkIfShipHitBlob(blob) {
    var shipHit = false;
    var shipShape = ship.getBodyShape();

    for (var pt in shipShape) {
        var shipVertex = new Point(shipShape[pt].x, shipShape[pt].y);
        var indexOfHitShape = blob.getIndexOfHitShape(shipVertex);

        if (indexOfHitShape != -1) {
            shipHit = true;
            break;
        }
    }

    return shipHit;
}

function updateBlobMovement(blob) {
    blob.centerX += blob.vx;
    blob.centerY += blob.vy;

    if (blob.centerX >= canvas.width || blob.centerX <= 0) {
        blob.vx *= -1;
    }

    if (blob.centerY >= canvas.height || blob.centerY <= 0) {
        blob.vy *= -1;
    }
}