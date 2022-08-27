<template>
	<view style="padding: 20rpx;">
		<view style="margin-bottom: .5rem">
			<u-search placeholder="搜索内容" v-model="title" :showAction=fasle @search="search" shape="square">
			</u-search>
		</view>

		<message-list :list="searchData"></message-list>
		<u-loadmore v-if="!hasMore" status="nomore" height="30"></u-loadmore>
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
				limit: 1,
				hasMore: true
			}
		},
		onLoad(option) {
			this.title = option.title
			this.getList()
		},
		onReachBottom(e) {
			if (!this.hasMore) {
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
				that.http.get("/News/index", {
					title: this.title,
					page: this.page,
					limit: this.limit
				}).then(result => {
					if (that.limit === result.data.length) {
						++that.page
					} else {
						that.hasMore = false
					}

					that.searchData = that.searchData.concat(result.data)
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
</style>
