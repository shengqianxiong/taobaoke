<template>
	<view class="index-content">
		<view class="search-pop">
			<view class="main-title">
				<view class="search-tab">
					<!--  #ifdef H5 -->
					<view class="close-src" @tap="navigateBack">
						<text class="iconfont icon-zuojiantou"></text>
					</view>
					<!--  #endif -->
					<!--  #ifdef APP-PLUS -->
					<view class="close-src" @tap="navigateBack" style="margin-top:32upx">
						<text class="iconfont icon-zuojiantou"></text>
					</view>
					<!--  #endif -->

					<view class="search">
						<input type="text" :value="keywords" :placeholder="placeholder" class="search_area" @input="searchInput" @confirm="submitSearch" />
						<!--  #ifndef MP-ALIPAY -->
						<text v-if="keywords!==''" class="cuIcon-close clear" @tap="clearInput"></text>
						<view class="search_submit" @tap="submitSearch">搜 索</view>
						<!--  #endif -->
					</view>
				</view>
			</view>
		</view>

	<view style="background: #FFFFFF;">
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation style="border-top: 1px solid #F8F8F8;position: fixed;z-index: 100;text-align: center;width: 100%;">
			<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in tab" @tap="tabSelect"
			 :data-id="index">
				<text :style="index==TabCur?'background: #e10a07;color: white;padding: 4upx 20upx 4upx 20upx;border-radius: 32upx;margin-right: -10px':'background: #ffffff;color: #333333;margin-right: -10px'">
					{{item.name}}
				</text>
			</view>
		</scroll-view>
	</view>

		<view class="index-coupon has-bg-white has-pd-10 top_30">
			<view class="goods-list" v-if="couponlist.length > 0&&fromTabIndex==0" style="padding-top: 82upx">
				<orange-goods-card-home v-for="(item,index) in couponlist" :index="index%2" :logo="item.shoptype=='B'?logo:taobao"
				 :tkmoney='item.tkmoney' :tkmoneys='item.tkmoneys' :itemid="item.itemid" :isEnable='isEnable' :is-invitation="isInvitation"
				 :itempic="item.itempic+'_310x310.jpg'" :itemtitle="item.itemtitle" :itemprice='"¥"+item.itemprice' :itemsale='item.itemsale'
				 :itemendprice='""+item.itemendprice' :couponmoney="item.couponmoney"></orange-goods-card-home>
			</view>
		</view>


		<!-- 领券直播 -->

		<!-- 加载更多提示 -->
		<view class="s-col is-col-24" v-if="couponlist.length > 0">
			<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
		</view>
		<!-- 加载更多提示 -->
		<!-- 悬浮上拉 -->
		<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
			<text class="iconfont icon-shangla"></text>
		</view>
		<empty v-if="couponlist.length === 0" des="没有搜索到数据 换个搜索条件试试" show="false"></empty>
	</view>
</template>

