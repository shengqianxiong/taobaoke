<template>
	<view class="content">
		<!-- <view class="beijing"> -->
			<view class="post" v-show="tishi==1" >
				<p style="color: #ffffff;font-size: 30upx;margin-top: 70upx;">长按保存图片至相册</p>
				<view class="content" style="text-align: center;width: 85%;margin: 0 auto;">
					<view style="padding-top: 20upx;margin-top: 30upx;background: #ffffff;">
						<view @click="guanbi" >
						  <img id="test" style="width: 580upx;height: 954upx;"/>
						</view>
					</view>
				</view>
				<!-- #ifdef APP-PLUS -->
			<image @click="guanbi" class="cha" style="width: 80upx;height: 80upx; margin-top: 25upx;margin-left: 47%;"></image>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<image @click="guanbi" class="cha" style="width: 80upx;height: 80upx; margin-top: 25upx; margin: 0;"></image>
			<!-- #endif -->
			</view>
		<!-- </view> -->
		
		<view class="tupian" @click="erweima" style="text-align: center;"></view>
	</view>
</template>
 
<script>
	import canvas_x from '../../common/canvas_x.js';

	export default {
		
		data() {
			return {
				tishi:0,
				userid:0,
				img:"",
				phone:"",
				poster: {},
				qrShow: false,
				canvasId: 'default_PosterCanvasId',
				nickname:"",
				val:""
			};
		},
		onLoad(option) {
			//二维码地址（可从后台获取地址进行赋值）
			this.val='http://www.baidu.com'
		},
		methods: {
			
			guanbi:function(){
				this.tishi=0;
			},
			erweima:function(){
				this.tishi=1;
				canvas_x.makeImage({
								type: 'url',
								parts: [
									{
										type: 'image',
										url: '../../static/beijing22.jpg',
										width: 680,
										height: 1264,
										// backgroundSize:680,
									},
									{
										type: 'qrcode',
										text: this.val,
										x: 80,
										y: -50,
										width: 130,
										height: 130,
										padding: 0,
										background: '#fff',
										level: 3
									},
									{
										type: 'text',
										text: '玫瑰',
										textAlign: 'left',
										lineAlign: 'TOP',
										x: 440,
										y: 1115,
										color: 'black',
										size: '30px',
										// bold: true
									},
									{
										type: 'text',
										text:'玫瑰',
										textAlign: 'left',
										lineAlign: 'TOP',
										x: 440,
										y: 1185,
										color: 'black',
										size: '30px',
										// bold: true
									}
								],
								width: 680,
								height: 1264
							}, (err, data) => {
								document.getElementById('test').src = data
							})
			}
		}
	};
</script>
 
<style lang="scss">
	.post {
		width: 100%;
		height: 100%;
		background-color:rgba(0,0,0,0.7);
		position: fixed;
		top: 0upx;
		z-index: 10000;
		text-align: center;
		.wrapper {
			height: 1420upx;
			width: 610upx;
			margin: 0 auto;
			margin-top: -150upx;
			
			// margin-top: 50upx;
		}
	}
	.tupian{
		width: 100%;
		height: 1360upx;
		background-image: url('../../static/tutu3.png');
		background-size:750upx 1360upx ;
	}
	
	.cha{
		background-image: url('../../static/chacha.png');background-size: 80upx 80upx;
		position: relative;
		top: 40upx
	
	}
</style>
