<template>
    <view style="padding: 16px;background: #FFFFFF">

      <view >
          <view style="color: orangered">
              省钱兄是西安省钱兄网络科技有限公司旗下产品！
          </view>
          <view style="margin-top: 16px">
              这里有海量的淘宝、天猫商品,

          </view>
          <view>
              您要做的只是把好的商品分享出去，<text style="color: orangered">不用囤货，不用发货，无额外费用，0成本，0风险，</text>
          </view>
          <view>
              产生成交就有佣金拿，多劳多得，上不封顶！
          </view>
      </view>




        淘宝联盟APP是学生党、上班族、家庭主妇、自由职业者等赚钱首选，现在就跟着淘小客君一起开启赚钱之旅吧！
        1找到喜欢的商品

        APP上带券的商品，都是经过系统筛选的优质商品。尤其适合作为专属粉丝福利，转化率高，强烈推荐！

        2分享商品

        选品图片-确认文案-选择渠道，一键分享出去

        朋友圈微信群
        3用户下单得佣金

        只要用户购买您分享的商品，即可获得相应的佣金奖励。

        4如何查看佣金收入

        报表可以查看推广效果，点击订单明细可以查看具体订单。

        5怎么把钱提出来？

        报表-提现，可把钱提到支付宝。每月21号可提取上个月收益，无收益门槛限制哦。

        6怎么提升收入？

        关注联盟学堂的推送消息，多跟大牛学习。

        7有问题？

        戳这里，看帮助和反馈

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
                },
                isWeiXin: false
            }
        },
        onLoad() {
            //#ifdef H5
            let ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('micromessenger') !== -1) {
                this.isWeiXin = true;
            }
            //#endif
        },
        onShow() {
            //#ifdef H5
            if (this.$queue.getData("openid")) {
                this.$Request.get("/tao/wx/follow/" + this.$queue.getData("openid")).then(res => {
                    if (res === true) {
                        uni.navigateBack();
                    }
                });
            }
            //#endif
        },
        onPullDownRefresh: function () {
            uni.stopPullDownRefresh(); // 停止刷新
        },
        methods: {
            navBack() {
                uni.navigateBack();
            },
            follow() {
                this.$Request.get("/tao/wx/follow/" + this.$queue.getData("openid")).then(res => {
                    if (res === true) {
                        window.location.replace(this.$queue.publicYuMing());
                    } else {
                        uni.showToast({
                            title: "请长按识别上方二维码关注公众号",
                            mask: false,
                            duration: 1500,
                            icon: "none"
                        });
                    }

                });
            },
            rests() {
                uni.showToast({
                    title: "已刷新请再次长按识别",
                    mask: false,
                    duration: 1500,
                    icon: "none"
                });
                window.location.reload();
            }
        },

    }
</script>

<style lang='scss'>
    @import "../../static/css/index.css";

    .back-btn {
        position: absolute;
        left: 20px;
        z-index: 9999;
        padding-top: var(--status-bar-height);
        top: 20px;
        font-size: 20px;
        color: white;
    }

    uni-image > div, uni-image > img {
        width: 102%;
        height: 100%;
    }

    .content {
        text-align: center;
        position: absolute;
        height: 100%;

        width: 100%;
        background-size: cover
    }
</style>
