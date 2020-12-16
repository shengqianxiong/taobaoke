<template>
	<view style="text-align: center;color: #FFFFFF;">
		<view style="text-align: center;color: #FFFFFF;padding-top: 8px;padding-bottom:8px;font-size: 16px;font-weight: bold">
			省钱兄是什么？
		</view>
		<view style="font-size: 14px">
			<view style="margin-top: 2px">
				省钱兄是一个汇聚了全网隐藏优惠券的省钱法宝 ！
			</view>
			<view style="margin-top: 2px">
				汇聚淘宝、京东、天猫、拼多多各大商城优惠券信息！
			</view>
			<view style="margin-top: 2px">
				每天实时更新优惠券，发放一些商家的大额优惠券！
			</view>
			<view style="margin-top: 2px">
				这里可以帮你网购省钱返利，也可以帮你兼职赚钱！
			</view>
			<view style="margin-top: 2px">
				每年最高能让你网购省50%的钱！
			</view>
		</view>
		<view style="text-align: center;color: #FFFFFF;padding-top: 8px;padding-bottom:8px;font-size: 16px;font-weight: bold">
			会员特权
		</view>
		<view style="margin-top: 2px">
			1、使用邀请码邀请好友注册拿高佣金！
		</view>
		<view style="margin-top: 2px">
			2、会员购买商品可享受省钱 +返现！
		</view>
		<view style="margin-top: 2px">
			3、会员分享商品给好友购买拿佣金！
		</view>
		<view style="margin-top: 2px">
			4、更多会员特权我们将陆续上线！
		</view>
		<view style="font-size: 16px;margin-top: 16px;margin-left: 16px;margin-right: 16px;font-weight: 800;color: #FFFFFF">
			{{des}}
		</view>
		<view style="color:white;padding: 10px;background: #f15b6c;width: 60%;margin-right: 20%;margin-left: 20%;border-radius: 16px;margin-top: 16px"
		 @click="goHome">{{description}}
		</view>

		<view id="shareit" v-if="show_share" @tap="closeShare">
			<image class="arrow" src="../../static/img/jiant.png"></image>
			<view id="follow">受微信平台限制无法进行会员申请！点击右上角按钮，选择浏览器打开！授权成功后请自行返回微信！</view>
		</view>
	</view>
</template>

