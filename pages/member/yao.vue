<template>
	<view style="text-align: center;background: white;height: 100%;position: absolute;width: 100%">
		<view style="padding: 42upx;background: #e10a07;">
			<view style="font-size: 32upx;color: #FFFFFF;margin-bottom: 32upx"> 我的等级</view>
			<text class="num" style="font-size: 32upx;color: #FFFFFF;margin-bottom: 10px">
				<text style="font-size: 30upx;margin-right:10upx;">VIP</text>
				<text style="font-size: 50upx;font-weight: bold;">{{dengji}}</text>

			</text>
			<view style="font-size: 28upx;margin-top: 32upx;color: #FFFFFF;">( {{dengjides}} )</view>
		</view>
		<view style="text-align: left;color: #333333;font-size: 28upx;padding: 32upx;">
			<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;">
				升级规则
			</view>
			<view>每成功邀请2位好友提升1级</view>
			<view style="margin-top: 8upx">最高10级每级对应相应的返现比例</view>
			<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;margin-top: 16upx;">
				邀请方式
			</view>
			<view>1、点击下方【海报推广】选择任意免单商品生成海报，将海报分享好友、群或朋友圈，让好友扫码即可升级</view>
			<view style="margin-top: 8upx;">2、点击下方【链接推广】复制专属推广链接，复制内容分享好友、群，让好友点击访问即可升级</view>
		</view>
		<view @click="productHaibao()" style="margin-top:32upx;margin-left: 40px;margin-right:40px;font-size: 32upx;background: #e10a07;color: white;border-radius: 10px;height: 40px;line-height: 40px">
			海报推广
		</view>
		<view @click="share()" style="margin-top:32upx;margin-left: 40px;margin-right:40px;font-size: 32upx;background: #e10a07;color: white;border-radius: 10px;height: 40px;line-height: 40px">
			链接推广
		</view>
		<view @click="yaoqing()" style="margin-top:32upx;margin-left: 40px;margin-right:40px;font-size: 32upx;background: #e10a07;color: white;border-radius: 10px;height: 40px;line-height: 40px">
			邀请的好友
		</view>
		
	</view>
</template>

<script>
	
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	export default {
		components: {
			
			tkiQrcode
		},
		data() {
			return {
				modalName: "",
				totalMoney: '0',
				dengji: 0,
				itemendprice: '识别二维码免费领取',
				tuiguang: '给你说个京东、淘宝、拼多多买东西省钱工具叫省钱兄！\n我用好久了买东西不但能领券还能返现！\n这一年半载我都省下一大半了！\n点链接可以看看\n',
				itemtitle: '',
				relationId: "",
				itemprice: '',
				erweima: "",
				itempic: '',
				url: '',
				dengjides: '生成海报'
			};
		},
		onLoad() {
			// this.loadInfos();
		},
		onShow() {

			let relationId = this.$queue.getData("relation_id");
			if (relationId) {
				this.relationId = relationId;
				this.url = this.$queue.publicYuMing() + '/?invitation=' + relationId;
			}
			let userId = this.$queue.getData("userId");
			if (userId) {
				this.getUserInfo(userId)
			}
		},
		methods: {
			
			

			productHaibao() {
				uni.navigateTo({
					url: '/pages/share/product'
				});
			},
			yaoqing() {
				uni.navigateTo({
					url: '/pages/member/yaoqing'
				});
			},
			hideModal() {
				this.modalName = null
			},

			share() {
				this.sharurl();
			},
			getUserInfo(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						let grade = res.data.grade;
						if (grade == 0.3) {
							this.dengji = 0;
							this.dengjides = '还可升级10级';
						} else if (grade == 0.34) {
							this.dengji = 1;
							this.dengjides = '还可升级9级';
						} else if (grade == 0.38) {
							this.dengji = 2;
							this.dengjides = '还可升级8级';
						} else if (grade == 0.42) {
							this.dengji = 3;
							this.dengjides = '还可升级7级';
						} else if (grade == 0.46) {
							this.dengji = 4;
							this.dengjides = '还可升级6级';
						} else if (grade == 0.5) {
							this.dengji = 5;
							this.dengjides = '还可升级5级';
						} else if (grade == 0.54) {
							this.dengji = 6;
							this.dengjides = '还可升级4级';
						} else if (grade == 0.58) {
							this.dengji = 7;
							this.dengjides = '还可升级3级';
						} else if (grade == 0.62) {
							this.dengji = 8;
							this.dengjides = '还可升级2级';
						} else if (grade == 0.66) {
							this.dengji = 9;
							this.dengjides = '还可升级1级';
						} else if (grade == 0.7) {
							this.dengji = 10;
							this.dengjides = '已到达最高等级';
						}
					}
				});
			},
			sharurl() {
				let short_url = '';
				this.$queue.showLoading("加载中...")
				uni.request({
					url: 'https://www.gomyorder.cn/suo/api.htm?format=json&url=' + encodeURIComponent(this.url) +
						'&key=5e69209d9f9594023280d13d@28c43a86f83a49a3d98aaa07ab5f3642',
					method: 'GET',
					success: res => {
						uni.hideLoading()
						if (res.data.url) {
							short_url = res.data.url;
							uni.showModal({
								title: '链接推广',
								content: this.tuiguang + short_url,
								showCancel: true,
								cancelText: '关闭',
								confirmText: '一键复制',
								success: res => {
									if (res.confirm) {
										uni.setClipboardData({
											data: this.tuiguang + short_url,
											success: function() {
												console.log('success');
												this.$queue.showToast("复制成功")
											}
										});
									}
								}
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: '请求超时请稍后重试'
							});
						}

					},
					fail: () => {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: '请求超时请稍后重试'
						});
					},
				});


			},
			getMoney() {
				let that = this;
				let relationId = this.$queue.getData('relation_id');
				if (relationId) {
					this.$Request.getT('/user/getCount?invitation=' + relationId).then(res => {
						if (res.status === 0 && res.data) {
							that.totalMoney = res.data;
						} else if (res.status === -102) {
							this.$queue.showToast(res.msg);
							this.$queue.logout();
							uni.navigateTo({
								url: '/pages/public/login'
							});
						} else {
							that.totalMoney = '0';
						}
					});
				}
			},
			getOut() {
				let that = this;
				let relationId = this.$queue.getData('relation_id');
				if (relationId) {
					if (this.totalMoney > 2) {
						that.$queue.showLoading('结算中...');
						this.$Request.getT('/user/getCash?invitation=' + relationId).then(res => {
							if (res.status === 0 && res.data) {
								uni.showModal({
									showCancel: false,
									title: '结算成功',
									content: '请返回【我的】点击【立即提现】'
								});
								that.getMoney();
							}
							uni.hideLoading();
						});
					} else {
						uni.showModal({
							showCancel: false,
							title: '结算提醒',
							content: '邀请必须够3人才可申请结算'
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/public/login'
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';
</style>
