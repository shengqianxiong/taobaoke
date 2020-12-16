<template>
    <view class="s-page-wrapper">
        <view class="index-goods" v-if="loadGoods">
            <view class="swiper">
                <swiper class="swiper-container" :autoplay="true" :interval="4000" :circular="true"
                        :indicator-dots="true"
                        indicator-active-color="#e10a07" indicator-color="#cccccc">
                    <block v-for="item in goods.images" :key="item">
                        <swiper-item class="swiper-wrapper">
                            <image lazy-load :src="item" mode="widthFix" class="is-response"
                                   @longpress="toSave(item)"></image>
                        </swiper-item>
                    </block>
                </swiper>
            </view>
            <view class="goods_info" style="padding-top: 6px">


                <view style="padding: 8px">
                    <image v-if="goods.shoptype=='B'" style="height: 14px;width:12px;margin-top: 4px;margin-right: 4px"
                           src="../../static/img/mao.png"></image>
                    <image v-else style="height: 14px;width:12px;margin-top: 4px;margin-right: 4px"
                           src="../../static/img/taobao.png"></image>

                    <text style="font-weight: bold"><text v-if="goods.shopname" style="color: #e10a07;font-weight: bold">
                        【{{goods.shopname}}】
                    </text>{{ goods.itemtitle }}</text>

                </view>
                <view class="coupon-price s-row">
                    <view class="price" style="width: 60%">
                        <text style="font-size: 14px"> 券后价
                            <text style="font-size: 12px">￥</text>
                        </text>
                        <text style="font-weight: 700;">0</text>
                        <text style="font-size: 12px;color: grey;text-decoration:line-through;margin-left: 8px">
                            ￥{{goods.itemprice }}
                        </text>
                    </view>
                    <view class="volume" style="padding-top: 14rpx;font-size: 14px;width: 40%">{{ goods.itemsale }}人付款
                    </view>
                </view>
                <view class="coupon-price s-row"></view>
            </view>
            <view>
                <view style="font-weight: bold;background: #FFFFFF;text-align: center;padding: 16px;color: #e10a07;font-size: 20px;">
                    <view>▼</view>
                    新人免单流程
                    <view style="font-size: 14px;margin-top: 8px;color: #FF6600;">
                        注册会员 » 领券下单 » 等待收货 » 返至我的 » 提现
                    </view>
                    <view>▼</view>
                    提现账号设置流程
                    <view style="font-size: 14px;margin-top: 8px;color: #FF6600;">
                        返至我的 » 立即提现 » 提现账号 » 绑定支付宝账号
                    </view>
                </view>
            </view>
           <!-- <view class="goods_quan s-row">
                <view class="row getGoodsLink">
                    <view class="is-col-16 money">
                        <view style="font-weight: bold">
                            <text>{{goods.couponmoney}}</text>
                            元优惠券
                        </view>
                        <view class="date-coupon" v-if="goods.start_time">使用期限: {{goods.start_time}} -
                            {{goods.end_time}}
                        </view>
                    </view>
                    <view class="is-col-8 name">
                        <text @tap="shopCartShare('quan')">立即领券</text>
                    </view>
                </view>
                <image lazy-load src="../../static/img/goods/goods_quan.png" mode="widthFix"
                       class="is-response"></image>
            </view> -->
            <view class="goods_reco" style="margin-top: 10px;display: flex">
                <view class="goods-info-title" style="color: #e10a07;width: 20%;text-align: center">必买理由</view>
                <view class="goods_desc" style="padding-bottom: 8px;padding-top:8px;width: 80%">{{ goods.itemdesc }}
                </view>
            </view>
            <view class="goods_reco" style="margin-top: -100rpx" v-if="goods.images">
                <view class="goods-info-title">宝贝详情</view>
                <view class="imglist">
                    <block v-for="(item,index) in goods.images">
                        <image lazy-load :src="item" mode="widthFix" class="is-response" @longpress="toSave(item)"
                               @click="goWeb(coupon_click_url)"></image>
                    </block>
                </view>
            </view>
            <!-- 购买按钮 -->
            <view class="goods_shop_cart">
                <view class="cent" style="display: flex">
                    <view style="text-align: center;width: 25%;margin-top: 4px;margin-bottom: 4px;display: flex">
                        <view style="width: 50%;text-align: center">
                            <view class="iconfont icon-shouye" @tap="goBackUp()"></view>
                            <view style="font-size: 12px">返回</view>
                        </view>
                        <view style="width: 50%;text-align: center">
                            <view class="iconfont icon-shoucang" :style="collect.isCollect"
                                  @tap="clickCollect()"></view>
                            <view style="font-size: 12px" :style="collect.isCollect">{{collect.name}}</view>
                        </view>
                    </view>

                    <view style="width: 75%;display: flex;color: white">
                        <view class="getTbk"
                              style="width: 100%;background:#F15B6C; text-align: center;padding-top: 12px"
                              @tap="shopCartShare('quan')">免费领取
                        </view>
                    </view>
                </view>

            </view>

            <!-- 购买按钮 active-->
            <view v-if="shopCartBg" class="goods_shop_cart_bg" @tap="showShopCartBg('cart')"
                  @touchmove.stop.prevent="moveHandleStop"></view>
            <view class="goods_share" v-bind:class="[shopCartBg ? 'active' : '','']">
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
                <view v-if="navBarButton" class="goods_shop_cart_bg navBarButton" @tap="showShopCartBg('nav')"
                      @touchmove.stop.prevent="moveHandleStop"></view>
                <view class="h_newlit" v-bind:class="[navBarButton ? 'active' : '','']">
                    <view class="em">
                        <view style="font-size: 14px" @tap="navBarButtontO('home')">
                            <text class="iconfont icon-shouye"></text>
                            返回首页
                        </view>
                        <view style="font-size: 14px" @tap="navBarButtontO('search')">
                            <text class="iconfont icon-sousuo"></text>
                            超级搜索
                        </view>
                        <view style="font-size: 14px" @tap="navBarButtontO('footer')">
                            <text class="iconfont icon-zuji"></text>
                            我的足迹
                        </view>
                        <view style="font-size: 14px" @tap="navBarButtontO('like')">
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
                                <view class="textarea">{{goods.itemtitle}}<br>【在售价】{{goods.itemprice}}元<br>【券后价】{{goods.itemendprice}}元<br>复製此信息进入【手机Tao宝】即可查看并下单{{tkl}}
                                    <br>【必买理由】{{goods.itemdesc}}<br>
                                </view>
                            </div>
                        </div>
                        <view class="closeTips">长按上方轮播图片可保存图片素材哦~</view>
                    </view>
                    <view class="buy-btn-copy" v-bind:class="[copyTklStatus ? 'active' : '','']" @tap="copyTklWenAns">
                        {{copyTklStatus?"已复制到剪切板":"一键复制"}}
                    </view>
                </view>
            </simpleModal>
            <!-- 淘口令分享 -->

            <!-- 淘口令购买 -->
            <simpleModal ref="simpleModalTklBuy" @maskClose="TklBuymaskClose">
                <view class="buy-box-center">
                    <view class="code-cent" style="margin-top: 10px;">
                        <div class="cente-text" style="height: auto;">
                            <div>
                                <view class="textarea" style="height: auto;">复制框内整段文字，打开【手机淘宝APP】即可领券购买。{{tkl}}
                                </view>
                            </div>
                        </div>
                    </view>
                    <button class="buy-btn-copy" v-bind:class="[copyTklStatus ? 'active' : '','']" @tap="copyTklWenAn">
                        {{copyTklStatus?" 复制成功！请打开【手机淘宝】购买":"一键复制"}}
                    </button>
                </view>
            </simpleModal>
            <!-- 淘口令购买 -->
        </view>
        <view class="" v-if="!loadGoods">
            <view class="s-page">
                <view class="is-100vh is-flex is-column is-justify-center is-align-center ">
                    <image src="../../static/img/load.gif" style="width:75px;height: 75px;" class="is-response"
                           mode="widthFix"></image>
                </view>
            </view>
        </view>

        <!-- <view v-if="couponlist.length > 0"
              style="text-align: center;font-size: 18px;color: #e10a07;background: white;margin-top: -60px;padding: 16px">
            为你推荐
        </view>
        <view class="goods-list" style="margin-bottom: 60px" v-if="couponlist.length > 0">
            <orange-goods-card-home v-for="(item,index) in couponlist" :index="index%2" :tkmoney='"￥"+item.tkmoney'
                                    :itemid="item.itemid"
                                    :logo="item.shoptype=='B'?logo:taobao" :is-invitation="isInvitation"
                                    :itempic="item.itempic+'_310x310.jpg'"
                                    :itemtitle="item.itemtitle" :itemprice='"¥"+item.itemprice'
                                    :itemsale='item.itemsale' :itemendprice='""+item.itemendprice'
                                    :couponmoney="item.couponmoney"></orange-goods-card-home>
        </view> -->
        <view id="shareit" v-if="show_share" @tap="closeShare">
            <image class="arrow" src="../../static/img/jiant.png"></image>
            <text id="follow">点击右上角按钮！【发送给朋友】</text>
        </view>


        <view class="content">
            <view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
                <view class="flex_column">
                    <view class="backgroundColor-white padding1vh border_radius_10px">
                        <image :src="poster.finalPath" mode="widthFix" class="posterImage"></image>
                    </view>
                    <button class="marginTop2vh" type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片
                    </button>
                </view>
            </view>
            <view class="hideCanvasView">
                <canvas class="hideCanvas" canvas-id="default_PosterCanvasId"
                        :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
            </view>
        </view>

    </view>
