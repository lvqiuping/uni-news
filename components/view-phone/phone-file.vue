<template>
	<view>
		<u-popup :show="show" mode="center" :round="10">
			<view style="position: relative; width: 500rpx; height: 500rpx; text-align: center;">
				<image style="width: 100%; height: 50%;" src="@/static/imgs/tk.png"></image>
				<view style="position: absolute; bottom: 10%;">
					<u-row justify="center">
						<u-col :span="10">
							<view style="margin: 0 40rpx 40rpx 40rpx">
								<u--text text="为了提供更多的详情,小程序需要您的手机号授权" align="left" size="12" color="rgb(121,121,121)">
								</u--text>
							</view>
							<u-row justify="around">
								<u-col span="4">
									<u-button type="primary" :plain="true" size="small" text="拒绝"
										@click="cancelGetPhone">
									</u-button>
								</u-col>
								<u-col span="4">
									<u-button type="primary" size="small" text="允许" openType="getPhoneNumber"
										@getphonenumber="getPhoneNumber" @click="getPhone">
									</u-button>
								</u-col>
							</u-row>
						</u-col>
					</u-row>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: 'PhoneFile',
		props: ['showPop', 'detailId'],
		data() {
			return {
				show: this.showPop
			}
		},
		methods: {
			getPhoneNumber(e) {
				const that = this
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					that.http.post('/User/getUserPhoneNumber', {
						code: e.detail.code
					}).then(res => {
						if (res.code !== 1) {
							uni.showToast({
								title: res.msg
							})

							return false
						}


						const userInfo = uni.getStorageSync('userInfo')
						userInfo.phone = res.data.phoneNumber
						uni.setStorageSync('userInfo', userInfo)
						that.userInfo = userInfo
						uni.reLaunch({
							url: '/components/vol-list/detail/detail?id=' + that.detailId
						})
					})
				} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
					that.show = true
				}
			},
			getPhone() {
				this.show = false
				console.log(this.show)
			},
			cancelGetPhone() {
				uni.reLaunch({
					url: '/pages/home/home'
				})
			},
		}

	}
</script>

<style scoped>
	button::after {
		border: none;
	}

	.slot-boxs {
		width: 312px;
		height: 208px;
		padding: 20rpx;
	}

	.title {
		margin: 30rpx;
		font-weight: 800;
	}

	.tips {
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

	.but1 {
		width: 28%;
		margin-right: 30rpx;
		padding-bottom: 40rpx;

	}

	button::after {
		border: none;
	}
</style>
