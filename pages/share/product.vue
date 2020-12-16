<template style="background: white">
	<view>
		<view>
			<view class="index-content">
				<view class="index-coupon has-bg-white has-pd-10 top_30">
					<view class="goods-list" v-if="couponlist.length > 0">
						<orange-goods-card-home v-for="(item, index9) in couponlist" :logo="logo"
						 :isEnable="isEnable" :tkmoney="item.tkmoney" :tkmoneys="item.tkmoneys" :itemid="item.itemid" :itempic="item.itempic ? item.itempic + '_310x310.jpg' : 'https://www.gomyorder.cn/logo.png'"
						 :itemtitle="item.itemtitle" :is-invitation="isInvitation" :itemprice="'¥' + item.itemprice" :itemsale="item.itemsale"
						 :itemendprice="'' + item.itemendprice" :couponmoney="item.couponmoney" @success='clicklItem'></orange-goods-card-home>
					</view>
				</view>
				<!-- 悬浮上拉 -->
				<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '', '']" style="bottom: 56px;"><text
					 class="iconfont icon-shangla"></text></view>
				<!-- 加载更多提示 -->
				<view class="s-col is-col-24" v-if="couponlist.length > 0">
					<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
				</view>
				<!-- 加载更多提示 -->
				<empty v-if="couponlist.length === 0" des="暂无数据" show="false"></empty>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Image'?'show':''" @tap="hideModal" v-if="itempic&&qrPath">
			<view class="cu-dialog" @tap="hideModal">
				<view class="bg-img">
					<wm-posters @success="SuccessImage" :imgSrc="itempic" :QrSrc="qrPath" :Title="itemtitle" :PriceTxt="itemendprice"
					 :OriginalTxt="itemprice" :LineType='false'></wm-posters>
				</view>
			</view>
		</view>
		<tki-qrcode ref="qrcode" :val="erweima" :size="600" background="#fff" foreground="#000" pdground="#000" :onval="true"
		 :loadMake="true" @result="qrR" :show="false"></tki-qrcode>
	</view>
</template>

<script>
	import wmPosters from '@/components/wm-poster/wm-posters.vue';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	export default {
		components: {
			tkiQrcode,
			wmPosters
		},
		onShareAppMessage(res) {
			return {
				title: '购物先领券，一年省一半',
				path: '/pages/index/index'
			};
		},

		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				modalName: '',
				logo: '../../static/img/maos.png',
				TabCur: 0,
				TabCurs: 0,
				isEnable: '否',
				erweima: "../../static/img/erweima.jpg",
				qrPath: "",
				scrollLeft: 0,
				scrollLefts: 0,
				couponlist: [],
				selectId: 1,
				page: 1,
				min_id: 1,
				cid: 0,
				type: 4,
				sort: 3,
				genderKey: 'gender',
				loadingType: 0,
				isInvitation: 0,
				scrollTop: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				itemendprice: '识别二维码免费领取',
				itemtitle: '',
				itemprice: '',
				itempic: ''
			};
		},
		onLoad: function(e) {
			uni.showLoading({
				title: '加载中...'
			});

			let userId = this.$queue.getData('userId');
			if (userId) {
				this.loadCouponList();
				this.loadInfos();
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						this.$queue.setData('image_url', res.data.image_url);
						this.$queue.setData('mobile', res.data.phone);
						this.isInvitation = res.data.isInvitation;
						this.$queue.setData('isInvitation', res.data.isInvitation);
						this.$queue.setData('relation', res.data.invitation);
						this.$queue.setData('grade', res.data.grade);
						this.$queue.setData('nickName', res.data.nickName);
						this.$queue.setData('relation_id', res.data.relationId);
						this.$queue.setData('gender', parseInt(res.data.gender));
					}
				});
			}

		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		methods: {

			loadInfos() {
				let that = this;
				this.$Request.getT('/wx/token').then(res => {
					uni.request({
						url: 'https://www.gomyorder.cn/qrcode?access_token=' + res,
						method: 'POST',
						header: {
							'content-type': 'application/json'
						},
						data: {
							action_name: 'QR_LIMIT_STR_SCENE',
							action_info: {
								scene: {
									scene_str: this.$queue.getData('relation_id')
								}
							}
						},
						success: function(result) {
							that.erweima = result.data.url;
						},
						fail: function(e) {
							console.error(e);
						}
					});
				});
			},
			qrR(path) {
				this.qrPath = path;
			},
			hideModal() {
				this.modalName = null
			},
			SuccessImage(qrR) {
				this.modalName = "Image"
				uni.hideLoading()
			},
			clicklItem(qrR) {
				this.itemprice = '';
				this.itempic = '';
				this.itemtitle = '';
				uni.showLoading({
					title: '海报生成中...'
				});
				this.$Request.get('/api/item_detail/apikey/maxd/itemid/' + qrR).then(res => {
					if (res.code === 1) {
						this.itemprice = res.data.itemprice;
						this.itempic = "https://" + res.data.itempic.split('://')[1];
						this.itemtitle = res.data.itemtitle;
					}
				})

			},
			change(index) {
				this.selectId = index;
			},

			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},

			loadCouponList: function(type) {
				this.loadingType = 1;
				this.$Request.get('/api/low_price_Pinkage_data/apikey/maxd/back/20/order/4/type/' + this.type + '/min_id/' + this.min_id)
					.then(
						res => {
							this.loadingType = 0;
							if (res.code === 1) {
								if (this.page === 1) {
									this.couponlist = [];
								}
								this.min_id = res.min_id;
								res.data.forEach(d => {
									let grade = this.$queue.getData('grade');
									d.tkmoneys = (d.tkmoney * 0.7).toFixed(2);
									if (grade) {
										d.tkmoney = (d.tkmoney * parseFloat(grade)).toFixed(2);
									} else {
										d.tkmoney = (d.tkmoney * 0.3).toFixed(2);
									}
									d.itemsale = d.itemsale > 10000 ? '已售 ' + (d.itemsale / 10000).toFixed(1) + '万' : '已售 ' + d.itemsale;
									this.couponlist.push(d);
								});
							} else {
								this.loadingType = 2;
							}
							uni.hideLoading();
							if (type === 'Refresh') {
								uni.stopPullDownRefresh(); // 停止刷新
							}
						});
			},

			toGoodsInfo: function(itemid) {
				let relation_id = this.$queue.getData('relation_id');
				if (relation_id) {
					uni.navigateTo({
						url: '/pages/detail/goodsinfo?itemid=' + itemid + '&relation_id=' + relation_id
					});
				} else {
					uni.navigateTo({
						url: '/pages/detail/goodsinfo?itemid=' + itemid
					});
				}
			}
		},

		onReady: function() {
			this.loadCouponList();
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.loadCouponList();
		},
		onPullDownRefresh: function() {
			this.page = 1;
			this.min_id = 1;
			this.loadCouponList('Refresh');
		}
	};
</script>

<style>
	@import '../../static/css/index.css';
</style>
