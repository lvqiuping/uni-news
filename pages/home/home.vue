<template>
	<view :style="{height:height+50+'px'}">
			<view class="user-info">
						<view class="u-left">
							<image class="u-img" :src="userInfo.img"></image>
							<view class="u-title">{{userInfo.userName}}</view>
						</view>
						<view class="u-right">
							<u--input 
							v-model="searchWord" 
							placeholder="大家都在搜" 
							clearable
							suffixIcon="search" 
							suffixIconStyle="color: #909399" shape="circle"
							border
							@click="search"
							 />
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
			<view style="height: 115rpx;"></view>
			<vol-tabbar :index="0"></vol-tabbar>
			<!-- 弹框 -->
			<u-notify message="请输入关键词" :show="showSearch"></u-notify>
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
				showSearch: false,
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
			var that = this;
			that.userInfo.img = that.$store.state.userInfo.header_img
			that.userInfo.userName = that.$store.state.userInfo.nickname
			that.userInfo.openid = that.$store.state.userInfo.openid
			uni.hideTabBar({
				animation: false
			})
			that.getList(that.cid0)
		},
		methods: {
			search(){
				this.showSearch = true
			},
			getNav(){
				var that = this;
				let params = { openid: that.userInfo.openid }
					that.http.get("/NewsCate/index", params, false).then(result => {
						result.data.forEach((item)=> {
							that.tabsTitle.push({name: item.title, id: item.id}) // 框架需要的格式
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
				let params = { openid: that.userInfo.openid, id: cid }
				that.http.get("/News/index", params, false).then(result => {
					// result.forEach(item => {
					// 	item.imageUrl = this.http.ipAddress + item.imageUrl;
					// })
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
			.u-right{
				border: 1px solid #333333;
				border-radius: 50rpx;
			}
		}
		.tabs-info{
			.t-title{
				margin: 0 0 20rpx 0;
			}
		}
</style>
