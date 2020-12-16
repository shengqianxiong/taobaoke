<template>
    <view class="content">
        <view style="display: flex;text-align: center;background: white;padding: 16px;">
            <view style="width: 33.3%;">本月结算
                <view style="color: #e10a07">￥{{nowOver}}</view>
            </view>
            <view style="width: 33.3%;">上月结算
                <view style="color: #e10a07">￥{{lastOver}}</view>
            </view>
            <view style="width: 33.3%;">本月付款
                <view style="color: #e10a07">￥{{nowPaied}}</view>
            </view>
        </view>
        <view style="text-align: center;font-size:12px;background: white;padding-bottom: 8px;">
            (佣金结算规则：只有代理等级是会员才可得到返佣)
        </view>
        <view style="background: white;text-align: center;padding-bottom: 16px">

            <text @click="yaoqing()" style="margin-right: 8px;color: black;font-weight: bold">成员中心</text>
            |
            <text @click="tuiuang()" style="margin-left: 8px;margin-right: 8px;font-weight: bold">推广中心</text>
            |
            <text @click="sucai()" style="margin-left: 8px;font-weight: bold">素材推广</text>
        </view>
        <view class="navbar">
            <view
                    v-for="(item, index) in navList" :key="index"
                    class="nav-item"
                    :class="{current: tabCurrentIndex === index}"
                    @click="tabClick(index)"
            >
                {{item.text}}
            </view>
        </view>
        <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
            <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
                <scroll-view
                        class="list-scroll-content"
                        lower-threshold
                        @scrolltolower="loadMore"
                        scroll-y
                >
                    <!-- 空白页 -->
                    <empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0" des="暂无数据"></empty>

                    <!-- 订单列表 -->
                    <view
                            v-for="(item,index) in tabItem.orderList" :key="index"
                            class="order-item"
                            @click="toGoodsInfo(item.item_id)"
                    >
                        <view class="i-top b-b">
                            <text class="time" style="font-size: 14px;color: grey">{{item.tk_paid_time}}付款</text>
                            <text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
                        </view>

                        <view class="goods-box-single">
                            <image class="goods-img" :src='item.image'></image>
                            <view class="right">
                                <text class="title clamp">{{item.item_title}}</text>
                                <text class="attr-box">店铺名称 {{item.seller_shop_title}}</text>
                                <text class="price">实付款 ￥{{item.alipay_total_price}}</text>
                            </view>
                        </view>
                        <view class="price-box">
                            代理【{{item.relation_id}}】预估收入
                            <text class="price" style="color: black">
                                {{item.tk_status!==13?item.pub_share_pre_fee_user:'--'}}
                            </text>
                        </view>
                        <view class="price-box">
                            我的预估提成
                            <text class="price" style="color: #F15B6C;font-weight: bold">
                                {{item.tk_status!==13?item.invitationMoney:'--'}}
                            </text>
                        </view>

                    </view>

                    <uni-load-more :status="tabItem.loadingType"></uni-load-more>

                </scroll-view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import empty from "@/components/empty";

    export default {
        components: {
            uniLoadMore,
            empty
        },
        data() {
            return {
                tabCurrentIndex: 0,
                scrollTop: false,
                nowPaied: 0,
                lastPaied: 0,
                nowOver: 0,
                lastOver: 0,
                navList: [
                    {
                        state: 12,
                        text: '已付款',
                        page: 0,
                        loadingType: 'more',
                        orderList: []
                    },
                    {
                        state: 3,
                        text: '已结算',
                        page: 0,
                        loadingType: 'more',
                        orderList: []
                    }
                ],
            };
        },
        onPageScroll: function (e) {
            this.scrollTop = e.scrollTop > 200;
        },
        onLoad(options) {
            /**
             * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
             * 替换onLoad下代码即可
             */
            this.tabCurrentIndex = parseInt(options.state);
            // #ifndef MP
            this.loadData();
            // #endif
            // #ifdef MP
            if (options.state === 0) {
                this.loadData()
            }
            // #endif
            this.getMoney()

        },
        methods: {
            yaoqing() {
                uni.navigateTo({url: "/pages/invitation/persons"})
            },
            tuiuang() {
                uni.navigateTo({url: "/pages/member/yao"})
            },
            sucai() {
                uni.navigateTo({url: "/pages/share/share"})
            },
            getMoney() {
                let that = this;
                let relation_id = this.$queue.getData("relation_id");
                this.$Request.getT("/order/now/count?relation_id=" + relation_id + "&tk_status=12").then(res => {
                    if (res.status === 0 && res.data) {
                        that.nowPaied = parseFloat(res.data).toFixed(1);
                    } else {
                        that.nowPaied = '0';
                    }
                });
                this.$Request.getT("/order/now/count?relation_id=" + relation_id + "&tk_status=3").then(res => {
                    if (res.status === 0 && res.data) {
                        that.nowOver = parseFloat(res.data).toFixed(1);
                    } else {
                        that.nowOver = '0';
                    }
                });
                this.$Request.getT("/order/invitation/count?relation_id=" + relation_id + "&tk_status=3").then(res => {
                    if (res.status === 0 && res.data) {
                        that.lastOver = parseFloat(res.data).toFixed(1);
                    } else {
                        that.lastOver = '0';
                    }
                });
            },
            loadMore() {
                let index = this.tabCurrentIndex;
                this.navList[index].page = this.navList[index].page + 1;
                this.loadData();
            },
            topScrollTap: function () {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
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
            //获取订单列表
            loadData(source) {
                //这里是将订单挂载到tab列表下
                let index = this.tabCurrentIndex;
                let navItem = this.navList[index];
                let state = navItem.state;
                let page = navItem.page;
                if (source === 'tabChange' && navItem.loaded === true) {
                    //tab切换只有第一次需要加载数据
                    return;
                }
                if (navItem.loadingType === 'loading') {
                    //防止重复加载
                    return;
                }
                if (navItem.loadingType === 'noMore') {
                    return;
                }

                navItem.loadingType = 'loading';
                let relation_id = this.$queue.getData("relation_id");
                if (relation_id && relation_id !== 'undefined') {
                    this.$Request.getT("/order/invitation/list?relation_id=" + relation_id + "&tk_status=" + state + "&page=" + page + "&size=10").then(res => {
                        if (res.status === 0) {
                            let list = res.data.content;
                            let orderList = list.filter(item => {
                                //添加不同状态下订单的表现形式
                                item = Object.assign(item, this.orderStateExp(item.tk_status));
                                return item
                            });
                            orderList.forEach(item => {
                                item.image = "http:" + item.item_img;
                                navItem.orderList.push(item);
                            });
                            if (res.data.totalElements === navItem.orderList.length) {
                                //判断是否还有数据， 有改为 more， 没有改为noMore
                                navItem.loadingType = 'noMore';
                            } else {
                                //判断是否还有数据， 有改为 more， 没有改为noMore
                                navItem.loadingType = 'more';
                            }
                            this.$set(navItem, 'loaded', true);
                        } else if (res.status === -102) {
                            this.$queue.showToast(res.msg);
                            this.$queue.logout();
                            uni.navigateTo({url: '/pages/public/login'})
                        } else {
                            this.$queue.showToast(res.msg);
                        }
                    });
                } else {
                    navItem.loadingType = 'noMore';
                    this.$set(navItem, 'loaded', true);
                }


            },

            //swiper 切换
            changeTab(e) {
                this.tabCurrentIndex = e.target.current;
                this.loadData('tabChange');
            },
            //顶部tab点击
            tabClick(index) {
                this.tabCurrentIndex = index;
            },

            //订单状态文字和颜色
            orderStateExp(state) {
                let stateTip = '',
                    stateTipColor = '#e10a07';
                switch (+state) {
                    case 12:
                        stateTip = '已付款';
                        break;
                    case 14:
                        stateTip = '已收货';
                        break;
                    case 3:
                        stateTip = '已结算';
                        break;
                    case 4:
                        stateTip = '维权退款';
                        break;
                    case 13:
                        stateTip = '已失效';
                        stateTipColor = '#909399';
                        break;

                    //更多自定义
                }
                return {stateTip, stateTipColor};
            }
        },
    }
</script>

<style lang="scss">

    page, .content {
        background: $page-color-base;
        height: 100%;
    }

    .swiper-box {
        height: calc(100% - 40px);
    }

    .list-scroll-content {
        height: 100%;
    }

    .navbar {
        display: flex;
        height: 40px;
        padding: 0 5px;
        background: #fff;
        box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
        position: relative;
        z-index: 10;

        .nav-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 15px;
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
                    border-bottom: 2px solid $base-color;
                }
            }
        }
    }

    .uni-swiper-item {
        height: auto;
    }

    .order-item {
        display: flex;
        flex-direction: column;
        padding-left: 15px;
        background: #fff;
        margin-top: 8px;

        .i-top {
            display: flex;
            align-items: center;
            height: 40px;
            padding-right: 16px;
            font-size: $font-base;
            color: $font-color-dark;
            position: relative;

            .time {
                flex: 1;
            }

            .state {
                font-weight: 400;
                color: $base-color;
            }

            .del-btn {
                padding: 6px 0 6px 18px;
                font-size: $font-lg;
                color: $font-color-light;
                position: relative;

                &:after {
                    content: '';
                    width: 0;
                    height: 16px;
                    border-left: 1px solid $border-color-dark;
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }


        /* 单条商品 */
        .goods-box-single {
            display: flex;
            padding: 10px 0;

            .goods-img {
                width: 60px;
                height: 60px;
            }

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 0 15px 0 12px;
                overflow: hidden;

                .title {
                    height: 32px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: $font-base + 2upx;
                    color: $font-color-dark;
                    line-height: 1;
                }

                .attr-box {
                    font-size: $font-sm + 2upx;
                    color: $font-color-light;
                    padding: 5px 0px;
                }

                .price {
                    font-size: $font-base + 2upx;
                    color: $font-color-dark;

                    &:before {
                        font-size: $font-sm;
                        margin: 0 1px 0 4px;
                    }
                }
            }
        }

        .price-box {
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            padding: 10px 16px;
            font-size: $font-sm + 2upx;
            color: $font-color-light;

            .num {
                margin: 0 4px;
                color: $font-color-dark;
            }

            .price {
                font-size: $font-lg;
                color: $font-color-dark;

                &:before {
                    content: '￥';
                    font-size: $font-sm;
                    margin: 0 1px 0 4px;
                }
            }
        }

        .action-box {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 50px;
            position: relative;
            padding-right: 16px;
        }

        .action-btn {
            width: 80px;
            height: 30px;
            margin: 0;
            margin-left: 12px;
            padding: 0;
            text-align: center;
            line-height: 30px;
            font-size: $font-sm + 2upx;
            color: $font-color-dark;
            background: #fff;
            border-radius: 100px;

            &:after {
                border-radius: 100px;
            }

            &.recom {
                background: #fff9f9;
                color: $base-color;

                &:after {
                    border-color: #f7bcc8;
                }
            }
        }
    }


    /* load-more */
    .uni-load-more {
        display: flex;
        flex-direction: row;
        height: 40px;
        align-items: center;
        justify-content: center
    }

    .uni-load-more__text {
        font-size: 14px;
        color: #999
    }

    .uni-load-more__img {
        height: 24px;
        width: 24px;
        margin-right: 10px
    }

    .uni-load-more__img > view {
        position: absolute
    }

    .uni-load-more__img > view view {
        width: 6px;
        height: 2px;
        border-top-left-radius: 1px;
        border-bottom-left-radius: 1px;
        background: #999;
        position: absolute;
        opacity: .2;
        transform-origin: 50%;
        animation: load 1.56s ease infinite
    }

    .uni-load-more__img > view view:nth-child(1) {
        transform: rotate(90deg);
        top: 2px;
        left: 9px
    }

    .uni-load-more__img > view view:nth-child(2) {
        transform: rotate(180deg);
        top: 11px;
        right: 0
    }

    .uni-load-more__img > view view:nth-child(3) {
        transform: rotate(270deg);
        bottom: 2px;
        left: 9px
    }

    .uni-load-more__img > view view:nth-child(4) {
        top: 11px;
        left: 0
    }

    .load1,
    .load2,
    .load3 {
        height: 24px;
        width: 24px
    }

    .load2 {
        transform: rotate(30deg)
    }

    .load3 {
        transform: rotate(60deg)
    }

    .load1 view:nth-child(1) {
        animation-delay: 0s
    }

    .load2 view:nth-child(1) {
        animation-delay: .13s
    }

    .load3 view:nth-child(1) {
        animation-delay: .26s
    }

    .load1 view:nth-child(2) {
        animation-delay: .39s
    }

    .load2 view:nth-child(2) {
        animation-delay: .52s
    }

    .load3 view:nth-child(2) {
        animation-delay: .65s
    }

    .load1 view:nth-child(3) {
        animation-delay: .78s
    }

    .load2 view:nth-child(3) {
        animation-delay: .91s
    }

    .load3 view:nth-child(3) {
        animation-delay: 1.04s
    }

    .load1 view:nth-child(4) {
        animation-delay: 1.17s
    }

    .load2 view:nth-child(4) {
        animation-delay: 1.3s
    }

    .load3 view:nth-child(4) {
        animation-delay: 1.43s
    }

    @-webkit-keyframes load {
        0% {
            opacity: 1
        }

        100% {
            opacity: .2
        }
    }
</style>
