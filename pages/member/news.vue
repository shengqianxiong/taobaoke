<template>
    <view class="content">
        <view style="background: white;text-align: center;padding: 16px;border-radius: 16px;margin-top: 55%;margin-right: 10%;margin-left: 10%">
            <view style="text-align: center;color: red;opacity: 0.8;font-weight: bold">福利一</view>
            {{text}}
            <view @click="sharurl()"
                  style="background: red;opacity: 0.8;color: white;border-radius: 30px;padding: 8px 10px;margin:16px 32px 2px 32px">
                {{des}}
            </view>
        </view>
        <view style="background: white;text-align: center;padding: 16px;border-radius: 16px;margin-top: 30px;margin-right: 10%;margin-left: 10%">
            <view style="text-align: center;color: red;opacity: 0.8;font-weight: bold">福利二</view>
            今日的前100名新用户！可获得免费加入会员的机会，拥有多项超级特权！省钱又赚钱！
            <view @click="addPublisher()"
                  style="background: red;opacity: 0.8;color: white;border-radius: 30px;padding: 8px 10px;margin:16px 32px 2px 32px">
                {{des1}}
            </view>
        </view>
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
                des: '立即注册',
                text: '新用户注册免费领取双十一超级红包！上亿红包坐等你来领取！最高可获得1111元',
                des1: '免费加入会员',
                relation_id: ''
            }
        },
        onLoad() {
            let types = this.$queue.getData("type");
            let token = this.$queue.getData("token");
            if (token) {
                this.des = '一键复制';
                this.text = '2019双11超级红包主会场 复制这条信息，$d93jYqr2f2t$，到【手机淘宝】即可查看';
            }
            let relation_id = this.$queue.getData("relation_id");
            if (relation_id) {
                this.des1 = '已经加入会员';
            }
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
                let token = this.$queue.getData("token");
                let userId = this.$queue.getData("userId");
                if (token) {
                    uni.navigateTo({
                        url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/public/register'
                    })
                }
            },
            //复制分享链接
            sharurl() {
                let token = this.$queue.getData("token");
                if (token) {
                    uni.setClipboardData({
                        data: '2019双11超级红包主会场 $d93jYqr2f2t$，到【手机淘宝】即可领取双11超级红包',
                        success: function () {
                            console.log('success');
                            uni.showModal({
                                content: '复制成功！请打开【手机淘宝】即可领取双11超级红包',
                                showCancel: false,
                            });
                        }
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/public/register'
                    })
                }

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
        background: url(../../static/img/double.jpg) no-repeat;
        width: 100%;
        background-size: cover
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