<script>
	const plug = uni.requireNativePlugin('Html5app-Baichuan');
	export default {
		data() {
			return {
				weiXin: false,
				description: "立即申请",
				show_share: false,
				des: "",
				timer: null,
				userInfo: "userInfo",
				relation_id: '',
			}
		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh(); // 停止刷新
		},
		onUnload: function() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		onLoad() {
			//#ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') !== -1) {
				this.weiXin = true;
				if (window.location.href.indexOf("?uid=") !== -1 && window.location.href.indexOf("&time=order") === -1 && window.location
					.href.indexOf("&code=") === -1) {
					window.location.href = window.location.href + "&time=order";
				}
				if (window.location.href.indexOf("?uid=") === -1 && window.location.href.indexOf("?time=order") === -1 && window.location
					.href.indexOf("&code=") === -1) {
					window.location.href = window.location.href + "?time=order";
				}
			} else {
				if (window.location.href.indexOf("?code=") !== -1 || window.location.href.indexOf("&code=") !== -1) {
					let code;
					if (window.location.href.indexOf("?code=") !== -1) {
						code = window.location.href.split("?code=")[1].split("&")[0];
					} else {
						code = window.location.href.split("&code=")[1].split("&")[0];
					}
					this.getUserInfo(code);
				}
				if (window.location.href.indexOf("?uid=") !== -1 && window.location.href.indexOf("&token=") !== -1) {
					let uid = window.location.href.split("?uid=")[1].split("&")[0];
					let token = window.location.href.split("&token=")[1].split("&")[0];
					this.$queue.setData("token", token);
					this.$queue.setData("userId", uid);
					//#ifdef H5
					let ua = navigator.userAgent.toLowerCase();
					if (ua.indexOf('micromessenger') === -1) {
						this.getUserInfos(uid);
					}
					//#endif
					//#ifndef H5
					this.getUserInfos(uid);
					//#endif
				}
			}
			//#endif
		},
		onShow() {
			let relation_id = this.$queue.getData("relation_id");
			if (relation_id) {
				this.relation_id = relation_id;
				this.description = "返回";
				this.des = "恭喜你已成为【省钱兄】的会员！"
			} else {
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				if (token && userId) {
					this.getUserInfos(userId);
				}
				this.description = "立即申请";
			}
		},
		methods: {
			getUserInfos(userId) {
				this.$Request.getT("/user/" + userId).then(res => {
					if (res.status === 0) {
						if (res.data.isInvitation === 0) {
							this.$Request.postT("/user/updateInvitation/" + userId).then(res => {});
						}
						this.$queue.setData("image_url", res.data.image_url);
						this.$queue.setData("relation_id", res.data.relationId);
						this.$queue.setData("nickName", res.data.nickName);
						this.$queue.setData("gender", parseInt(res.data.gender));
						if (res.data.relationId) {
							this.relation_id = res.data.relationId;
							this.description = "返回";
							this.des = "恭喜你已成为【省钱兄】的会员！";
							let href = this.$queue.getData("href");
							if (href) {
								this.$queue.remove("href");
								uni.redirectTo({
									url: href
								})
							} else {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						} else {
							this.description = "立即申请";

						}
					} else {
						this.$queue.logout();
					}
				});
			},
			closeShare() {
				this.show_share = false;
			},
			goHome() {

				let that = this;
				let userId = this.$queue.getData("userId");
				let relation = this.$queue.getData("relation");
				if (userId) {
					this.$Request.getT("/user/" + userId).then(res => {
						if (res.status === 0) {
							if (res.data.phone) {
								if (res.data.isInvitation === 0) {
									uni.showModal({
										showCancel: false,
										title: '会员申请提醒',
										content: '目前会员权限只针对少部分用户开放\n继续申请添加客服微信【710070994】申请'
									});
								} else {
									if (res.data.relationId) {
										this.$queue.setData("relation_id", res.data.relationId);
										let href = this.$queue.getData("href");
										if (href) {
											this.$queue.remove("href");
											uni.redirectTo({
												url: href
											})
										} else {
											uni.switchTab({
												url: '/pages/index/index'
											});
										}
									} else {
										that.authorized()
									}
								}
							} else {
								uni.navigateTo({
									url: '/pages/public/mobile'
								})
							}
						}
					});

				} else {
					this.$queue.setData("href", "/pages/member/publisher");
					//#ifdef H5
					uni.navigateTo({
						url: '/pages/member/register'
					});
					//#endif
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/public/login'
					});
					//#endif

				}

			},


			authorized() {
				// #ifdef APP-PLUS
				// plug.taobaoOauth({"url": "https://oauth.taobao.com/authorize?response_type=code&client_id=27742632&redirect_uri=https://www.gomyorder.cn/pages/member/publisher&state=1&view=wap"}, ret => {
				//     console.error(ret);
				//     this.getUserInfoss(ret.code);
				// });
				let userId = this.$queue.getData("userId");
				let token = this.$queue.getData("token");
				plus.runtime.openURL(this.$queue.publicYuMing() + "/pages/member/publisher?uid=" + userId + "&token=" + token,
					function(
						res) {});
				// plus.runtime.openURL(
				// 	"https://oauth.taobao.com/authorize?response_type=code&client_id=" + this.$queue.getTaoBaoAppid() +
				// 	"&redirect_uri=https://www.gomyorder.cn/pages/member/publisher&state=1&view=wap",
				// 	function(res) {
				// 		// that.shopCartShare('tttt');
				// 		uni.hideLoading();
				// 	},
				// 	'com.taobao.taobao'
				// );
				// #endif

				// #ifndef APP-PLUS
				let ua = navigator.userAgent.toLowerCase();
				if (ua.indexOf('micromessenger') !== -1) {
					this.show_share = true;
				} else {
					window.location.assign(
						"https://oauth.taobao.com/authorize?response_type=code&client_id=" + this.$queue.getTaoBaoAppid() +
						"&redirect_uri=" + this.$queue.publicYuMing() + "/pages/member/publisher&state=1&view=wap"
					)
				}
				// #endif
			},
			getUserInfo(code) {
				let that = this;
				that.$Request.post("/sessionKey", {
					"grant_type": "authorization_code",
					"response_type": "code",
					"client_id": this.$queue.getTaoBaoAppid(),
					"client_secret": this.$queue.getTaoBaoSecret(),
					"redirect_uri": this.$queue.getTaoBaoRedirect(),
					"code": code,
				}).then(res => {
					if (res) {
						that.$queue.setData("access_token", res.access_token);
						that.$queue.setData("taobao_user_nick", res.taobao_user_nick);
						that.$Request.get("/tao/taobao/savePublisher/" + res.access_token).then(res => {
							if (res) {
								if (res.tbk_sc_publisher_info_save_response.data.relation_id) {
									that.$Request.getT("/user/bind/relationId/" + res.tbk_sc_publisher_info_save_response.data.relation_id +
										"/" + this.$queue.getData("userId")).then(ress => {
										if (ress.status === 0) {
											that.$queue.setData("relation_id", ress.data.relationId);
											that.relation_id = res.tbk_sc_publisher_info_save_response.data.relation_id;
											if (res.tbk_sc_publisher_info_save_response.data.relation_id) {
												this.relation_id = res.tbk_sc_publisher_info_save_response.data.relation_id;
												this.description = "回首页分享赚钱";
												this.des = "恭喜你已成为【省钱兄】的会员！"
											}
										}
									});
								}
							}
						});

					}
				});
			},
			getUserInfoss(code) {
				let that = this;
				that.$Request.post("/sessionKey", {
					"grant_type": "authorization_code",
					"response_type": "code",
					"client_id": this.$queue.getTaoBaoAppid(),
					"client_secret": this.$queue.getTaoBaoSecret(),
					"redirect_uri": this.$queue.getTaoBaoRedirect(),
					"code": code,
				}).then(res => {
					if (res) {
						that.$queue.setData("access_token", res.access_token);
						that.$queue.setData("taobao_user_nick", res.taobao_user_nick);
						that.$Request.get("/tao/taobao/savePublisherOne/" + res.access_token).then(res => {
							if (res) {
								if (res.tbk_sc_publisher_info_save_response.data.relation_id) {
									that.$Request.getT("/user/bind/relationId/" + res.tbk_sc_publisher_info_save_response.data.relation_id +
										"/" + this.$queue.getData("userId")).then(ress => {
										if (ress.status === 0) {
											that.$queue.setData("relation_id", ress.data.relationId);
											that.relation_id = res.tbk_sc_publisher_info_save_response.data.relation_id;
											if (res.tbk_sc_publisher_info_save_response.data.relation_id) {
												this.relation_id = res.tbk_sc_publisher_info_save_response.data.relation_id;
												this.description = "回首页分享赚钱";
												this.des = "恭喜你已成为【省钱兄】的会员！"
											}
										}
									});
								}
							}
						});

					}
				});
			}

		},
	}
</script>

<style>
	@import "../../static/css/index.css";

	page {
		background: #e10a07;
	}

	#shareit {
		-webkit-user-select: none;
		position: fixed;
		/*width: 100%;*/
		height: 2000px;
		background: rgba(0, 0, 0, 0.85);
		text-align: center;
		top: 0;
		left: 0;
		z-index: 999;
	}

	#shareit img {
		max-width: 100%;
	}

	.arrow {
		width: 100px;
		height: 150px;
		position: absolute;
		right: 5%;
		top: 1%;
	}

	#follow {
		margin-right: 60px;
		margin-left: 30px;
		width: 90%;
		height: 50px;
		line-height: 50px;
		text-align: left;
		text-decoration: none;
		font-size: 18px;
		color: white;
		float: left;
		margin-top: 160px;
	}
</style>
