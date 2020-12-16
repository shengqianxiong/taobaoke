<template>
    <view class="index-content">
        <scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft"
                     style="position: fixed;z-index: 100;border-bottom: 1px solid ghostwhite">
            <view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in category"
                  @tap="tabSelect" :data-id="index">
                {{item}}
            </view>
        </scroll-view>
        <!-- 领券直播 -->
        <view class="index-coupon has-bg-white has-pd-10 top_30">
            <view class="goods-list" v-if="couponlist.length > 0" style="padding-top: 46px">
                <!--                <orange-goods-list-->
                <!--                        v-for="(item,index) in couponlist"-->
                <!--                        :key="index"-->
                <!--                        :itemid="item.itemid"-->
                <!--                        :itempic="item.itempic"-->
                <!--                        :itemtitle="item.itemtitle"-->
                <!--                        :itemprice='"在售价 ¥"+item.itemprice'-->
                <!--                        :itemsale="item.itemsale"-->
                <!--                        :itemendprice="item.itemendprice"-->
                <!--                        :couponmoney="item.couponmoney"-->
                <!--                ></orange-goods-list>-->
                <orange-goods-card
                        v-for="(item,index) in couponlist"
                        :logo="logo"
                        :tkmoney='"赚 ￥"+(item.tkmoney / 2).toFixed(2)'
                        :itemid="item.itemid"
                        :itempic="item.itempic+'_310x310.jpg'"
                        :itemtitle="item.itemtitle"
                        :itemprice='"原价 "+item.itemprice'
                        :itemsale='item.itemsale+"人付款"'
                        :itemendprice='""+item.itemendprice'
                        :couponmoney="item.couponmoney"
                ></orange-goods-card>
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

    </view>
</template>

<script>
    export default {
        onShareAppMessage(res) {
            return {
                title: '购物先领券，一年省一半',
                path: '/pages/index/index'
            }
        }, data() {
            return {
                logo: "../../static/img/mao.png",
                TabCur: 0,
                scrollLeft: 0,
                category: [
                    '全部',
                    '女装',
                    '男装',
                    '内衣',
                    '美妆',
                    '配饰',
                    '鞋品',
                    '箱包',
                    '儿童',
                    '母婴',
                    '居家',
                    '美食',
                    '数码',
                    '家电',
                    '其他',
                    '车品',
                    '文体',
                    '宠物',
                ],
                genderKey: "gender",
                couponlist: [],
                page: 1,
                min_id: 1,
                cid: 0,
                sort: 4,
                loadingType: 0,
                scrollTop: false,
                contentText: {
                    contentdown: "上拉显示更多",
                    contentrefresh: "正在加载...",
                    contentnomore: "没有更多数据了"
                }
            }
        },
        onLoad: function (e) {
            let gender = this.$queue.getData(this.genderKey);
            if (gender && gender === 1 || gender === 2) {
                this.TabCur = gender;
                this.cid = gender;
            }
            this.loadCouponList();
        },
        onPageScroll: function (e) {
            this.scrollTop = e.scrollTop > 200;
        },
        methods: {
            tabSelect(e) {
                this.TabCur = e.currentTarget.dataset.id;
                this.cid = e.currentTarget.dataset.id;
                this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
                this.page = 1;
                this.min_id = 1;
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
                this.$Request.get('/api/column/apikey/maxd/type/2/back/20/sort/' + this.sort + '/min_id/' + this.min_id + '/cid/' + this.cid).then(res => {
                    this.loadingType = 0;
                    if (res.code === 1) {
                        if (this.page === 1) {
                            this.couponlist = [];
                        }
                        this.min_id = res.min_id;
                        res.data.forEach(d => {
                            this.couponlist.push(d);
                        })
                    } else {
                        this.loadingType = 2;
                    }
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
