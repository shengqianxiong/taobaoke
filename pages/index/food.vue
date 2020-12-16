<template style="background: white">
    <view>
        <view style="background: white;z-index: 999">
            <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLefts"
                         style="position: fixed;z-index: 100;text-align: center;border-bottom:1px solid ghostwhite">
                <view class="cu-item" :class="indexs==TabCurs?'text-green cur':''" v-for="(item,indexs) in tab"
                      :key="indexs"
                      @tap="searchSelect" :data-id="indexs">
                    <text :style="indexs==TabCurs?'background: #e10a07;color: white;padding: 2px 10px 2px 10px;border-radius: 16px;margin-right: -10px':'background: #ffffff;color: #333333;margin-right: -10px'">
                        {{item.name}}
                    </text>
                </view>
            </scroll-view>
        </view>
        <view style="height: 1px;background: grey;width: 100%"></view>
        <view class="index-content" style="padding-top: 40px;">
            <view class="index-coupon has-bg-white has-pd-10 top_30">
                <view class="goods-list" v-if="couponlist.length > 0">
                    <orange-goods-card-home
                            v-for="(item,index) in couponlist"
                            :index="index%2"
                            :logo="logo"
							:isEnable='isEnable'
                            :tkmoney='item.tkmoney'
                            :tkmoneys='item.tkmoneys'
                            :itemid="item.itemid"
                            :is-invitation="isInvitation"
                            :itempic="item.itempic+'_310x310.jpg'"
                            :itemtitle="item.itemtitle"
                            :itemprice='"¥"+item.itemprice'
                            :itemsale="item.itemsale"
                            :itemendprice='""+item.itemendprice'
                            :couponmoney="item.couponmoney"
                    ></orange-goods-card-home>
                </view>
            </view>
            <!-- 悬浮上拉 -->
            <view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']"
                  style="bottom: 56px;">
                <text class="iconfont icon-shangla"></text>
            </view>


            <!-- 加载更多提示 -->
            <view class="s-col is-col-24" v-if="couponlist.length > 0">
                <load-more :loadingType="loadingType" :contentText="contentText"></load-more>
            </view>
            <!-- 加载更多提示 -->
            <empty v-if="couponlist.length === 0" des="暂无数据" show="false"></empty>


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
                logo: "../../static/img/mao.png",
                tab: [
                    {name: '热销', position: 4, total: 0, data: []},
                    {name: '最新', position: 0, total: 0, data: []},
                    {name: '超低价', position: 1, total: 0, data: []},
                    {name: '高佣金', position: 5, total: 0, data: []},
                    {name: '大额券', position: 3, total: 0, data: []},
                ],
                TabCur: 0,
                TabCurs: 0,
                scrollLeft: 0,
                scrollLefts: 0,
                couponlist: [],
                goods: {},
                page: 1,
                min_id: 1,
                cid: 0,
                type: 1,
                sort: 4,
                genderKey: "gender",
                loadingType: 0,
                scrollTop: false,
				isEnable:'否',
                isInvitation: 0,
                contentText: {
                    contentdown: "上拉显示更多",
                    contentrefresh: "正在加载...",
                    contentnomore: "没有更多数据了"
                }
            }
        },
        onLoad: function (e) {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
            if (e.title && e.type) {
                this.type = e.type;
                uni.setNavigationBarTitle({
                    title: e.title
                });
                uni.showLoading({
                    title: '加载中...'
                });
                this.loadCouponList();
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
            } else {
                uni.navigateBack()
            }
        },
        onPageScroll: function (e) {
            this.scrollTop = e.scrollTop > 200;
        },
        methods: {
            searchSelect(e) {
                this.TabCurs = e.currentTarget.dataset.id;
                this.sort = this.tab[e.currentTarget.dataset.id].position;
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
                this.loadCouponList("Refresh");
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
                this.loadCouponList("Refresh");
            },
            topScrollTap: function () {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            },

            loadCouponList: function (type) {
                this.loadingType = 1;
                let that = this;
                this.$Request.get('/api/column/apikey/maxd/type/' + this.type + '/back/20/sort/' + this.sort + '/min_id/' + this.min_id + '/cid/11').then(res => {
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
                        });
                        //#ifdef H5
                        let url = encodeURIComponent(window.location.href.split('#')[0]);
                        that.$Request.get("/tao/wx/js/sign?url=" + url).then(res => {
                            that.$wx.config({
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: res["appid"], // 必填，公众号的唯一标识
                                timestamp: res["timestamp"], // 必填，生成签名的时间戳
                                nonceStr: res["noncestr"], // 必填，生成签名的随机串
                                signature: res["signature"],// 必填，签名
                                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
                            });
                            that.$wx.ready(function () {
                                //分享到朋友
                                that.$wx.onMenuShareAppMessage({
                                    title: "全网爆款网红美食来袭",
                                    desc: "全网超低折扣价！让你享受白菜价网购的快感！",
                                    link: window.location.href.split('#')[0], // 分享链接
                                    imgUrl: this.$queue.publicYuMing() + '/shg.png', // 分享图标
                                    type: 'link', // 分享类型,music、video或link，不填默认为link
                                    success: function () {
                                    },
                                    cancel: function () {
                                    }
                                });
                                that.$wx.onMenuShareTimeline({
                                    title: "爆款网红美食！全网超低折扣价！让你享受白菜价网购的快感！",
                                    link: window.location.href.split('#')[0], // 分享链接
                                    imgUrl: this.$queue.publicYuMing() + '/shg.png', // 分享图标
                                    trigger: function (res) {
                                    },
                                    success: function (res) {
                                    },
                                    cancel: function (res) {
                                    },
                                    fail: function (res) {
                                    }
                                });
                            });
                        });
                        //#endif

                    } else {
                        this.loadingType = 2;
                    }
                    uni.hideLoading();
                    if (type === "Refresh") {
                        uni.stopPullDownRefresh(); // 停止刷新
                    }
                })
            },
            toGoodsInfo: function (itemid) {
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

        onReady: function () {
            this.loadCouponList();
        },
        onReachBottom: function () {
            this.page = this.page + 1;
            this.loadCouponList();
        },
        onPullDownRefresh: function () {
            this.page = 1;
            this.min_id = 1;
            this.loadCouponList("Refresh");
        }
    }
</script>

<style>
    @import "../../static/css/index.css";
</style>
