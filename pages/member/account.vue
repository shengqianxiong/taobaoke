<template>
    <view class="container">
        <view v-if="relation_id" class="list-cell b-b" @click="navTo('/pages/member/zhifubao')" hover-class="cell-hover"
              :hover-stay-time="50">
            <text class="cell-tit">提现账号设置</text>
            <text class="cell-more yticon icon-you"></text>
        </view>
        <view class="list-cell b-b" style="margin-top: 2upx" @click="navTo('/pages/public/bind')"
              hover-class="cell-hover"
              :hover-stay-time="50">
            <text class="cell-tit">换绑手机号</text>
            <text class="cell-more yticon icon-you"></text>
        </view>
        <view class="list-cell b-b" style="margin-top: 2upx" @click="navTo('/pages/public/pwd')" hover-class="cell-hover"
              :hover-stay-time="50">
            <text class="cell-tit">修改密码</text>
            <text class="cell-more yticon icon-you"></text>
        </view>
    </view>
</template>

<script>
    import {
        mapMutations
    } from 'vuex';

    export default {
        data() {
            return {
                isShow: false,
                version: '',
                relation_id:'',
            };
        },
        onShow() {
            let that = this;
            let token = this.$queue.getData("token");
            let relation_id = this.$queue.getData("relation_id");
            if (relation_id) {
                this.relation_id = relation_id;
            }
            if (token) {
                this.isShow = true;
            }

        },
        methods: {
            ...mapMutations(['logout']),

            navTo(url) {
                let token = this.$queue.getData("token");
                if (token) {
                    uni.navigateTo({
                        url: url
                    });
                } else {
                    uni.navigateTo({
                        url: '/pages/public/login'
                    });
                }
            },
            navTo1(url) {
                uni.navigateTo({
                    url: url
                });
            },
            about(url) {
                uni.showModal({
                    showCancel: false,
                    title: '省钱兄',
                    content: '省钱兄是一个汇聚了全网隐藏优惠券的网购返利软件 ！这里汇聚淘宝、京东、天猫、拼多多等商城优惠券信息！每天实时更新优惠券，发放一些商家的大额优惠券！这里可以帮你网购省钱返利，也可以帮你兼职赚钱！每年最高能让你网购省50%的钱！\n\n西安省钱兄网络科技有限公司',
                    success: (e) => {
                        if (e.confirm) {

                        }
                    }
                });
            },
            //退出登录
            toLogout() {
                let that = this;
                uni.showModal({
                    content: '确定要退出登录么',
                    success: (e) => {
                        if (e.confirm) {
                            that.$queue.remove("token");
                            that.$queue.remove("userId");
                            that.$queue.remove("mobile");
                            that.$queue.remove("openid");
                            that.$queue.remove("nickName");
                            that.$queue.remove("image_url");
                            that.$queue.remove("relation_id");
                            that.isShow = false;
                            setTimeout(() => {
                                uni.switchTab({url: '/pages/member/user'});
                            }, 200)
                        }
                    }
                });
            },
            //switch
            switchChange(e) {
                let statusTip = e.detail.value ? '打开' : '关闭';
                this.$api.msg(`${statusTip}消息推送`);
            },
            update() {
                //#ifdef APP-PLUS
                // APP检测更新 具体可以参考：https://ask.dcloud.net.cn/article/35667
                plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
                    this.$Request.get("/update.json").then(res => {
                        console.error(res.wgtUrl);
                        console.error(res.version);
                        console.error(widgetInfo.version);
                        if (res.wgtUrl && widgetInfo.version < res.version) {
                            uni.downloadFile({
                                url: res.wgtUrl,
                                success: (downloadResult) => {
                                    if (downloadResult.statusCode === 200) {
                                        plus.runtime.install(downloadResult.tempFilePath, {
                                            force: false
                                        }, (d) => {
                                            console.log('install success...');
                                            plus.runtime.restart();
                                        }, (e) => {
                                            console.error('install fail...');
                                        })
                                    }
                                }
                            })
                        }
                    })
                });
                //#endif
            }

        }
    }
</script>

<style lang='scss'>
    page {
        background: $page-color-base;
    }

    .list-cell {
        display: flex;
        align-items: baseline;
        padding: 20upx $page-row-spacing;
        line-height: 60upx;
        position: relative;
        background: #fff;
        justify-content: center;

        &.log-out-btn {
            margin-top: 40upx;

            .cell-tit {
                color: $uni-color-primary;
                text-align: center;
                margin-right: 0;
            }
        }

        &.cell-hover {
            background: #fafafa;
        }

        &.b-b:after {
            left: 32upx;
        }

        &.m-t {
            margin-top: 18upx;
        }

        .cell-more {
            align-self: baseline;
            font-size: $font-lg;
            color: $font-color-light;
            margin-left: 12upx;
        }

        .cell-tit {
            flex: 1;
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            margin-right: 12upx;
        }

        .cell-tip {
            font-size: $font-base;
            color: $font-color-light;
        }

        switch {
            transform: translateX(8px) scale(.84);
        }
    }
</style>
