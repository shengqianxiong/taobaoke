<template>

    <view class="coupon-page s-row"
          @tap="open(itemid)"
		  v-bind:key='itemid'
          style="border-bottom: 1px solid ghostwhite">
        <view class="image">
            <image :src="itempic"></image>
        </view>
        <view class="content">
            <view style="display: flex">
                <image v-if="logo!=null"
                       style="margin-left:4px;height: 12px;width: 5%;margin-top: 4px;margin-right: 2px"
                       :src="logo"></image>
                <view class="twolist-hidden"
                      style="height: 80upx;font-size: 28upx;margin-right: 2px;margin-left: 2px;width: 95%;max-lines:2;overflow: hidden">
                    {{ itemtitle }}
                </view>
            </view>
            <view class="num s-row">
                <text class="tmprice">{{itemprice}}</text>
                <text class="volume">{{itemsale}}人付款</text>
            </view>
            <view class="money s-row">
                <text class="coupon-price">券后价
                    <text style="font-size: 24upx">¥<text style="font-weight: bold">0</text></text>
                </text>

                <!--  #ifndef MP-ALIPAY -->
                <text class="quan" v-if="couponmoney!=null">
                    <i></i>免单<i></i>
                </text>
                <!--  #endif -->
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "orange-goods-list",
        props: [
            "itempic", "itemtitle", "itemprice", "itemsale", "itemendprice", "couponmoney", "itemid", "logo","tkmoney","isInvitation"
        ],
        methods: {
            open(itemid) {
               let relation_id = this.$queue.getData("relation_id");
                if (relation_id) {
                    uni.navigateTo({
                        url: "/pages/detail/goodsinfos?itemid=" + itemid + "&relation_id=" + relation_id,
                    })
                } else {
                    uni.navigateTo({
                        url: "/pages/detail/goodsinfos?itemid=" + itemid,
                    })
                }
            },
        }
    }
</script>

<style>
    @import "../../static/css/index.css";
</style>
