<template>
	<view class="cash">
		<view class="cash-top">
			<view class="leiji">可提现金额</view>
			<text class="num" style="font-weight: bold;font-size: 24px;color: #FFFFFF;margin-bottom: 10px">{{money}} 元</text>
			<view style="margin-top: 8px;font-size: 10px;color: #FFFFFF">（可提现金额=已结算订单佣金+邀好友结算佣金）</view>
		</view>
		<view style="padding: 16px;border-radius: 8px">
			<view style="font-size: 14px;color: grey;margin-bottom: 10px">累计提现金额</view>
			<text class="num" style="font-size: 18px;color: #e10a07;margin-bottom: 10px">{{totalMoney}} 元</text>
			<view style="margin-top: 8px;font-size: 10px;color: #999999">（累计提现金额=所有已提现金额总和）</view>
		</view>

		<view style="text-align: center;margin-top: 32px;width: 100%;padding-bottom: 32px">
			<view @click="getOut" v-if="money!=='0'" style="margin-left: 40px;margin-right:40px;font-size: 18px;background: #e10a07;color: white;border-radius: 10px;height: 40px;line-height: 40px">
				提现
			</view>
			<view v-else style="margin-left: 40px;margin-right:40px;font-size: 18px;background: gainsboro;color: white;border-radius: 10px;height: 40px;line-height: 40px">
				暂无可提现金额
			</view>
		</view>
		<view style="display: flex">
			<view style="color: grey;width: 50%;padding-bottom: 30px" @click="goZhifuBao">提现账号</view>
			<view style="color: grey;width: 50%;padding-bottom: 30px" @click="list">提现记录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: '0.00',
				zhifubao: '',
				totalMoney: '0.00',
				zhifubaoName: '',
			}
		},
		onShow: function(e) {
			this.getMoney();
		},

		methods: {
			list() {
				uni.navigateTo({
					url: '/pages/member/cashList'
				})
			},
			goZhifuBao() {
				uni.navigateTo({
					url: "/pages/member/zhifubao"
				})
			},
			getMoney() {
				let that = this;
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				if (token) {
					//this.$queue.showLoading("加载中...");
					//可以提现金额查询预估收入查询
					this.$Request.getT("/cash/money/" + userId).then(res => {
						if (res.status === 0 && res.data) {
							that.money = res.data;
						} else if (res.status === -102) {
							this.$queue.showToast(res.msg);
							this.$queue.logout();
							uni.navigateTo({
								url: '/pages/public/login'
							})
						} else {
							that.money = '0.00';
							//this.$queue.showToast(res.msg);
						}
					});
					this.$Request.getT("/cash/userinfo/" + userId).then(res => {
						if (res.status === 0 && res.data) {
							that.zhifubao = res.data.zhifubao;
							that.zhifubaoName = res.data.zhifubaoName;
						}
						uni.hideLoading();
					});
					//总的提现记录
					this.$Request.getT("/cash/countByRelationId/" + this.$queue.getData("relation_id")).then(res => {
						if (res.status === 0 && res.data) {
							that.totalMoney = parseFloat(res.data).toFixed(2);
						} else {
							that.totalMoney = '0.00';
						}
					});
				}

			},
			getOut() {
				let that = this;
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (parseFloat(this.money).toFixed(1) >= 10) {
							uni.showModal({
								title: "提现申请提示",
								content: '请仔细确认收款人信息\n\n姓名:' + that.zhifubaoName + '\n\n收款账号：' + that.zhifubao + '',
								success: (e) => {
									if (e.confirm) {
										this.$queue.showLoading("提现中...");
										this.$Request.getT("/cash/out/" + userId).then(res => {
											if (res.status === 0 && res.data) {
												that.$queue.showToast("提现申请成功，预计三个工作日到账");
												that.getMoney();
											}
											uni.hideLoading();
										});
									}
								}
							});
						} else {
							this.$queue.showToast("提现金额必须大于或等于10元才可提现");
						}
					} else {
						uni.navigateTo({
							url: "/pages/member/zhifubao"
						})
					}
				} else {
					uni.navigateTo({
						url: "/pages/public/login"
					})
				}
			},

		},

	}
</script>

<style lang='less'>
	@import "../../static/css/index.css";

	.cash {
		text-align: center;
		background: white;
		height: 100%;
		position: absolute;
		width: 100%;

		.cash-top {
			padding: 32upx 32upx 50upx 32upx;
			/* border-bottom: 1px solid gainsboro; */
			background: #e10a07;
		}

		.leiji {
			font-size: 14px;
			color: #FFFFFF;
			margin-bottom: 10px;
		}
	}
</style>
