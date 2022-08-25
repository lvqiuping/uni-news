<template>
	<view>
		<view style="margin: .5rem 0">
			<u-search placeholder="请输入新闻标题" v-model="title" :showAction=fasle @search="search"></u-search>
		</view>
		<block v-if="searchData.length > 0">
			<view @click="toDetail(item)" class="message-list-item" v-for="(item, index) in searchData" :key="index">
				<view class="message-list-item-right">
					<view class="message-list-item-right-title over_two_lines">
						{{ item.title }}
					</view>
					<view class="message-list-item-right-small-text">
						<view style="margin-right: 30rpx;">阅读 {{ item.read_count }}</view>
						<view></view>
					</view>
				</view>
				<view class="message-list-item-left">
					<u--image width="80px" height="80px" radius="15px" :src="item.cover_img"></u--image>
				</view>
			</view>
		</block>
		<block v-else>
			<u-empty mode="data"></u-empty>
		</block>
	</view>
</template>

<script>
	export default {
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
		// #ifdef MP-WEIXIN
		watch: {
			title(v) {
				// this.getList()
			}
		},
		// #endif
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
