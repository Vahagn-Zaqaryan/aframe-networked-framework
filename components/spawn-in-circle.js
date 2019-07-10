AFRAME.registerComponent('spawn-in-circle', {
    schema: {
        radius: {type: 'number', default: 1}
    },

    init() {
        let el = this.el;
        let center = el.getAttribute('position');

        let angleRad = this.getRandomAngleInRadians();
        let circlePoint = this.randomPointOnCircle(this.data.radius, angleRad);
        let worldPoint = {x: circlePoint.x + center.x, y: center.y, z: circlePoint.y + center.z};
        el.setAttribute('position', worldPoint);

        let angleDeg = angleRad * 180 / Math.PI;
        let angleToCenter = -1 * angleDeg + 90;
        let rotationStr = '0 ' + angleToCenter + ' 0';
        el.setAttribute('rotation', rotationStr);
    },

    getRandomAngleInRadians() {
        return Math.random()*Math.PI*2;
    },

    randomPointOnCircle(radius, angleRad) {
        let x = Math.cos(angleRad)*radius;
        let y = Math.sin(angleRad)*radius;
        return {x, y};
    }
});