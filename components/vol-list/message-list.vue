<template>
	<view>
		<view class="swiper-info">
			<u-swiper height="538rpx" :list="swiperList" :radius="0" indicator indicatorMode="dot" circular indicatorActiveColor="#FC5C5B" />
		</view>
		<view class="news-info">
			<view class="news-info-inner">
					<u-row>
						<u-col span="4">
							<view class="n-left">
								<u--image width="80rpx" height="80rpx" :src="localImage1"></u--image>
								<view class="n-tips">快讯</view>
							</view>
						</u-col>
						<u-col span="8">
							<view class="n-right over_two_lines"></view>
						</u-col>
					</u-row>
			
			</view>
		</view>

		<view @click="toDetail(item)" class="message-list-item" v-for="(item,index) in data" :key="index">
			<view class="message-list-item-right">
				<view class="message-list-item-right-title over_two_lines">
					{{item.title}}
				</view>
				<view class="message-list-item-right-small-text" v-if="index===0">
						<u-tag text="置顶" type="error" shape="circle" size="large"></u-tag>
				</view>
				<view class="message-list-item-right-small-text" v-else="index>0">
				  <view style="margin-right: 30rpx;">11个小时前</view><view>20个评论</view>
				</view>
			</view>
			<view class="message-list-item-left">
				<u--image width="80px" height="80px" radius="15px" :src="item.cover_img"></u--image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				localImage1: '/static/imgs/2x.png',
				swiperList: [
					'/static/swiper1.png',
					'/static/swiper2.png',
					'/static/swiper3.png'
				],
				data: [],
				phone: false
			}
		},
		created() {
			this.data = this.list;
		},
		// #ifdef MP-WEIXIN
		watch: {
			list: {
				handler(val) {
					this.data = val;
				},
				immediate: true,
				deep: true
			}
		},
		// #endif
		methods: {
			toDetail(item) {
				// if(this.$store.state.userInfo.phone === null){
				// 	uni.navigateTo({
				// 		url: '/pages/phone/phone'
				// 	})
				// }
				uni.navigateTo({
					url: '/components/vol-list/detail/detail?id=' + item.id + "&title=" + item.title
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.over_two_lines{
	    display: -webkit-box;
	    word-break: break-all;
	    text-overflow:ellipsis;
	    overflow: hidden;
	    white-space: pre-line;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp:2;
	}
	.news-info {
		display: flex;
		justify-content: center;
		background-color: #F7F7F7;
		height: 193rpx;
		font-size: 30rpx;
		.news-info-inner {
			background-color: #ffffff;
			height: 141rpx;
			width: 96%;
			margin: auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			border-radius: 20rpx;
			.n-left{
				display: flex;
				justify-content: center;
				.n-tips{
					color: #FC5C5B; 
					margin-left: 10rpx;
					margin-top: 20rpx;
				}
			}
			.n-right{
				color: #666666;
				padding-top: 5rpx;
				padding-right: 10rpx;
			}
		}
	}
	.message-list-item {
		min-height: 100rpx;
		display: flex;
		justify-content: space-between;
		padding: 40rpx;
		border-bottom: 1px solid #999999;
	}

	.message-list-item-left {
		
	}

	.message-list-item-right {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.message-list-item-right-title {
			font-size: 40rpx;
			color: #333333;
			margin-bottom: 20rpx;
			margin-right: 20rpx;
		}

		.message-list-item-right-small-text {
			display: flex;
			font-size: 30rpx;
			color: #999999;

			.text {
				flex: 1;
			}

			.text:last-child {
				text-align: right;
			}

			.flag {
				padding: 1px 5px;
				border-radius: 3px;
				font-size: 20rpx;
				background: #f44336;
				color: #ffff;
				position: relative;
				top: -2px;
			}
		}
	}
</style>
