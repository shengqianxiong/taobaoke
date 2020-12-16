<template>
	<view style="height: 100vh;background: #e10a07;">
		<!-- <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view> -->
		<!-- <image style="position: absolute;height: 100%;width: 100%" src="../../static/img/background1.png"></image> -->

		<view style="text-align: center">
			<image style="width: 130px;height: 130px;margin-top: 50%;text-align: center" :src="image">
			</image>
			<view style="font-size: 14px;color:white;margin-top: 20px;opacity: 0.9">
				{{isWeiXin?'长按识别上方二维码':'微信关注公众号【省钱兄】后登录'}}
			</view>
			<!--            <view style="font-size: 15px;margin-top: 10px;color:white;opacity: 0.9">关注服务号【省钱兄】操作更便捷</view>-->
			<view v-if="isWeiXin" style="font-size: 13px;color:white;margin-top: 40px;opacity: 0.9" @click="rests">
				无法识别？
			</view>
		</view>

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
				image: 'https://www.gomyorder.cn/erweima.jpg',
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
			//获取客服二维码
			this.$Request.getT("/common/type/2").then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.image = res.data.value;
					}
					// uni.navigateBack();
				}
			});
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
		onPullDownRefresh: function() {
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

<style lang='scss' scoped>
	@import "../../static/css/index.css";

	page {
		background: #e10a07；
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

	uni-image>div,
	uni-image>img {
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
