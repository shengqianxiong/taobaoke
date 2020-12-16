<template>
	<view style="width:680rpx">
		<view class="modal-box " :class="isVisibility?'show':''" @touchmove.stop.prevent="moveHandleStop">
		  <view class="dialog">
		    <view class="simple-bar justify-end has-borderb" v-if="title != '' ">
		      <view class='content'>{{title}}</view>
		    </view>
		    <view :class="contentClass" v-bind:style="'text-align:'+messageAlign">{{message}}</view>
		    <view class="simple-bar has-bordert">
				<view class='action has-mg-0 flex-sub text-green' v-if="showCancelButton == true" @tap='handleClose'>{{cancelButtonText}}</view>
				<view class='action has-mg-0 flex-sub has-borderl' v-if="showConfirmButton == true" @tap='handleConfirm'>{{confirmButtonText}}</view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
/**
 * 弹窗插件 
 * 使用方法：
 * 		1.引入组件：import simpleDialog from '@/components/simple-pro/dialog.vue';
 * 		2.定义：components ，simpleDialog 
 * 		3.页面使用：<simpleDialog ref="simpleDialog2"></simpleDialog> 
 * 		4.指定方法 this.$refs.simpleDialog2.func(); 
 * 		
 * 自定义方法：
 * 		1. alert() ; 支持在方法中传入 object 更改内容  该方法仅弹出一个按钮 （如果传入了object参数 其中的参数值优先级最高）
 * 		2. confirm(); 同理 可传入object参数 该方法支持确定、取消 按钮  （如果传入了object参数 其中的参数值优先级最高）
 */
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		message: {
			type: String,
			default: '你怎么会看到我^_^'
		},
		contentClass:{
			type :String,
			default:'has-pd-50 has-bg-white', 
		},
		// 内容对齐方式 center | left | right
		messageAlign: {
			type: String,
			default: 'center'
		},
		// 是否显示确认按钮
		showConfirmButton: {
			type: Boolean,
			default: true
		},
		// 是否显示取消按钮
		showCancelButton: {
			type: Boolean,
			default: false
		},
		// 确定按钮的文案
		confirmButtonText: {
			type: String,
			default: '确定'
		},
		// 取消按钮的文案
		cancelButtonText: {
			type: String,
			default: '取消'
		}
	},

	data() {
		return {
			isVisibility: false
		};
	},
	methods: {
		__show() {
			this.isVisibility = true;
		},
		__close() {
			this.isVisibility = false;
		},
		__setconfig(options){
			if(options != undefined && (typeof options == "object") ){
				if (options['title']!=undefined) this.title = options['title']
				if (options['message']!=undefined) this.message = options['message']
				if (options['contentClass']!=undefined) this.contentClass = options['contentClass']
				if (options['messageAlign']!=undefined) this.messageAlign = options['messageAlign']
				if (options['showConfirmButton']!=undefined) this.showConfirmButton = options['showConfirmButton']
				if (options['showCancelButton']!=undefined) this.showCancelButton = options['showCancelButton']
				if (options['confirmButtonText']!=undefined) this.confirmButtonText = options['confirmButtonText']
				if (options['cancelButtonText']!=undefined) this.cancelButtonText = options['cancelButtonText']
			}
		},
		alert(options) {
			// <simpleDialog ref="simpleDialog"></simpleDialog>
			// this.$refs.simpleDialog.alert();
			this.__setconfig(options);
			this.__show();
		},
		confirm(options) {
			this.showCancelButton = true;
			this.__setconfig(options);
			this.__show();
		},
		handleClose() {
			this.__close();
			this.$emit('cancelButton');
		},
		handleConfirm() {
			this.__close();
			this.$emit('confirmButton');
		},
		moveHandleStop:function(){
			
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
