<template>
    <view style="width: 100%;height: 100%;position: absolute;background: white" @dblclick="navBack">
       <!-- #ifdef H5 -->
	    <view v-if="isShow" class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
       <!-- #endif -->
        <view style="background: whitesmoke">
            <wm-poster :imgSrc="itempic" :QrSrc="erweima" :Title="itemtitle" :PriceTxt="itemendprice"
                       :OriginalTxt="itemprice"></wm-poster>
        </view>
    </view>
</template>

<script>
    import wmPoster from "@/components/wm-poster/wm-poster.vue"

    export default {
        components: {
            wmPoster
        },
        data() {
            return {
                itemendprice: '',
                itemtitle: '',
                isShow: false,
                user: '',
                itemprice: '',
                erweima: 'http://img.alicdn.com/imgextra/i2/3841585233/O1CN01dqOFc01oWlA1A4cf6_!!3841585233.jpg',
                itempic: 'http://img.alicdn.com/imgextra/i2/3841585233/O1CN01dqOFc01oWlA1A4cf6_!!3841585233.jpg',
            }
        },
        onLoad: function (e) {
            let that = this;
            this.itempic = this.$queue.getData("itempic");
            this.itemtitle = this.$queue.getData("itemtitle");
            this.itemprice = this.$queue.getData("itemprice");
            this.itemendprice = this.$queue.getData("itemendprice");
            this.erweima = this.$queue.getData("erweima");
            setTimeout(function () {
                that.isShow = true;
            }, 2000)
        },
        methods: {
            navBack() {
                uni.navigateBack();
            },
        }
    }
</script>

<style lang='scss'>
    .back-btn {
        position: absolute;
        left: 20px;
        z-index: 9999;
        padding-top: var(--status-bar-height);
        top: 20px;
        font-size: 20px;
    }
</style>
