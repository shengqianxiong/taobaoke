<template>
	<view class="s-page-wrapper" v-if="showPage" style="background-color: #ebebeb;">
		<view class="index-goods" v-if="loadGoods">
			<view class="swiper">
				<swiper
					class="swiper-container"
					:autoplay="true"
					:interval="4000"
					:circular="true"
					:indicator-dots="true"
					indicator-active-color="#FC3F78"
					indicator-color="#cccccc"
				>
					<block v-for="(item, index) in goods.images" :key="item">
						<swiper-item class="swiper-wrapper">
							<image :src="item" mode="widthFix" class="is-response" lazy-load="true" :data-index="index" @tap="previewPhoto"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<view
				style="background: #333333;padding: 8px;display: flex;font-size: 14px;font-weight: bold"
				v-if="goods && !relation_id && isEnable != '否'"
				@tap="goPublisher"
			>
				<image src="../../static/detail/2x.png" style="width: 40upx;height: 35upx;display: block;margin-top: 10upx;margin-right: 17upx;" mode=""></image>
				<view style="color: #FCDFB8;width: 74%;line-height: 60upx">成为会员最高可返现金￥{{ shengji }}元</view>
				<view style="width: 24%;text-align: center;font-size: 28upx;margin-top:4upx" class="b-btn">
					立即加入
					<text class="cuIcon cuIcon-right" style="background-color: #FFE9C6;width: 40upx;height: 40upx;border-radius: 50%;color:#000000;margin-left: 6upx;"></text>
				</view>
			</view>
			<view
				style="background: #333333;padding: 8px;display: flex;font-size: 14px;font-weight: bold"
				v-if="goods && relation_id && grade !== '0.7' && isEnable != '否'"
				@tap="shengJiMethod"
			>	
				<image src="../../static/detail/2x.png" style="width: 40upx;height: 35upx;display: block;margin-top: 10upx;margin-right: 17upx;" mode=""></image>
				<view style="color: #FCDFB8;width: 74%;line-height: 60upx;font-size: 28upx">预估返￥{{ money }}元,升级最高返￥{{ shengji }}元</view>
				<view style="width: 24%;text-align: center;font-size: 28upx;margin-top:4upx" class="b-btn">
					立即升级
					<text class="cuIcon cuIcon-right" style="background-color: #FFE9C6;width: 40upx;height: 40upx;border-radius: 50%;color:#000000;margin-left: 6upx;"></text>
				</view>
			</view>
			<view style="background: #333333;padding: 16upx;display: flex;font-size: 28upx;font-weight: bold" v-if="goods && grade === '0.7' && isEnable != '否'">
				<image src="../../static/detail/2x.png" style="width: 40upx;height: 35upx;display: block;margin-top: 10upx;margin-right: 17upx;" mode=""></image>
				<view style="color: #FCDFB8;width: 74%">已成为高级会员,预估返现￥ {{ money }}元</view>
			</view>
			<view class="goods_info" style="padding-top: 6px;padding-bottom: 16upx">
				<view class="coupon-price s-row">
					<view class="price" style="width: 70%">
						<text style="font-size: 24upx;margin-left: 4upx;">券后价</text>
						<text style="font-size: 34upx">￥</text>
						<text style="font-weight: 700;">{{ goods.itemendprice }}</text>
						<text style="font-size: 24upx;color: grey;text-decoration:line-through;margin-left: 8px">￥{{ goods.itemprice }}</text>
					</view>
					<!-- <view class="volume" style="padding-top: 14rpx;font-size: 14px;width: 30%">{{ goods.itemsale }}人付款</view> -->
				</view>
				<view style="padding: 16upx 16upx 16upx 16upx;display: flex;">
					<view style="width:90%;">
						<text
							v-if="goods.shoptype == 'B'"
							style="color: #FFFFFF;background: #E10A07;font-size: 24upx;padding-left: 12upx;padding-right: 12upx;border-radius: 16upx;margin-right: 8upx;padding-top: 4upx;padding-bottom: 4upx;"
						>
							<text>天猫</text>
						</text>
						<text
							v-if="goods.shoptype != 'B'"
							style="color: #FFFFFF;background: #E10A07;font-size: 24upx;padding-left: 12upx;padding-right: 12upx;border-radius: 16upx;margin-right: 8upx;padding-top: 4upx;padding-bottom: 4upx;"
						>
							<text>淘宝</text>
						</text>

						<text style="font-weight: bold;font-size: 32upx;">
							<text @longpress="copyTitle">{{ goods.itemtitle }}</text>
						</text>
					</view>
					<view style="width: 120upx;height:48upx; text-align: center;line-height: 48upx; background-color: #ebebeb;border-radius:24upx 0upx 0upx 24upx;">
						<text @click="showModal()">
							<text class="cuIcon cuIcon-share"></text>
							<text>分享</text>
						</text>
					</view>
				</view>
				<view style="width:100%;height: 98upx;background-color:#F2F2F2;">
					<view v-if="goods.shopname" style="float: right;height: 68upx;width:100%;background-color:#FFFFFF;float: right; line-height: 68upx;margin-top: 16upx;margin-bottom:16upx;display:  flex;">
						<view style="margin-right:60upx ;margin-left: 20upx;">店铺</view>
						<image style="height: 40upx;width:40upx;margin-top: 6px;margin-right: 4upx;" src="../../static/img/dianpu.png"></image>
						<view style="font-weight: bold;">{{ goods.shopname }}</view>
					</view>
				</view>
				<view style="width: 100%;padding:30upx">
					<view class="goods-info-title" style="color:#333333;width: 20%;text-align: center;float:left;">必买理由</view>
					<view class="volume" style="font-size: 28upx;float: right;color:#333333;"><text style="color:#E20C0A;font-weight: bold;">{{ goods.itemsale }}人付款</text></view>
					<view class="coupon-price s-row"></view>
					
					<view class="goods_reco" style="display: flex;margin-top: 20upx;background-color: #F2F2F2;width: 96%;margin:20upx auto 0;position: relative;border-radius: 8upx;">
						<image src="../../static/detail/559.png" style="width:14upx;height:12upx;display: block;position: absolute;top:-12upx;left:34upx"></image>
						<view class="goods_desc" style="padding-bottom: 16upx;padding-top:20upx;" @click="shareFriend" >
							<text>{{ goods.itemdesc }}</text>
						</view>
					</view> 
				</view>
			</view>
			
			<view class="goods_quan s-row" style="padding-top: 8upx;padding-bottom: 8upx;background-color: #F2F2F2;">
				<view class="row getGoodsLink" @tap="shopCartShare('quan')">
					<view class="is-col-16 money" style="color: #DE2E2D;">
						<view style="font-weight: bold" v-if="goods.couponmoney != 0">
							<text>{{ goods.couponmoney }}</text>
							元优惠券
						</view>
						<view style="font-weight: bold;margin-top: 18upx;color: #DE2E2D;" v-else >优惠券已被抢光</view>
						<view class="date-coupon" style="color: #DE2E2D;" v-if="goods.start_time">使用期限: {{ goods.start_time }} - {{ goods.end_time }}</view>
					</view>
					<!-- <view class="is-col-8 name"> -->
						<!-- <text @tap="shopCartShare('quan')">{{ goods.couponmoney == 0 ? '原价购买' : '立即抢券' }}</text> -->
					<!-- </view> -->
				</view>
				<image lazy-load src="../../static/detail/21.png" mode="widthFix" class="is-response"></image>
			</view>
			
		
					
			
			<!-- 购买按钮 -->
			<view class="goods_shop_cart">
				<view class="cent" style="display: flex">
					<view style="text-align: center;width: 25%;margin-top: 4px;margin-bottom: 4px;display: flex">
						<view style="width: 50%;text-align: center">
							<view class="iconfont icon-shouye" @tap="goBackUp()"></view>
							<view style="font-size: 12px">首页</view>
						</view>
						<view style="width: 50%;text-align: center">
							<view class="iconfont icon-shoucang" :style="collect.isCollect" @tap="clickCollect()"></view>
							<view style="font-size: 12px" :style="collect.isCollect">{{ collect.name }}</view>
						</view>
					</view>
					<view style="width: 75%;display: flex;color: white">
						<view style="border-radius: 32upx;width: 50%;background: #e43939;text-align: center;padding-top:8px;margin: 4px" @tap="shopCartShares('tkl')">{{ buyDes }}</view>
						<view class="getTbk" style="border-radius: 32upx;width: 50%;background:#E41F19; text-align: center;padding-top: 8px;margin: 4px" @tap="shopCartShare('quan')">{{ getQun }}</view>
					</view>
				</view>
			</view>
			<!-- 购买按钮 active-->
			<view v-if="shopCartBg" class="goods_shop_cart_bg" @tap="showShopCartBg('cart')" @touchmove.stop.prevent="moveHandleStop"></view>
			<view class="goods_share" v-bind:class="[shopCartBg ? 'active' : '', '']">
				<view class="cent">
					<!-- #ifndef H5 -->
					<view class="" @tap="shareFc()">
						<text class="iconfont icon-kouling"></text>
						生成海报
					</view>
					<!--#endif-->
					<text class="em"></text>
					<view class="" @tap="shopCartShare('tklbuy')">
						<text class="iconfont icon-tupian"></text>
						素材分享
					</view>
					<view class="" @tap="copyHref">
						<text class="cuIcon cuIcon-copy"></text>
						复制链接
					</view>
					<view @tap="shopCartShares('tkl')" v-if="isWeiXin">
						<text class="cuIcon cuIcon-share"></text>
						发送给朋友
					</view>
				</view>
			</view>

			<view class="navBarButtonBox">
				<!-- 顶部右侧菜单 -->
				<view v-if="navBarButton" class="goods_shop_cart_bg navBarButton" @tap="showShopCartBg('nav')" @touchmove.stop.prevent="moveHandleStop"></view>
				
				<!-- #ifdef H5 -->
				<view style="margin-top: 16upx;" class="h_newlit" v-bind:class="[navBarButton ? 'active' : '', '']">
				
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view style="margin-top: 66upx;" class="h_newlit" v-bind:class="[navBarButton ? 'active' : '', '']">
				
				<!-- #endif -->
					<view class="em">
						<view style="font-size: 28upx" @tap="navBarButtontO('home')">
							<text class="iconfont icon-shouye"></text>
							返回首页
						</view>
						<view style="font-size: 28upx" @tap="navBarButtontO('search')">
							<text class="iconfont icon-sousuo"></text>
							超级搜索
						</view>
						<view style="font-size: 28upx" @tap="navBarButtontO('footer')">
							<text class="iconfont icon-zuji"></text>
							我的足迹
						</view>
						<view style="font-size: 28upx" @tap="navBarButtontO('like')">
							<text class="iconfont icon-shoucang"></text>
							个人中心
						</view>
					</view>
				</view>
			</view>
			<!-- 顶部右侧菜单 -->

			<!-- 淘口令分享 -->
			<simpleModal ref="simpleModalTkl" @maskClose="TklmaskClose">
				<view class="buy-box-title">复制分享文案</view>
				<view class="buy-box-center">
					<view class="code-cent">
						<div class="cente-text">
							<div>
								<view class="textarea">
									{{ goods.itemtitle }}
									<br />
									【在售价】{{ goods.itemprice }}元
									<br />
									【券后价】{{ goods.itemendprice }}元
									<br />
									{{ tkl }}
									<br />
									【必买理由】{{ goods.itemdesc }}
									<br />
								</view>
							</div>
						</div>
						<view class="closeTips">长按上方轮播图片可保存图片素材哦~</view>
					</view>
					<view class="buy-btn-copy" v-bind:class="[copyTklStatus ? 'active' : '', '']" @tap="copyTklWenAns">{{ copyTklStatus ? '已复制到剪切板' : '一键复制' }}</view>
				</view>
			</simpleModal>
			<!-- 淘口令分享 -->

			<!-- 淘口令购买 -->
			<simpleModal ref="simpleModalTklBuy" @maskClose="TklBuymaskClose">
				<view class="buy-box-center">
					<view class="code-cent" style="margin-top: 10px;">
						<div class="cente-text" style="height: auto;">
							<div>
								<view class="textarea" style="height: auto;">复制框内整段文字，打开【手机淘宝APP】即可领券购买。{{ tkl }}</view>
							</div>
						</div>
					</view>
					<button class="buy-btn-copy" v-bind:class="[copyTklStatus ? 'active' : '', '']" @tap="copyTklWenAn">
						{{ copyTklStatus ? ' 复制成功！请打开【手机淘宝】购买' : '一键复制' }}
					</button>
				</view>
			</simpleModal>
			<!-- 淘口令购买 -->
		</view>
		<view class="" v-if="!loadGoods">
			<view class="s-page">
				<view class="is-100vh is-flex is-column is-justify-center is-align-center ">
					<image src="../../static/img/load.gif" style="width:75px;height: 75px;" class="is-response" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<!-- 宝贝详情 -->
		<view class="goods_reco" style="text-align: center;font-size: 36upx;color: #333333;background: white;margin-top:6upx;padding: 20upx;" v-if="goods.images">
			<view class="imglist" >
				<view class="goods-info-title" style="margin-bottom: 10upx;">宝贝详情</view>
				<block v-for="(item, index) in goods.images"><image lazy-load :src="item" mode="widthFix" class="is-response" @longpress="toSave(item)"></image></block>
			</view>
		</view>
		<view id="shareit" v-if="show_share" @tap="closeShare">
			<image class="arrow" src="../../static/img/jiant.png"></image>
			<text id="follow">点击右上角按钮！【发送给朋友】</text>
		</view>
		<view class="content">
			<view class="flex_row_c_c modalView" :class="qrShow ? 'show' : ''" @tap="hideQr()">
				<view class="flex_column">
					<view class="backgroundColor-white padding1vh border_radius_10px"><image :src="poster.finalPath" mode="widthFix" class="posterImage"></image></view>
					<button class="marginTop2vh" type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
				</view>
			</view>
			<view class="hideCanvasView">
				<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{ width: (poster.width || 0) + 'px', height: (poster.height || 0) + 'px' }"></canvas>
			</view>
			<tki-qrcode
				ref="qrcode"
				:val="erweima"
				:size="200"
				background="#fff"
				foreground="#000"
				pdground="#000"
				:onval="true"
				:loadMake="true"
				@result="qrR"
				:show="false"
			></tki-qrcode>
		</view>
		<view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog" v-if="goods && erweimapath && haibaoShow" @tap="hideModal">
				<view class="bg-img">
					<wm-poster
						@success="posterSuccess"
						:imgSrc="goods.itempic"
						:QrSrc="erweimapath"
						:Title="goods.itemtitle"
						:PriceTxt="goods.itemendprice"
						:OriginalTxt="goods.itemprice"
						:LineType="false"
					></wm-poster>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import simpleModal from '../../components/simple-pro/customModal.vue';
