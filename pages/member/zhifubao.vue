<template>
	<view class="container">
		<list-cell title="收款人" type="text" placeholder="请输入支付宝姓名" v-model="userName"></list-cell>

		<list-cell title="收款账号" type="number" placeholder="请输入支付宝手机号" v-model="mobile"></list-cell>

		<button :class="mobile&&userName?'confirm-btn':'confirm-btn1'" @click="toLogin" :disabled="logining">立即保存</button>
	</view>
	</view>
</template>

<script>
	import listCell from '@/components/com-input';
	export default {
		components: {
			listCell
		},
		data() {
			return {
				mobile: '',
				userName: '',
				logining: false
			}
		},
		onLoad() {
			let userId = this.$queue.getData("userId");
			if (userId) {
				this.$Request.getT("/cash/userinfo/" + userId).then(res => {
					if (res.status === 0) {
						if (res.data.zhifubao) {
							this.mobile = res.data.zhifubao;
						}
						if (res.data.zhifubaoName) {
							this.userName = res.data.zhifubaoName;
						}
					}
				});
			}

		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},

			toLogin() {
				let userId = this.$queue.getData("userId");
				let token = uni.getStorageSync("token");
				const {
					mobile,
					userName
				} = this;
				if (!mobile) {
					this.$queue.showToast("请设置收款人支付宝账号");
				} else if (!userName) {
					this.$queue.showToast("请设置收款人姓名");
				} else {
					this.$queue.showLoading("修改中...");
					this.$Request.postT("/cash/userinfo?userId=" + userId + "&zhifubao=" + mobile + "&zhifubaoName=" + userName).then(
						res => {
							if (res.status === 0) {
								if (res.data.zhifubao) {
									this.mobile = res.data.zhifubao;
								}
								if (res.data.zhifubaoName) {
									this.userName = res.data.zhifubaoName;
								}
								this.navBack();
							} else {
								this.$queue.showToast(res.msg)
							}
							uni.hideLoading();
						});
				}
			},
		},

	}
</script>

<style lang='scss'>
	page {
		background: #FFFFFF;
	}

	.container {
		padding-top: 32upx;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.confirm-btn1 {
		width: 300px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 70px;
		background: whitesmoke;
		color: grey;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
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

		&:before,
		&:after {
			display: block;
			content: "";
			width: 20px;
			height: 40px;
			background: -moz-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: -webkit-gradient(linear,
				left top,
				left right,
				color-stop(0, #fa4dbe),
				color-stop(100%, #fbaa58));
			background: -webkit-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: -o-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: -ms-linear-gradient(left, #fa4dbe 0, #fbaa58 100%);
			background: linear-gradient(to left, #fa4dbe 0, #fbaa58 100%);
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
		top: -50px;
		font-size: 23px;
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
		margin-top: 70px;
		background: #e10a07;
		color: #fff;
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
		position: fixed;
		left: 0;
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
