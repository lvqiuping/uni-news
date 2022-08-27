<template>
	<block>
		<block v-if="list.length > 0">
			<view v-for="(item, index) in list" style="padding-bottom: 10px;" :key="index">
				<u-row justify="space-between" gutter="10" @click="toDetail(item)">
					<u-col span="9">
						<u--text lines="2" :text="item.title" bold margin="0 0 8px 0">
						</u--text>
						<u--text type="info" size="12" block :text="'阅读 ' + item.read_count"></u--text>
					</u-col>
					<u-col span="3" justify="end">
						<u--image width="80px" height="80px" radius="15px" :src="item.cover_img || ''"></u--image>
					</u-col>
				</u-row>
				<u-line margin="10px 0"></u-line>
			</view>
		</block>
		<block v-else>
			<u-row gutter="10">
				<u-col span="12">
					<u-empty mode="data"></u-empty>
				</u-col>
			</u-row>
		</block>
		<u-popup :show="show" mode="bottom" :round="10" closeable="true" @close="close" @open="open">
		<view class="slot-boxs">
			<view class="tips">
				是否确定继续前往查看更多内容？
			</view>
			   <view class="slot-content">
			   <view class="but1">
				   <u-button type="info" @click="cancel">
				   	取消
				   </u-button>
			   </view>
			     <view class="but1">
					 <u-button type="primary" openType="getPhoneNumber" @getphonenumber="getPhoneNumber" class="but1">
					 	确定
					 </u-button>
			     </view>
			   
			   </view>
		</view>
			</u-popup>
	</block>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				show: false,
				newsInfo: {
					id: 0,
					title: ''
				}
			};
		},
		methods: {
			open() {
				// console.log('1')
			},
			close() {
				this.show = false
				return
			},
			cancel() {
				this.show = false
				return
			},
			toDetail(item) {
				this.newsInfo = Object.assign({}, this.newsInfo, {
					id: item.id,
					title: item.title
				})
				const userInfo = uni.getStorageSync('userInfo')
				if(userInfo.phone){
					this.show = true
					return
				}
				const url = '/components/vol-list/detail/detail?id=' + item.id + "&title=" + item.title
				uni.navigateTo({
					url: url
				})
			},
			getPhoneNumber(e) {
				this.show = false
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					this.http.post('/User/getUserPhoneNumber', {
						code: e.detail.code
					}).then(res => {
						if (res.code === 1) {
							const userInfo = uni.getStorageSync('userInfo')
							userInfo.phone = res.data.phoneNumber
							uni.setStorageSync('userInfo', userInfo)
							uni.navigateTo({
								url: '/components/vol-list/detail/detail?id=' + this.newsInfo.id + "&title=" + this.newsInfo.title
							})
						}
					})
				} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
					console.log('拒绝获得手机号')
				}

			}
		}
	}
</script>
<style lang="less" scoped>
	.slot-boxs{
		height: 350rpx;
		padding: 20rpx;
	}
	.tips{
		color: rgba(0, 0, 0, .6);
		padding: 20rpx;
		margin-bottom: 60rpx;
		
	}
	.slot-content {
		   display: flex;
		   flex-direction: row;
		   justify-content: center;
		   align-items: center;			
	}
	.but1{
		width: 28%;
		margin-right: 30rpx;
		padding-bottom: 40rpx;
		
	}
</style>
