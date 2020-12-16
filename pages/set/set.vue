<template>
	<view class="container">
		<view class="list-cell b-b" @click="navTo1('/pages/member/xieyi')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">用户协议</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view style="margin-top: 1px" class="list-cell b-b" @click="navTo1('/pages/member/mimi')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">隐私政策</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view style="margin-top: 1px" class="list-cell b-b" @click="gowuche" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">意见反馈</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view style="margin-top: 1px" class="list-cell b-b" @click="about('关于')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于我们</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!--        #ifdef APP-PLUS-->
		<view style="margin-top: 1px" class="list-cell" @click="update()">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 {{ version }}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!--        #endif-->
		<view v-if="isShow" class="list-cell log-out-btn" @click="toLogout"><text class="cell-tit" style="color: #e10a07">退出登录</text></view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	data() {
		return {
			isShow: false,
			version: ''
		};
	},
	onShow() {
		//#ifdef APP-PLUS
		let token = this.$queue.getData('token');
		if (token) {
			this.isShow = true;
		}
		//#endif
		//#ifndef APP-PLUS
		this.isShow = false;
		//#endif
	},
	onLoad() {
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			this.version = widgetInfo.version;
		});
		// #endif
	},
	methods: {
		...mapMutations(['logout']),

		navTo(url) {
			let token = this.$queue.getData('token');
			if (token) {
				uni.navigateTo({
					url: url
				});
			} else {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			}
		},
		gowuche() {
			uni.navigateTo({ url: '/pages/feedback' });
		},
		navTo1(url) {
			uni.navigateTo({
				url: url
			});
		},
		about(url) {
			uni.showModal({
				showCancel: false,
				title: '关于我们',
				content:
					'省钱兄是一个汇聚了全网隐藏优惠券的网购返利软件 ！这里汇聚淘宝、京东、天猫、拼多多等商城优惠券信息！每天实时更新优惠券，发放一些商家的大额优惠券！这里可以帮你网购省钱返利，也可以帮你兼职赚钱！每年最高能让你网购省50%的钱！\n\n西安省钱兄网络科技有限公司',
				success: e => {
					if (e.confirm) {
					}
				}
			});
		},
		//退出登录
		toLogout() {
			let that = this;
			uni.showModal({
				title: '退出提醒',
				content: '确定要退出登录么',
				success: e => {
					if (e.confirm) {
						that.$queue.remove('token');
						that.$queue.remove('userId');
						that.$queue.remove('mobile');
						that.$queue.remove('openid');
						that.$queue.remove('grade');
						that.$queue.remove('nickName');
						that.$queue.remove('isInvitation');
						that.$queue.remove('image_url');
						that.$queue.remove('relation_id');
						that.$queue.remove('relation');
						that.isShow = false;
						setTimeout(() => {
							uni.switchTab({ url: '/pages/member/user' });
						}, 200);
					}
				}
			});
		},

		update() {
			plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
				this.$Request.getT('/appinfo/').then(res => {
					res = res.data[0];
					if (res.wgtUrl && widgetInfo.version < res.version) {
						let downloadLink = '';
						let androidLink = res.androidWgtUrl;
						let iosLink = res.iosWgtUrl;
						let ready = false;
						if (res.wgtUrl.match(RegExp(/.wgt/))) {
							// 判断系统类型
							if (plus.os.name.toLowerCase() === 'android') {
								console.log('安卓系统');
								if (androidLink && androidLink !== '#') {
									// 我这里默认#也是没有地址，请根据业务自行修改
									console.log('发现下载地址');
									// 安卓：创建下载任务
									if (androidLink.match(RegExp(/.wgt/))) {
										console.log('确认wgt热更新包');
										downloadLink = androidLink;
										ready = true;
									} else {
										console.log('安卓推荐.wgt强制更新，.apk的强制更新请您自行修改程序');
									}
								} else {
									console.log('下载地址是空的，无法继续');
								}
							} else {
								console.log('苹果系统');
								if (iosLink && iosLink !== '#') {
									// 我这里默认#也是没有地址，请根据业务自行修改
									console.log('发现下载地址');
									// 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
									if (iosLink.match(RegExp(/.wgt/))) {
										console.log('确认wgt热更新包');
										downloadLink = iosLink;
										ready = true;
									} else {
										console.log('苹果只支持.wgt强制更新');
									}
								} else {
									console.log('下载地址是空的，无法继续');
								}
							}
							if (ready) {
								console.log('任务开始');
								let downloadTask = uni.downloadFile({
									url: downloadLink,
									success: res => {
										if (res.statusCode === 200) {
											// 保存下载的安装包
											console.log('保存安装包');
											uni.saveFile({
												tempFilePath: res.tempFilePath,
												success: res => {
													const packgePath = res.savedFilePath;
													// 保存更新记录到stroage，下次启动app时安装更新
													uni.setStorage({
														key: 'updated',
														data: {
															completed: false,
															packgePath: packgePath
														},
														success: () => {
															console.log('成功保存记录');
														}
													});
													// 任务完成，关闭下载任务
													console.log('任务完成，关闭下载任务，下一次启动应用时将安装更新');
													downloadTask.abort();
													downloadTask = null;
												}
											});
										}
									}
								});
							} else {
								console.log('下载地址未准备，无法开启下载任务');
							}
						} else {
							if (res.method == 'true') {
								uni.showModal({
									showCancel: false,
									title: '发现新版本',
									content: res.des,
									success: res => {
										if (res.confirm) {
											if (uni.getSystemInfoSync().platform == 'android') {
												uni.downloadFile({
													url: androidLink,
													success: downloadResult => {
														if (downloadResult.statusCode === 200) {
															plus.runtime.install(
																downloadResult.tempFilePath,
																{
																	force: false
																},
																d => {
																	console.log('install success...');
																	plus.runtime.restart();
																},
																e => {
																	console.error('install fail...');
																}
															);
														}
													}
												});
											}
											if (uni.getSystemInfoSync().platform == 'ios') {
												plus.runtime.openURL(iosLink, function(res) {});
											}
										} else if (res.cancel) {
											console.log('取消');
										}
									}
								});
							} else {
								uni.showModal({
									title: '发现新版本',
									content: res.des,
									success: res => {
										if (res.confirm) {
											if (uni.getSystemInfoSync().platform == 'android') {
												uni.downloadFile({
													url: androidLink,
													success: downloadResult => {
														if (downloadResult.statusCode === 200) {
															plus.runtime.install(
																downloadResult.tempFilePath,
																{
																	force: false
																},
																d => {
																	console.log('install success...');
																	plus.runtime.restart();
																},
																e => {
																	console.error('install fail...');
																}
															);
														}
													}
												});
											}
											if (uni.getSystemInfoSync().platform == 'ios') {
												plus.runtime.openURL(iosLink, function(res) {});
											}
										} else if (res.cancel) {
											console.log('取消');
										}
									}
								});
							}
						}
					}else{
						this.$queue.showToast('已经是最新版本啦')
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}

.list-cell {
	display: flex;
	align-items: baseline;
	padding: 10px $page-row-spacing;
	line-height: 30px;
	position: relative;
	background: #fff;
	justify-content: center;

	&.log-out-btn {
		margin-top: 20px;

		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 16px;
	}

	&.m-t {
		margin-top: 9px;
	}

	.cell-more {
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 6px;
	}

	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 6px;
	}

	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}

	switch {
		transform: translateX(8px) scale(0.84);
	}
}
</style>
