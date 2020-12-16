<template>
    <view style="text-align: center;height: 100%;position: absolute;width:100%;background: #F8F8F8;">
        <image style="width: 60px;height: 60px;margin-top: 70px;border-radius:10px" src="../../static/logo.png">
        </image>
        <view style="font-size: 18px;margin-top: 8px;font-weight: 600">你的网购省钱专家</view>
        <image style="width: 150px;height: 150px;margin-top: 40px" :src="erweima" >
        </image>
        <view v-if="isWeiXin" style="font-size: 28upx;color: grey;margin-top: 20px">长按识别上方二维码</view>
        <view v-if="!isWeiXin" style="font-size: 16px;margin-top: 10px">微信扫描或搜索关注【省钱兄】访问</view>
		<view v-if="isWeiXin" style="font-size: 16px;margin-top: 10px">微信关注【省钱兄】访问</view>
        <view v-if="isWeiXin" style="font-size: 28upx;color: grey;margin-top: 40px" @click="rests">无法识别？</view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
				isWeiXin:false,
				erweima:'../../static/img/erweima.jpg',
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		onLoad() {
			//#ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') !== -1) {
				this.isWeiXin = true;
				if(!this.$queue.getData("openid")){
					window.location.href =
						'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
						this.$queue.getWxAppid() +
						'&redirect_uri=' +
						window.location.href.split('#')[0] +
						'&response_type=code&scope=snsapi_userinfo#wechat_redirect';
				}
			}
			//#endif
			this.$Request.getT("/common/type/2").then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.erweima = res.data.value;
					}
				}
			});
		},
        onPullDownRefresh: function () {
            uni.stopPullDownRefresh(); // 停止刷新
        },
		onShow() {
			//#ifdef H5
			this.follow()
			//#endif
		},
        methods: {
			
            follow() {
				if(this.$queue.getData("openid")){
					this.$Request.get("/tao/wx/follow/" + this.$queue.getData("openid")).then(res => {
					    if (res === true) {
					        window.location.replace(this.$queue.publicYuMing());
					    }
					});
				}
                
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

<style>
    @import "../../static/css/index.css";
</style>