import _app from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/app.js';
import getSharePoster from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/QS-SharePoster.js';
import wmPoster from '@/components/wm-poster/wm-poster.vue';
const Alibcsdk = uni.requireNativePlugin('UZK-Alibcsdk');
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
export default {
	data() {
		return {
			modalName: '',
			erweima: '',
			erweimapath: '',
			logo: '../../static/img/mao.png',
			taobao: '../../static/img/taobao.png',
			buyDes: '口令购买',
			collect: {
				name: '收藏',
				isCollect: ''
			},
			show_share: false,
			itemid: '',
			itempic: '',
			itemtitle: '',
			itemendprice: '',
			itemprice: '',
			shengji: '',
			getQun: '立即领券',
			follow: false,
			loadGoods: true,
			showPage: false,
			goods: '',
			taoBaoBuy: true,
			shopCartBg: false,
			scrollTop: false,
			couponlist: [],
			navBarButton: false,
			copyTklStatus: false,
			save: false,
			tkl: '',
			relation_id: null,
			money: 0,
			grade: '',
			isInvitation: 0,
			messageList: [],
			showFollow: false,
			isWeiXin: false,
			footprintKey: 'orange-sqx-footprint',
			collectKey: 'orange-sqx-collect',
			poster: {},
			haibaoImg: null,
			coupon_click_url: '',
			qrShow: false,
			haibaoShow: false,
			isEnable: '否',
			canvasId: 'default_PosterCanvasId'
		};
	},
	components: {
		simpleModal,
		tkiQrcode,
		wmPoster
	},
	onShow: function() {
		this.copyTklStatus = false;
		let relation_id = this.$queue.getData('relation_id');
		if (relation_id) {
			this.relation_id = relation_id;
		}
	},
	onLoad: function(e) {
		//#ifdef APP-PLUS
		Alibcsdk.init(result => {
			console.log(JSON.stringify(result));
		});
		//#endif
		this.$queue.showLoading('加载中...');
		let a = this.$queue.getData('isEnable');
		if (a) {
			this.isEnable = a;
		}
		if (e.itemid) {
			//#ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') !== -1) {
				this.isWeiXin = true;
			}
			if (window.location.href.indexOf('&relation_id=') !== -1) {
				let relation = window.location.href.split('&relation_id=')[1].split('&')[0];
				this.$queue.setData('relation', relation);
			}
			//#endif
			this.itemid = e.itemid;
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						this.isInvitation = res.data.isInvitation;
						this.$queue.setData('isInvitation', res.data.isInvitation);
						this.$queue.setData('relation', res.data.invitation);
						this.$queue.setData('grade', res.data.grade);
						if (res.data.image_url) {
							this.$queue.setData('image_url', res.data.image_url);
						}
						this.$queue.setData('mobile', res.data.phone);
						this.$queue.setData('nickName', res.data.nickName);
						this.$queue.setData('relation_id', res.data.relationId);
						this.$queue.setData('gender', parseInt(res.data.gender));
					}
				});
				this.loadGoodsInfo();
				this.getOrderList();
			} else {
				this.loadGoodsInfo();
			}
		} else {
			uni.navigateBack();
		}
	},
	onPageScroll: function(e) {
		this.scrollTop = e.scrollTop > 200;
	},

	onNavigationBarButtonTap: function() {
		this.navBarButton = !this.navBarButton;
	},
	methods: {
		
		youmi(){
			uni.navigateTo({
				url: '/pages/detail/move?itemid='+this.itemid
			});
		},
		
		init() {
			Alibcsdk.init(result => {});
		},
		getOrderList() {
			//获取用户提现
			this.$Request.getT('/statistics/getOrderList/0/10').then(res => {
				if (res.status == 0 && res.data) {
					let index = 1;
					res.data.content.forEach(d => {
						d.userName = d.userName.substring(0, 1) + '**';
						this.messageList.push(d);
					});
				}
				uni.hideLoading();
			});
		},
		posterSuccess(haibaoImg) {
			this.haibaoImg = haibaoImg;
			this.modalName = 'Image';
		},
		showModal() {
			if (!this.haibaoImg) {
				this.haibaoShow = true;
				this.$queue.showLoading('海报生成中...');
			} else {
				this.modalName = 'Image';
			}
		},
		hideModal() {
			this.modalName = null;
		},
		bijiage() {
			uni.navigateTo({
				url: '../bijia/index?keywords=' + this.goods.itemtitle
			});
		},
		shareFriend() {
			this.$refs.simpleModalTkl.show({
				showConfirmButton: false
			});
		},
		shengJiMethod() {
			uni.navigateTo({
				url: '/pages/member/yao'
			});
		},
		qrR(path) {
			this.erweimapath = path;
			this.$queue.setData('erweima', path);
		},
		/* 预览照片 */
		previewPhoto(e) {
			let index = e.currentTarget.dataset.index;
			let list = this.goods.images.map((item, index) => {
				return item;
			});

			uni.previewImage({
				current: list[index],
				urls: list,
				longPressActions: {
					itemList: ['保存图片'],
					success: function(res) {
						// console.error(res);
						uni.getImageInfo({
							src: list[res.index],
							success: function(image) {
								console.log('图片信息：', JSON.stringify(image));
								uni.saveImageToPhotosAlbum({
									filePath: image.path,
									success: function() {
										uni.showToast({
											title: '图片保存成功',
											icon: 'none',
											duration: 3000
										});
									}
								});
							}
						});
					}
				}
			});
		},
		//初始化加载详情数据
		loadGoodsInfo: function() {
			let that = this;
			uni.showLoading({
				title: '加载中...'
			});
			this.$Request.get('/api/item_detail/apikey/maxd/itemid/' + this.itemid).then(res => {
				if (res.code === 1) {
					if (res.data.taobao_image && res.data.taobao_image.length > 0) {
						let images = res.data.taobao_image.split(',');
						res.data.images = [];
						for (let i = 0; i < images.length; i++) {
							res.data.images.push(images[i]);
						}
					} else {
						res.data.images = [];
						res.data.images.push(res.data.itempic);
					}
					if (res.data.start_time && res.data.end_time) {
						res.data.start_time = this.formatDate(new Date(res.data.start_time * 1000));
						res.data.end_time = this.formatDate(new Date(res.data.end_time * 1000));
					}
					res.data.itemsale = res.data.itemsale > 10000 ? (res.data.itemsale / 10000).toFixed(1) + '万' : res.data.itemsale;
					res.data.itempic = 'https://' + res.data.itempic.split('://')[1];
					that.goods = res.data;
					that.loadGoods = true;
					let grade = this.$queue.getData('grade');
					if (grade) {
						that.money = (res.data.tkmoney * parseFloat(grade)).toFixed(2);
					} else {
						that.money = (res.data.tkmoney * parseFloat(this.$queue.minMoney)).toFixed(2);
					}
					that.shengji = parseFloat(res.data.tkmoney * parseFloat(this.$queue.maxMoney())).toFixed(2);
					that.grade = grade;
					try {
						let isExist = this.$queue.isExist(this.collectKey, res.data.itemid);
						if (isExist === true) {
							this.collect.name = '已收藏';
							this.collect.isCollect = 'color: #E41F19';
						} else {
							this.collect.name = '收藏';
							this.collect.isCollect = false;
						}
						let isExists = this.$queue.isExist(this.footprintKey, res.data.itemid);
						if (isExists === false) {
							this.$queue.insert({
								key: this.footprintKey,
								value: this.goods
							});
						}
						this.itemprice = res.data.itemprice;
						this.itempic = 'https://' + res.data.itempic.split('://')[1];
						this.itemtitle = res.data.itemtitle;
						this.itemendprice = res.data.itemendprice;
						this.$queue.setData('itempic', res.data.itempic);
						this.$queue.setData('itemtitle', res.data.itemtitle);
						this.$queue.setData('itemprice', res.data.itemprice);
						this.$queue.setData('itemendprice', res.data.itemendprice);
						let grade = this.$queue.getData('grade');
						if (this.isEnable != '否') {
							if (grade) {
								if (grade === '0.7') {
									this.buyDes = '返现 ￥' + (this.goods.tkmoney * parseFloat(grade)).toFixed(2);
								} else {
									this.buyDes = '升级返 ￥' + (this.goods.tkmoney * parseFloat(this.$queue.maxMoney())).toFixed(2);
								}
							} else {
								this.buyDes = '返现 ￥' + (this.goods.tkmoney * parseFloat(this.$queue.minMoney())).toFixed(2);
							}
						} else {
							this.buyDes = '分享给好友';
						}
						this.getQun = '领￥' + this.goods.couponmoney + ' 券购买';
						if (res.data.couponmoney == 0) {
							this.getQun = '原价￥' + res.data.itemprice + ' 购买';
						} else {
							this.getQun = '领￥' + res.data.couponmoney + ' 券购买';
						}
						//获取淘口令
						this.loadTkl();
						//#ifdef H5
						let url = encodeURIComponent(window.location.href.split('#')[0]);
						that.$Request.get('/tao/wx/js/sign?url=' + url).then(res => {
							that.$wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: res['appid'], // 必填，公众号的唯一标识
								timestamp: res['timestamp'], // 必填，生成签名的时间戳
								nonceStr: res['noncestr'], // 必填，生成签名的随机串
								signature: res['signature'], // 必填，签名
								jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
							});
							that.$wx.ready(function() {
								//分享到朋友
								that.$wx.onMenuShareAppMessage({
									title: that.goods.itemendprice + '元 ' + that.goods.itemtitle,
									desc: that.goods.itemdesc,
									link: window.location.href.split('#')[0], // 分享链接
									imgUrl: that.goods.images[0], // 分享图标
									type: 'link', // 分享类型,music、video或link，不填默认为link
									success: function() {
										that.show_share = false;
									},
									cancel: function() {
										that.show_share = false;
									}
								});
								that.$wx.onMenuShareTimeline({
									title: that.goods.itemendprice + '元 ' + that.goods.itemtitle,
									link: window.location.href.split('#')[0], // 分享链接
									imgUrl: that.goods.images[0], // 分享图标
									trigger: function(res) {
										that.show_share = false;
									},
									success: function(res) {
										that.show_share = false;
									},
									cancel: function(res) {
										that.show_share = false;
									},
									fail: function(res) {
										that.show_share = false;
									}
								});
							});
						});
						//#endif
					} catch (e) {
						console.log(e);
					}
					
				} else {
					uni.showModal({
						title: '加载失败',
						showCancel: false,
						content: res.msg,
						success(res) {
							if (res.confirm) {
								uni.navigateBack();
							}
						}
					});
				}
				this.showPage = true;
				uni.hideLoading();
			});
			this.$Request.get('/api/get_similar_info/apikey/maxd/itemid/' + this.itemid).then(res => {
				if (res.code === 1) {
					for (let i = 0; i < 6; i++) {
							res.data[i].itemsale = res.data[i].itemsale >= 10000 ? '已售 ' + (res.data[i].itemsale / 10000).toFixed(1) + '万' : '已售 ' + res.data[i].itemsale;
						this.couponlist.push(res.data[i]);
						
					}
				
				}
			});
		},
		
		goWeb(url) {
			uni.navigateTo({
				url: '/pages/member/webview?url=' + url
			});
		},

		goPublisher() {
			let token = this.$queue.getData('token');
			let userId = this.$queue.getData('userId');
			if (token) {
				uni.navigateTo({
					url: '/pages/member/publisher?uid=' + userId + '&token=' + token
				});
			} else {
				this.loginS();
			}
		},

		/**
		 * 保存图片
		 * @param url
		 */
		toSave(url) {
			//#ifndef H5
			uni.getImageInfo({
				src: url,
				success: function(image) {
					console.log('图片信息：', JSON.stringify(image));
					uni.saveImageToPhotosAlbum({
						filePath: image.path,
						success: function() {
							console.log('save success');
							uni.showToast({
								title: '图片保存成功',
								icon: 'none',
								duration: 3000
							});
						}
					});
				}
			});

			//#endif
		},
		/**
		 * 返回
		 */
		goBackUp() {
			// uni.navigateBack();
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		/**
		 * 复制链接
		 */
		copyHref() {
			//#ifdef H5
			uni.setClipboardData({
				data: window.location.href,
				success: r => {
					this.$queue.showToast('复制成功');
				}
			});
			//#endif
			//#ifndef H5
			let relation_id = this.$queue.getData('relation_id');
			if (relation_id) {
				uni.setClipboardData({
					data: this.$queue.publicYuMing() + '/pages/detail/goodsinfo?itemid=' + this.itemid + '&relation_id=' + relation_id,
					success: r => {
						this.$queue.showToast('复制成功');
					}
				});
			} else {
				uni.setClipboardData({
					data: this.$queue.publicYuMing() + '/pages/detail/goodsinfo?itemid=' + this.itemid,
					success: r => {
						this.$queue.showToast('复制成功');
					}
				});
			}
			//#endif
		},
		closeShare() {
			this.show_share = false;
		},
		clickCollect() {
			//收藏
			let isExist = this.$queue.isExist(this.collectKey, this.goods.itemid);
			if (isExist) {
				let items = [];
				items.push(this.goods.itemid);
				this.$queue.removeItem(this.collectKey, items);
				this.collect.name = '收藏';
				this.collect.isCollect = '';
			} else {
				this.$queue.insert({
					key: this.collectKey,
					value: this.goods
				});
				this.collect.name = '已收藏';
				this.collect.isCollect = 'color: #FC3F78';
			}
		},
		//获取优惠券
		getQuan: function() {
			uni.showLoading({
				title: '领券中...'
			});
			let that = this;
			this.$Request
				.post('/api/ratesurl', {
					itemid: this.itemid,
					tb_name: this.$queue.getTaoBaoName(),
					pid: this.$queue.getTaoBaoPid(),
					apikey: this.$queue.getTaoBaoKey()
				})
				.then(res => {
					if (res.code === 1) {
						let coupon_click_url = res.data.coupon_click_url;
						let relation_id = that.$queue.getData('relation_id');
						let relation = that.$queue.getData('relation');
						//if (relation_id || relation) {
						if (relation) {
							coupon_click_url = res.data.coupon_click_url + '&relationId=' + relation;
						}
						if (relation_id) {
							coupon_click_url = res.data.coupon_click_url + '&relationId=' + relation_id;
						}
						//#ifdef APP-PLUS
						var hasTaobao = plus.runtime.isApplicationExist({pname:'com.taobao.taobao',action:'taobao://'});  
						if(hasTaobao){
							Alibcsdk.openurl(
								{
									url: coupon_click_url,
									pid: this.$queue.getTaoBaoPid(),
									adzoneid: this.$queue.getTaoBaoPid().split('_')[3],
									appkey: this.$queue.getTaoBaoAppid(),
									linkkey: 'taobao',
									nativeFailedMode: 'download'
								},
								result => {}
							);
							
						}else{
							uni.navigateTo({
								url: '/pages/member/webview?url=' + coupon_click_url
							});
						}
						
						uni.hideLoading();
						// uni.showToast({
						// 	title: '正在获取优惠券请稍后...',
						// 	mask: false,
						// 	duration: 1500,
						// 	icon: 'none'
						// });
						// if (plus.os.name == 'Android') {
						// 	plus.runtime.openURL(
						// 		coupon_click_url,
						// 		function(res) {
						// 			that.shopCartShare('tttt');
						// 			uni.hideLoading();
						// 		},
						// 		'com.taobao.taobao'
						// 	);
						// } else {
						// 	coupon_click_url = coupon_click_url.split('//')[1];
						// 	plus.runtime.openURL(
						// 		'taobao://' + coupon_click_url,
						// 		function(res) {
						// 			that.shopCartShare('tttt');
						// 			uni.hideLoading();
						// 		},
						// 		'taobao://'
						// 	);
						// }
						//#endif
						//#ifndef APP-PLUS
						that.shopCartShare('tttt');
						//#endif
						// } else {
						//     this.loginS();
						// }
						that.coupon_click_url = coupon_click_url;
					}
				});
		},
		/**
		 *获取佣金结算
		 * @param type
		 */
		getTkl: function(type) {
			let that = this;
			let relation_id = that.$queue.getData('relation_id');
			if (this.tkl) {
				if (type === 'tkl' && type !== 'tklbuy') {
					this.$refs.simpleModalTkl.show({
						showConfirmButton: false
					});
				} else if (type === 'tttt') {
					this.$refs.simpleModalTklBuy.show({
						showConfirmButton: false
					});
				} else if (type === 'copy') {
					that.copyTkl();
				} else if (type === 'save') {
					//that.copyTkl();
				} else if (relation_id) {
					this.$refs.simpleModalTkl.show({
						showConfirmButton: false
					});
				} else {
					this.$refs.simpleModalTklBuy.show({
						showConfirmButton: false
					});
				}
				uni.hideLoading();
			} else {
				uni.showLoading({
					title: '加载中...'
				});
				this.$Request
					.post('/api/ratesurl', {
						itemid: this.itemid,
						tb_name: this.$queue.getTaoBaoName(),
						pid: this.$queue.getTaoBaoPid(),
						apikey: this.$queue.getTaoBaoKey()
					})
					.then(res => {
						if (res.code === 1) {
							let relation = that.$queue.getData('relation');
							//#ifdef H5
							if (window.location.href.indexOf('&relation_id=') !== -1) {
								relation = window.location.href.split('&relation_id=')[1].split('&')[0];
								that.$queue.setData('relation', relation);
							}
							//#endif
							let coupon_click_url;
							if (relation_id || relation) {
								if (relation) {
									coupon_click_url = res.data.coupon_click_url + '&relationId=' + relation;
								}
								if (relation_id) {
									coupon_click_url = res.data.coupon_click_url + '&relationId=' + relation_id;
								}
							} else {
								coupon_click_url = res.data.coupon_click_url;
							}
							this.$Request
								.postF('/tao/taobao/tbwd', {
									appKey: this.$queue.getTaoBaoAppid(),
									appSecret: this.$queue.getTaoBaoSecret(),
									logo: this.goods.itempic,
									text: this.goods.itemtitle,
									url: coupon_click_url
								})
								.then(res => {
									if (res && res.tbk_tpwd_create_response.data.model) {
										if (type === 'tkl' && type !== 'tklbuy') {
											this.$refs.simpleModalTkl.show({
												showConfirmButton: false
											});
										} else if (type === 'tttt') {
											this.$refs.simpleModalTklBuy.show({
												showConfirmButton: false
											});
										} else if (type === 'copy') {
											that.copyTkl();
										} else if (type === 'save') {
											//that.copyTkl();
										} else if (relation_id) {
											this.$refs.simpleModalTkl.show({
												showConfirmButton: false
											});
										} else {
											this.$refs.simpleModalTklBuy.show({
												showConfirmButton: false
											});
										}
									} else {
										uni.showToast({
											title: '请关注微信公众号【小券侠】领取优惠券',
											mask: false,
											duration: 1500,
											icon: 'none'
										});
									}
									uni.hideLoading();
								})
								.catch(res => {
									uni.hideLoading();
									uni.showToast({
										title: '请关注微信公众号【小券侠】领取优惠券',
										mask: false,
										duration: 1500,
										icon: 'none'
									});
								});
						} else {
							uni.hideLoading();
						}
					});
			}
		},

		formatDate: function(now) {
			const year = now.getFullYear();
			const month = now.getMonth() + 1;
			const date = now.getDate();
			return year + '-' + month + '-' + date;
		},
		loadTkl() {
			let that = this;
			//好单库高佣金请求
			this.$Request
				.post('/api/ratesurl', {
					itemid: this.itemid,
					tb_name: this.$queue.getTaoBaoName(),
					pid: this.$queue.getTaoBaoPid(),
					apikey: this.$queue.getTaoBaoKey()
				})
				.then(res => {
					if (res.code === 1) {
						let relation_id = that.$queue.getData('relation_id');
						let relation = that.$queue.getData('relation');
						//#ifdef H5
						if (window.location.href.indexOf('&relation_id=') !== -1) {
							relation = window.location.href.split('&relation_id=')[1].split('&')[0];
							that.$queue.setData('relation', relation);
						}
						//#endif
						let coupon_click_url;
						if (relation_id || relation) {
							if (relation) {
								coupon_click_url = res.data.coupon_click_url + '&relationId=' + relation;
							}
							if (relation_id) {
								coupon_click_url = res.data.coupon_click_url + '&relationId=' + relation_id;
							}
						} else {
							coupon_click_url = res.data.coupon_click_url + '&relationId=' + this.$queue.getInvitation();
						}
						this.coupon_click_url = coupon_click_url;
						this.$Request
							.postF('/tao/taobao/tbwd', {
								appKey: this.$queue.getTaoBaoAppid(),
								appSecret: this.$queue.getTaoBaoSecret(),
								logo: this.goods.itempic,
								text: this.goods.itemtitle,
								url: coupon_click_url
							})
							.then(res => {
								if (res && res.tbk_tpwd_create_response.data.model) {
									this.tkl = res.tbk_tpwd_create_response.data.model;
									// this.tkl = res.tbk_tpwd_create_response.data.model;
									this.erweima = '复制这段内容(' + res.tbk_tpwd_create_response.data.password_simple + ')\n打开【手淘】领券';
								}
							});
					}
				});
		},
		copyTkl: function() {
			uni.setClipboardData({
				data: this.tkl,
				success: r => {
					uni.showToast({
						title: '复制成功',
						duration: 1500
					});
				}
			});
		},
		haibao: function() {
			uni.navigateTo({
				url: '/pages/detail/share'
			});
		},
		moveHandleStop: function() {
			console.log('111');
		},
		showShopCartBg: function(type) {
			if (type === 'cart') {
				this.shopCartBg = !this.shopCartBg;
			}
			if (type === 'nav') {
				this.navBarButton = !this.navBarButton;
			}
		},
		topScrollTap: function() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		navBarButtontO: function(type) {
			if (type === 'search') {
				uni.switchTab({
					url: '/pages/homeSearch/index'
				});
			} else if (type === 'like') {
				uni.switchTab({
					url: '/pages/member/user'
				});
			} else if (type === 'footer') {
				uni.navigateTo({
					url: '/pages/footer/index'
				});
			} else if (type === 'home') {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},

		shopCartShare: function(type) {
			if (type === 'tkl') {
				this.copyTklStatus = false;
				this.getTkl(type);
			} else if (type === 'tklbuy') {
				// let relation_id = this.$queue.getData("relation_id");
				// if (relation_id) {
				//     // // 淘口令购买
				//     this.copyTklStatus = false;
				//     this.getTkl(type);
				// } else {
				//     if (this.isInvitation == 0) {
				//         this.$refs.simpleModalTkl.show({
				//             showConfirmButton: false,
				//         });
				//     } else {
				//         this.$queue.setData("href", '/pages/detail/goodsinfo?itemid=' + this.itemid);
				//         let token = this.$queue.getData("token");
				//         let userId = this.$queue.getData("userId");
				//         if (token) {
				//             uni.navigateTo({
				//                 url: '/pages/member/publisher?uid=' + userId + '&token=' + token
				//             });
				//         } else {
				//             this.loginS();
				//         }
				//     }
				//
				// }
				// // 淘口令购买
				this.copyTklStatus = false;
				this.getTkl(type);
			} else if (type === 'showPic') {
				let relation_id = this.$queue.getData('relation_id');
				if (relation_id) {
					this.shopCartBg = true;
				} else {
					if (this.isInvitation == 0) {
						this.shopCartBg = true;
					} else {
						this.$queue.setData('href', '/pages/detail/goodsinfo?itemid=' + this.itemid);
						let token = this.$queue.getData('token');
						let userId = this.$queue.getData('userId');
						if (token) {
							uni.navigateTo({
								url: '/pages/member/publisher?uid=' + userId + '&token=' + token
							});
						} else {
							this.loginS();
						}
					}
				}
			} else if (type === 'quan') {
				// let relation = this.$queue.getData("relation");
				// let userId = this.$queue.getData("userId");
				// if (relation || userId) {
				//
				// } else {
				//     this.loginS();
				// }
				this.getQuan();
			} else {
				this.copyTklStatus = false;
				this.getTkl(type);
			}
		},

		loginS() {
			//#ifdef H5
			this.$queue.setData('href', '/pages/detail/goodsinfo?itemid=' + this.itemid);
			uni.navigateTo({
				url: '/pages/member/register'
			});
			//#endif
			//#ifndef H5
			this.$queue.setData('href', '/pages/detail/goodsinfo?itemid=' + this.itemid);
			uni.navigateTo({
				url: '/pages/public/login'
			});
			//#endif
		},
		shopCartShares: function(type) {
			//#ifdef H5
			if (type === 'tkl') {
				let relation_id = this.$queue.getData('relation_id');
				if (this.isEnable != '否') {
					if (relation_id) {
						if (this.$queue.getData('grade') == '0.7') {
							this.copyTklStatus = false;
							this.getTkl(type);
						} else {
							this.shengJiMethod();
						}
					} else {
						let token = this.$queue.getData('token');
						let userId = this.$queue.getData('userId');
						if (token) {
							uni.navigateTo({
								url: '/pages/member/publisher?uid=' + userId + '&token=' + token
							});
						} else {
							this.loginS();
						}
					}
				} else {
					this.copyTklStatus = false;
					this.getTkl(type);
				}
			} else if (type === 'tklbuy') {
				// // 淘口令购买
				this.copyTklStatus = false;
				this.getTkl(type);
			} else if (type === 'quan') {
				this.getQuan();
			}
			//#endif
			//#ifndef H5
			// tkl = 淘口令  picture = 图片
			if (type === 'tkl') {
				let relation_id = this.$queue.getData('relation_id');
				if (relation_id) {
					// // 淘口令购买
					this.copyTklStatus = false;
					this.getTkl(type);
				} else {
					let token = this.$queue.getData('token');
					let userId = this.$queue.getData('userId');
					if (token) {
						uni.navigateTo({
							url: '/pages/member/publisher?uid=' + userId + '&token=' + token
						});
					} else {
						this.loginS();
					}
				}
			} else if (type === 'tklbuy') {
				// // 淘口令购买
				this.copyTklStatus = false;
				this.getTkl(type);
			} else if (type === 'quan') {
				this.getQuan();
			}
			//#endif
		},
		TklmaskClose: function(e) {
			this.$refs.simpleModalTkl.hide();
			this.copyTklStatus = false;
		},
		copyTklWenAn: function() {
			uni.setClipboardData({
				data: this.tkl,
				success: r => {
					this.copyTklStatus = true;
				}
			});
		},
		copyTitle: function() {
			uni.setClipboardData({
				data: this.goods.title,
				success: r => {
					this.$queue.showToast('复制成功');
				}
			});
		},
		copyTklWenAns: function() {
			let relation_id = this.$queue.getData('relation_id');
			//#ifdef H5
			uni.setClipboardData({
				data:
					this.goods.itemtitle +
					'\n【在售价】' +
					this.goods.itemprice +
					'元\n【券后价】' +
					this.goods.itemendprice +
					'元\n【必买理由】\n' +
					this.goods.itemdesc +
					'+\n$' +
					this.tkl,
				success: r => {
					this.copyTklStatus = true;
				}
			});

			//#endif
			//#ifndef H5
			uni.setClipboardData({
				data:
					this.goods.itemtitle +
					'\n【在售价】' +
					this.goods.itemprice +
					'元\n【券后价】' +
					this.goods.itemendprice +
					'元\n【必买理由】\n' +
					this.goods.itemdesc +
					'+\n$' +
					this.tkl
					,
				success: r => {
					this.copyTklStatus = true;
				}
			});
			//#endif
		},
		TklBuymaskClose: function() {
			this.$refs.simpleModalTklBuy.hide();
			this.copyTklStatus = false;
		},
		async shareFc() {
			if (!this.goods.itempic_copy) {
				_app.showToast('当前商品不支持海报生成');
				return;
			}
			try {
				if (!this.poster.finalPath) {
					const d = await getSharePoster({
						type: 'testShareType',
						backgroundImage: this.goods.itempic,
						posterCanvasId: this.canvasId,
						qrCodeArray: ({ bgObj, type, bgScale }) => {
							let relation_id = this.$queue.getData('relation_id');
							if (relation_id) {
								return [
									{
										text: this.$queue.publicYuMing() + '/pages/detail/goodsinfo?itemid=' + this.itemid + '&relation_id=' + relation_id,
										size: bgObj.width * 0.2,
										dx: bgObj.width * 0.05,
										dy: bgObj.height - bgObj.width * 0.25
									}
								];
							} else {
								return [
									{
										text: this.$queue.publicYuMing() + '/pages/detail/goodsinfo?itemid=' + this.itemid,
										size: bgObj.width * 0.2,
										dx: bgObj.width * 0.05,
										dy: bgObj.height - bgObj.width * 0.25
									}
								];
							}
						},
						textArray: ({ bgObj, type, bgScale }) => {
							const fontSize = bgObj.width * 0.05;
							const fontSize2 = bgObj.width * 0.08;
							const widths = bgObj.width * 0.25;
							const fontSize1 = bgObj.width * 0.04;
							const lineHeight = bgObj.height * 0.04;
							return [
								{
									fontStyle: 'italic',
									fontWeight: 'bold',
									text: '【小券侠】券后价',
									size: fontSize,
									color: 'red',
									alpha: '1',
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										_app.log('index页面的text的infocallback ，textlength:' + textLength);
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight * 3.5
										};
									}
								},
								{
									fontWeight: 'bold',
									text: '长按识别二维码领券',
									size: fontSize1,
									color: 'white',
									alpha: 1,
									textAlign: 'right',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										return {
											dx: bgObj.width * 0.37,
											dy: bgObj.height - bgObj.width * 0.02
										};
									}
								},
								{
									text: this.goods.itemendprice + ' 元',
									size: fontSize2,
									fontWeight: 'bold',
									color: 'red',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									infoCallBack(textLength) {
										return {
											dx: bgObj.width - textLength - fontSize,
											dy: bgObj.height - lineHeight * 1.5
										};
									}
								}
							];
						},
						setCanvasWH: ({ bgObj, type, bgScale }) => {
							// 为动态设置画布宽高的方法，
							this.poster = bgObj;
						},
						setDraw: ({ Context, bgObj, type, bgScale }) => {
							Context.setFillStyle('black');
							Context.setGlobalAlpha(0.5);
							Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
						}
					});
					console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath);
					this.poster.finalPath = d.poster.tempFilePath;
				}
				this.qrShow = true;
			} catch (e) {
				_app.hideLoading();
				_app.showToast(JSON.stringify(e));
				console.log(JSON.stringify(e));
			}
		},
		saveImage() {
			// #ifndef H5
			uni.saveImageToPhotosAlbum({
				filePath: this.poster.finalPath,
				success(res) {
					_app.showToast('保存成功');
				}
			});
			// #endif
			// #ifdef H5
			_app.showToast('请长按上方图片保存');
			// #endif
		},
		share() {
			// #ifdef APP-PLUS
			_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
			// #endif

			// #ifndef APP-PLUS
			_app.showToast('请长按图片保存后自行分享');
			// #endif
		},
		hideQr() {
			this.qrShow = false;
		}
	}
};
</script>