<script>
	export default {
		onShareAppMessage(res) {
			return {
				title: '购物先领券，一年省一半',
				path: '/pages/index/index'
			}
		},
		data() {
			return {
				logo: "../../static/img/mao.png",
				jdlogo: "../../static/img/jd.png",
				pddlogo: "../../static/img/pinduoduo.png",
				taobao: "../../static/img/taobao.png",
				recentKeyword: [],
				fromTabIndex: 0,
				pddSort: 6,
				jdSort: "inOrderCount30Days",
				tabList: [{
					position: 'tb',
					name: '淘宝'
				}, {
					position: 'pdd',
					name: '拼多多'
				}, {
					position: 'jd',
					name: '京东'
				}],
				tab: [{
						name: '热销',
						position: 2,
						pdd: 6,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '综合',
						position: 0,
						pdd: 0,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '最新',
						position: 1,
						pdd: 12,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '高佣',
						position: 6,
						pdd: 14,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '低价',
						position: 4,
						pdd: 9,
						jd: 5,
						total: 0,
						data: []
					},
				],
				tabData: [{
						name: '热销',
						position: 2,
						pdd: 6,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '综合',
						position: 0,
						pdd: 0,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '最新',
						position: 1,
						pdd: 12,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '高佣',
						position: 6,
						pdd: 14,
						jd: 5,
						total: 0,
						data: []
					},
					{
						name: '低价',
						position: 4,
						pdd: 9,
						jd: 5,
						total: 0,
						data: []
					},
				],
				TabCur: 0,
				scrollLeft: 0,
				scrollTop: false,
				placeholder: "输入关键字或粘贴宝贝标题",
				couponlist: [],
				pddPage: 1,
				sortName: '',
				page: 1,
				localKeyword: 'orange-tyh-keyword',
				min_id: 1,
				sort: 2,
				tb_p: 1,
				keywords: "",
				isInvitation: 0,
				loadingType: 0,
				isEnable: '否',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onLoad: function(e) {
			this.keywords = e.keywords;
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			if (e.index == 3) {
				this.fromTabIndex = 2;
				this.tab = [{
							name: '热销',
							position: 2,
							pdd: 6,
							jd: "inOrderCount30Days",
							total: 0,
							data: []
						},
						{
							name: '高佣',
							position: 6,
							pdd: 14,
							jd: "commission",
							total: 0,
							data: []
						}
					],
					this.loadJdCouponList("Refresh");
			} else {
				this.loadTaoBaoCouponList();
			}
			uni.showLoading({
				title: '加载中...'
			});
			this.getUserInfo();

		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		methods: {
			clickItem(index) {
				this.$queue.setData("jd_list", JSON.stringify(this.couponlist[index]))
				uni.navigateTo({
					url: '/pages/detail/jd'
				});
			},
			getUserInfo() {
				let userId = this.$queue.getData("userId");
				if (userId) {
					this.$Request.getT("/user/" + userId).then(res => {
						if (res.status === 0) {
							this.$queue.setData("image_url", res.data.image_url);
							this.$queue.setData("mobile", res.data.phone);
							this.isInvitation = res.data.isInvitation;
							this.$queue.setData("isInvitation", res.data.isInvitation);
							this.$queue.setData("relation", res.data.invitation);
							this.$queue.setData("grade", res.data.grade);
							this.$queue.setData("nickName", res.data.nickName);
							this.$queue.setData("relation_id", res.data.relationId);
							this.$queue.setData("gender", parseInt(res.data.gender));
						}
					});
				}
			},
			clearInput() {
				this.keywords = '';
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.sort = this.tab[e.currentTarget.dataset.id].position;
				this.pddSort = this.tab[e.currentTarget.dataset.id].pdd;
				this.jdSort = this.tab[e.currentTarget.dataset.id].jd;
				this.page = 1;
				this.min_id = 1;
				this.tb_p = 1;
				uni.showLoading({
					title: '加载中...'
				});
				if (this.fromTabIndex == 0) { //淘宝商品
					this.loadTaoBaoCouponList("Refresh");
				}
				if (this.fromTabIndex == 1) { //拼多多商品
					this.loadPddCouponList("Refresh");
				}
				if (this.fromTabIndex == 2) { //京东商品
					this.loadJdCouponList("Refresh");
				}
				//#ifdef H5
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				//#endif
			},
			fromTabSelect(index) {
				this.fromTabIndex = index;
				this.page = 1;
				this.min_id = 1;
				this.couponlist = [];
				uni.showLoading({
					title: '加载中...'
				});
				if (index == 0) { //淘宝商品
					this.tab = this.tabData;
					this.loadTaoBaoCouponList("Refresh");
				}
				if (index == 1) { //拼多多商品
					this.tab = this.tabData;
					this.loadPddCouponList("Refresh");
				}
				if (index == 2) { //京东商品
					this.tab = [{
								name: '热销',
								position: 2,
								pdd: 6,
								jd: "inOrderCount30Days",
								total: 0,
								data: []
							},
							{
								name: '高佣',
								position: 6,
								pdd: 14,
								jd: "commission",
								total: 0,
								data: []
							}
						],
						this.loadJdCouponList("Refresh");
				}
				//#ifdef H5
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				//#endif
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			loadTaoBaoCouponList: function(type) {
				this.loadingType = 1;
				this.$Request.get('/api/supersearch/apikey/maxd/keyword/' + this.keywords + '/back/20/sort/' + this.sort +
					'/min_id/' + this.min_id + '/is_coupon/1/tb_p/' + this.tb_p).then(res => {
					this.loadingType = 0;
					if (res.code === 1) {
						if (this.page === 1) {
							this.couponlist = [];
						}
						this.min_id = res.min_id;
						this.tb_p = res.tb_p;
						res.data.forEach(d => {
							let grade = this.$queue.getData("grade");
							d.tkmoneys = ((d.itemendprice * (d.tkrates * 0.01)) * 0.7).toFixed(2);
							if (grade) {
								d.tkmoney = ((d.itemendprice * (d.tkrates * 0.01)) * parseFloat(grade)).toFixed(2);
							} else {
								d.tkmoney = ((d.itemendprice * (d.tkrates * 0.01)) * 0.3).toFixed(2);
							}
							d.itemsale = d.itemsale > 10000 ? "已售 " + (d.itemsale / 10000).toFixed(1) + "万" : "已售 " + d.itemsale;
							this.couponlist.push(d);
						})
					} else {
						this.loadingType = 2;
					}
					uni.hideLoading();

					if (type === "Refresh") {
						uni.stopPullDownRefresh(); // 停止刷新
					}
				})
			},

			loadPddCouponList: function(type) {
				this.loadingType = 1;
				this.$Request.getT('/pdd/list/keyword/' + this.pddSort + '/page/' + this.page + '/pageSize/20?keyword=' + this.keywords)
					.then(res => {
						this.loadingType = 0;
						if (res.goodsSearchResponse) {
							if (this.page === 1) {
								this.couponlist = [];
							}
							res.goodsSearchResponse.goodsList.forEach(d => {
								let grade = this.$queue.getData("grade");
								d.tkmoneys = ((((d.minGroupPrice - d.couponDiscount) * 0.01) * (d.promotionRate * 0.001)) * 0.7).toFixed(2);
								if (grade) {
									d.tkmoney = ((((d.minGroupPrice - d.couponDiscount) * 0.01) * (d.promotionRate * 0.001)) * parseFloat(
										grade)).toFixed(2);
								} else {
									d.tkmoney = ((((d.minGroupPrice - d.couponDiscount) * 0.01) * (d.promotionRate * 0.001)) * 0.3).toFixed(2);
								}
								d.itemendprice = ((d.minGroupPrice - d.couponDiscount) * 0.01).toFixed(2);
								d.itemprice = ((d.minGroupPrice) * 0.01).toFixed(2);
								this.couponlist.push(d);
							})
						} else {
							this.loadingType = 2;
						}
						uni.hideLoading();

						if (type === "Refresh") {
							uni.stopPullDownRefresh(); // 停止刷新
						}
					})
			},

			loadJdCouponList: function(type) {
				this.loadingType = 1;
				this.$Request.getT('/jd/goods/list/' + this.page + "?sortName=" + this.jdSort + "&keywords=" + this.keywords).then(
					res => {
						this.loadingType = 0;
						if (res.code === 200) {
							if (this.page === 1) {
								this.couponlist = [];
							}
							res.data.list.forEach(d => {
								let grade = this.$queue.getData("grade");
								if (d.imageInfo.imageList.length > 0) {
									d.itempic = d.imageInfo.imageList[0].url
								}
								d.itemprice = d.priceInfo.price
								d.couponmoney = d.couponInfo.couponList[0].discount
								d.itemendprice = Math.round(d.priceInfo.price - d.couponInfo.couponList[0].discount);
								d.tkmoneys = (d.commissionInfo.couponCommission * 0.7).toFixed(2);
								if (grade) {
									d.tkmoney = (d.commissionInfo.couponCommission * parseFloat(grade)).toFixed(2);
								} else {
									d.tkmoney = (d.commissionInfo.couponCommission * 0.3).toFixed(2);
								}
								d.itemsale = d.inOrderCount30Days > 10000 ? "已售 " + (d.inOrderCount30Days / 10000).toFixed(1) + "万" : "已售 " +
									d.inOrderCount30Days;
								this.couponlist.push(d);
							})
						} else {
							this.loadingType = 2;
						}
						uni.hideLoading();

						if (type === "Refresh") {
							uni.stopPullDownRefresh(); // 停止刷新
						}
					})
			},
			navigateBack: function() {
				uni.navigateBack();
			},
			toGoodsInfo: function(itemid) {
				let relation_id = this.$queue.getData("relation_id");
				if (relation_id) {
					uni.navigateTo({
						url: "/pages/detail/goodsinfo?itemid=" + itemid + "&relation_id=" + relation_id,
					})
				} else {
					uni.navigateTo({
						url: "/pages/detail/goodsinfo?itemid=" + itemid,
					})
				}
			},
			searchInput: function(e) {
				this.keywords = e.detail.value;
			},
			submitSearch: function() {
				let keywords = this.$queue.get(this.localKeyword);
				if (JSON.stringify(keywords).indexOf(this.keywords) === -1) {
					this.$queue.insert({
						key: this.localKeyword,
						value: {
							keyword: this.keywords
						},
						capacityNum: 20, //队列容量
					});
				}
				uni.showLoading({
					title: '加载中...'
				});
				// #ifdef MP-ALIPAY
				if (this.$queue.getSearchKeys(this.keywords)) {
					uni.showToast({
						title: "输入内容带有非法关键字请重新输入",
						mask: false,
						duration: 1500,
						icon: "none"
					});
					this.keywords = '';
				} else {
					this.page = 1;
					this.min_id = 1;
					this.tb_p = 1;
					if (this.fromTabIndex == 0) { //淘宝商品
						this.loadTaoBaoCouponList("Refresh");
					}
					if (this.fromTabIndex == 1) { //拼多多商品
						this.loadPddCouponList("Refresh");
					}
					if (this.fromTabIndex == 2) { //京东商品
						this.loadJdCouponList("Refresh");
					}
					this.topScrollTap();
				}
				// #endif
				// #ifndef MP-ALIPAY
				this.page = 1;
				this.min_id = 1;
				this.tb_p = 1;
				if (this.fromTabIndex == 0) { //淘宝商品
					this.loadTaoBaoCouponList("Refresh");
				}
				if (this.fromTabIndex == 1) { //拼多多商品
					this.loadPddCouponList("Refresh");
				}
				if (this.fromTabIndex == 2) { //京东商品
					this.loadJdCouponList("Refresh");
				}
				this.topScrollTap();
				// #endif

			},

		},

		onReady: function() {
			if (this.fromTabIndex == 0) { //淘宝商品
				this.loadTaoBaoCouponList();
			}
			if (this.fromTabIndex == 1) { //拼多多商品
				this.loadPddCouponList();
			}
			if (this.fromTabIndex == 2) { //京东商品
				this.loadJdCouponList();
			}
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			if (this.fromTabIndex == 0) { //淘宝商品
				this.loadTaoBaoCouponList();
			}
			if (this.fromTabIndex == 1) { //拼多多商品
				this.loadPddCouponList();
			}
			if (this.fromTabIndex == 2) { //京东商品
				this.loadJdCouponList();
			}
		},
		onPullDownRefresh: function() {
			this.page = 1;
			this.min_id = 1;
			this.tb_p = 1;
			if (this.fromTabIndex == 0) { //淘宝商品
				this.loadTaoBaoCouponList("Refresh");
			}
			if (this.fromTabIndex == 1) { //拼多多商品
				this.loadPddCouponList("Refresh");
			}
			if (this.fromTabIndex == 2) { //京东商品
				this.loadJdCouponList("Refresh");
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/index.css";

	.top_30 {
		margin-top: 120upx;
	}

	.search-default image {
		display: block;
		margin: auto;
		width: 80%;
	}

	.navbar {
		display: flex;
		height: 80upx;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 32upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}
	}

	.main-title {
		background: -moz-linear-gradient(left, #F15B6C, #e10a07 100%);
		background: -webkit-gradient(linear, left top, left right, color-stop(0, #F15B6C), color-stop(100%, #e10a07));
		background: -webkit-linear-gradient(left, #F15B6C 0, #e10a07 100%);
		background: -o-linear-gradient(left, #F15B6C 0, #e10a07 100%);
		background: -ms-linear-gradient(left, #F15B6C 0, #e10a07 100%);
		background: linear-gradient(to left, #F15B6C 0, #e10a07 100%);

		border-bottom-color: transparent;
		padding: 16upx 20upx;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		display: block;
		box-sizing: border-box;
	}

	.search-pop .search-tab {
		margin: 10upx 0 20upx;
		color: #fff;
		font-size: 32upx;
		text-align: center;
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
	}

	.search-pop .search-tab .my-sub-src {
		margin: 0 auto 0 40upx;
		display: inline-block;
		color: #fff;
		line-height: 60upx;
		margin-bottom: 20upx !important;
	}

	.search-pop .search-tab .my-sub-src:nth-child(1) {
		margin-left: 0px !important;
	}

	.main-title .search-tab .cur {
		opacity: 1;
		border-bottom: 2upx solid #fff;
	}

	.main-title .search-tab .close-src {
		position: absolute;
		left: 40upx;
		display: block;
		float: left;
		color: #ffffff;
		margin-top: 10upx;
	}

	.main-title .search-tab .close-src .iconfont {
		font-size: 40upx;
	}

	.uni-input-input,
	.uni-input-placeholder {
		width: 93%;
	}

	.main-title .search {
		background-color: #fff;
		border-radius: 40upx;
		width: 76%;
		margin-left: 12%;
		position: relative;
		padding: 0 18upx;
		height: 64upx;
		line-height: 64upx;
		font-size: 26upx;
		margin-top: 20upx;
	}

	.search_submit {
		width: 25%;
		height: 64upx;
		background: #ffb925;
		color: #fff;
		float: right;
		margin-top: -64upx;
		position: relative;
		border-radius: 32upx;
		margin-right: -32upx;
		z-index: 30;
	}

	.clear {
		width: 70upx;
		// background: white; 
		color: crimson;
		position: absolute;
		z-index: 999;
		font-size: 32upx;
		/* height: 56upx; */
		margin-left: 96upx;
		margin-top: -60upx
	}

	.main-title .search input {
		border: none;
		outline: 0;
		height: 64upx;
		font-size: 26upx;
		line-height: 60upx;
		background: #fff;
		color: #666;
		border-radius: 10upx;
		padding: 0 0 0 10upx;
		text-align: left;
	}

	.main-title .search input.search_area {
		background-color: transparent;
		position: relative;
		z-index: 99;
		width: 80%;
		color: #333;
		font-size: 24upx;
	}
</style>
