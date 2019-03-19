<template>
    <div class="okam-tabbar-container"
        @animationend="onAnimationEnd"
        @webkitAnimationend="onAnimationEnd" v-show="show">
        <div :class="tabBarClassNames" :style="tabBarStyle" >
            <div :class="['weui-tabbar__item', item.active ? 'weui-bar__item_on' : '']"
                @click="onTabClick(index)"
                v-for="(item, index) in tabList" :key="item.pagePath">
                <div class="okam-tabbar-icon">
                    <img :src="item.selectedIconPath" class="weui-tabbar__icon" v-if="item.active && item.selectedIconPath && !isTopPosition" />
                    <img :src="item.iconPath" class="weui-tabbar__icon" v-else-if="!item.active && item.iconPath && !isTopPosition" />
                    <span class="weui-badge okam-tabbar-badge" v-if="item.badge">{{item.badge}}</span>
                    <span class="weui-badge weui-badge_dot okam-tabbar-dot" v-else-if="item.dot"></span>
                </div>
                <div class="weui-tabbar__label"
                    :style="item | getActiveTabStyle(textColor, textSelectedColor)">
                    {{item.text}}
                </div>
            </div>
            <div class="okam-tabbar-active-line" :style="activeLineStyle" v-if="isTopPosition">
                <div class="okam-tabbar-active-line-inner" :style="activeLineInnerStyle"></div>
            </div>
        </div>
    </div>
</template>
<script>
import router from 'okam-api-h5/src/router';
import tabBarApi from 'okam-api-h5/src/tab';

export default {
    props: {
        color: String, // tab text color
        selectedColor: String, // tab text selected color
        backgroundColor: String,
        borderStyle: { // validated value: black / white
            type: String,
            default: 'black'
        },
        list: {
            type: Array,
            required: true
        },
        position: { // validated value: bottom / top
            type: String,
            default: 'bottom'
        }
        // `custom` prop is not supported
    },

    data() {
        return {
            tabList: [],
            activeIndex: 0,
            animationClass: false,
            show: false,
            textColor: '',
            textSelectedColor: '',
            tabBgColor: '',
            tabBorderColor: ''
        };
    },

    computed: {
        isTopPosition() {
            return this.position === 'top';
        },

        tabBarClassNames() {
            let suffix = this.isTopPosition ? 'top' : 'bottom';
            let borderStyle = this.tabBorderColor;
            let isBlackStyle = borderStyle !== 'white';
            let value = ['weui-tabbar', `okam-tabbar-${suffix}`];
            isBlackStyle && value.push(`okam-tabbar-${suffix}-black`);

            if (this.animationClass) {
                value.push(this.animationClass);
            }

            return value;
        },

        tabBarStyle() {
            let style = {};
            let bgColor = this.tabBgColor;
            if (bgColor) {
                style.backgroundColor = bgColor;
            }

            return style;
        },

        activeLineStyle() {
            let lineWidth = 100 / (this.list.length || 1);
            let left = this.activeIndex * 100 + '%';
            let style = {
                width: `${lineWidth}%`,
                transform: `translate3d(${left}, 0, 0)`
            };

            return style;
        },

        activeLineInnerStyle() {
            let style = {};
            if (this.textSelectedColor) {
                style.background = this.textSelectedColor;
            }
            return style;
        }
    },

    watch: {
        list: {
            handler: 'initTabList',
            immediate: true
        },
        color: {
            handler(val) {
                this.textColor = val;
            },
            immediate: true
        },
        selectedColor: {
            handler(val) {
                this.textSelectedColor = val;
            },
            immediate: true
        },
        backgroundColor: {
            handler(val) {
                this.tabBgColor = val;
            },
            immediate: true
        },
        borderStyle: {
            handler(val) {
                this.tabBorderColor = val;
            },
            immediate: true
        }
    },

    filters: {
        getActiveTabStyle(tab, color, selectedColor) {
            let style = {};

            if (tab.active && selectedColor) {
                style.color = selectedColor;
            }
            else if (!tab.active && color) {
                style.color = color;
            }
            return style;
        }
    },

    created() {
        let routePath = this.$route.path;
        let activeIdx;
        this.list.some((item, index) => {
            if (item.pagePath === routePath) {
                activeIdx = index;
                return true;
            }
            return false;
        });

        if (activeIdx !== undefined) {
            this.activeIndex = activeIdx;
            this.show = true;
        }
        else {
            this.show = false;
        }

        this.initTabList(this.list);

        tabBarApi._initTabBarInstance(this);
    },

    mounted() {
        router._initRouterInstance(this.$router);
    },

    methods: {
        initTabList(list) {
            list || (list = []);
            let activeIndex = this.activeIndex;
            this.tabList = list.map((item, index) => {
                return Object.assign({}, item, {
                    active: activeIndex === index,
                    badge: false,
                    dot: false
                });
            });
        },

        setActiveIndex(activeIdx) {
            let tabList = this.tabList;
            tabList.forEach((item, itemIdx) => {
                item.active = itemIdx === activeIdx;
            });
            this.activeIndex = activeIdx;
        },

        onTabClick(activeIdx) {
            this.setActiveIndex(activeIdx);

            let pagePath = this.tabList[activeIdx].pagePath;
            router.switchTab({url: pagePath});
        },

        toggleRedDot(idx, show) {
            let item = this.tabList[idx];
            if (item) {
                item.dot = !!show;
                return true;
            }
            return false;
        },

        toggleTabBar(show, animation, callback) {
            show = !!show;
            if (this.show === show) {
                callback();
                return;
            }

            if (animation) {
                let animationClass;
                if (this.isTopPosition) {
                    animationClass = `okam-tabbar-top-animate-slide-${show ? 'down' : 'up'}`;
                }
                else {
                    animationClass = `weui-animate-slide-${show ? 'up' : 'down'}`;
                }
                this.animationClass = animationClass;

                if (show) {
                    this.$el.style.display = 'block';
                }
                this.animationDoneCallback = () => {
                    this.show = show;
                    this.animationClass = '';
                    callback();
                };
            }
            else {
                this.show = show;
                callback();
            }
        },

        onAnimationEnd() {
            this.animationDoneCallback && this.animationDoneCallback();
            this.animationDoneCallback = null;
            this.animation = false;
        },

        setTabBarStyle({color, selectedColor, backgroundColor, borderStyle}) {
            color != null && (this.textColor = color);
            selectedColor != null && (this.textSelectedColor = selectedColor);
            backgroundColor != null && (this.tabBgColor = backgroundColor);
            borderStyle != null && (this.tabBorderColor = borderStyle);
        },

        setTabBarItem(index, info) {
            let item = this.tabList[index];
            if (item) {
                Object.assign(item, info);
                return true;
            }
            return false;
        },

        setTabBarBadge(index, text) {
            let item = this.tabList[index];
            if (item) {
                text = text || '';
                text.length > 4 && (text = '...');
                item.badge = text;
                return true;
            }
            return false;
        }

    }
};
</script>
<style lang="stylus">
@require './common/mixin.styl'
$-okam-tabbar-height := 50px

