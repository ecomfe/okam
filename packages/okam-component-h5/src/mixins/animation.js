/**
 * @file Enable animation property support
 * @author sparklewhy@gmail.com
 */

'use strict';

const TRANSITION_END_EVENT = 'transitionend';

let needWebkitVendorPrefix = null;
function initStyleVendorPrefix() {
    let elem = document.createElement('div');
    elem.style.cssText = `
        -webkit-transition: all;
        transition: all;
    `;

    needWebkitVendorPrefix = !elem.style.transition;
}

function getStylePropName(prop) {
    if (needWebkitVendorPrefix) {
        return 'webkit' + prop.replace(/^\w/, c => c.toUpperCase());
    }
    return prop;
}


function normalizeAnimationData(data) {
    let {style: styleMap, transform: transformMap, options} = data;
    const {
        duration,
        delay,
        timingFunction,
        transformOrigin
    } = options;

    // init style rules
    let styleRules = [];
    let transitionProps = [];
    Object.keys(styleMap).forEach(k => {
        styleRules.push([k, styleMap[k]]);
        transitionProps.push(k);
    });

    // init transform style rule
    let transformRule = [];
    Object.keys(transformMap).forEach(k => {
        transformRule.push(`${k}(${transformMap[k]})`);
    });
    if (transformRule.length) {
        transitionProps.push('transform');
        styleRules.push([getStylePropName('transform'), transformRule.join(' ')]);
    }

    const animationRules = [];
    animationRules.push([getStylePropName('transformOrigin'), transformOrigin]);

    // init transition style rule
    animationRules.push([
        getStylePropName('transition'),
        `${duration}ms ${timingFunction} ${delay}ms`]
    );
    animationRules.push([
        getStylePropName('transitionProperty'),
        transitionProps.join(', ')
    ]);

    return {
        style: styleRules,
        animation: animationRules
    };
}

function executeAnimation(el, steps) {
    if (!Array.isArray(steps)) {
        return;
    }

    if (needWebkitVendorPrefix === null) {
        initStyleVendorPrefix();
    }

    let animationData = steps.map(item => normalizeAnimationData(item));
    let stepIdx = 0;
    let doAnimation = function () {
        if (stepIdx >= animationData.length) {
            el.removeEventListener(TRANSITION_END_EVENT, executeAnimation);
            return;
        }

        let {style, animation} = animationData[stepIdx];
        stepIdx++;
        if (!style.length) {
            return doAnimation();
        }

        animation.forEach(p => (el.style[p[0]] = p[1]));
        style.forEach(p => (el.style[p[0]] = p[1]));
    };

    doAnimation();
    el.addEventListener(TRANSITION_END_EVENT, doAnimation);
}

export default {
    props: {
        animation: [Array, String, Object]
    },

    mounted() {
        this.$watch('animation', (newVal, oldVal) => {
            newVal && executeAnimation(this.$el, newVal);
        }, {immediate: true});
    }
};
