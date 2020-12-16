<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="wrapper">
			<view class="left-top-sign">省钱兄</view>
			<view class="welcome">
				注册
			</view>
			<view class="input-content">
				<view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<view class="title">手机号</view>
					<input type="number" :value="mobile" placeholder="请输入手机号" maxlength="11" data-key="mobile" @input="inputChange" />
				</view>
				<view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">验证码</text>
					<input type="number" :value="code" placeholder="请输入验证码" maxlength="6" data-key="code" @input="inputChange"
					 @confirm="toLogin" />
					<button class="send-msg" @click="sendMsg" :disabled="sending">{{sendTime}}</button>
				</view>

				<view class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">设置密码</text>
					<input type="password" :value="password" placeholder="请设置新密码" placeholder-class="input-empty" maxlength="20"
					 minlength="6" data-key="password" @input="inputChange" @confirm="toLogin" />
				</view>
				<view v-if="!invitations" class="cu-form-group" style="border: 1px solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
					<text class="title">邀请码</text>
					<input type="number" :value="invitation" placeholder="请填写邀请码" data-key="invitation" maxlength="20" @input="inputChange"
					 @confirm="toLogin" />
					<text v-if="!invitations" class="send-msgs" @click="showMa()">获取官方邀请码</text>
				</view>
			</view>
			<button :class="mobile&&code&&password&&invitation?'confirm-btn':'confirm-btn1'" @click="toLogin">立即注册
			</button>
			<view class="footer">
				<text @tap="isShowAgree" class="cuIcon" :class="showAgree?'cuIcon-radiobox':'cuIcon-round'">同意
				</text>
				<!-- 协议地址 -->
				<navigator url="/pages/member/mimi" open-type="navigate">《隐私政策》</navigator>和
				<navigator url="/pages/member/xieyi" open-type="navigate">《用户服务协议》</navigator>


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showAgree: false,
				code: '',
				mobile: '',
				password: '',
				sending: false,
				sendTime: '获取验证码',
				count: 60,
				invitation: '',
				invitations: '',
			}
		},
		methods: {
			isShowAgree() {
				//是否选择协议
				this.showAgree = !this.showAgree;
			},
			showMa() {
				this.invitation = this.$queue.getInvitation()
			},
			sendMsg() {
				const {
					mobile
				} = this;
				if (!mobile) {
					this.$queue.showToast("请输入手机号");
				} else if (mobile.length !== 11) {
					this.$queue.showToast("请输入正确的手机号");
				} else {
					this.$queue.showLoading("正在发送验证码...");
					this.$Request.getT("/user/sendMsg/" + mobile + "/register").then(res => {
						if (res.status === 0) {
							this.sending = true;
							this.$queue.showToast('验证码发送成功请注意查收');
							this.countDown();
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								showCancel: false,
								title: '短信发送失败',
								content: res.msg ? res.msg : '请一分钟后再获取验证码',
							});
						}
					});
				}
			},
			countDown() {
				const {
					count
				} = this;
				if (count === 1) {
					this.count = 60;
					this.sending = false;
					this.sendTime = '获取验证码'
				} else {
					this.count = count - 1;
					this.sending = true;
					this.sendTime = count - 1 + '秒后重新获取';
					setTimeout(this.countDown.bind(this), 1000);
				}
			},
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},


			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			toLogin() {
				const {
					mobile,
					password,
					code,
					showAgree,
					invitation
				} = this;
				if (!mobile) {
					this.$queue.showToast("请输入账号");
				} else if (!password) {
					this.$queue.showToast("请设置密码");
				} else if (password.length < 6) {
					this.$queue.showToast("密码位数必须大于六位");
				} else if (invitation.length == 0) {
					this.$queue.showToast("请输入邀请码");
				} else if (!showAgree) {
					this.$queue.showToast("请先同意《协议》");
				} else {
					this.logining = true;
					this.$queue.showLoading("注册中...");
					this.$Request.postJson("/user/bindOpenid", {
						pwd: password,
						phone: mobile,
						msg: code,
						platform: "app",
						invitation: invitation,
						openid: this.$queue.getData("openid")
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
								title: '注册失败',
								content: res.msg,
							});
						}
					});
				}
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
							if (href === '/pages/member/publisher') {
								this.$queue.remove("href");
								uni.redirectTo({
									url: '/pages/member/publisher?uid=' + userId + '&token=' + token
								});
							} else if (href === '/pages/member/user') {
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
							uni.switchTab({
								url: '/pages/index/index'
							});
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

	.footer {
		padding-left: 140upx;
		margin-top: 32upx;
		text-align: center;
		display: flex;
	}

	.send-msg {
		border-radius: 30px;
		color: white;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
		background: #e10a07;
	}

	.send-msgs {
		border-radius: 30px;
		color: black;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
		background: white;
	}

	.container {
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
