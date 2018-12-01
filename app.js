function animate() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // do all blob related processing/drawing
        for (var i = 0; i < blobs.length; i++) {
            var blob = blobs[i];

            updateBlobMovement(blob);

            if (checkIfShipHitBlob(blob)) {
                gameOver = true;
                break;
            }

            var launchableObjects = getLaunchableObjects(); // breaks the game here
            // console.log(launchableObjects.length)
            // for (var i = 0; i < launchableObjects.length; i++) {
                // var bulletPos = launchableObjects[i].position;
                // deleteBlobIfHit(blob, bulletPos);
            // }

            drawBlob(blob);
        }

        // do all launchable object (only rockets as of now) processing/drawing 
        var launchableObjects = getLaunchableObjects();
        for (var i = 0; i < launchableObjects.length; i++) {
            var radians = getRelativeRadAngle(launchableObjects[i].angle);
            var vx = launchableObjects[i].velocity * Math.cos(radians);
            var vy = launchableObjects[i].velocity * -Math.sin(radians);

            if (launchableObjects[i].hasNotBeenGivenAbsPos) {
                launchableObjects[i].hasNotBeenGivenAbsPos = false;

                launchableObjects[i].position.x += ship.x;
                launchableObjects[i].position.y += ship.y;
            }

            launchableObjects[i].position.x += vx;
            launchableObjects[i].position.y += vy;

            launchableObjects[i].physicsLoop();
        }

        // move ship with keyboard input
        updateShip(ship.x, ship.y);

        // call this function again ASAP
        requestAnimationFrame(animate);
    }
}

animate();