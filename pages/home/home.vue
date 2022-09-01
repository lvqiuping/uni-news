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

		<view style="margin: 12px 0">
			<u-sticky bgColor="#fff">
				<u-tabs :list="tabsTitle" lineColor="#f56c6c" :current="tabIndex" :activeStyle="{
								            color: '#Fc5c5b',
								            fontWeight: 'bold',
											fontSize: '30rpx',
								            transform: 'scale(1.05)'
								        }" :inactiveStyle="{
								            color: '#606266',
											fontSize: '30rpx',
								            transform: 'scale(1)'
								        }" itemStyle=" padding-right: 15px; height: 34px;" @click="tabsClick" />
			</u-sticky>
		</view>

		<u-row justify="space-between">
			<u-col span="12">
				<view style="margin-bottom: 10px;">
					<u-row justify="space-between">
						<u-col span="12">
							<u-swiper :list="swiperList" :radius="0" indicator indicatorMode="dot" circular
								indicatorActiveColor="#FC5C5B" />
						</u-col>
					</u-row>
				</view>
				<message-list :list="list[tabIndex]"></message-list>
				<u-loadmore v-if="!tabsTitle[tabIndex].hasMore" status="nomore" height="30"></u-loadmore>
			</u-col>
		</u-row>
		<!-- <phone-file :show="show"></phone-file> -->
	</view>
</template>

<script>
	import messagelist from '@/components/vol-list/message-list.vue'
	// import PhoneFile from '@/components/view-phone/phone-file.vue' 'phone-file': PhoneFile
	const app = getApp()
	export default {
		components: {
			'message-list': messagelist
		},
		data() {
			return {
				show: true,
				swiperList: [
					'/static/imgs/swiper1.jpg',
					'/static/imgs/swiper1.jpg'
				],
				tabsTitle: [],
				list: [],
				height: 0,
				cid0: 0,
				userInfo: {},
				searchWord: '',
				tabIndex: 0,
				limit: 10,
				appName: '',
				logo: '/static/imgs/logo.png'
			}
		},
		onLoad(option) {
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
		},
		onShareAppMessage() {

		},
		onShareTimeline() {

		},
		onReachBottom(e) {
			if (!this.tabsTitle[this.tabIndex].hasMore) {
				return false
			}
			this.getList()
		},
		onPullDownRefresh(e) {
			this.list[this.tabIndex] = []
			this.tabsTitle[this.tabIndex].hasMore = true
			this.tabsTitle[this.tabIndex].page = 1
			this.$set(this.tabsTitle, this.tabIndex, this.tabsTitle[this.tabIndex])
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
							id: item.id,
							hasMore: true,
							page: 1
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
					page: this.tabsTitle[this.tabIndex].page,
					limit: this.limit
				}
				that.http.get("/News/index", params).then(result => {
					if (that.limit === result.data.length) {
						++that.tabsTitle[that.tabIndex].page
					} else {
						that.tabsTitle[that.tabIndex].hasMore = false
						that.$set(that.tabsTitle, that.index, that.tabsTitle[that.tabIndex])
					}

					let c = that.list[that.tabIndex]
					if (c) {
						that.$set(that.list, that.tabIndex, c.concat(result.data))
					} else {
						that.$set(that.list, that.tabIndex, result.data)
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
</style>