.okam-tabbar-wrap
    display: flex
    flex-direction: column
    height: 100%

.okam-tabbar-container
    position: relative
    min-height: $-okam-tabbar-height
    .weui-tabbar
        position: relative
        height: 100%

@keyframes topSlideUp
    from
        transform: translate3d(0, 0, 0)

    to
        transform: translate3d(0, -100%, 0)

@keyframes topSlideDown
    from
        transform: translate3d(0, -100%, 0)

    to
        transform: translate3d(0, 0, 0)

.okam-tabbar-top-animate-slide-up
    animation: topSlideUp ease .3s forwards

.okam-tabbar-top-animate-slide-down
    animation: topSlideDown ease .3s forwards

.okam-tabbar-content
    position: relative
    flex: 1
    overflow: auto
    -webkit-overflow-scrolling: touch

.okam-tabbar-top,
.okam-tabbar-bottom
    align-items: center

    &:before
        border-top: none

.okam-tabbar-top
    top: 0
    left: 0
    bottom: auto
    width: 100%

.okam-tabbar-bottom-black
    hairline(#C0BFC4, top)

.weui-tabbar__item
    .okam-tabbar-dot
        position: absolute
        top: 0
        right: -6px

    .okam-tabbar-badge
        position: absolute
        top: -2px
        left: 13px
        min-width: 15px

.okam-tabbar-icon
    position: relative
    display: inline-block

.okam-tabbar-active-line
    position: absolute
    bottom: 0
    height: 3px
    transition: transform ease .3s

.okam-tabbar-active-line-inner
    width: 60%
    height: 100%
    margin: 0 auto
    background: #09bb07

</style>
