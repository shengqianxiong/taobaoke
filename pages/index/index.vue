<template>
	<view class="index-content" style="background: white">
		<view class="top-bckground">
			<!-- 搜索板块 -->
			<view class="index-header" style="top: 0;">
				<!-- #ifndef H5 -->
				<view class="icon_header" style="padding-top: 50upx;">
					<!--#endif-->
					<!-- #ifdef H5 -->
					<view class="icon_header">
						<!--#endif-->
						<view class="icon-gender">
							<image :src="imageUrl" class="img-gender" @click="toMessage"></image>
						</view>
						<view class="index-search" style="margin-right: 120upx;margin-left: 140upx;" @tap="toSearchIndex">
							<view class="icon_search" style="text-align: left">
								<text class="cuIcon cuIcon-search" style="margin-right: 12upx"></text>
								<text>输入关键字或粘贴宝贝标题</text>
							</view>

						</view>
						<!-- #ifndef H5 -->
						<view class="icon_suji" @tap="toZujiIndex" style="margin-right: 20upx;margin-top: 48upx">
							<text class="iconfont icon-zuji" style="color:#dcdcdc;font-size: 44upx"></text>
						</view>
						<view class="icon_suji" @tap="toZujiIndex" style="margin-right: 20upx;margin-top: 48upx">
							<text class="iconfont icon-zuji" style="color:#dcdcdc;font-size: 44upx"></text>
						</view>
						<!--#endif-->
						<!-- #ifdef H5 -->
						<view class="icon_suji" @tap="toZujiIndex" style="margin-right: 20upx;margin-top: 10upx">
							<text class="iconfont icon-zuji" style="color:#dcdcdc;font-size: 44upx"></text>
						</view>
						<!--#endif-->
					</view>
				</view>

				<view>
					<!-- #ifdef H5 -->
					<scroll-view scroll-x class="nav selectTop" scroll-with-animation :scroll-left="scrollLeft">
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<scroll-view scroll-x class="nav selectTop1" scroll-with-animation :scroll-left="scrollLeft">
							<!-- #endif -->
							<view class="cu-item" :class="index1 == TabCur ? 'text-green cur' : ''" v-for="(item, index1) in category" :key="index1"
							 @tap="tabSelect" :data-id="index1">
								<text :style="
								index1 == TabCur
									? 'background: #FFFFFF;padding: 4upx 20upx 4upx 20upx;border-radius: 32upx;margin-right: -20upx'
									: 'background: transparent;color: #FFFFFF;margin-right: -20upx'
							">
									{{ item.name }}
								</text>
							</view>
						</scroll-view>
				</view>
			</view>
			<!-- banner板块 -->
			<view v-if="TabCur==0">
				<!-- #ifndef H5 -->
				<view class="swiper" style="padding-top: 220upx;background: white">
					<!--#endif-->
					<!-- #ifdef H5 -->

					<view class="swiper" style="padding-top: 180upx;background: white">
						<!--#endif-->
						<swiper class="swiper-container" :autoplay="true" :interval="4000" :circular="true" :indicator-dots="true"
						 indicator-active-color="#e10a07" indicator-color="#cccccc" style="height: 240upx;padding: 18upx 16upx 8upx 16upx">
							<block v-for="(item, index3) in banners" :key="index3">
								<swiper-item class="swiper-wrapper" @tap="toGoodsInfo(item.url)">
									<image lazy-load='true' fade-show='true' :src="item.image_url" style="width: 100%;height: 220upx;border-radius: 32upx;"
									 mode="scaleToFill"></image>
								</swiper-item>
							</block>
						</swiper>
					</view>
					<!-- banner结束 -->
					<!--首页菜单开始-->
					<view style="margin: 16upx;" v-if="navlist.length>0">
						<view class="index-navlist s-grids" style="padding-bottom: 20upx;background: white">
							<view class="is-col-1-5 is-center" style="margin-top: 16upx;" v-for="(nav, index5) in navlist" :key="index5"
							 @tap="toNavList(nav.url, nav.title)">
								<view class="has-pdtb-5">
									<image lazy-load='true' fade-show='true' :src="nav.image_url" mode="widthFix" style="height: 90upx;width: 90upx"></image>
									<view class="is-size-14">{{ nav.title }}</view>
								</view>
							</view>
						</view>
					</view>
					<!--首页菜单结束-->
					<view style="text-align: center;height: 100px;width:96%;background-image: url(https://www.gomyorder.cn/go.png);background-repeat: round;margin: 8px"
					 @tap="goPublisherInfo()" v-if="!relation_id&&isEnable!='否'&&navlist.length>0">
						<!-- <view style="position: absolute;margin-top: 90upx;margin-left: 80upx;font-size: 38upx;color: white;font-weight: bold">加入会员拿返现哦</view> -->
						<!-- <view style="position: absolute;margin-top: 150upx;margin-left: 284upx;font-size: 24upx;color: white;font-weight: bold">戳我了解会员特权</view> -->
					</view>
					<!--首页公告开始-->
					<swiper v-if="messageList.length > 0" :autoplay="true" :vertical="true" :interval="4000" :circular="true"
					 :indicator-dots="false" style="height: 60upx;margin-left: 32upx;margin-right: 32upx;line-height: 60upx;">
						<block v-for="(item1, index10) in messageList" :key="index10">
							<swiper-item style="height: 60upx;" @click="goWebView(item1)">
								<view>
									<image src="../../static/img/laba.png" style="width: 40upx;height: 40upx;"></image>
									<text>{{ item1.title }}</text>
								</view>
							</swiper-item>
						</block>
					</swiper>

					<!--首页公告结束-->
					<view style="display: flex;padding: 16upx;" v-if="navlist3.length>0">
						<view style="width:50%;height:310upx;border-radius:12upx;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;" @tap="toNavList(navlist3[0].url)">
							<view style="margin:7px;color: #F15B6C;font-size: 32upx;font-weight: bold">
								{{navlist3[0].title.split('-')[0]}}
								<text style="font-size: 28upx;margin-left: 12upx;background:rgba(241,91,108,1);border-radius:8upx;color: white;padding: 2px">{{navlist3[0].title.split('-')[1]}}</text>
							</view>
							<view style="color:rgba(127,134,153,1);font-weight: 400;margin-left: 16upx">{{navlist3[0].title.split('-')[2]}}</view>
							<view style="height: 200upx;text-align: center;width: 100%;padding-top: 32upx;">
								<image :src="navlist3[0].image_url" style="height: 120upx;width: 180upx"></image>
							</view>
						</view>
						<view style="width: 50%;padding-left: 10upx;height:310upx;border-radius:12upx;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;"
						 @tap="toNavList(navlist3[1].url)">
							<view style="height: 150upx;margin-bottom: 10px;border-bottom: 8upx solid #f8f8f8;" @tap="toNavList(navlist3[1].url)">
								<view style="float:left;margin-top:26upx;padding-left: 16upx;">
									<view style="color:#333333;font-size:32upx;font-weight: bold">{{navlist3[1].title.split('-')[0]}}</view>
									<view style="color:#FF7527;font-size:24upx;margin-top: 8upx;">{{navlist3[1].title.split('-')[2]}}</view>
								</view>
								<image :src="navlist3[1].image_url" mode="" style="width: 70px;height: 60px;margin-top:6px;float: right;"></image>
							</view>
							<view style="" @tap="toNavList(navlist3[5].url)">
								<view style="float:left;margin-top:26upx;padding-left: 16upx;">
									<view style="color:#333333;font-size:32upx;font-weight: bold">{{navlist3[5].title.split('-')[0]}}</view>
									<view style="color:#3CB8FF;font-size:24upx;margin-top: 8upx;">{{navlist3[5].title.split('-')[1]}}</view>
								</view>
								<image :src="navlist3[5].image_url" mode="" style="width: 70px;height: 60px;margin-top:6px;float: right;"></image>
							</view>
						</view>
					</view>
					<view v-if="navlist3.length>0" style="margin-left: 16upx;margin-right: 16upx;display: flex;height: 250upx;justify-content: space-around;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;">
						<view style="width: 32%;padding-left: 32upx;border-radius: 6px;" @tap="toNavList(navlist3[2].url)">
							<view class="nablist-1">{{navlist3[2].title.split('-')[0]}}</view>
							<view style="color:#666666;font-size:24upx;">{{navlist3[2].title.split('-')[1]}}</view>
							<view style="height: 100px;text-align: center;width: 100%;padding-left: 3px;">
								<image :src="navlist3[2].image_url" style="height: 120upx;width: 160upx;margin-top: 20upx;display: block;"></image>
							</view>
						</view>
						<view style="width: 32%;padding-left: 20upx;border-radius: 6px;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;"
						 @tap="toNavList(navlist3[4].url)">
							<view class="nablist-1">{{navlist3[4].title.split('-')[0]}}</view>
							<view style="color:#666666;font-size:24upx;">{{navlist3[4].title.split('-')[1]}} </view>
							<view style="height: 100px;text-align: center;width: 100%;padding-left: 3px;">
								<image :src="navlist3[4].image_url" style="height: 120upx;width: 180upx;margin-top: 20upx;display: block;"></image>
							</view>
						</view>
						<view style="width: 32%;padding-left: 20upx;border-radius: 6px;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;"
						 @tap="toNavList(navlist3[3].url)">
							<view class="nablist-1">{{navlist3[3].title.split('-')[0]}}</view>
							<view style="color:#666666;font-size:24upx;">{{navlist3[3].title.split('-')[1]}}</view>
							<view style="height: 100px;text-align: center;width: 100%;padding-left: 3px;">
								<image :src="navlist3[3].image_url" style="height: 120upx;width: 160upx;margin-top: 20upx;display: block;"></image>
							</view>
						</view>
					</view>
					<view style="margin: 22upx 32upx 16upx 32upx;" v-if="juhuasuanlist.length>0&&wanghong">
						<view @tap="toNavList('/pages/cate/index', '网红抖货')" style="display: flex;">
							<view style="color:#333333;width: 86%; font-size: 32upx;font-weight: bold;">
								网红抖货
							</view>
							<view class="fr-jutext" style="width: 86%;text-align: right;color: #999999;">查看更多 ></view>
						</view>
					</view>
					<view style="display: flex;justify-content: space-around;margin-left: 16upx;margin-right: 16upx;" v-if="juhuasuanlist.length>0&&wanghong">
						<view>
							<view v-for="(g, index7) in juhuasuanlist" :key="index7" class="box-float">
								<image lazy-load='true' fade-show='true' style="border-radius: 16upx;width: 214upx;height: 214upx;margin-right: 20upx;"
								 class="image" :src="g.itempic + '_310x310.jpg'" @click="toGoodsInfos(g.itemid)" mode="scaleToFill"></image>
								<view style="margin-bottom: 7px;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;white-space: nowrap;display: block;">{{g.itemshorttitle}}</view>
								<view>
									<view style="font-size: 30upx;font-weight: bold;position: absolute; float:left; color: #FD3B2C;"><text style="font-size: 30upx;">￥</text>{{ g.itemendprice }}</view>
									<view style="font-size: 24upx;position: absolute; right: 16upx;top:280upx;color:#FFFFFF;background: #FD3B2C;padding-left: 12upx;padding-right: 12upx;border-radius: 16upx;">券后价</view>
								</view>

							</view>
						</view>

					</view>

					<view class="index-coupon has-pd-10" style="background: ghostwhite;" v-if="haowuList.length > 0">
						<view style="text-align: center;margin-top: 60upx;margin-bottom: 16upx;padding-top: 16upx;">
							<text class="news_title">一</text>
							<text style="font-size: 32upx;color: #F15B6C;">精选好物</text>
							<text class="news_title">一</text>
						</view>
						<view class="goods-list" v-if="haowuList.length > 0">
							<orange-goods-list v-for="(item, index18) in haowuList" :tkmoney="item.tkmoney" :tkmoneys="item.tkmoneys"
							 :itemid="item.itemid" :shopname='item.shopname' :isEnable="isEnable" :is-invitation="isInvitation" :logo="logo"
							 :itempic="item.itempic + '_310x310.jpg'" :itemtitle="item.itemtitle" :itemprice="' ¥' + item.itemprice"
							 :itemsale="item.itemsale" :itemendprice="item.itemendprice" :couponmoney="item.couponmoney"></orange-goods-list>
						</view>
					</view>

					<!-- 领券 -->
					<view class="index-coupon has-pd-10" style="background: ghostwhite;" v-if="category[0].orderList.length > 0">
						<view style="text-align: center;margin-top: 60upx;margin-bottom: 16upx;padding-top: 32upx;">
							<text class="news_title">一</text>
							<text style="font-size: 32upx;color: #F15B6C;">为你推荐</text>
							<text class="news_title">一</text>
						</view>
						<view class="goods-list" v-if="category[0].orderList.length > 0">
							<orange-goods-list v-for="(item, index8) in category[0].orderList" :tkmoney="item.tkmoney" :tkmoneys="item.tkmoneys"
							 :itemid="item.itemid" :shopname='item.shopname' :isEnable="isEnable" :is-invitation="isInvitation" :logo="logo"
							 :itempic="item.itempic + '_310x310.jpg'" :itemtitle="item.itemtitle" :itemprice="' ¥' + item.itemprice"
							 :itemsale="item.itemsale" :itemendprice="item.itemendprice" :couponmoney="item.couponmoney"></orange-goods-list>
						</view>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
				<view class="index-coupon has-pd-10" style="margin:200upx 8upx 180upx 8upx ;background: #FFFFFF" v-if="TabCur!=0">

					<!-- #endif -->
					<!-- #ifndef APP-PLUS -->
					<view class="index-coupon has-pd-10" style="margin:180upx 8upx 180upx 8upx ;background: #FFFFFF" v-if="TabCur!=0">

						<!-- #endif -->
						<view class="category" v-if="category[TabCur].banner.length > 0">
							<view class="list">
								<view class="box" v-for="(item, i) in category[TabCur].banner" :key="item.son_name" @tap="toCategory(item.son_name)">
									<image lazy-load='true' fade-show='true' :src="item.imgurl"></image>
									<view class="text">{{ item.son_name }}</view>
								</view>
							</view>
						</view>
						<view class="goods-list" v-if="category[TabCur].orderList.length > 0">
							<orange-goods-card-home v-for="(item, index9) in category[TabCur].orderList"
							 :logo="logo" :isEnable="isEnable" :tkmoney="item.tkmoney" :tkmoneys="item.tkmoneys" :itemid="item.itemid"
							 :itempic="item.itempic ? item.itempic + '_310x310.jpg' : 'https://www.gomyorder.cn/logo.png'" :itemtitle="item.itemtitle"
							 :is-invitation="isInvitation" :shopname='item.shopname' :itemprice="'¥' + item.itemprice" :itemsale="item.itemsale"
							 :itemendprice="'' + item.itemendprice" :couponmoney="item.couponmoney"></orange-goods-card-home>
						</view>
					</view>

					<!-- 加载更多提示 -->
					<!-- #ifdef H5 -->
					<view class="s-col is-col-24">
						<load-more :loadingType="category[TabCur].loadingType" :contentText="contentText"></load-more>
					</view>
					<!-- #endif -->

					<!-- 加载更多提示 -->
					<empty v-if="category[TabCur].orderList.length === 0 && category[TabCur].loadingType == 0" des="暂无数据"></empty>


					<!-- <simpleModal ref="simpleModalTkl" @maskClose="TklmaskCloses">
						<view class="buy-box-title">选择您的身份</view>
						<view class="buy-box-center">
							<view class="code-cent" style="padding: 30px 80px 40px 80px">
								<view style="margin-bottom: 16px" @tap="choseGender(1)">
									<image src="../../static/img/home/boy.png" style="width: 50px;height: 50px"></image>
									<view style="color: #0e80d2">我是帅哥</view>
								</view>
								<view @tap="choseGender(2)">
									<image src="../../static/img/home/girl.png" style="width: 50px;height: 50px"></image>
									<view style="color: pink">我是美女</view>
								</view>
							</view>
						</view>
					</simpleModal> -->


					<!-- 淘口令分享 -->
					<simpleModal ref="simpleModalTkls" @maskClose="TklmaskClose">
						<view style="width: 600upx;border-radius: 16upx;">
							<view class="buy-box-title" style="font-weight: bold;color: #e10a07;">全网超级搜</view>
							<view class="buy-box-center">
								<view class="code-cent">
									<view style="padding: 8px;font-size: 32upx">{{ copyTklStatus }}</view>
								</view>
								<view class="buy-btn-copy" @click="goSearch()">立即搜索</view>
							</view>
						</view>
					</simpleModal>
					<!-- <view id="shareit" v-if="show_share">
						<image @click="goHongbao" class="arrow" src="../../static/go.png"></image>
						<view style="border-radius: 100px;color: #FFFFFF;font-size: 38upx;" @click="closeShare">X</view>
					</view> -->
					<view class="xinrenhongbao">
						<image @click="goHongbao" v-if="show_share" src="https://www.gomyorder.cn/fubiao.png" style="width: 160upx;height: 160upx;position: fixed;bottom: 160upx;right: 32upx;z-index: 99;"></image>

					</view>
					<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop != 0 ? 'active' : '', '']" style="bottom: 56px;"><text
						 class="iconfont icon-shangla"></text></view>


					<tki-qrcode ref="qrcode" :val="erweima" :size="600" background="#fff" foreground="#000" pdground="#000" :onval="true"
					 :loadMake="true" @result="qrR" :show="false"></tki-qrcode>

				</view>
			</view>

