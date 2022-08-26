<template>
	<view style="padding: 20rpx;">
		<view style="margin-bottom: .5rem">
			<u-search placeholder="搜索内容" v-model="title" :showAction=fasle @search="search" shape="square">
			</u-search>
		</view>

		<message-list :list="searchData"></message-list>
	</view>
</template>

<script>
	import messageList from '@/components/vol-list/message-list.vue'
	export default {
		components: {
			messageList
		},
		data() {
			return {
				title: '',
				searchData: [],
				page: 1,
				limit: 10,
				hasMore: true
			}
		},
		onLoad(option) {
			var that = this;
			that.title = option.title
			that.getList()
		},
		onReachBottom(e) {
			if (!this.hasMore) {
				uni.showToast({
					title: '没有更多数据'
				})

				return false
			}
			this.getList()
		},
		methods: {
			search() {
				this.page = 1
				this.hasMore = true
				this.searchData = []
				this.getList()
			},
			// 获取列表写进list
			getList() {
				var that = this;
				let params = {
					title: this.title,
					page: this.page,
					limit: this.limit
				}
				that.http.get("/News/index", params).then(result => {
					if (that.limit === result.data.length) {
						++that.page
					} else {
						that.hasMore = false
					}

					if (result.data.length > 0) {
						that.searchData = that.searchData.concat(result.data)
					} else {
						that.searchData = result.data
					}
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
		border-bottom: 1px solid #ccc;
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