<style scoped>
@import '../../static/css/index.css';

page {
	background: #f8f8f8;
}

.swiper-container {
	min-height: 100vw;
}

.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999 upx;
	left: -99999 upx;
	z-index: -99999;
}

.flex_row_c_c {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.modalView {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	outline: 0;
	transform: scale(3);
	perspective: 2500 upx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out;
	pointer-events: none;
	backface-visibility: hidden;
	z-index: 999;
}

.modalView.show {
	opacity: 1;
	transform: scale(1);
	pointer-events: auto;
}

.flex_column {
	display: flex;
	flex-direction: column;
}

.backgroundColor-white {
	background-color: white;
}

.border_radius_10px {
	border-radius: 10px;
}

.padding1vh {
	padding: 1vh;
}

.posterImage {
	width: 60vw;
}

.flex_row {
	display: flex;
	flex-direction: row;
}

.marginTop2vh {
	margin-top: 2vh;
}

.shareInfos {
	color: #fc3f78;
}

.shareInfo::after {
	border: none;
}

button {
	font-size: 14px;
}

#shareit {
	-webkit-user-select: none;
	position: fixed;
	width: 100%;
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

.b-btn {
	right: 10px;
	top: 16px;
	width: 80px;
	text-align: center;
	font-size: 14px;
	padding: 4px 1px 4px 6px;
	color: #FCDFB8;
	z-index: 1;
}

#follow {
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	text-decoration: none;
	font-size: 18px;
	color: white;
	float: left;
	margin-top: 160px;
}

#follow1 {
	width: 100%;
	height: 50px;
	line-height: 50px;
	text-align: center;
	text-decoration: none;
	font-size: 18px;
	color: white;
	float: left;
	margin-top: 170px;
}

button::after {
	border: none;
}

.swiper-wrapper {
	width: 100%;
}
</style>
