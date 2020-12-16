<template>
    <view>
        <web-view :webview-styles="webviewStyles" src="https://fir.vip/d/5yilc"></web-view>
    </view>
</template>

<script>
    export default {
        onShareAppMessage(res) {
            return {
                title: '购物先领券，一年省一半',
                path: '/pages/index/index'
            }
        },
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }

            }
        },
        onPullDownRefresh: function () {
            uni.stopPullDownRefresh(); // 停止刷新
        },
        methods: {},

    }
</script>

<style>
    @import "../../static/css/index.css";
</style>
