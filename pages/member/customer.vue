<template>
	<view style="height: 100vh;background: #e10a07;text-align: center;">
		<image @click="saveImg" mode="aspectFit" style="margin-top: 80upx" :src="image">
		</image>
		<view style="font-size: 28upx;color: #FFFFFF;margin-top: 40upx">{{isWeiXin?'长按识别上方二维码':'保存上方二维码打开微信扫一扫'}}</view>
		<view style="font-size: 32upx;margin-top: 20upx;color: #FFFFFF">添加【客服微信】后进行咨询</view>
		<view v-if="isWeiXin" style="font-size: 24upx;color: #FFFFFF;margin-top: 80upx" @click="rests">无法识别？</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				image: 'https://www.gomyorder.cn/custom.jpg',
				isWeiXin: false,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}

			}
		},
		onLoad() {
			// #ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') !== -1) {
				this.isWeiXin = true;
			}
			// #endif
			//获取客服二维码
			this.$Request.getT("/common/type/1").then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.image = res.data.value;
					}
					// uni.navigateBack();
				}
			});
		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh(); // 停止刷新
		},
		methods: {
			saveImg() {
				let that = this;
				uni.saveImageToPhotosAlbum({
					filePath: that.image,
					success(res) {
						that.$queue.showToast('保存成功');
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

<style scoped>
	@import "../../static/css/index.css";

	page {
		background: #e10a07;
	}
</style>
