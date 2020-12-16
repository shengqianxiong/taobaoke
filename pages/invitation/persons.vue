<template>
    <view style="text-align: left">
        <view v-for="(item, index) in list" :key="index"
              style="background: white;padding: 8px;font-size:14px;margin-bottom: 1px;display: flex">
            <view style="width: 75%;display: flex">
                <view>
                    <image class="portrait" :src="item[1]"
                           style="width: 48px;height: 48px;border-radius: 30px;margin-right: 8px"></image>
                </view>
                <view>
                    <view style="margin-bottom: 4px;color: #e10a07;">
                        <text style="color: #000000;margin-right: 2px;">等级</text>
                        {{item[3]?'会员':'游客'}}
                    </view>
                    <view style="margin-bottom: 4px;color: black"> 昵称 {{item[2]}}</view>
                    <view style="margin-bottom: 4px"> 时间 {{item[0]}}</view>
                    <view style="margin-bottom: 4px;color: #e10a07;" v-if="item[3]">
                        <text style="color: #000000;margin-right: 2px;">会员编号</text>
                        {{item[3]}}
                    </view>
                </view>
            </view>
        </view>
        <empty v-if="list.length === 0" des="快去邀请好友赚钱吧" show="false"></empty>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                list: [],
                page: 0,
                total: 0,
            }
        },
        onLoad: function (e) {
            this.getMoney();
        },
        onReachBottom: function () {
            this.page = this.page + 1;
            if (this.total != this.list.length) {
                this.getMoney();
            }
        },
        onPullDownRefresh: function () {
            this.page = 0;
            this.total = 0;
            this.list = [];
            this.getMoney();
        },
        onNavigationBarButtonTap(val) {
            uni.navigateTo({url: "/pages/share/shares"})
        },
        methods: {

            getMoney() {
                let relationId = this.$queue.getData("relation_id");
                if (relationId) {
                    this.$queue.showLoading("加载中...");
                    //可以提现金额查询预估收入查询
                    this.$Request.getT("/user/getUsersByInvitation?invitation=" + relationId + "&page=" + this.page + "&size=10").then(res => {
                        if (res.status === 0 && res.data) {
                            this.total = res.data.totalElements;
                            uni.setNavigationBarTitle({
                                title: "已邀请成员" + res.data.totalElements + "人"
                            });
                            res.data.content.forEach(d => {
                                this.list.push(d);
                            })
                        }
                        uni.hideLoading();
                    });
                }

            },
        },

    }
</script>

<style lang='scss'>
    @import "../../static/css/index.css";

</style>
