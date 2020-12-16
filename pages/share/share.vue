<template>
    <view class="content">
        <!--  #ifdef APP-PLUS -->
        <view class="top"></view>
        <!--  #endif -->
        <!--  #ifndef APP-PLUS -->
        <view class="top1"></view>
        <!--  #endif -->
        <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
        <view class="banner" style="margin-top: 8px">
            <view style="text-align: center">
                <view style="font-size: 22px;font-weight: bold;color: #e10a07">省钱兄</view>
                <view style="color: #e10a07;margin-top: 4px;">让你体验白菜价网购的快感</view>
            </view>
            <view class="img">
                <image :src="erweima" @longpress="toSave"></image>
            </view>
            <view style="text-align: center;font-size: 12px;color: grey;margin-top: 8px">长按上方二维码保存图片</view>
            <view style="text-align: center;font-size: 10px;color: grey;margin-top: 4px">（可截屏当前页面发送到朋友圈哦）</view>
            <view class="shartitle">
                <view>推广链接</view>
            </view>
            <view class="tgtit" style="margin-top: 12px">
                <text class="tugurl" style="margin-top: 6px">{{url}}</text>
            </view>
            <view class="sharbuttn">
                <view class="btn" @click="sharurl">复制推广链接</view>
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
                sourceLink: 'http://yunzhujiao.cn/bind_pub/index.html',
                type: 0,
                url: this.$queue.publicYuMing() + '/?invitation=' + this.$queue.getInvitation(),
                erweima: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + this.$queue.publicYuMing(),
            }
        },
        onLoad() {
            let relationId = this.$queue.getData("relation_id");
            if (relationId) {
                this.url = this.$queue.publicYuMing() + '/?invitation=' + relationId;
                this.erweima = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + this.$queue.publicYuMing() + '/?invitation=' + relationId;
            }
            uni.getProvider({
                service: 'share',
                success: (e) => {
                    let data = [];
                    for (let i = 0; i < e.provider.length; i++) {
                        switch (e.provider[i]) {
                            case 'weixin':
                                data.push({
                                    name: '分享到微信好友',
                                    id: 'weixin'
                                });
                                data.push({
                                    name: '分享到微信朋友圈',
                                    id: 'weixin',
                                    type: 'WXSenceTimeline'
                                });
                                break;
                            case 'qq':
                                data.push({
                                    name: '分享到QQ',
                                    id: 'qq'
                                });
                                break;
                            default:
                                break;
                        }
                    }
                    this.providerList = data;
                },
                fail: (e) => {
                    console.log('获取登录通道失败' + JSON.stringify(e));
                }
            });
        },
        methods: {
            toSave() {
                //#ifndef H5
                uni.getImageInfo({
                    src: this.erweima,
                    success: function (image) {
                        console.log('图片信息：', JSON.stringify(image));
                        uni.saveImageToPhotosAlbum({
                            filePath: image.path,
                            success: function () {
                                console.log('save success');
                                uni.showToast({
                                    title: '图片保存成功',
                                    icon: 'none',
                                    duration: 3000
                                });
                            }
                        });
                    }
                });

                //#endif
            },
            navBack() {
                uni.navigateBack();
            },
            //复制分享链接
            sharurl() {
                uni.setClipboardData({
                    data: "给你说个京东、淘宝、天猫、拼多多买东西省钱的工具！\n我用了好久了买东西不但能领券还能返现呢！\n这一年半载都能省下之前的消费一半了！\n点链接可以看看哦" + this.url,
                    success: function () {
                        console.log('success');
                        uni.showModal({
                            title: '复制成功',
                            content: '内容已复制到粘贴板',
                            showCancel: false
                        });
                    }
                });
            },
            //保存图片到相册
            save() {
                uni.showActionSheet({
                    itemList: ['保存图片到相册'],
                    success: () => {
                        plus.gallery.save('http://pds.jyt123.com/wxtest/logo.png', function () {
                            uni.showToast({
                                title: '保存成功',
                                icon: 'none'
                            })
                        }, function () {
                            uni.showToast({
                                title: '保存失败，请重试！',
                                icon: 'none'
                            })
                        });
                    }
                })
            },
            share(e) {
                if (this.providerList.length === 0) {
                    uni.showModal({
                        title: '当前环境无分享渠道!',
                        showCancel: false
                    });
                    return;
                }
                let itemList = this.providerList.map(function (value) {
                    return value.name
                });


                uni.showActionSheet({
                    itemList: itemList,
                    success: (res) => {
                        console.log(this.providerList[res.tapIndex].id)
                        if (this.providerList[res.tapIndex].id == 'qq') {
                            this.type = 1
                        } else {
                            this.type = 0
                        }
                        uni.share({
                            provider: this.providerList[res.tapIndex].id,
                            scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : "WXSceneSession",
                            type: this.type,
                            title: '耘助教',
                            summary: '耘助教是一个在线教育应用平台',
                            imageUrl: 'http://pds.jyt123.com/wxtest/logo.png',
                            href: "https://m3w.cn/uniapp",
                            success: (res) => {
                                console.log("success:" + JSON.stringify(res));
                            },
                            fail: (e) => {
                                uni.showModal({
                                    content: e.errMsg,
                                    showCancel: false
                                })
                            }
                        });
                    }
                })


            },
            openLink() {
                plus.runtime.openWeb(this.sourceLink)
            }
        }
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
        top: 10px;
        font-size: 20px;
        color: white;
    }

    .content {
        position: absolute;
        width: 100%;
        height: 100%;
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
        width: 100%;
        background-color: #ffffff;
    }

    .top {
        width: 100%;
        height: 70px;
        /*background: url(../../static/img/banner.png) no-repeat;*/
        background-size: 100%;
        background-position: center center;
        background: -moz-linear-gradient(left, #F15B6C, #e10a07 100%);
        background: -webkit-gradient(linear, left top, left right, color-stop(0, #F15B6C), color-stop(100%, #e10a07));
        background: -webkit-linear-gradient(left, #F15B6C 0, #e10a07 100%);
        background: -o-linear-gradient(left, #F15B6C 0, #e10a07 100%);
        background: -ms-linear-gradient(left, #F15B6C 0, #e10a07 100%);
        background: linear-gradient(to left, #F15B6C 0, #e10a07 100%);
    }

    .top1 {
        width: 100%;
        height: 40px;
        /*background: url(../../static/img/banner.png) no-repeat;*/
        background-size: 100%;
        background-position: center center;
        background: -moz-linear-gradient(left, #F15B6C, #e10a07 100%);
        background: -webkit-gradient(linear, left top, left right, color-stop(0, #F15B6C), color-stop(100%, #e10a07));
        background: -webkit-linear-gradient(left, #F15B6C 0, #e10a07 100%);
        background: -o-linear-gradient(left, #F15B6C 0, #e10a07 100%);
        background: -ms-linear-gradient(left, #F15B6C 0, #e10a07 100%);
        background: linear-gradient(to left, #F15B6C 0, #e10a07 100%);
    }

    .banner {
        width: 100%;
        background-color: #FFFFFF;
        border-radius: 30px 30px 0 0;
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
        margin-top: 12px;
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
