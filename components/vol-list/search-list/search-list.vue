<template>
	<view>
		<view @click="toDetail(item)" class="message-list-item" v-for="(item,index) in searchDate" :key="index">
			<view class="message-list-item-right">
				<view class="message-list-item-right-title over_two_lines">
					{{item.title}}
				</view>
				<view class="message-list-item-right-small-text">
					<view style="margin-right: 30rpx;">11个小时前</view>
					<view>20个评论</view>
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
		data() {
			return {
				title: '',
				searchDate: []
			}
		},
		onLoad(option) {
			var that = this;
			that.title = option.title
			that.getList(that.title)
		},
		// #ifdef MP-WEIXIN
		watch: {},
		// #endif
		methods: {
			// 获取列表写进list
			getList(title) {
				var that = this;
				let params = {
					title: title
				}
				console.log('params', params)
				that.http.get("/News/index", params).then(result => {
					that.searchDate = result.data;
				})
			},
			toDetail(item) {
				const userInfo = uni.getStorageSync('userInfo')
				if (!userInfo.phone) {
					uni.navigateTo({
						url: '/pages/phone/phone'
					})
				} else {
					uni.navigateTo({
						url: '/components/vol-list/detail/detail?id=' + item.id + "&title=" + item.title
					})
				}

			}
		}
	}
</script>
<style lang="less" scoped>
	.over_two_lines {
		display: -webkit-box;
		word-break: break-all;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: pre-line;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.message-list-item {
		min-height: 100rpx;
		display: flex;
		justify-content: space-between;
		padding: 40rpx;
		border-bottom: 1px solid #999999;
	}

	.message-list-item-left {}

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
