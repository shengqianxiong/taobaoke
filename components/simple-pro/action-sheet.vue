<template name="simpleActionSheet">
	<view class="simple-action-sheet" v-if="show"  @touchmove.stop.prevent="moveHandleStop">
		<view class="simple-actionsheet-mask" v-if="overlay" v-bind:style="{ zIndex: zIndex-1 }" @click="ActionCloseOverlay"></view>
	 	<view class="simple-actionsheet" v-bind:style="{ zIndex: zIndex }" :class="[show ? 'simple-actionsheet-animate-show' : '']">
	 		<view class="simple-actionsheet-content">
	 			<view class="simple-actionsheet_item" hover-class="simple-actionsheet_item_hover" v-for="(item,index) in actions" :key="index" @click="ActionClick(index)">{{item.name}}</view>
	 			<view class="simple-actionsheet_item simple-actionsheet_item-cancel" hover-class="simple-actionsheet_item_hover" @click="ActionCancelClick">{{cancelText}}</view>
	 		</view>
	 	</view>
	</view>
</template>
<script>
	export default {
		name: "simpleActionSheet",
		props: {
			show:{
				type : Boolean,
				default:false, // 是否展示 
			},
			actions:{
				type : Array,
				default : [], // 菜单选项  
			},
			title: {
				type: String,
				default: "" // 标题
			},
			zIndex:{
				type : Number,
				default : 100 // z-index 层级
			},
			cancelText:{
				type: String,
				default: "取消" //取消按钮文字 
			},
			overlay:{
				type : Boolean,
				default:true, // 是否显示遮罩层
			},
			closeOverlay:{
				type : Boolean,
				default:true, // 是否点击遮罩层关闭
			}
		},
		methods:{
			ActionClick:function(index){
				var action = this.actions[index];
				this.$emit('select',action); // 选中  
			},
			ActionCancelClick:function(){
				this.$emit('cancel'); // 点击了取消按钮 
			},
			ActionCloseOverlay:function(){
				this.$emit('close'); // 点击了遮罩层 
			},
			moveHandleStop:function(){
				
			}
		}
	}
</script>
<style>

.simple-action-sheet .simple-actionsheet{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    color: #323233;
    max-height: 90%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f8f8f8;
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    z-index: 5000;
    width: 100%;
    background-color: #efeff4;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
}
.simple-action-sheet .simple-actionsheet.simple-actionsheet-animate-show{
    -webkit-transform: translate(0);
    transform: translate(0);
}
.simple-action-sheet .simple-actionsheet-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}
.simple-action-sheet .simple-actionsheet .simple-actionsheet_item{
    height: 100rpx;
    line-height: 100rpx;
    font-size: 32rpx;
    text-align: center;
    background-color: #fff;
    border-bottom: 1rpx solid #ebedf0;
}
.simple-action-sheet .simple-actionsheet .simple-actionsheet_item_hover{
    background-color: #e8e8e8;
}
.simple-actionsheet_item-cancel{
	margin-top: 10rpx;
}
</style>