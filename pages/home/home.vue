<template>
	<view :style="{height:height+50+'px'}">
		<view class="user-info">
			<view class="u-left">
				<image class="u-img" :src="userInfo.header_img"></image>
				<view class="u-title">{{userInfo.nickname}}</view>
			</view>
			<view class="u-right">
				<u-search 
				placeholder="请输入新闻标题" 
				v-model="searchWord"
				:showAction=fasle
				@search="search"
				></u-search>
			</view>
		</view>
		<view class="tabs-info">
			<view class="t-title">
				<u-sticky bgColor="#fff">
					<u-tabs :list="tabsTitle" lineColor="#f56c6c" :activeStyle="{
						            color: '#Fc5c5b',
						            fontWeight: 'bold',
									fontSize: '30rpx',
						            transform: 'scale(1.05)'
						        }" :inactiveStyle="{
						            color: '#606266',
									fontSize: '30rpx',
						            transform: 'scale(1)'
						        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @change="tabsClick" />
				</u-sticky>
			</view>
			<view class="t-list">
				<u-skeleton rows="3" :loading="loading" avatar :title="false">
					<u-list :height="height" :lowerThreshold='50'>
						<message-list :list="list"></message-list>
					</u-list>
				</u-skeleton>
			</view>
		</view>
	</view>
</template>

<script>
	import messagelist from '@/components/vol-list/message-list.vue'
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
				searchWord: ''
			}
		},

		onLoad() {
			var that = this;
			uni.getSystemInfo({ // 获取手机状态栏高度
				success: function(data) {
					that.height = data.statusBarHeight;
				}
			})
			
			
		},
		async onLoad() {
			var that = this;
			await that.getNav();
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			uni.hideTabBar({
				animation: false
			})
			that.getList(that.cid0)
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
						that.cid0 = that.tabsTitle[0].id // 如何让一进页面就传递这个Id给list
					})
				})
			},
			tabsClick(v) {
				this.getList(v.id);
			},
			// 获取列表写进list
			getList(cid) {
				var that = this;
				let params = {
					cid: cid
				}
				that.http.get("/News/index", params).then(result => {
					that.list = result.data;
				})
			},
		}
	}
</script>
<style lang="less" scoped>
	.user-info {
		margin: 40rpx 20rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.u-left {
			display: flex;
			flex-direction: row;
			justify-content: left;
			align-items: center;

			.u-img {
				width: 85rpx;
				height: 85rpx;
				border-radius: 50%;
				border: 2rpx solid #FFFFFF;
				margin-right: 10rpx;
			}

			.u-title {
				font-size: 50rpx;
				color: #333333;
				white-space: nowrap;
			}
		}

		.u-right {
			
		}
	}

	.tabs-info {
		.t-title {
			margin: 0 0 20rpx 0;
		}
	}
</style>
