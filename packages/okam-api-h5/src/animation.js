/**
 * @file Animation API for H5 App
 * @author sparklewhy@gmail.com
 */

'use strict';

function unit(val) {
    if (typeof val === 'number') {
        return `${val}px`;
    }
    return val || 0;
}

class Animation {
    constructor({
        duration = 400,
        delay = 0,
        timingFunction = 'linear',
        transformOrigin = '50% 50% 0'
    } = {}) {
        this.defaultStepOpts = {
            duration,
            delay,
            timingFunction,
            transformOrigin
        };

        this.styleMap = {};
        this.transformMap = {};
        this.steps = [];
    }

    matrix(...args) {
        this.transformMap.matrix = args.join(', ');
        return this;
    }

    matrix3d(...args) {
        this.transformMap.matrix3d = args.join(', ');
        return this;
    }

    rotate(angle) {
        this.transformMap.rotate = `${angle}deg`;
        return this;
    }

    rotate3d(x, y, z, angle) {
        this.transformMap.rotate3d = `${x}, ${y}, ${z}, ${angle}deg`;
        return this;
    }

    rotateX(angle) {
        this.transformMap.rotateX = `${angle}deg`;
        return this;
    }

    rotateY(angle) {
        this.transformMap.rotateY = `${angle}deg`;
        return this;
    }

    rotateZ(angle) {
        this.transformMap.rotateZ = `${angle}deg`;
        return this;
    }

    scale(x, y) {
        this.transformMap.scale = `${x}, ${y}`;
        return this;
    }

    scale3d(x, y, z) {
        this.transformMap.scale3d = `${x}, ${y}, ${z}`;
        return this;
    }

    scaleX(scale) {
        this.transformMap.scaleX = scale;
        return this;
    }

    scaleY(scale) {
        this.transformMap.scaleY = scale;
        return this;
    }

    scaleZ(scale) {
        this.transformMap.scaleZ = scale;
        return this;
    }

    skew(x, y) {
        this.transformMap.skew = `${x}, ${y}`;
        return this;
    }

    skewX(angle) {
        this.transformMap.skewX = angle;
        return this;
    }

    skewY(angle) {
        this.transformMap.skewY = angle;
        return this;
    }

    translate(x, y) {
        this.transformMap.translate = `${unit(x)}, ${unit(y)}`;
        return this;
    }

    translate3d(x, y, z) {
        this.transformMap.translate3d = `${unit(x)}, ${unit(y)}, ${unit(z)}`;
        return this;
    }

    translateX(translate) {
        this.transformMap.translateX = unit(translate);
        return this;
    }

    translateY(translate) {
        this.transformMap.translateY = unit(translate);
        return this;
    }

    translateZ(translate) {
        this.transformMap.translateZ = unit(translate);
        return this;
    }

    opacity(value) {
        this.styleMap.opacity = value;
        return this;
    }

    backgroundColor(value) {
        this.styleMap.backgroundColor = value;
        return this;
    }

    width(value) {
        this.styleMap.width = unit(value);
        return this;
    }

    height(value) {
        this.styleMap.height = unit(value);
        return this;
    }

    top(value) {
        this.styleMap.top = unit(value);
        return this;
    }

    right(value) {
        this.styleMap.right = unit(value);
        return this;
    }

    bottom(value) {
        this.styleMap.bottom = unit(value);
        return this;
    }

    left(value) {
        this.styleMap.left = unit(value);
        return this;
    }

    step(options) {
        this.steps.push({
            style: this.styleMap,
            transform: Object.assign({}, this.transformMap),
            options: Object.assign({}, options, this.defaultStepOpts)
        });

        // clear style rules, do not clear transform to ensure the animation consistency
        this.styleMap = {};

        return this;
    }

    export() {
        let animationStepData = this.steps;

        // clear steps
        this.steps = [];

        return animationStepData;
    }
}

export default {
    createAnimation(options) {
        return new Animation(options);
    }
};
