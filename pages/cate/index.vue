<template>
	<view class="index-content">
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft" style="position: fixed;z-index: 100;border-bottom: 1px solid ghostwhite">
			<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in category" :key="index" @tap="tabSelect"
			 :data-id="index">
				<text :style="index==TabCur?'background: #e10a07;color: white;padding: 4px 10px 4px 10px;border-radius: 16px;margin-right: -10px':'background: #ffffff;color: #333333;margin-right: -10px'">{{item.name}}</text>

			</view>
		</scroll-view>
		<view class="index-coupon has-bg-white has-pd-10 top_30">
			<view class="goods-list" v-if="couponlist.length > 0" style="padding-top: 46px">
			<orange-goods-card-home v-for="(item,index) in couponlist" :index="index%2" :tkmoney='item.tkmoney' :tkmoneys='item.tkmoneys'
			 :itemid="item.itemid" :isEnable='isEnable' :logo="logo" :is-invitation="isInvitation" :itempic="item.itempic+'_310x310.jpg'"
			 :itemtitle="item.itemtitle" :itemprice='"¥"+item.itemprice' :itemsale='item.itemsale' :itemendprice='""+item.itemendprice'
			 :couponmoney="item.couponmoney"></orange-goods-card-home>
			</view>
		</view>

		<!-- 加载更多提示 -->
		<view class="s-col is-col-24" v-if="couponlist.length > 0">
			<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
		</view>
		<!-- 加载更多提示 -->
		<!-- 悬浮上拉 -->
		<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
			<text class="iconfont icon-shangla"></text>
		</view>
		<empty v-if="couponlist.length === 0" des="暂无数据" show="false"></empty>
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
				taobao: "../../static/img/taobao.png",
				category: [{
						name: '热门抖货'
					},
					{
						name: '百变穿搭'
					},
					{
						name: '时尚潮男'
					},
					{
						name: '舒适好物'
					},
					{
						name: '美妆达人'
					},
					{
						name: '魅力配饰'
					},
					{
						name: '步履不停'
					},
					{
						name: '包罗万象'
					},
					{
						name: '萌娃驾到'
					},
					{
						name: '宝妈神器'
					},
					{
						name: '居家好物'
					},
					{
						name: '吃货专区'
					},
					{
						name: '数码达人'
					},
					{
						name: '用电能手'
					},
					{
						name: '其他'
					},
					{
						name: '伴你前行'
					},
					{
						name: '学习娱乐'
					},
					{
						name: '萌宠世界'
					},
				],
				genderKey: "gender",
				TabCur: 0,
				scrollLeft: 0,
				scrollTop: false,
				couponlist: [],
				page: 1,
				min_id: 0,
				isInvitation: 0,
				cid: 0,
				cat_id: 0,
				sort: 4,
				loadingType: 0,
				isEnable:'否',
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		onLoad: function(e) {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			uni.showLoading({
				title: '加载中...'
			});
			this.loadCouponList();
			this.getUserInfo();
			
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		methods: {
			getUserInfo(){
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
			tabSelect(e) {
				uni.showLoading({
					title: '加载中...'
				});
				this.TabCur = e.currentTarget.dataset.id;
				this.cat_id = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.page = 1;
				this.min_id = 0;
				//#ifdef H5
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				//#endif
				this.loadCouponList("Refresh");
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},

			loadCouponList: function(type) {
				this.loadingType = 1;
				this.$Request.get('/api/get_trill_data/apikey/maxd/min_id/' + this.min_id + '/back/20/cat_id/' + this.cat_id).then(
					res => {
						this.loadingType = 0;
						if (res.code === 1) {
							if (this.page === 1) {
								this.couponlist = [];
							}
							this.min_id = res.min_id;
							res.data.forEach(d => {
								let grade = this.$queue.getData("grade");
								d.tkmoneys = (d.tkmoney * 0.7).toFixed(2);
								if (grade) {
									d.tkmoney = (d.tkmoney * parseFloat(grade)).toFixed(2);
								} else {
									d.tkmoney = (d.tkmoney * 0.3).toFixed(2);
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
			this.loadCouponList("Refresh");
		}
	}
</script>

<style>
	@import "../../static/css/index.css";
</style>
