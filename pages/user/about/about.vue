<template>
	<view :style="{height:height+50+'px'}">
			<view class="user-info">
				<u-row>
					<u-col :span="6">
						<view class="u-left">
							<image class="u-img" :src="userInfo.img"></image>
							<view class="u-title">{{userInfo.userName}}</view>
						</view>
					</u-col>
					<u-col :span="6">
						<view class="u-right">
							<u--input v-model="userInfo.verificationCode" placeholder="大家都在搜" clearable
								suffixIcon="search" suffixIconStyle="color: #909399" shape="circle" />
						</view>
					</u-col>
				</u-row>
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
						        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" @change="tabsClick">
						</u-tabs>
					</u-sticky>
				</view>
				<view class="t-list">
					<u-skeleton rows="3" :loading="loading" avatar :title="false">
						<u-list @scrolltolower="scrolltolower" :height="height" :lowerThreshold='50'>
							<message-list :list="list"></message-list>
						</u-list>
					</u-skeleton>
				</view>
			</view>
			<view style="height: 115rpx;"></view>
			<vol-tabbar :index="0"></vol-tabbar>
		</view>
</template>

<script>
	import messagelist from '@/pages/message/message-list.vue'
	export default {
		components: {
			'message-list': messagelist
		},
		data() {
			return {
				id: 0,
				page: 0,
				loading: false,
				tabsTitle: [],
				list: [],
				height: 0,
				userInfo: {},
				img: ''
			}
		},
		onLoad() {
			var _this = this;
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: function(data) {
					_this.height = data.statusBarHeight;
				}
			})
		},
		async onLoad() {
			await this.getNav();
			if (!this.tabsTitle.length) {
				this.loading = false;
				return;
			}
			this.id = this.tabsTitle[0].id;
			this.getList(); //初始列表

		},
		onShow() {
			console.log('that.$store.state.userInfo', that.$store.state.userInfo)
			var that = this;
			that.userInfo.img = that.$store.state.userInfo.header_img
			that.img = that.$store.state.userInfo.header_img
			that.userInfo.userName = that.$store.state.userInfo.nickname
			uni.hideTabBar({
				animation: false
			})
		},
		methods: {
			var that = this;
			// 获取tab栏数据
			async getNav() {
				await that.http.get('api/app_news/getList', {}, true).then(result => {
					console.log('result', result)
					that.tabsTitle = result
					console.log('this.tabsTitle', that.tabsTitle)
				})
			},
			// 点击tab栏就去请求数据列表
			tabsClick(v) {
				console.log('zhe', v)
			},
			// 这是？
			scrolltolower() {
				console.log('点击的id', id)
				this.getList();
			},
			// 获取列表写进list
			getList() {
				if (this.page < 0) {
					return;
				}
				this.page++;
				let url = 'api/app_news/getList?newsType=' + this.id + "&page=" + this.page;
				this.http.get(url, {}, false).then(result => {
					console.log('result', result)
					result.forEach(item => {
						item.imageUrl = this.http.ipAddress + item.imageUrl;
					})
					if (!result.length) {
						this.page = -1;
					}
					this.list.push(...result);
					this.loading = false;
				})
			},
		}
	}
</script>
<style lang="less" scoped>
		.user-info {
			margin: 40rpx 20rpx 20rpx;

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
				}
			}
		}
		.tabs-info{
			.t-title{
				margin: 0 0 20rpx 0;
			}
		}
</style>
