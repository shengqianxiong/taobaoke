<template>
	<view>

		<view style="font-size: 24upx;color: #999999;margin: 100upx 16upx 0upx 16upx">
			提示: 足迹最多保存100个宝贝，如果超出100个宝贝，如果此时浏览了新的宝贝，最末尾的宝贝将会自动删除
		</view>
		<view class="index-content">
			<view class="index-coupon has-bg-white has-pd-10 top_30">
				<view class="goods-list" v-if="couponlist.length > 0&&fromTabIndex==0">
					<orange-goods-card-home v-for="(item,index) in couponlist" :index="index%2" :tkmoney='item.tkmoney' :tkmoneys='item.tkmoneys'
					 :itemid="item.itemid" :isEnable='isEnable' :logo="logo" :is-invitation="isInvitation" :itempic="item.itempic+'_310x310.jpg'"
					 :itemtitle="item.itemtitle" :itemprice='"¥"+item.itemprice' :itemsale='item.itemsale' :itemendprice='""+item.itemendprice'
					 :couponmoney="item.couponmoney"></orange-goods-card-home>
				</view>
				<view class="goods-list" v-if="couponlist.length > 0&&fromTabIndex==1">
					<orange-goods-card-home v-for="(item,index) in couponlist" :index="index%2" :logo="pddlogo" :tkmoney='item.tkmoney'
					 :tkmoneys='item.tkmoneys' :itemid="item.goodsId" :isEnable='isEnable' :is-invitation="isInvitation" :itempic="item.goodsImageUrl"
					 :itemtitle="item.goodsName" :itemprice='"¥"+item.itemprice' :itemsale='"已售 "+item.salesTip'
					 :itemendprice='item.itemendprice' :couponmoney="item.couponDiscount*0.01">
					</orange-goods-card-home>
				</view>
				<view class="goods-list" v-if="couponlist.length > 0&&fromTabIndex==2">
					<orange-goods-card-home v-for="(item,index) in couponlist" :index='index' :tkmoney='item.tkmoney' :tkmoneys='item.tkmoneys'
					 :itemid="item.skuId" :logo="jdlogo" :isEnable='isEnable' :is-invitation="isInvitation" :itempic="item.itempic"
					 :itemtitle="item.skuName" :itemprice='"¥"+item.itemprice' :itemsale='item.itemsale' :itemendprice='""+item.itemendprice'
					 :couponmoney="item.couponmoney" @success="clickItem"></orange-goods-card-home>
				</view>
			</view>
			<!-- 悬浮上拉 -->
			<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']" style="bottom: 56px;">
				<text class="iconfont icon-shangla"></text>
			</view>
			<!-- 空白页 -->
			<empty v-if="couponlist.length === 0" des="你还没有足迹，快去逛逛吧"></empty>
		</view>
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
				jdlogo: "../../static/img/jd.png",
				logo: "../../static/img/mao.png",
				taobao: "../../static/img/taobao.png",
				pddlogo: "../../static/img/pinduoduo.png",
				fromTabIndex: 0,
				couponlist: [],
				loadingType: 0,
				isInvitation: 0,
				isEnable: '否',
				scrollTop: false,
				collectKey: 'orange-sqx-footprint',
				collectPddKey: 'orange-sqx-footprint-pdd',
				collectJdKey: 'orange-sqx-footprint-jd',

			}
		},
		onLoad: function(e) {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			this.getUserInfo();
			this.getTaoBao();
		},
		methods: {
			clickItem(index) {
				this.$queue.setData("jd_list", JSON.stringify(this.couponlist[index]))
				uni.navigateTo({
					url: '/pages/detail/jd'
				});
			},
			getTaoBao() {
				this.$queue.get(this.collectKey).forEach(d => {
					let grade = this.$queue.getData("grade");
					d.tkmoneys = (d.tkmoney * 0.7).toFixed(2);
					if (grade) {
						d.tkmoney = (d.tkmoney * parseFloat(grade)).toFixed(2);
					} else {
						d.tkmoney = (d.tkmoney * 0.3).toFixed(2);
					}
					d.itemsale = d.itemsale > 10000 ? "已售" + (d.itemsale / 10000).toFixed(1) + "万" : "已售" + d.itemsale;
					this.couponlist.push(d);
				});
			},
			getPddd() {
				this.$queue.get(this.collectPddKey).forEach(d => {
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
				});
			},
			getJD() {
				this.$queue.get(this.collectJdKey).forEach(d => {
					let grade = this.$queue.getData("grade");
					this.couponlist.push(d);
				});
			},
			fromTabSelect(index) {
				this.fromTabIndex = index;
				this.couponlist = [];
				if(index==0){
					this.getTaoBao();
				}
				if(index==1){
					this.getPddd();
				}
				if(index==2){
					this.getJD();
				}
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
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			onPageScroll: function(e) {
				this.scrollTop = e.scrollTop > 200;
			}
		},

	}
</script>

<style lang="scss">
	@import "../../static/css/index.css";

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
</style>
