<template>
	<view style="width: 100%;height: 100%;position: absolute;background: white" @dblclick="navBack">
		<!-- #ifdef H5 -->
		<view v-if="isShow" class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- #endif -->
		<view style="background: whitesmoke">
			<wm-posters :imgSrc="itempic" :QrSrc="erweima" :Title="itemtitle" :PriceTxt="itemendprice" :OriginalTxt="itemprice"></wm-posters>
		</view>
	</view>
</template>

<script>
	import wmPosters from '@/components/wm-poster/wm-posters.vue';
	export default {
		components: {
			wmPosters
		},
		data() {
			return {
				itemendprice: '识别二维码免费领取',
				itemtitle: '',
				isShow: false,
				erweimas: '',
				user: '',
				itemprice: '',
				erweima: "",
				itempic: ''
			};
		},
		onLoad: function(e) {
			let that = this;
			this.itempic = this.$queue.getData('itempic');
			this.itemtitle = this.$queue.getData('itemtitle');
			if (!this.$queue.getData('itemtitle')) {
				this.itemtitle = '漫花原木纸巾抽纸家用整箱实惠装餐巾纸卫生纸面巾纸抽婴儿擦手纸';
			}
			if (!this.$queue.getData('itempic')) {
				this.itempic = 'https://img.alicdn.com/imgextra/i3/2930255252/O1CN0159ouF21ofSiQ3kPq2_!!2930255252.jpg';
			}
			this.erweima = this.$queue.getData('erweimas');
			if (!this.$queue.getData('erweimas')) {
				this.erweima = this.$queue.publicYuMing() + '/erweimas.jpg';
			}
			setTimeout(function() {
				that.isShow = true;
			}, 2000);
		},
		methods: {
			navBack() {
				uni.navigateBack();
			}
		}
	};
</script>

<style lang="scss">
	.back-btn {
		position: absolute;
		left: 20px;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 20px;
		font-size: 20px;
	}
</style>
