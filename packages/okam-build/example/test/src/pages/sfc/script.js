import Hello from '../../components/Hello';

export default {
    config: {
        title: 'Home Page Title'
    },

    components: {
        Hello
    },

    data: {
        btnText: 'Hello',
        clicked: false,
        from: 'Okam home page'
    },

    methods: {

        handleHello(e) {
            this.clicked = true;
            this.btnText = 'You clicked';

            this.$api.showToast({
                title: 'Received Hello',
                duration: 3000
            });
        }
    }
};
