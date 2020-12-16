<template>
    <view class="container">
        <view class="left-bottom-sign"></view>
        <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
        <view class="wrapper">
            <view class="left-top-sign">省钱兄</view>
            <view class="welcome">
                登录
            </view>
            <view class="input-content">
                <view class="cu-form-group"
                      style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
                    <view class="title">手机号</view>
                    <input
                            type="number"
                            :value="mobile"
                            placeholder="请输入手机号"
                            maxlength="11"
                            data-key="mobile"
                            @input="inputChange"
                    />
                </view>
                <view class="cu-form-group" style="border: 1px solid whitesmoke;border-radius: 30px">
                    <view class="title">密码</view>
                    <input
                            type="password"
                            placeholder="请输入密码"
                            maxlength="20"
                            :value="code"
                            data-key="code"
                            @input="inputChange"
                            @confirm="toLogin"
                    />
                    <text class="send-msg" @click="forget">忘记密码</text>
                </view>
            </view>
            <button :class="mobile&&code?'confirm-btn':'confirm-btn1'" @click="toLogin">登录</button>
            <view style="margin-top: 32px;text-align: center">
                <view>没有账号？
                    <text style="color: #e10a07" @click="register()">立即注册</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    export default {
        data() {
            return {
                mobile: '',
                code: '',
                sending: false,
                sendTime: '获取验证码',
                count: 60,
            }
        },
        methods: {
            forget() {
                uni.navigateTo({
                    url: '/pages/public/pwd'
                });
            },
            register() {
                uni.navigateTo({
                    url: '/pages/public/register'
                });
            },
            inputChange(e) {
                const key = e.currentTarget.dataset.key;
                this[key] = e.detail.value;
            },
            navBack() {
                uni.navigateBack();
            },

            toLogin() {
                this.$queue.loginClear();
                let openid = this.$queue.getData("openid");
                const {mobile, code} = this;
                if (!mobile && !code) {
                    return;
                }
                this.$queue.showLoading("正在登录中...");
                this.$Request.postJson("/user/login", {
                    pwd: code,
                    phone: mobile,
                    openid: openid
                }).then(res => {
                    if (res.status === 0) {
                        this.$queue.setData("token", res.data.uuid);
                        this.$queue.setData("userId", res.data.userId);
                        this.$queue.setData("mobile", mobile);
                        this.getUserInfo(res.data.userId, res.data.uuid);
                    } else {
                        uni.hideLoading();
                        uni.showModal({
                            showCancel: false,
                            title: '登录失败',
                            content: res.msg,
                        });
                    }
                });
            },
            getUserInfo(userId, token) {
                this.$Request.getT("/user/" + userId).then(res => {
                    if (res.status === 0) {
                        this.$queue.setData("image_url", res.data.image_url ? res.data.image_url : '/static/img/common/logo.jpg');
                        this.$queue.setData("relation_id", res.data.relationId);
                        this.$queue.setData("relation", res.data.invitation);
                        this.$queue.setData("grade", res.data.grade);
                        this.$queue.setData("isInvitation", res.data.isInvitation);
                        this.$queue.setData("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
                        this.$queue.setData("gender", parseInt(res.data.gender));
                        let href = this.$queue.getData("href");
                        if (href) {
                            if (href==='/pages/member/publisher') {
                                this.$queue.remove("href");
                                uni.redirectTo({
                                    url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                                });
                            } else if (href==='/pages/member/user') {
                                this.$queue.remove("href");
                                uni.switchTab({
                                    url: '/pages/member/user'
                                });
                            } else {
                                this.$queue.remove("href");
                                uni.redirectTo({
                                    url: href
                                });
                            }
                        } else {
                            uni.switchTab({url: '/pages/index/index'});
                        }
                    } else {
                        uni.showModal({
                            showCancel: false,
                            title: '登录失败',
                            content: res.msg,
                        });
                        this.$queue.logout();
                    }
                    uni.hideLoading();
                });
            }
        },

    }
</script>

<style lang='scss'>
    page {
        background: #fff;
    }

    .send-msg {
        border-radius: 30px;
        color: black;
        background: white;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
    }

    .container {
        top: 0;
        padding-top: 50px;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff;
    }

    .wrapper {
        position: relative;
        z-index: 90;
        background: #fff;
        padding-bottom: 20px;
    }

    .back-btn {
        position: absolute;
        left: 20px;
        z-index: 9999;
        padding-top: var(--status-bar-height);
        top: 20px;
        font-size: 20px;
        color: $font-color-dark;
    }

    .left-top-sign {
        font-size: 80px;
        color: $page-color-base;
        position: relative;
    }


    .right-top-sign {
        position: absolute;
        top: 40px;
        right: -15px;
        z-index: 95;

        &:before, &:after {
            display: block;
            content: "";
            width: 20px;
            height: 40px;
            background: #e10a07;
        }

        &:before {
            transform: rotate(50deg);
            border-radius: 0 50px 0 0;
        }

        &:after {
            position: absolute;
            right: -198px;
            top: 0;
            transform: rotate(-50deg);
            border-radius: 50px 0 0 0;
            /* background: pink; */
        }
    }

    .left-bottom-sign {
        position: absolute;
        left: -270px;
        bottom: -320px;
        /*border: 100upx solid #d0d1fd;*/
        border-radius: 50%;
        padding: 90px;
    }

    .welcome {
        position: relative;
        left: 30px;
        top: -55px;
        font-size: 28px;
        color: #555;
        text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
    }

    .input-content {
        padding: 0 20px;
    }

    .input-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 0 30px;
        background: $page-color-light;
        height: 64px;
        border-radius: 4px;
        margin-bottom: 30px;

        &:last-child {
            margin-bottom: 0;
        }

        .tit {
            height: 30px;
            line-height: 28px;
            font-size: $font-sm+2upx;
            color: $font-color-base;
        }

        input {
            height: 40px;
            font-size: $font-base + 2upx;
            color: $font-color-dark;
            width: 100%;
        }
    }

    .confirm-btn {
        width: 300px;
        height: 42px;
        line-height: 42px;
        border-radius: 30px;
        margin-top: 40px;
        background: #e10a07;
        color: #fff;
        font-size: $font-lg;

        &:after {
            border-radius: 60px;
        }
    }

    .confirm-btn1 {
        width: 300px;
        height: 42px;
        line-height: 42px;
        border-radius: 30px;
        margin-top: 40px;
        background: whitesmoke;
        color: grey;
        font-size: $font-lg;

        &:after {
            border-radius: 60px;
        }
    }

    .forget-section {
        font-size: $font-sm+2upx;
        color: $font-color-spec;
        text-align: center;
        margin-top: 40px;
    }

    .register-section {
        left: 0;
        margin-top: 30px;
        bottom: 30px;
        width: 100%;
        font-size: $font-sm+2upx;
        color: $font-color-base;
        text-align: center;

        text {
            color: $font-color-spec;
            margin-left: 10px;
        }
    }
</style>