</template>

<script>
	import simpleModal from '@/components/simple-pro/customModal.vue';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';

	export default {
		components: {
			simpleModal,
			tkiQrcode
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		data() {
			return {
				modalName: '',
				topH: 1000,
				logo: '../../static/img/mao.png',
				TabCur: 0,
				scrollLeft: 0,
				messageList: [],
				imageUrl: '../../static/img/common/logo.jpg',
				showEmpty: false,
				banner: [{
					id: '1'
				}],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				category: [{
						name: '热门',
						positon: 0,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: []
					},
					{
						name: '美食',
						positon: 11,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '干果',
								imgurl: 'http://img.haodanku.com/31695fbcfec8af7274b493698d5c1f5a-600'
							},
							{
								son_name: '干货',
								imgurl: 'http://img.haodanku.com/40693f1b39155f40843b4023d938a812-600'
							},
							{
								son_name: '速食',
								imgurl: 'http://img.haodanku.com/78ca01c1baddaed135f179cbf495d780-600'
							},
							{
								son_name: '零食',
								imgurl: 'http://img.haodanku.com/3bba49572000849457705fb6e7b25756-600'
							},
							{
								son_name: '饮料',
								imgurl: 'http://img.haodanku.com/e9ced92e2c3c5a9125bde206632923f8-600'
							},
							{
								son_name: '酒水',
								imgurl: 'http://img.haodanku.com/6b2095fa96eb10aef4cc968253a77e62-600'
							},
							{
								son_name: '土鸡蛋',
								imgurl: 'http://img.haodanku.com/011b54caa88d4ebf172312ad228e234c-600'
							},
							{
								son_name: '大米',
								imgurl: 'http://img.haodanku.com/be27573ccf52be1f42238f29167516da-600'
							},
							{
								son_name: '大闸蟹',
								imgurl: 'http://img.haodanku.com/ee9e645ee82d6ef1bad1a9c676122375-600'
							},
							{
								son_name: '新鲜水果',
								imgurl: 'http://img.haodanku.com/2ae6a731a71e6021383e808db628915d-600'
							}
						]
					},
					{
						name: '居家',
						positon: 10,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '卫生巾',
								imgurl: 'http://img.haodanku.com/d4ad5258247d5cfcd397fed061c55332-600'
							},
							{
								son_name: '卷纸',
								imgurl: 'http://img.haodanku.com/1fa08dd194ae423de72af366e6fa319c-600'
							},

							{
								son_name: '抽纸',
								imgurl: 'http://img.haodanku.com/8b15fc81e69e7140bfdd6af51890a5f7-600'
							},
							{
								son_name: '洗手液',
								imgurl: 'http://img.haodanku.com/afa011f3b8e0757b5b9d67af74062fe6-600'
							},
							{
								son_name: '洗衣液',
								imgurl: 'http://img.haodanku.com/e068719387ea102d937ec3724598675c-600'
							},

							{
								son_name: '牙膏',
								imgurl: 'http://img.haodanku.com/9d36678d53c9c83a1a6a7cd1e9637b65-600'
							},
							{
								son_name: '沐浴露',
								imgurl: 'http://img.haodanku.com/14bfdb8fc38493aa985d310d390aad19-600'
							},
							{
								son_name: '洗发水',
								imgurl: 'http://img.haodanku.com/162652a65fc931cf7aba34436a5882cd-600'
							},
							{
								son_name: '清洁剂',
								imgurl: 'http://img.haodanku.com/cc34507e016b01cc6005d028b55aa1cc-600'
							},
							{
								son_name: '牙刷',
								imgurl: 'http://img.haodanku.com/529884a59eb3a2ed7cad27cc215f042c-600'
							}
						]
					},
					{
						name: '美妆',
						positon: 4,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '卸妆',
								imgurl: 'http://img.haodanku.com/11f4c31e57040ca6578e395764685f9d-600'
							},
							{
								son_name: '唇膏',
								imgurl: 'http://img.haodanku.com/73dce1ba7e1e6c2f087a82e6e2daaf0f-600'
							},

							{
								son_name: '洗面奶',
								imgurl: 'http://img.haodanku.com/0390ae3565930d395244524603d38605-600'
							},

							{
								son_name: '眼线',
								imgurl: 'http://img.haodanku.com/4216c4cdc29f8e9bce9722bf2329f4d4-600'
							},
							{
								son_name: '眼霜',
								imgurl: 'http://img.haodanku.com/9bcc8b7e61d0958a4cf24efa92d8d7d9-600'
							},
							{
								son_name: '睫毛膏',
								imgurl: 'http://img.haodanku.com/917ca505a2916d4308258c1df00aa6bc-600'
							},

							{
								son_name: '纤体',
								imgurl: 'http://img.haodanku.com/900cbfe080fcea90a276c9b0367252ef-600'
							},

							{
								son_name: '腮红',
								imgurl: 'http://img.haodanku.com/1305d219f6095577b2d4930531a1b3ee-600'
							},

							{
								son_name: '面膜',
								imgurl: 'http://img.haodanku.com/f9ddb9d89e9bfd8312056b02c4081bcd-600'
							},
							{
								son_name: '面霜',
								imgurl: 'http://img.haodanku.com/e57cb97f45eacb673b10d4179ce54079-600'
							}
						]
					},
					{
						name: '女装',
						positon: 1,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '妈妈装',
								imgurl: 'http://img.haodanku.com/cf445d5d9ddad49a38c0e542be22b565-600'
							},

							{
								son_name: 'T恤',
								imgurl: 'http://img.haodanku.com/397fc31d9f3abdef5177ab1ec82a254c-600'
							},
							{
								son_name: '一字肩',
								imgurl: 'http://img.haodanku.com/f4ca5e271d74fd5c29d051c7b1106f04-600'
							},
							{
								son_name: '卫衣',
								imgurl: 'http://img.haodanku.com/2329f94b4030aa27e819e159d64969c4-600'
							},
							{
								son_name: '夹克',
								imgurl: 'http://img.haodanku.com/ab499244178c525025d8a3e1ff4ed36e-600'
							},
							{
								son_name: '棉服',
								imgurl: 'http://img.haodanku.com/6d3898d409060a49ebc6a80c150d15b2-600'
							},
							{
								son_name: '毛呢',
								imgurl: 'http://img.haodanku.com/5b397df30169b79af64c569606b7e0af-600'
							},
							{
								son_name: '牛仔',
								imgurl: 'http://img.haodanku.com/38a001153e2f30933f3cae16f2b2a171-600'
							},
							{
								son_name: '皮衣',
								imgurl: 'http://img.haodanku.com/78c7fcecea8eaf4b329002b3308b3545-600'
							},
							{
								son_name: '短外套',
								imgurl: 'http://img.haodanku.com/26a08a44cce036a5cf49a3322e4cbf37-600'
							}
						]
					},

					{
						name: '母婴',
						positon: 9,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '奶嘴',
								imgurl: 'http://img.haodanku.com/dc498440b8169d4f411a2d303ce85c7d-600'
							},
							{
								son_name: '奶瓶',
								imgurl: 'http://img.haodanku.com/b9d99fb2308fec3063560d1a442c51e6-600'
							},
							{
								son_name: '婴儿床',
								imgurl: 'http://img.haodanku.com/8d25d45a30d633f31af4e6f8ec9e3eb7-600'
							},
							{
								son_name: '婴儿抱被',
								imgurl: 'http://img.haodanku.com/e87f2636c6c571487bfe3e1b87c19f24-600'
							},
							{
								son_name: '学步车',
								imgurl: 'http://img.haodanku.com/4bc090e096ed0d3fc550d373b257ce83-600'
							},
							{
								son_name: '推车',
								imgurl: 'http://img.haodanku.com/192ba1c1901d19388a80ed93fe0dd532-600'
							},
							{
								son_name: '新生儿',
								imgurl: 'http://img.haodanku.com/8eb521c44d4cc5c2c606101321f6878f-600'
							},
							{
								son_name: '睡袋',
								imgurl: 'http://img.haodanku.com/2afc4fdac09e372274248fc6f421b8ef-600'
							},
							{
								son_name: '纸尿布',
								imgurl: 'http://img.haodanku.com/0d2df54a221fca7d23c888464edf17e3-600'
							},
							{
								son_name: '连体睡衣',
								imgurl: 'http://img.haodanku.com/e1fd4104171d365a3e76ada535e55c0b-600'
							}
						]
					},

					{
						name: '男装',
						positon: 2,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '马甲',
								imgurl: 'http://img.haodanku.com/325254ca7f6e1f03c438d818cb4c67cb-600'
							},
							{
								son_name: '呢大衣',
								imgurl: 'http://img.haodanku.com/f3c0fd52abf5945b5d253a64f8fce62d-600'
							},
							{
								son_name: '夹克',
								imgurl: 'http://img.haodanku.com/250eefdd7acef0934e9f0fafffa75c88-600'
							},
							{
								son_name: '棉衣',
								imgurl: 'http://img.haodanku.com/6b5cd4e0f1c6f346b552651209cf78a3-600'
							},
							{
								son_name: '棒球服',
								imgurl: 'http://img.haodanku.com/2c296a0d7e6600da4b5f572c1c1878e4-600'
							},
							{
								son_name: '牛仔外套',
								imgurl: 'http://img.haodanku.com/d55f8511d3916346c8a808dbe5b0868a-600'
							},
							{
								son_name: '皮衣',
								imgurl: 'http://img.haodanku.com/14f79fee301aa6bb5a69318d9d95a2ef-600'
							},
							{
								son_name: '羽绒服',
								imgurl: 'http://img.haodanku.com/51ee457f0c7b8c2ddb6f4e5e9dd9818e-600'
							},
							{
								son_name: '西装',
								imgurl: 'http://img.haodanku.com/09290b9079002c5d957b245bf8d5dc22-600'
							},
							{
								son_name: '风衣',
								imgurl: 'http://img.haodanku.com/16a6f06b799c96f30289e124ee084f9a-600'
							}
						]
					},

					{
						name: '鞋品',
						positon: 6,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '帆布鞋',
								imgurl: 'http://img.haodanku.com/b1ec5218812aac9249071123cc9ff37d-600'
							},
							{
								son_name: '板鞋',
								imgurl: 'http://img.haodanku.com/c0ea8e1a9a0e9c486c2f3b571b495395-600'
							},
							{
								son_name: '网布鞋',
								imgurl: 'http://img.haodanku.com/acaf3517b2b374e568e512ea2c1c0334-600'
							},
							{
								son_name: '豆豆鞋',
								imgurl: 'http://img.haodanku.com/6f74d2cd0dc9de9ea1b746ab78ba6b66-600'
							},
							{
								son_name: '男运动鞋',
								imgurl: 'http://img.haodanku.com/7b3bc2187dfeaf64dbb61ad6d3eb358f-600'
							},
							{
								son_name: '女运动鞋',
								imgurl: 'http://img.haodanku.com/9449c2e63a06f058a48f788c82591d00-600'
							},
							{
								son_name: '高跟鞋',
								imgurl: 'http://img.haodanku.com/0ee8f1f3483c3faa69f5ef1f129cfac5-600'
							},
							{
								son_name: '中跟鞋',
								imgurl: 'http://img.haodanku.com/5a52d7f0375aadd03558aab5a2489a81-600'
							},
							{
								son_name: '乐福鞋',
								imgurl: 'http://img.haodanku.com/8ebb992fc125df908039e1468b634c1f-600'
							},
							{
								son_name: '低跟鞋',
								imgurl: 'http://img.haodanku.com/19c7f3e00da194115690d71b5b0f6691-600'
							}
						]
					},
					{
						name: '箱包',
						positon: 7,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '单肩包',
								imgurl: 'http://img.haodanku.com/4acda5f2e1ba8067820eb6a0b1517a48-600'
							},

							{
								son_name: '小方包',
								imgurl: 'http://img.haodanku.com/d1f9ffe6b63d0100c573312981c293e9-600'
							},
							{
								son_name: '斜挎包',
								imgurl: 'http://img.haodanku.com/197be2a76a74db7a9d3fee2e513b1cf0-600'
							},
							{
								son_name: '水桶包',
								imgurl: 'http://img.haodanku.com/02f6b9bcb87488b3b2f538ed3bd901d9-600'
							},
							{
								son_name: '手提包',
								imgurl: 'http://img.haodanku.com/5e2d18ca3f9f2863b7e02f88e1cd5895-600'
							},
							{
								son_name: '旅行箱',
								imgurl: 'http://img.haodanku.com/7e4ae55cefff14d819c8619566b85700-600'
							},
							{
								son_name: '钱包',
								imgurl: 'http://img.haodanku.com/fa179896a4e7ba6864c3a2b5c208c647-600'
							},
							{
								son_name: '双肩包',
								imgurl: 'http://img.haodanku.com/a410a8f08c112bb99e3f61ba46ee0b7a-600'
							},
							{
								son_name: '波士顿包',
								imgurl: 'http://img.haodanku.com/2db6a9dfe0323ab1aba9eb4d0c92b9f6-600'
							},
							{
								son_name: '贝壳包',
								imgurl: 'http://img.haodanku.com/d5c5a8c3afa64c58527a68cbd46c2234-600'
							}
						]
					},
					{
						name: '配饰',
						positon: 5,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '贝雷帽',
								imgurl: 'http://img.haodanku.com/6d5eebc640a964a4b55fb03046a2f8fb-600'
							},
							{
								son_name: '针织帽',
								imgurl: 'http://img.haodanku.com/0b376d73ab661bbab0c83d8aefc50aca-600'
							},
							{
								son_name: '鸭舌帽',
								imgurl: 'http://img.haodanku.com/1de98e064ef1e8dd92d4e95eda311105-600'
							},
							{
								son_name: '真皮腰带',
								imgurl: 'http://img.haodanku.com/cd8ad3794ee3fbb1a8c8bce8f88f7ef1-600'
							},
							{
								son_name: '腰带',
								imgurl: 'http://img.haodanku.com/7586c7f14be6334d52ea6f862048ce3a-600'
							},
							{
								son_name: '触屏手套',
								imgurl: 'http://img.haodanku.com/a69d879b523d78d0203fe4879109486f-600'
							},
							{
								son_name: '雨伞',
								imgurl: 'http://img.haodanku.com/eb9cb749ec8237a84227614d356bfd0f-600'
							},
							{
								son_name: '真丝围巾',
								imgurl: 'http://img.haodanku.com/c371383e6e2f9b234f30d32c0a1295ef-600'
							},
							{
								son_name: '羊毛围巾',
								imgurl: 'http://img.haodanku.com/2959aea355069c58f07a5bd4312c0750-600'
							},
							{
								son_name: '羊绒围巾',
								imgurl: 'http://img.haodanku.com/9870a6e83a4e97ce9f8b8d2bf2fe057e-600'
							}
						]
					},
					{
						name: '儿童',
						positon: 8,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '描红本',
								imgurl: 'http://img.haodanku.com/89a1df77f661111da350ffb31b965683-600'
							},
							{
								son_name: '早教机',
								imgurl: 'http://img.haodanku.com/2ac050e8b1a787b9a1296a51edfa182a-600'
							},
							{
								son_name: '自行车',
								imgurl: 'http://img.haodanku.com/54baf388a5aacb482bffba872a8393e0-600'
							},
							{
								son_name: '学习用品',
								imgurl: 'http://img.haodanku.com/e1cdde128eaff4b464b02a6280128ab9-600'
							},
							{
								son_name: '户外玩具',
								imgurl: 'http://img.haodanku.com/4b7d8b14035d7c42417d36037827df23-600'
							},
							{
								son_name: '积木',
								imgurl: 'http://img.haodanku.com/dfb898577d5b402ee78efdf77fc753b9-600'
							},
							{
								son_name: '亲子玩具',
								imgurl: 'http://img.haodanku.com/5a1f75dd01301762813b4c946f72c0bb-600'
							},
							{
								son_name: '玩具',
								imgurl: 'http://img.haodanku.com/89ac36736a405eac40bd34efc223edba-600'
							},
							{
								son_name: '亲子装',
								imgurl: 'http://img.haodanku.com/e892274edc543dbd443f1e1ca011e8a0-600'
							},
							{
								son_name: '女童外套',
								imgurl: 'http://img.haodanku.com/3c4dbd196a8c86fd7aa7c0db67398427-600'
							}
						]
					},



					{
						name: '数码',
						positon: 12,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '保护壳',
								imgurl: 'http://img.haodanku.com/778ee5974fe396bc6fb46241462aebd1-600'
							},
							{
								son_name: '耳机',
								imgurl: 'http://img.haodanku.com/f34fd15e7a7775051a2c0f613eaa14f1-600'
							},
							{
								son_name: '苹果配件',
								imgurl: 'http://img.haodanku.com/c5f7f3b8324bbc7c9394bdd2af6e7651-600'
							},
							{
								son_name: '鼠标键盘',
								imgurl: 'http://img.haodanku.com/71e1a923a83a1a6ca44695c71b46bf7c-600'
							},
							{
								son_name: '无人机',
								imgurl: 'http://img.haodanku.com/c372feef0f96f90efe5d1c55cacf79c3-600'
							},
							{
								son_name: '电脑主机',
								imgurl: 'http://img.haodanku.com/d596eac2d096816c10881b97fbac02a9-600'
							},
							{
								son_name: '音响',
								imgurl: 'http://img.haodanku.com/81f08ba219e31194566d65363173fdcf-600'
							}
						]
					},
					{
						name: '家电',
						positon: 13,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: [{
								son_name: '加湿器',
								imgurl: 'http://img.haodanku.com/086080993e964a15594f81c94d509eb8-600'
							},
							{
								son_name: '取暖器',
								imgurl: 'http://img.haodanku.com/f5662ec4c72c3c7f81f8837f51255e4b-600'
							},
							{
								son_name: '吸尘器',
								imgurl: 'http://img.haodanku.com/ec822582bdb343a4fcf4aa7241e76f21-600'
							},
							{
								son_name: '扫地机器人',
								imgurl: 'http://img.haodanku.com/951a3f7ccf7390bbb332c697415bec48-600'
							},
							{
								son_name: '榨汁机',
								imgurl: 'http://img.haodanku.com/7878d1994d35916456406cff96bd333d-600'
							},
							{
								son_name: '烤箱',
								imgurl: 'http://img.haodanku.com/b1ee29313a733d944f80453a2cefa832-600'
							},
							{
								son_name: '电热毯',
								imgurl: 'http://img.haodanku.com/afa97d55c0121f8bcee9dc15bf99dd72-600'
							},
							{
								son_name: '电饭锅',
								imgurl: 'http://img.haodanku.com/529b946479dd79d3f86dd5d161095fad-600'
							},
							{
								son_name: '空气净化器',
								imgurl: 'http://img.haodanku.com/24fc6a453206afb6a7c26d52dc64a50c-600'
							},
							{
								son_name: '豆浆机',
								imgurl: 'http://img.haodanku.com/88e089532fc4b4c184ca1d596d0e3ab4-600'
							}
						]
					},

					{
						name: '内衣',
						positon: 3,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: []
					},
					{
						name: '车品',
						positon: 15,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: []
					},
					{
						name: '文体',
						positon: 16,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: []
					},
					{
						name: '宠物',
						positon: 17,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: []
					},
					{
						name: '其他',
						positon: 14,
						loadingType: 0,
						page: 0,
						orderList: [],
						banner: []
					}
				],
				banners: [{
					image_url: '../../static/banner.jpg',
					url: '/pages/member/news'
				}],
				haowuList: [],
				navlist: [],
				navlists: [{
						title: '天猫优选',
						image_url: '../../static/img/home/tianmaojingxuan.png',
						url: '/pages/index/list?title=天猫优选&type=9',
					},
					{
						title: '拼多多',
						image_url: '../../static/img/home/pinduoduo.png',
						url: '/pages/pdd/index'
					},
					{
						title: '京选好货',
						image_url: '../../static/img/home/jingdong.png',
						url: '/pages/jd/jds'
					},
					{
						title: '热销榜',
						image_url: '../../static/img/home/daequan.png',
						url: '/pages/hot/index'
					},
					{
						title: '聚划算',
						image_url: '../../static/img/home/juhuasuan.png',
						url: '/pages/index/list?title=聚划算&type=4',
					}, {
						title: '30元精选',
						image_url: '../../static/img/home/tianmaochaoshi.png',
						url: '/pages/index/list?title=30元精选&type=3',
					}, {
						title: '母婴精选',
						image_url: '../../static/img/home/gaoyongjingxuan.png',
						url: '/pages/index/tuiguang?cid=9'
					},
					{
						title: '9.9包邮',
						image_url: '../../static/img/home/baoyou.png',
						url: '/pages/index/list?title=9.9包邮&type=2',
					},

					{
						title: '超值大牌',
						image_url: '../../static/img/home/chaozhidapai.png',
						url: '/pages/index/list?title=超值大牌&type=8',
					},

					{
						title: '新人免单',
						image_url: '../../static/img/home/free-order.gif',
						url: '/pages/index/mian'
					},
				],
				juhuasuanlist: [],
				couponlist: [],
				dataList: [],
				page: 1,
				min_id: 1,
				wanghong: false,
				min_ids: 1,
				min_ida: 1,
				erweima: '',
				cat_id: 0,
				navlist3: [],
				gender: 0,
				loadingType: 0,
				index: 0,
				show_share: false,
				genderKey: 'gender',
				copyTklStatus: '',
				isInvitation: 0,
				isEnable: "否",
				relation_id: '',
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			};
		},
		onPullDownRefresh() {
			this.loadBanner();
			this.loadMenuList();
			this.loadMenuList1();
			this.loadMessage();
			this.loadJuhuasuanlist();
			this.loadCouponList();
			// uni.hideLoading()
		},
		onLoad: function() {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			let gender = this.$queue.getData(this.genderKey);
			if (gender) {
				if (gender === 1) {
					this.gender = gender;
				}
				if (gender === 2) {
					this.gender = gender;
				}
			}

			this.loadBanner();
			this.loadMenuList();
			this.loadMenuList1();
			this.loadMessage();
			this.loadJuhuasuanlist();
			this.loadCouponList();
			this.checkNews();
		},
		onReachBottom() {
			this.loadCouponList();
		},
		onShow() {
			if (this.navlist.length == 0) {
				this.loadBanner();
				this.loadMenuList();
				this.loadMenuList1();
				this.loadMessage();
				this.loadJuhuasuanlist();
				this.loadCouponList();

			}
			this.getUserInfo()
		},

		methods: {
			checkNews() {
				this.$Request.getT('/common/type/54').then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value && res.data.value === '是') {
							let userId = this.$queue.getData('userId');

							let relation_id = this.$queue.getData('relation_id');
							if (userId) {
								if (relation_id) {
									this.$Request.getT('/order/isNewsUser/' + userId).then(ress => {
										if (ress.status !== 0) {
											this.show_share = true;
										} else {
											this.show_share = false;
										}
									});
								} else {
									this.show_share = true;
								}
							} else {
								this.show_share = true;
							}
						}
					}
				});
				this.$Request.getT('/common/type/55').then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value && res.data.value === '是') {
							this.wanghong = true;
						}

					}
				});

			},
			goHongbao() {
				// this.show_share=false;
				uni.navigateTo({
					url: "/pages/index/mian"
				})
			},
			closeShare() {
				this.show_share = false;
			},
			hideModal() {
				this.modalName = ''
			},
			showModals() {
				this.modalName = 'RadioModal'
			},
			/**
			 * 首页轮播
			 */
			loadBanner: function() {
				this.$Request.getT('/banner/user/list').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							this.banners = res.data;
						}

					}
				});

			},
			loadMenuList1: function() {
				this.$Request.getT('/activity/state/2').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							this.navlist3 = res.data;
						}
					}
				});
				this.$Request.getT('/commodity/selectCommodityList?page=0&size=100').then(res => {
					if (res.status === 0) {
						this.haowuList = [];
						res.data.content.forEach(d => {
							let grade = this.$queue.getData('grade');
							d.tkmoneys = (d.itemendprice * (d.tkrates * 0.01) * parseFloat(this.$queue.maxMoney())).toFixed(2);
							if (grade) {
								d.tkmoney = (d.itemendprice * (d.tkrates * 0.01) * parseFloat(grade)).toFixed(2);
							} else {
								d.tkmoney = (d.itemendprice * (d.tkrates * 0.01) * parseFloat(this.$queue.minMoney())).toFixed(2);
							}
							d.itemsale = d.itemsale > 10000 ? '月销' + (d.itemsale / 10000).toFixed(1) + '万件' : '月销' + d.itemsale + '件';
							this.haowuList.push(d);


							// this.category[this.TabCur].orderList.push(d);
						});
					}
				});
			},
			loadMenuList: function() {
				this.$Request.getT('/activity/state/1').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							this.navlist = res.data;
							console.log('logo', this.navlist)
						} else {
							this.navlist = this.navlists;
						}
					}
				});
			},

			/**
			 * 网红抖货
			 */
			loadJuhuasuanlist: function() {
				this.$Request.get('/api/get_trill_data/apikey/maxd/min_id/0/back/10/cat_id/0').then(
					res => {
						if (res.code === 1) {
							this.juhuasuanlist = [];
							for (let i = this.index; i < this.index + 3; i++) {

								this.juhuasuanlist.push(res.data[i]);
							}
						}
						uni.stopPullDownRefresh(); // 停止刷新
					});
			},

			/**
			 * @param {Object} type加载
			 */
			loadCouponList: function(type) {
				this.category[this.TabCur].loadingType = 1;
				this.$Request
					.get('/api/column/apikey/maxd/type/9/back/10/min_id/' + this.category[this.TabCur].page + '/sort/9/cid/' + this.category[
						this.TabCur].positon)
					.then(res => {
						this.category[this.TabCur].loadingType = 0;
						if (res.code === 1) {
							this.category[this.TabCur].page = res.min_id;
							res.data.forEach(d => {
								let grade = this.$queue.getData('grade');
								d.tkmoneys = (d.tkmoney * parseFloat(this.$queue.maxMoney())).toFixed(2);
								if (grade) {
									d.tkmoney = (d.tkmoney * parseFloat(grade)).toFixed(2);
								} else {
									d.tkmoney = (d.tkmoney * parseFloat(this.$queue.minMoney())).toFixed(2);
								}
								d.itemsale = d.itemsale > 10000 ? '已售 ' + (d.itemsale / 10000).toFixed(1) + '万件' : '已售 ' + d.itemsale + '件';
								this.category[this.TabCur].orderList.push(d);

								// this.category[this.TabCur].orderList.push(d);
							});
						} else {
							this.category[this.TabCur].loadingType = 2;
						}
						if (type === 'Refresh') {
							uni.stopPullDownRefresh(); // 停止刷新
						}
						uni.hideLoading();
					});
			},


			getUserInfo() {
				let userId = this.$queue.getData('userId');
				if (userId) {
					this.$Request.getT('/user/' + userId).then(res => {
						if (res.status === 0) {
							this.imageUrl = res.data.image_url;
							this.$queue.setData('image_url', res.data.image_url);
							this.$queue.setData('mobile', res.data.phone);
							this.isInvitation = res.data.isInvitation;
							this.topH = 1050;
							if (res.data.relationId) {
								this.relation_id = res.data.relationId;
								this.topH = 850;

							} else {
								this.topH = 1050;
							}
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
			/**
			 * 加载公告
			 */
			loadMessage() {
				this.$Request.getT('/message/page/1/0/5').then(res => {
					if (res.status === 0) {
						this.messageList = res.data.content;
					}
				});
			},

			/**
			 * @param {Object} e tab切换
			 */
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 50;
				let list = this.category[e.currentTarget.dataset.id].orderList;
				if (list.length == 0) {
					this.$queue.showLoading('加载中...')
					this.loadCouponList('Refresh');
				}
				if (e.currentTarget.dataset.id == 0) {
					this.loadBanner();
					this.loadMenuList();
					this.loadMenuList1();
					this.loadMessage();
					this.loadJuhuasuanlist();
					this.loadCouponList();
				}
			},

			qrR(path) {
				this.$queue.setData('erweimas', path);
			},

			toCategory(son_name) {
				uni.navigateTo({
					url: '/pages/categray/search?cid=' + this.category[this.TabCur].positon + '&name=' + son_name
				});
			},

			//app查询
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/search?keywords=' + this.copyTklStatus
				});
				this.$refs.simpleModalTkls.hide();
				this.copyTklStatus = '';
				uni.setClipboardData({
					data: '',
					success: r => {
						uni.showToast({
							icon: 'none',
							title: '搜索中',
							duration: 1500
						});
					}
				});
			},
			// //app查询弹框
			TklmaskClose: function(e) {
				this.$refs.simpleModalTkls.hide();
				this.copyTklStatus = '';
				uni.setClipboardData({
					data: '',
					success: r => {
						uni.showToast({
							icon: 'none',
							title: '已取消',
							duration: 1500
						});
					}
				});
			},
			TklmaskCloses: function(e) {
				this.$refs.simpleModalTkls.hide();
			},
			//获取剪切板
			async getClipboardData() {
				let that = this;
				uni.getClipboardData({
					success: function(res) {
						that.copyTklStatus = res.data;
						if (res.data) {
							if (res.data.indexOf('http') == -1 && res.data.indexOf('&') == -1 && res.data.indexOf('￥') == -1) {
								that.$refs.simpleModalTkls.show({
									showConfirmButton: false
								});
							} else {
								that.$refs.simpleModalTkls.hide();
							}
						} else {
							that.$refs.simpleModalTkls.hide();
						}
					},
					fail: function(res) {}
				});
			},




			/**
			 * 会员授权界面
			 */
			goPublisherInfo() {
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
			 * 登录检测
			 */
			loginS() {
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
			},
			goWebView(item) {
				if (item.type == 'url') {
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/member/ping?url=' + item.url
					});
					//#endif
					//#ifdef H5
					window.location.href = item.url;
					//#endif
				}
			},
			/**
			 * @param {Object} type 身份选择
			 */
			choseGender(type) {
				this.$queue.setData(this.genderKey, type);
				this.gender = type;
				this.page = 1;
				this.min_id = 1;
				if (type === 1) {
					this.TabCur = 6;
					this.cat_id = 2;
				}
				if (type === 2) {
					this.TabCur = 4;
					this.cat_id = 1;
				}
				this.loadCouponList('Refresh');
				this.$refs.simpleModalTkl.hide();
			},
			showGender() {
				this.$refs.simpleModalTkl.show({
					showConfirmButton: false
				});
			},

			/**
			 * 快速置顶
			 */
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},

			/**
			 * @param {Object} url
			 * @param {Object} titles 首页item跳转
			 */
			toNavList: function(url, title) {
				if (url.indexOf('/pages/') !== -1) {
					uni.navigateTo({
						url
					});
				} else {
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/member/webview?url=' + url
					});
					//#endif
					//#ifdef H5
					window.location.href = url;
					//#endif
				}
			},
			toGoodsInfo: function(url) {
				if (url.indexOf('/pages/') !== -1) {
					uni.navigateTo({
						url
					});
				} else {
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/member/webview?url=' + url
					});
					//#endif
					//#ifdef H5
					window.location.href = url;
					//#endif
				}
			},
			toGoodsInfos: function(itemid) {
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
			},
			toSearchIndex: function() {
				uni.navigateTo({
					url: '/pages/homeSearch/index'
				});
			},
			toZujiIndex: function() {
				uni.navigateTo({
					url: '/pages/footer/index'
				});
			},
			toMessage: function() {
				if (token) {
					uni.navigateTo({
						url: '/pages/member/message'
					});
				} else {
					this.loginS();
				}
			}
		},
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';

	.news_title {
		font-weight: bold;
		color: #F15B6C;
		margin-right: 32upx;
		margin-left: 32upx;
		width: 12upx;
	}

	.xinrenhongbao image {
		animation: myfirst 1s infinite;
	}

	@keyframes myfirst {
		0% {
			transform: translate(0px, 0px);
		}

		50% {
			transform: translate(0px, -15px);
		}

		100% {
			transform: translate(0px, 0px);
		}
	}

	.box-float {
		width: 32%;
		float: left;
		position: relative;
		border-radius: 16upx;
		padding: 6upx;
	}

	.img-gender {
		border-radius: 60upx;
		/* #ifndef H5 */
		width: 60upx;
		height: 60upx;
		margin-top: 66upx
			/* #endif */
			/* #ifdef H5 */
			width: 60upx;
		height: 60upx;
		margin-top: 20upx
			/* #endif */


	}

	.top-background {
		background: -webkit-linear-gradient(left, #f15b6c 0, #e10a07 100%);
		background: -o-linear-gradient(left, #f15b6c 0, #e10a07 100%);
		background: -ms-linear-gradient(left, #f15b6c 0, #e10a07 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #f15b6c), to(#e10a07));
		background: -o-linear-gradient(right, #f15b6c 0, #e10a07 100%);
		background: linear-gradient(to left, #f15b6c 0, #e10a07 100%);
	}

	.swiper-item img {
		display: block;
	}

	.title .fr {
		float: right;
		line-height: 50px;
		margin-right: 16px;
		font-size: 10px;
		color: #ccc;
	}

	/*#ifndef APP-PLUS*/
	.scroll_top_act {
		background: white;
		top: 45px;
		position: fixed;
	}

	/*#endif*/
	/*#ifdef APP-PLUS*/
	.scroll_top_act {
		background: white;
		top: 65px;
		position: fixed;
	}

	/*#endif*/

	.banner {
		border-radius: 10px;
		margin: 8px 8px 0 8px;
		overflow: hidden;
		display: flex;
	}

	.banner img {
		width: 100%;
	}

	.banner>.left {
		flex: 4;
		/* margin-right: 10upx; */
		border-right: 2px solid #f2f2f2;
		overflow: hidden;
	}

	.banner>.right {
		flex: 7;
	}

	.right .top {
		width: 100%;
		/* margin-bottom: 7upx; */
		/*border-bottom: 2px solid #f2f2f2;*/
		overflow: hidden;
	}

	.right .bottom {
		display: flex;
		width: 100%;
	}

	.right .bottom .bottom-left {
		flex: 6;
		/* margin-right: 5upx; */
		overflow: hidden;
		border-right: 1px solid #f2f2f2;
	}

	.right .bottom .bottom-right {
		flex: 6;
		/* margin-left: 5upx; */
		/* border-left: 1px solid #f2f2f2; */
		overflow: hidden;
	}

	.marquee-box {
		border-radius: 5px;
		overflow: hidden;
		position: relative;
		background: #fff;
		height: 26px;
		line-height: 26px;
	}

	.marquee-title {
		padding-left: 8px;
		padding-right: 8px;
		position: absolute;
		color: #ff5100;
		top: 0;
		left: 0;
		z-index: 3;
		background: #fff;
		font-size: 14px;
	}

	.marquee {
		padding: 6px 10px;
		color: #000;
		display: inline-block;
		white-space: nowrap;
		animation: 35s wordsLoop linear infinite normal;
		font-size: 14px;
	}

	@keyframes wordsLoop {
		0% {
			transform: translateX(350px);
			-webkit-transform: translateX(350px);
		}

		100% {
			transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
		}
	}

	.selectTop {
		z-index: 100;
		padding-left: 16upx;
		padding-right: 16upx;
		position: fixed;
		top: 90upx;
		background: -webkit-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -o-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -ms-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #e10a07), to(#f15b6c));
		background: -o-linear-gradient(right, #e10a07 0, #f15b6c 100%);
		background: linear-gradient(to left, #e10a07 0, #f15b6c 100%);
	}

	.selectTop1 {
		z-index: 999;
		padding-left: 16upx;
		padding-right: 16upx;
		position: fixed;
		top: 130upx;
		background: -webkit-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -o-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -ms-linear-gradient(left, #e10a07 0, #f15b6c 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #e10a07), to(#f15b6c));
		background: -o-linear-gradient(right, #e10a07 0, #f15b6c 100%);
		background: linear-gradient(to left, #e10a07 0, #f15b6c 100%);
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
		width: 80%;
		height: 420px;
		margin-top: 100px;
	}

	// 新加
	.nablist-1 {
		color: #333333;
		font-size: 32upx;
		font-weight: bold;
		padding-top: 16upx;
	}

	.share_close {
		position: absolute;
		bottom: -0.5rem;
		left: 50%;
		margin-left: -0.3rem;
		width: 0.6rem;
		height: 0.6rem;
		background: url(http://img.haodanku.com/Fo2-nJ_43fsFStbAfqMUEcCFJnJ6);
		background-size: 100% 100%;
		cursor: pointer;
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

	.category {
		padding: 4upx;

		.list {
			margin-top: 20upx;
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 20%;
				margin-bottom: 20upx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;

				image {
					width: 60%;
					height: calc(71.44vw / 3 * 0.6);
				}

				.text {
					margin-top: 5upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
				}
			}
		}
	}

	.swiper-box {
		height: calc(100% - 40px);
	}
</style>
