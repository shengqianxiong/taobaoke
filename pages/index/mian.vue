<template style="background: white">
	<view>
		<view style="z-index: 100;position: fixed;padding: 16px;color: #FFFFFF;background-color: rgb(255, 109, 178);display: flex;font-size: 16px;width: 100%;text-align: center;">
			<view style="width: 33%;text-align: center;" @tap="change(1)">
				新人免单
				<view v-if="selectId == 1" style="color: #FFFFFF;">—</view>
			</view>
			<view style="width: 33%;text-align: center;" @tap="change(2)">
				省钱教程
				<view v-if="selectId == 2" style="color: #FFFFFF;">—</view>
			</view>
			<view style="width: 33%;text-align: center;" @tap="change(3)">
				赚钱教程
				<view v-if="selectId == 3" style="color: #FFFFFF;">—</view>
			</view>
		</view>
		<view v-if="selectId == 2" style="padding-top: 72px;height: 100vh;background: #FFFFFF;">
			<view style="background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
				<view>▼</view>
				省钱流程
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">进入淘宝/京东/拼多多购物车选择任意商品点击进入详情</view>
				<view>▼</view>
				<!-- #ifdef H5 -->
				<view style="font-size: 14px;color: #FF6600;">长按复制商品标题</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">发送至省钱兄公众号</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">找到对应商品进入商品详情</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">点击立即领券（一键复制）</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">打开淘宝自动弹出（点击立即领券）</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view style="font-size: 14px;color: #FF6600;">长按复制商品标题</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">打开省钱兄APP</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">点击立即搜索</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">找到对应商品进入商品详情</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">点击立即领券</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">打开淘宝（点击立即领券）</view>
				<!-- #endif -->
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">进入商品点击立即购买</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">选择优惠券</view>
				<view>▼</view>
				<view style="font-size: 14px;color: #FF6600;">立即付款</view>
			</view>

		</view>
		<view v-if="selectId == 3" style="padding-top: 72px;height: 100vh;background: #FFFFFF;">
			<view style="background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
				<view>▼</view>
				加入会员流程
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">注册账号 »进入我的 » 会员申请 »淘宝授权</view>
			</view>
			<view style="margin-bottom: 1px;background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
				<view>▼</view>
				会员赚钱流程
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">选择任意商品 »商品详情 » 生成海报 »分享给朋友</view>
			</view>
			<view style="margin-bottom: 1px;background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
				<view>▼</view>
				会员升级流程
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">进入我的 »推广中心 » 会员升级 »</view>
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">生成海报 »分享给朋友</view>
			</view>
		</view>
		<view v-if="selectId == 1" style="padding-top: 72px;">
			<view style="background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
				<view>▼</view>
				新人免单流程
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">
					<text @tap="register">注册会员</text>
					» 领券下单 » 等待收货 » 返至我的 » 提现
				</view>
			</view>
			<view style="margin-bottom: 1px;background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
				<view>▼</view>
				以下商品，新人免单
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">仅限还未出过单的会员参与，出过单会员购买不免单</view>
				<view style="font-size: 14px;margin-top: 8px;color: #FF6600;">（仅限5元内商品全额免单）</view>
			</view>
			<view class="index-content">
				<view class="index-coupon has-bg-white has-pd-10 top_30">
					<view class="goods-list" v-if="couponlist.length > 0">
						<orange-goods-news-list v-for="(item, index) in couponlist" :key="index" :tkmoney="'返现 ￥' + item.tkmoney" :itemid="item.itemid"
						 :is-invitation="isInvitation" :logo="item.shoptype === 'B' ? logo : taobao" :itempic="item.itempic + '_310x310.jpg'"
						 :itemtitle="item.itemtitle" :itemprice="'在售价 ¥' + item.itemprice" :itemsale="item.itemsale" :itemendprice="item.itemendprice"
						 :couponmoney="item.couponmoney"></orange-goods-news-list>
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
	</view>
</template>

<script>
	export default {
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
				logo: '../../static/img/mao.png',
				TabCur: 0,
				TabCurs: 0,
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
				}
			};
		},
		onLoad: function(e) {
			//this.type = 4;
			uni.setNavigationBarTitle({
				title: '新人免单'
			});
			uni.showLoading({
				title: '加载中...'
			});
			this.loadCouponList();
			let userId = this.$queue.getData('userId');
			if (userId) {
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
			change(index) {
				// if (index == 2) {
				// 	// // #ifndef APP-PLUS
				// 	// window.location.replace(this.$queue.publicYuMing()+'/help/tb.html');

				// 	// // #endif
				// 	// // #ifdef APP-PLUS

				// 	// // #endif
				// 	uni.navigateTo({
				// 		url: '/pages/member/webview?url='+this.$queue.publicYuMing()+'/help/tb.html'
				// 	});
				// } else {

				// }
				this.selectId = index;
			},
			searchSelect(e) {
				this.TabCurs = e.currentTarget.dataset.id;
				this.sort = 3;
				this.scrollLefts = (e.currentTarget.dataset.id - 1) * 60;
				this.page = 1;
				this.min_id = 1;
				uni.showLoading({
					title: '加载中...'
				});
				//#ifdef H5
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				//#endif
				this.loadCouponList('Refresh');
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.cid = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.page = 1;
				this.min_id = 1;
				uni.showLoading({
					title: '加载中...'
				});
				//#ifdef H5
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				//#endif
				this.loadCouponList('Refresh');
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},

			loadCouponList: function(type) {
				this.loadingType = 1;
				this.$Request.get('/api/low_price_Pinkage_data/apikey/maxd/order/4/type/' + this.type + '/min_id/' + this.min_id).then(res => {
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
							d.itemsale = d.itemsale > 10000 ? (d.itemsale / 10000).toFixed(1) + '万' :  d.itemsale;
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
			register() {
				uni.navigateTo({
					url: '/pages/member/register??invitation=' + this.$queue.getInvitation()
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
