<template>
	<view style="min-height: 100vh; padding: 10rpx">
		<u-row justify="space-between" gutter="10">
			<u-col span="4">
				<u-row justify="space-between">
					<u-col span="12">
						<u--image class="" :src="logo" width="65" height="40"></u--image>
					</u-col>
				</u-row>
			</u-col>
			<u-col span="8">
				<u-search placeholder="搜索内容" v-model="searchWord" :showAction=fasle @search="search" shape="square">
				</u-search>
			</u-col>
		</u-row>

		<view style="margin-bottom: 12px">
			<u-sticky bgColor="#fff">
				<u-tabs :list="tabsTitle" lineColor="#f56c6c" :current="index" :activeStyle="{
								            color: '#Fc5c5b',
								            fontWeight: 'bold',
											fontSize: '30rpx',
								            transform: 'scale(1.05)'
								        }" :inactiveStyle="{
								            color: '#606266',
											fontSize: '30rpx',
								            transform: 'scale(1)'
								        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @click="tabsClick"
					@change="tabsChange" />
			</u-sticky>
		</view>

		<u-row justify="space-between">
			<u-col span="12">
				<message-list :list="list[tabIndex]"></message-list>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	import messagelist from '@/components/vol-list/message-list.vue'
	const app = getApp()
	export default {
		components: {
			'message-list': messagelist
		},
		data() {
			return {
				tabsTitle: [],
				list: [],
				height: 0,
				cid0: 0,
				userInfo: {},
				searchWord: '',
				tabIndex: 0,
				page: 1,
				limit: 10,
				hasMore: true,
				appName: '',
				logo: '/static/imgs/logo.png'
			}
		},
		watch: {
			page(v) {
				// this.getList(this.tabsTitle[this.tabIndex].id)
			}
		},
		onLoad() {
			var that = this;
			uni.getSystemInfo({ // 获取手机状态栏高度
				success: function(data) {
					that.height = data.statusBarHeight;
				}
			})
			this.appName = app.globalData.appName

			that.getNav();
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			uni.hideTabBar({
				animation: false
			})
		},
		onShareAppMessage() {

		},
		onShareTimeline() {

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
		onPullDownRefresh(e) {
			console.log('pulldown', e)
			this.list[this.tabIndex] = []
			this.getList()
		},
		methods: {
			search() {
				uni.navigateTo({
					url: '/components/vol-list/search-list/search-list?title=' + this.searchWord
				})
			},
			getNav() {
				var that = this
				that.http.get("/NewsCate/index").then(result => {
					result.data.forEach((item) => {
						that.tabsTitle.push({
							name: item.title,
							id: item.id
						}) // 框架需要的格式
					})
					that.getList(result.data[0].id)
				})
			},
			tabsClick(v) {
				this.tabIndex = v.index

				if (!this.list[this.tabIndex]) {
					this.getList()
				}
			},
			// 获取列表写进list
			getList(cid) {
				var that = this
				let params = {
					cid: this.tabsTitle[this.tabIndex].id,
					page: this.page,
					limit: this.limit
				}
				that.http.get("/News/index", params).then(result => {
					if (that.limit === result.data.length) {
						++that.page
					} else {
						that.hasMore = false
					}

					let c = that.list[that.tabIndex]
					if (c) {
						that.$set(that.list, that.tabIndex, c.concat(result.data))
					} else {
						that.$set(that.list, that.tabIndex, result.data)
					}
				})
			},
			tabsChange(v) {
				// console.log(v)
			}
		}
	}
</script>
<style lang="less" scoped>
</style>
