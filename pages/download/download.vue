<template>
    <view class="home1">
        <view style="margin-top: 150px;text-align: center;">
            <image src='../../static/logo.png' style="width: 100px;height: 100px;"></image>
        </view>
        <view style="text-align: center;font-size: 26px;font-weight: bold;margin-top: 40px;margin-bottom:32px;: #97582B">
            让你体验白菜价网购的快感
        </view>
        <view style="text-align: center;font-size:16px;color:white;padding: 4px 16px 4px 16px;background: blue;margin-right: 30%;margin-left: 30%;border-radius: 30px"
              @click="addPublisher">下载APP
        </view>
        <view id="shareit" v-if="show_share" @tap="closeShare">
            <image class="arrow" src="../../static/img/jiant.png"></image>
            <view id="follow">受微信平台限制无法进行下载！点击右上角按钮，选择浏览器打开！下载APP！</view>
        </view>
        <view style="margin-bottom: 8px;position: fixed;bottom: 0;text-align: center;width: 100%"> 北京寻源网络技术有限公司版权所有
        </view>
    </view>
</template>

<script>

    export default {
        data() {
            return {
                show_share: false
            }
        },
        methods: {
            closeShare() {
                this.show_share = false;
            },
            addPublisher() {
                // #ifdef H5
                let ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('micromessenger') !== -1) {
                    this.show_share = true
                } else {
                    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                        uni.showModal({
                            title: "下载提示",
                            content: '苹果APP正在上架中,请访问网站www.gomyorder.cn',
                            showCancel: true,
                            success: (e) => {
                                if (e.confirm) {
                                    window.location.assign(this.$queue.publicYuMing())
                                }
                            }
                        });
                    } else if (/(Android)/i.test(navigator.userAgent)) {
                        window.location.assign(this.$queue.publicYuMing()+"/app.apk")
                    } else {
                        window.location.assign(this.$queue.publicYuMing()+"/app.apk")
                    }
                }
                // #endif
                // #ifndef H5
                plus.runtime.openURL(this.$queue.publicYuMing()+"/app.apk", function (res) {

                });
                // #endif


            },
            navTo(url) {
                uni.navigateTo({
                    url
                })
            }
        }
    }
</script>

<style>

    #shareit {
        -webkit-user-select: none;
        position: fixed;
        /*width: 100%;*/
        height: 2000px;
        background: rgba(0, 0, 0, 0.85);
        text-align: center;
        top: 0;
        left: 0;
        z-index: 999;
    }

    #shareit img {
        max-width: 100%;
    }

    .arrow {
        width: 100px;
        height: 150px;
        position: absolute;
        right: 5%;
        top: 1%;
    }

    #follow {
        margin-right: 60px;
        margin-left: 30px;
        width: 90%;
        height: 50px;
        line-height: 50px;
        text-align: left;
        text-decoration: none;
        font-size: 18px;
        color: white;
        float: left;
        margin-top: 160px;
    }

    .home1 {
        position: absolute;
        width: 100%;
        height: 100%;
        color: black;
        background: #f8f8f8;
        /*background: linear-gradient(0deg, rgba(137, 70, 25, 1) 0%, rgba(240, 180, 72, 1) 51%, rgba(176, 104, 31, 1) 100%);*/
    }
</style>
