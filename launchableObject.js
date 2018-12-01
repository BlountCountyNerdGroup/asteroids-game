function isLaunchableObject(launchableObject) {
    var hasPosition = launchableObject.hasOwnProperty('position');

    if (hasPosition) {
        var position = launchableObject.position;
        if (!(position.hasOwnProperty('x') && position.hasOwnProperty('y'))) {
            console.error("Oops! Your position object doesn't have x and y properties");
        }
    }

    var hasVelocity = launchableObject.hasOwnProperty('velocity');
    var hasAngle = launchableObject.hasOwnProperty('angle');
    var hasPhysicsLoop = launchableObject.hasOwnProperty('physicsLoop');

    return hasPosition && hasVelocity && hasAngle && hasPhysicsLoop;
}

function launch(launchableObject) {
    if (isLaunchableObject(launchableObject)) {
        launchableObject.hasNotBeenGivenAbsPos = true;
        launchableObjects.push(launchableObject);
    } else {
        console.error('Your object does not have all the necessary properties of a launchable object (position, velocity, angle, physicsLoop).');
    }
}

function getLaunchableObjects() {
    return launchableObjects;
}

var launchableObjects = [];