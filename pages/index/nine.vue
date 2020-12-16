<template style="background: white">
    <view>
        <view class="index-content">
            <view class="index-coupon has-bg-white has-pd-10 top_30">
                <view class="goods-list" v-if="couponlist.length > 0">
                    <orange-goods-card-home
                            v-for="(item,index) in couponlist"
                            :index="index%2"
                            :logo="logo"
                            :tkmoney='item.tkmoney'
							:tkmoneys='item.tkmoneys'
							:isEnable='isEnable'
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
                TabCur: 0,
                TabCurs: 0,
                scrollLeft: 0,
                scrollLefts: 0,
                couponlist: [],
                page: 1,
                min_id: 1,
                cid: 0,
                type: 1,
                sort: 3,
                genderKey: "gender",
                loadingType: 0,
                isInvitation:0,
                scrollTop: false,
				idEnable:'否',
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
                this.$Request.get('/api/low_price_Pinkage_data/apikey/maxd/order/4/type/'+this.type+'/min_id/'+this.min_id).then(res => {
                    this.loadingType = 0;
                    if (res.code === 1) {
                        if (this.page === 1) {
                            this.couponlist = [];
                        }
                        this.min_id = res.min_id;
                        res.data.forEach(d => {
							d.tkmoneys = (d.tkmoney * 0.7).toFixed(2);
                            let grade = this.$queue.getData("grade");
                            if (grade) {
                                d.tkmoney = (d.tkmoney * parseFloat(grade)).toFixed(2);
                            } else {
                                d.tkmoney = (d.tkmoney * 0.3).toFixed(2);
                            }
							d.itemsale = d.itemsale > 10000 ? '已售 ' + (d.itemsale / 10000).toFixed(1) + '万' : '已售 ' + d.itemsale;
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
