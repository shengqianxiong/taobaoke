<template>
    <view class="content" style="background: #f7bcc8 ">
        <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>

        <view style="margin-top: 50%;background: white;opacity:0.9;text-align: center;padding: 32px;border-radius: 16px;margin-right: 10%;margin-left: 10%">
            <view style="text-align: center;color: red;opacity: 0.8;font-weight: bold;padding-top: 4px;font-size: 22px">新用户红包超级福利</view>
           <view style="margin-top: 16px;margin-bottom: 16px">
               复制这条信息，$He4xYwNkk9Y$，到【手机淘宝】即可领红包
           </view>
            <view @click="sharurl()"
                  style="background: red;opacity: 0.8;color: white;border-radius: 30px;padding: 8px 10px;margin:16px 32px 2px 32px">
                一键复制
            </view>
        </view>
<!--        <view style="background: white;opacity: 0.9;text-align: center;padding: 12px;border-radius: 12px;margin-top: 12px;margin-right: 10%;margin-left: 10%">-->
<!--            <view style="text-align: center;color: red;opacity: 0.8;font-weight: bold">下载APP操作更便捷</view>-->
<!--            省钱兄是一个汇聚了全网隐藏优惠券的省钱法宝！快下载省钱兄APP体验白菜价网购的快感！-->
<!--            <view @click="addPublisher()"-->
<!--                  style="background: red;opacity: 0.8;color: white;border-radius: 30px;padding: 8px 10px;margin:16px 32px 2px 32px">-->
<!--                立即下载-->
<!--            </view>-->
<!--            <view @click="navBack()"-->
<!--                  style="background: red;opacity: 0.8;color: white;border-radius: 30px;padding: 8px 10px;margin:8px 32px 2px 32px">-->
<!--                商城首页-->
<!--            </view>-->
<!--        </view>-->
    </view>
</template>

<script>
    import wmPoster from "@/components/wm-poster/wm-poster.vue"

    export default {
        components: {wmPoster},
        data() {
            return {
                providerList: [],
                type: 0,
                token: '',
                relation_id: ''
            }
        },
        onLoad() {
            let types = this.$queue.getData("type");
            this.token = this.$queue.getData("token");
            this.relation_id = this.$queue.getData("relation_id");
            if (types) {
                this.type = types;
            } else {
                let type = Math.floor(Math.random() * (100 - 2)) + 1;
                this.$queue.setData("type", type);
                this.type = type;
            }
        },
        methods: {
            navBack() {
                uni.switchTab({
                    url: "/pages/index/index"
                })
            },
            addPublisher() {
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                    uni.showModal({
                        title: "下载提示",
                        content: '苹果APP正在上架中请先关注公众号使用哦',
                        showCancel: true,
                        success: (e) => {
                            if (e.confirm) {
                                uni.navigateTo({url: '/pages/member/erweima'});
                            }
                        }
                    });
                } else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
                    window.location.assign("https://fir.vip/d/5yilc")
                } else { //pc
                    window.location.assign(this.$queue.publicYuMing())
                }
            },
            //复制分享链接
            sharurl() {
                uni.setClipboardData({
                    data: '  购物领券就上省钱兄 金额随机，先到先得！快抢！\n' +
                        '            复制这条信息，$He4xYwNkk9Y$，到【手机淘宝】即可查看',
                    success: function () {
                        console.log('success');
                        uni.showModal({
                            content: '复制成功！请打开【手机淘宝】即可领取省钱兄现金红包',
                            showCancel: false,
                        });
                    }
                });
            },

        },
    }


</script>

<style lang='scss'>
    .tugurl {
        color: #999;
    }

    .back-btn {
        position: absolute;
        left: 20px;
        z-index: 9999;
        padding-top: var(--status-bar-height);
        top: 20px;
        font-size: 20px;
        color: white;
    }

    .content {
        position: absolute;
        width: 100%;
    }

    .sharbuttn {
        display: flex;
        justify-content: center;
    }

    .shartitle {
        width: 80%;
        text-align: center;
        margin-left: 10%;
        border-bottom: 1px solid #dddddd;
        position: relative;
        height: 30px;
    }

    .tgtit {
        text-align: center;
    }

    .shartitle view {
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        color: #999;
        width: 60px;
        margin: 16px auto;
        position: absolute;
        background: #fff;
        left: 50%;
        margin-left: -30px;
    }

    .sharapk {
        display: flex;
        justify-content: center;
        margin: 10px auto
    }

    .sharapk view {
        margin: 20px;
    }

    .sharapk view image {
        height: 40px;
        width: 40px;
    }

    .content {
        position: absolute;
        height: 100%;
        width: 100%;
        background-size: contain
    }


    .banner {
        width: 100%;
        background-color: #FFFFFF;
        border-radius: 30px 30px 0 0;
        margin-top: -90px;
    }

    .banner dl {
        margin-top: -40px;
    }

    .banner dl dt {
        text-align: center;
    }

    .banner dl dt image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    .banner dl dd {
        text-align: center;
    }

    .img {
        width: 150px;
        height: 150px;
        background-color: red;
        margin: 0 auto;
        margin-top: 30px;
    }

    .img image {
        width: 100%;
        height: 100%;
    }

    .btn {
        width: 130px;
        height: 30px;
        line-height: 30px;
        margin: 0 auto;
        margin-top: 16px;
        border-radius: 20px;
        border: 0;
        font-size: 13px;
        outline: 0;
        background: #e10a07;
        color: #FFFFFF;
        text-align: center;
    }

    .bottom {
        margin-top: 16px;
        text-align: center;
        width: 100%;
        background-position: left bottom; /* 设置背景图片位置 */
        background-size: 20%;
    }

    .bottom ul {
        padding-left: 20px;
        box-sizing: border-box;
    }

    .bottom ul li {
        width: 100%;
        height: 30px;
    }
</style>
