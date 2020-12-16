<template>
	<view class="">
		<view class='simple-load load-modal' v-if="showLoading"  @touchmove.stop.prevent="moveHandleStop"> 
			<image :src='image' class='png' mode='aspectFit'></image>
			<view class='has-desc-color'>{{text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showLoading:false,
				image:"",
				text:"",
			};
		},
		methods:{
			show:function(config){
				if(config['image'] != undefined )  this.image = config['image']
				if(config['text'] != undefined )  this.text = config['text']
				this.showLoading = true;
			},
			hide:function(){
				this.showLoading = false;
			},
			moveHandleStop:function(){
				
			}
		}
	}
</script>

<style>

</style>
