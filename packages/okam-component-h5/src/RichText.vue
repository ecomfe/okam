<script>

const PROXY_EVENT_NAMES = [
    'click', 'touchstart', 'touchcancel', 'touchend', 'touchmove'
];

function escape(str) {
    return str.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function createVNode(createElement, node, extraOpts) {
    let {name, attrs, children, text} = node;
    if (text) {
        return createElement('span', {
            domProps: {
                innerHTML: escape(text)
            }
        });
    }

    let vnodeChildren;
    if (children && children.length) {
        vnodeChildren = children.map(
            item => createVNode(createElement, item)
        );
    }

    let opts = {attrs};
    if (extraOpts) {
        Object.assign(opts, extraOpts);
    }
    return createElement(name, opts, vnodeChildren);
}

export default {
    props: {
        nodes: [String, Array]
    },

    beforeCreate() {
        let onOpts = {};
        PROXY_EVENT_NAMES.forEach(name => {
            onOpts[name] = e => this.$emit(name, e);
        });
        this.onOption = onOpts;
    },

    render(createElement) {
        let nodes = this.nodes;
        let eventOpts = {
            on: this.onOption
        };
        if (Array.isArray(nodes)) {
            let rootNode;
            if (nodes.length > 1) {
                rootNode = {
                    name: 'div',
                    children: nodes
                };
            }
            else {
                rootNode = nodes[0];
            }

            return rootNode
                ? createVNode(createElement, rootNode, eventOpts)
                : '';
        }

        return createElement(
            'div',
            Object.assign({
                domProps: {
                    innerHTML: nodes
                }
            }, eventOpts)
        );
    }

};
</script>