</template>

<script>
    import simpleModal from '../../components/simple-pro/customModal.vue';
    import _app from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/app.js';
    import getSharePoster from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/QS-SharePoster.js';

    // const plug = uni.requireNativePlugin('Html5app-Baichuan');

    export default {
        onShareAppMessage(res) {
            return {
                title: this.goods.itemtitle,
                path: '/pages/detail/goodsinfo?itemid=' + this.itemid
            }
        },
        data() {
            return {
				modalName:"",
                logo: "../../static/img/mao.png",
                taobao: "../../static/img/taobao.png",
                buyDes: "口令购买",
                collect: {
                    name: '收藏',
                    isCollect: "",
                },
                show_share: false,
                itemid: '',
                follow: false,
                loadGoods: true,
                goods: {},
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
                isInvitation: 0,
                showFollow: false,
                isWeiXin: false,
                footprintKey: 'orange-sqx-footprint',
                collectKey: 'orange-sqx-collect',
                poster: {},
                coupon_click_url: "",
                qrShow: false,
                canvasId: 'default_PosterCanvasId'
            };
        },
        components: {
            simpleModal
        },
        onShow: function () {
            this.copyTklStatus = false;
            let relation_id = this.$queue.getData("relation_id");
            if (relation_id) {
                this.relation_id = relation_id;
            }
            if (this.$queue.getData("openid")) {
                this.$Request.get("/tao/wx/follow/" + this.$queue.getData("openid")).then(res => {
                    if (res === true) {
                        this.follow = true;
                    } else {
                        this.follow = false;
                    }
                });
            }
        },
        onLoad: function (e) {
            if (e.itemid) {
                //#ifdef H5
                let ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('micromessenger') !== -1) {
                    this.isWeiXin = true;
                }
                if (window.location.href.indexOf("&relation_id=") !== -1) {
                    let relation = window.location.href.split("&relation_id=")[1].split("&")[0];
                    this.$queue.setData("relation", relation)
                }
                //#endif
                this.itemid = e.itemid;
                let userId = this.$queue.getData("userId");
                if (userId) {
                    this.$Request.getT("/user/" + userId).then(res => {
                        if (res.status === 0) {
                            this.isInvitation = res.data.isInvitation;
                            this.$queue.setData("isInvitation", res.data.isInvitation);
                            this.$queue.setData("relation", res.data.invitation);
                            this.$queue.setData("grade", res.data.grade);
                            if (res.data.image_url) {
                                this.$queue.setData("image_url", res.data.image_url);
                            }
                            this.$queue.setData("mobile", res.data.phone);
                            this.$queue.setData("nickName", res.data.nickName);
                            this.$queue.setData("relation_id", res.data.relationId);
                            this.$queue.setData("gender", parseInt(res.data.gender));
                        }
                    });
                    this.loadGoodsInfo();
                } else {
                    this.loadGoodsInfo();

                }
            } else {
                uni.navigateBack();
            }
        },
        onPageScroll: function (e) {
            this.scrollTop = e.scrollTop > 200;
        },

        onNavigationBarButtonTap: function () {
            this.navBarButton = !this.navBarButton;
        },
        methods: {
			showModal() {
				this.modalName = "Image"
			},
			hideModal() {
				this.modalName = null
			},
            //初始化加载详情数据
            loadGoodsInfo: function () {
                let that = this;
                uni.showLoading({
                    title: '加载中...'
                });
                this.$Request.get("/api/item_detail/apikey/maxd/itemid/" + this.itemid).then(res => {
                    if (res.code === 1) {
                        if (res.data.taobao_image && res.data.taobao_image.length > 0) {
                            let images = res.data.taobao_image.split(',');
                            res.data.images = [];
                            for (let i = 0; i < images.length; i++) {
                                res.data.images.push(images[i])
                            }
                        } else {
                            res.data.images = [];
                            res.data.images.push(res.data.itempic);
                        }
                        if (res.data.start_time && res.data.end_time) {
                            res.data.start_time = this.formatDate(new Date(res.data.start_time * 1000));
                            res.data.end_time = this.formatDate(new Date(res.data.end_time * 1000));
                        }
                        res.data.itemsale = res.data.itemsale > 10000 ? (res.data.itemsale / 10000).toFixed(1) + "万" : res.data.itemsale;
                        that.goods = res.data;
                        that.loadGoods = true;
                        let grade = this.$queue.getData("grade");
                        if (grade) {
                            that.money = (res.data.tkmoney * parseFloat(grade)).toFixed(2);
                        } else {
                            that.money = (res.data.tkmoney * 0.3).toFixed(2);
                        }
                        try {
                            let isExist = this.$queue.isExist(this.collectKey, res.data.itemid);
                            if (isExist === true) {
                                this.collect.name = "已收藏";
                                this.collect.isCollect = "color: #e10a07";
                            } else {
                                this.collect.name = "收藏";
                                this.collect.isCollect = false;
                            }
                            let isExists = this.$queue.isExist(this.footprintKey, res.data.itemid);
                            if (isExists === false) {
                                this.$queue.insert({
                                    key: this.footprintKey,
                                    value: this.goods,
                                });
                            }

                            //检查授权会员权限
                            if (this.isInvitation == 0) {
                                this.buyDes = "分享给朋友";
                            } else {
                                let grade = this.$queue.getData("grade");
                                if (grade) {
                                    this.buyDes = "分享（赚" + (this.goods.tkmoney * parseFloat(grade)).toFixed(2) + "元）";
                                } else {
                                    this.buyDes = "分享（赚" + (this.goods.tkmoney * 0.3).toFixed(2) + "元）";
                                }
                            }
                            this.loadTkl();
                            //#ifdef H5
                            let url = encodeURIComponent(window.location.href.split('#')[0]);
                            that.$Request.get("/tao/wx/js/sign?url=" + url).then(res => {
                                that.$wx.config({
                                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                    appId: res["appid"], // 必填，公众号的唯一标识
                                    timestamp: res["timestamp"], // 必填，生成签名的时间戳
                                    nonceStr: res["noncestr"], // 必填，生成签名的随机串
                                    signature: res["signature"], // 必填，签名
                                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
                                });
                                that.$wx.ready(function () {
                                    //分享到朋友
                                    that.$wx.onMenuShareAppMessage({
                                        title: that.goods.itemendprice + "元 " + that.goods.itemtitle,
                                        desc: that.goods.itemdesc,
                                        link: window.location.href.split('#')[0], // 分享链接
                                        imgUrl: that.goods.images[0], // 分享图标
                                        type: 'link', // 分享类型,music、video或link，不填默认为link
                                        success: function () {
                                            that.show_share = false;
                                        },
                                        cancel: function () {
                                            that.show_share = false;
                                        }
                                    });
                                    that.$wx.onMenuShareTimeline({
                                        title: that.goods.itemendprice + "元 " + that.goods.itemtitle,
                                        link: window.location.href.split('#')[0], // 分享链接
                                        imgUrl: that.goods.images[0], // 分享图标
                                        trigger: function (res) {
                                            that.show_share = false;
                                        },
                                        success: function (res) {
                                            that.show_share = false;
                                        },
                                        cancel: function (res) {
                                            that.show_share = false;
                                        },
                                        fail: function (res) {
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

                        uni.navigateBack();

                    }
                    uni.hideLoading();
                });
                // this.$Request.get("/api/get_similar_info/apikey/maxd/itemid/" + this.itemid).then(res => {
                //     if (res.code === 1) {
                //         res.data.forEach(d => {
                //             let grade = this.$queue.getData("grade");
                //             if (grade) {
                //                 d.tkmoney = (d.tkmoney * parseFloat(grade)).toFixed(2);
                //             } else {
                //                 d.tkmoney = (d.tkmoney * 0.3).toFixed(2);
                //             }
                //             d.itemsale = d.itemsale > 10000 ? "已售 " + (d.itemsale / 10000).toFixed(1) + "万" : "已售 " + d.itemsale;
                //             this.couponlist.push(d);
                //         });
                //     }
                // });

            },

            goWeb(url) {
                uni.navigateTo({
                    url: "/pages/member/webview?url=" + url
                });
            },


            erweima() {
                uni.navigateTo({
                    url: '/pages/member/erweima'
                });
            },
            /**
             * 保存图片
             * @param url
             */
            toSave(url) {
                //#ifndef H5
                uni.getImageInfo({
                    src: url,
                    success: function (image) {
                        console.log('图片信息：', JSON.stringify(image));
                        uni.saveImageToPhotosAlbum({
                            filePath: image.path,
                            success: function () {
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
                uni.navigateBack();
            },
            /**
             * 复制链接
             */
            copyHref() {
                //#ifdef H5
                uni.setClipboardData({
                    data: window.location.href,
                    success: (r => {
                        this.$queue.showToast("复制成功")
                    }),
                });
                //#endif
                //#ifndef H5
                let relation_id = this.$queue.getData("relation_id");
                if (relation_id) {
                    uni.setClipboardData({
                        data: this.$queue.publicYuMing()+"/pages/detail/goodsinfo?itemid=" + this.itemid + "&relation_id=" + relation_id,
                        success: (r => {
                            this.$queue.showToast("复制成功")
                        }),
                    })
                } else {
                    uni.setClipboardData({
                        data: this.$queue.publicYuMing()+"/pages/detail/goodsinfo?itemid=" + this.itemid,
                        success: (r => {
                            this.$queue.showToast("复制成功")
                        }),
                    })
                }
                //#endif

            },
            closeShare() {
                this.show_share = false;
            },
            clickCollect() { //收藏
                let isExist = this.$queue.isExist(this.collectKey, this.goods.itemid);
                if (isExist) {
                    let items = [];
                    items.push(this.goods.itemid);
                    this.$queue.removeItem(this.collectKey, items);
                    this.collect.name = "收藏";
                    this.collect.isCollect = "";
                } else {
                    this.$queue.insert({
                        key: this.collectKey,
                        value: this.goods,
                    });
                    this.collect.name = "已收藏";
                    this.collect.isCollect = "color: #e10a07";
                }
            },
            getQuan: function () {
                uni.showLoading({
                    title: '加载中...'
                });
                let that = this;
                this.$Request.post("/api/ratesurl", {
                    itemid: this.itemid,
                    tb_name: this.$queue.getTaoBaoName(),
                    pid: this.$queue.getTaoBaoPid(),
                    apikey: this.$queue.getTaoBaoKey()
                }).then(res => {
                    if (res.code === 1) {
                        let coupon_click_url;
                        let relation_id = that.$queue.getData("relation_id");
                        let relation = that.$queue.getData("relation");
                        if (relation_id || relation) {
                            if (relation) {
                                coupon_click_url = res.data.coupon_click_url + "&relationId=" + relation
                            }
                            if (relation_id) {
                                coupon_click_url = res.data.coupon_click_url + "&relationId=" + relation_id
                            }
                            //#ifdef APP-PLUS
                            uni.showToast({
                                title: "正在获取优惠券请稍后...",
                                mask: false,
                                duration: 1500,
                                icon: "none"
                            });
                            if (plus.os.name == 'Android') {
                                plus.runtime.openURL(coupon_click_url, function (res) {
                                    that.shopCartShare('tttt');
                                    uni.hideLoading();
                                }, 'com.taobao.taobao');
                            } else {
                                coupon_click_url = coupon_click_url.split('//')[1]
                                plus.runtime.openURL('taobao://' + coupon_click_url, function (res) {
                                    that.shopCartShare('tttt');
                                    uni.hideLoading();
                                }, 'taobao://');
                            }

                            // plug.openCoupon({"url": coupon_click_url, "openType": 0}, ret => {
                            //     console.error(ret)
                            // });

                            //#endif
                            //#ifndef APP-PLUS
                            that.shopCartShare('tttt');
                            //#endif
                        } else {
                            this.loginS();
                        }
                        that.coupon_click_url = coupon_click_url;
                    }
                });
            },
            /**
             *获取佣金结算
             * @param type
             */
            getTkl: function (type) {
                let that = this;
                let relation_id = that.$queue.getData("relation_id");
                if (this.tkl) {
                    if (type === "tkl" && type !== "tklbuy") {
                        this.$refs.simpleModalTkl.show({
                            showConfirmButton: false,
                        });
                    } else if (type === "tttt") {
                        this.$refs.simpleModalTklBuy.show({
                            showConfirmButton: false,
                        });
                    } else if (type === "copy") {
                        that.copyTkl();
                    } else if (type === "save") {
                        //that.copyTkl();
                    } else if (relation_id) {
                        this.$refs.simpleModalTkl.show({
                            showConfirmButton: false,
                        });
                    } else {
                        this.$refs.simpleModalTklBuy.show({
                            showConfirmButton: false,
                        });
                    }
                    uni.hideLoading();
                } else {
                    uni.showLoading({
                        title: '加载中...'
                    });
                    this.$Request.post("/api/ratesurl", {
                        itemid: this.itemid,
                        tb_name: this.$queue.getTaoBaoName(),
                        pid: this.$queue.getTaoBaoPid(),
                        apikey: this.$queue.getTaoBaoKey()
                    }).then(res => {
                        if (res.code === 1) {
                            let relation = that.$queue.getData("relation");
                            //#ifdef H5
                            if (window.location.href.indexOf("&relation_id=") !== -1) {
                                relation = window.location.href.split("&relation_id=")[1].split("&")[0];
                                that.$queue.setData("relation", relation)
                            }
                            //#endif
                            let coupon_click_url;
                            if (relation_id || relation) {
                                if (relation) {
                                    coupon_click_url = res.data.coupon_click_url + "&relationId=" + relation
                                }
                                if (relation_id) {
                                    coupon_click_url = res.data.coupon_click_url + "&relationId=" + relation_id
                                }
                            } else {
                                coupon_click_url = res.data.coupon_click_url
                            }
                            this.$Request.postF("/tao/taobao/tbwd", {
                                appKey: this.$queue.getTaoBaoAppid(),
                                appSecret: this.$queue.getTaoBaoSecret(),
                                logo: this.goods.itempic,
                                text: this.goods.itemtitle,
                                url: coupon_click_url
                            }).then(res => {
                                if (res && res.tbk_tpwd_create_response.data.model) {
                                    this.tkl = res.tbk_tpwd_create_response.data.model;
                                    if (type === "tkl" && type !== "tklbuy") {
                                        this.$refs.simpleModalTkl.show({
                                            showConfirmButton: false,
                                        });
                                    } else if (type === "tttt") {
                                        this.$refs.simpleModalTklBuy.show({
                                            showConfirmButton: false,
                                        });
                                    } else if (type === "copy") {
                                        that.copyTkl();
                                    } else if (type === "save") {
                                        //that.copyTkl();
                                    } else if (relation_id) {
                                        this.$refs.simpleModalTkl.show({
                                            showConfirmButton: false,
                                        });
                                    } else {
                                        this.$refs.simpleModalTklBuy.show({
                                            showConfirmButton: false,
                                        });
                                    }
                                } else {
                                    uni.showToast({
                                        title: "请关注微信公众号【省钱兄】领取优惠券",
                                        mask: false,
                                        duration: 1500,
                                        icon: "none"
                                    });
                                }
                                uni.hideLoading();
                            }).catch(res => {
                                uni.hideLoading();
                                uni.showToast({
                                    title: "请关注微信公众号【省钱兄】领取优惠券",
                                    mask: false,
                                    duration: 1500,
                                    icon: "none"
                                });
                            });
                        } else {
                            uni.hideLoading();
                        }
                    });
                }
            },

            formatDate: function (now) {
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                const date = now.getDate();
                return year + "-" + month + "-" + date;
            },
            loadTkl() {
                let that = this;
                this.$Request.post("/api/ratesurl", {
                    itemid: this.itemid,
                    tb_name: this.$queue.getTaoBaoName(),
                    pid: this.$queue.getTaoBaoPid(),
                    apikey: this.$queue.getTaoBaoKey()
                }).then(res => {
                    if (res.code === 1) {
                        let relation_id = that.$queue.getData("relation_id");
                        let relation = that.$queue.getData("relation");
                        //#ifdef H5
                        if (window.location.href.indexOf("&relation_id=") !== -1) {
                            relation = window.location.href.split("&relation_id=")[1].split("&")[0];
                            that.$queue.setData("relation", relation)
                        }
                        //#endif
                        let coupon_click_url;
                        if (relation_id || relation) {
                            if (relation) {
                                coupon_click_url = res.data.coupon_click_url + "&relationId=" + relation
                            }
                            if (relation_id) {
                                coupon_click_url = res.data.coupon_click_url + "&relationId=" + relation_id
                            }
                        } else {
                            coupon_click_url = res.data.coupon_click_url
                        }
                        this.coupon_click_url = coupon_click_url;
                        this.$Request.postF("/tao/taobao/tbwd", {
                            appKey: this.$queue.getTaoBaoAppid(),
                            appSecret: this.$queue.getTaoBaoSecret(),
                            logo: this.goods.itempic,
                            text: this.goods.itemtitle,
                            url: coupon_click_url
                        }).then(res => {
                            if (res && res.tbk_tpwd_create_response.data.model) {
                                this.tkl = res.tbk_tpwd_create_response.data.model;
                                // uni.setClipboardData({
                                //     data: res.tbk_tpwd_create_response.data.model,
                                //     success: (r => {
                                //     }),
                                // })
                            }
                        })
                    }
                });
            },
            copyTkl: function () {
                let relation = this.$queue.getData("relation");
                if (relation) {
                    uni.setClipboardData({
                        data: this.tkl,
                        success: (r => {
                            uni.showToast({
                                title: "复制成功",
                                duration: 1500,
                            });
                        }),
                    })
                } else {
                    this.loginS();
                }
            },
            haibao: function () {
                // #ifndef H5
                this.shareFc();
                // #endif
                // #ifdef H5
                uni.navigateTo({
                    url: "/pages/detail/share"
                })
                // #endif
            },
            moveHandleStop: function () {
                console.log("111")
            },
            showShopCartBg: function (type) {
                if (type === "cart") {
                    this.shopCartBg = !this.shopCartBg;
                }
                if (type === "nav") {
                    this.navBarButton = !this.navBarButton;
                }
            },
            topScrollTap: function () {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },
            navBarButtontO: function (type) {
                if (type === "search") {
                    uni.switchTab({
                        url: "/pages/homeSearch/index"
                    })
                } else if (type === "like") {
                    uni.switchTab({
                        url: "/pages/member/user"
                    })
                } else if (type === "footer") {
                    uni.navigateTo({
                        url: "/pages/footer/index"
                    })
                } else if (type === "home") {
                    uni.switchTab({
                        url: "/pages/index/index"
                    })
                }

            },
            followWeChat() {
                let ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('micromessenger') !== -1) {
                    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
                        document.addEventListener('WeixinJSBridgeReady', ready, false)
                    } else {
                        if (this.$queue.getData("openid")) {
                            this.$Request.get("/tao/wx/follow/" + this.$queue.getData("openid")).then(res => {
                                if (res !== true) {
                                    localStorage.openUrl = window.location.href;
                                    uni.navigateTo({
                                        url: "/pages/member/erweima"
                                    })
                                }
                            });
                        }
                    }
                }
            },
            shopCartShare: function (type) {
                if (type === "tkl") {
                    this.copyTklStatus = false;
                    this.getTkl(type);
                } else if (type === "tklbuy") {
                    let relation_id = this.$queue.getData("relation_id");
                    if (relation_id) {
                        // // 淘口令购买
                        this.copyTklStatus = false;
                        this.getTkl(type);
                    } else {
                        if (this.isInvitation == 0) {
                            this.$refs.simpleModalTkl.show({
                                showConfirmButton: false,
                            });
                        } else {
                            this.$queue.setData("href", '/pages/detail/goodsinfo?itemid=' + this.itemid);
                            let token = this.$queue.getData("token");
                            let userId = this.$queue.getData("userId");
                            if (token) {
                                uni.navigateTo({
                                    url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                                });
                            } else {
                                this.loginS();
                            }
                        }

                    }
                } else if (type === "showPic") {
                    let relation_id = this.$queue.getData("relation_id");
                    if (relation_id) {
                        this.shopCartBg = true;
                    } else {
                        if (this.isInvitation == 0) {
                            this.shopCartBg = true;
                        } else {
                            this.$queue.setData("href", '/pages/detail/goodsinfo?itemid=' + this.itemid);
                            let token = this.$queue.getData("token");
                            let userId = this.$queue.getData("userId");
                            if (token) {
                                uni.navigateTo({
                                    url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                                });
                            } else {
                                this.loginS();
                            }
                        }
                    }
                } else if (type === "quan") {
                    let relation_id = this.$queue.getData("relation_id");
                    let userId = this.$queue.getData("userId");
                    if (userId) {
                        if (relation_id) {
                            this.getQuan();
                        } else {
                            this.goPublisher();
                        }
                    } else {
                        this.loginS();
                    }
                } else {
                    this.copyTklStatus = false;
                    this.getTkl(type);
                }
            },
            goPublisher() {
                let token = this.$queue.getData("token");
                let userId = this.$queue.getData("userId");
                if (token) {
                    this.$queue.setData("href", '/pages/detail/goodsinfos?itemid=' + this.itemid);
                    uni.navigateTo({
                        url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                    });
                } else {
                    this.loginS();
                }
            },

            loginS() {
                //#ifdef H5
                uni.showModal({
                    title: '登录提醒',
                    showCancel: false,
                    content: '当前账号未登录\n请登录后领取优惠券',
                    success: (confirmRes) => {
                        if (confirmRes.confirm) {
                            this.$queue.setData("href", '/pages/detail/goodsinfos?itemid=' + this.itemid);
                            uni.navigateTo({
                                url: '/pages/member/register'
                            });
                        }
                    }
                });
                //#endif
                //#ifndef H5
                uni.showModal({
                    title: '登录提醒',
                    showCancel: false,
                    content: '当前账号未登录\n请登录后领取优惠券',
                    success: (confirmRes) => {
                        if (confirmRes.confirm) {
                            this.$queue.setData("href", '/pages/detail/goodsinfos?itemid=' + this.itemid);
                            uni.navigateTo({
                                url: '/pages/public/login'
                            });
                        }
                    }
                });
                //#endif
            },
            shopCartShares: function (type) {
                //#ifdef H5
                let ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('micromessenger') !== -1) {
                    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
                        document.addEventListener('WeixinJSBridgeReady', ready, false)
                    } else {
                        this.show_share = true;
                    }
                } else {
                    // tkl = 淘口令  picture = 图片
                    if (type === "tkl") {
                        this.copyTklStatus = false;
                        this.getTkl(type);
                    } else if (type === "tklbuy") {
                        // // 淘口令购买
                        this.copyTklStatus = false;
                        this.getTkl(type);
                    } else if (type === "quan") {
                        this.getQuan();
                    }
                }
                //#endif
                //#ifndef H5
                // tkl = 淘口令  picture = 图片
                if (type === "tkl") {
                    let relation_id = this.$queue.getData("relation_id");
                    if (relation_id) {
                        // // 淘口令购买
                        this.copyTklStatus = false;
                        this.getTkl(type);
                    } else {
                        let token = this.$queue.getData("token");
                        let userId = this.$queue.getData("userId");
                        if (token) {
                            uni.navigateTo({
                                url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                            });
                        } else {
                            this.loginS();
                        }
                    }
                } else if (type === "tklbuy") {
                    // // 淘口令购买
                    this.copyTklStatus = false;
                    this.getTkl(type);
                } else if (type === "quan") {
                    this.getQuan();
                }
                //#endif
            },
            TklmaskClose: function (e) {
                this.$refs.simpleModalTkl.hide();
                this.copyTklStatus = false;
            },
            copyTklWenAn: function () {
                uni.setClipboardData({
                    data: this.tkl,
                    success: (r => {
                        this.copyTklStatus = true;
                    }),
                })
            },
            copyTklWenAns: function () {
                // //#ifndef H5
                // for (let i = 0; i < this.goods.images.length; i++) {
                //     this.toSave(this.goods.images[i])
                // }
                // //#endif
                let relation_id = this.$queue.getData("relation_id");
                //#ifdef H5
                uni.setClipboardData({
                    data: this.goods.itemtitle + "\n【在售价】" + this.goods.itemprice + "元\n【券后价】" + this.goods.itemendprice +
                        "元\n【必买理由】\n" + this.goods.itemdesc + "+\n" + this.tkl,
                    success: (r => {
                        this.copyTklStatus = true;
                    })
                });

                //#endif
                //#ifndef H5
                uni.setClipboardData({
                    data: this.goods.itemtitle + "\n【在售价】" + this.goods.itemprice + "元\n【券后价】" + this.goods.itemendprice +
                        "元\n【必买理由】\n" + this.goods.itemdesc + "+\n" + this.tkl,
                    success: (r => {
                        this.copyTklStatus = true;
                    })
                })
                //#endif

            },
            TklBuymaskClose: function () {
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
                            qrCodeArray: ({
                                              bgObj,
                                              type,
                                              bgScale
                                          }) => {
                                let relation_id = this.$queue.getData("relation_id");
                                if (relation_id) {
                                    return [{
                                        text: this.$queue.publicYuMing()+"/pages/detail/goodsinfo?itemid=" + this.itemid + "&relation_id=" +
                                            relation_id,
                                        size: bgObj.width * 0.2,
                                        dx: bgObj.width * 0.05,
                                        dy: bgObj.height - bgObj.width * 0.25
                                    }]
                                } else {
                                    return [{
                                        text: this.$queue.publicYuMing()+"/pages/detail/goodsinfo?itemid=" + this.itemid,
                                        size: bgObj.width * 0.2,
                                        dx: bgObj.width * 0.05,
                                        dy: bgObj.height - bgObj.width * 0.25
                                    }]
                                }
                            },
                            textArray: ({
                                            bgObj,
                                            type,
                                            bgScale
                                        }) => {
                                const fontSize = bgObj.width * 0.05;
                                const fontSize2 = bgObj.width * 0.08;
                                const widths = bgObj.width * 0.25;
                                const fontSize1 = bgObj.width * 0.04;
                                const lineHeight = bgObj.height * 0.04;
                                return [{
                                    fontStyle: 'italic',
                                    fontWeight: 'bold',
                                    text: "【省钱兄】券后价",
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
                                        }
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
                                            }
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
                                            }
                                        }
                                    },
                                ]
                            },
                            setCanvasWH: ({
                                              bgObj,
                                              type,
                                              bgScale
                                          }) => { // 为动态设置画布宽高的方法，
                                this.poster = bgObj;
                            },
                            setDraw: ({
                                          Context,
                                          bgObj,
                                          type,
                                          bgScale
                                      }) => {
                                Context.setFillStyle('black');
                                Context.setGlobalAlpha(0.5);
                                Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
                            }
                        });
                        console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath)
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
	page{
		background: #F8F8F8;
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
        transition: all .3s ease-in-out;
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
        color: #e10a07;
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
