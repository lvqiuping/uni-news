<template>
	<view>
		<u-popup :show="getShowPop" mode="center" :round="10">
			<view class="slot-boxs" style="position: relative">
				<view>
					<u--text text="提示" size="18" align="center" margin="30rpx 0 40rpx" bold></u--text>
				</view>
				<view style="padding: 20rpx;">
					<u--text text="为了提供更多的详情,小程序需要您的手机号授权" align="center" size="18" color="rgb(121,121,121)"></u--text>
				</view>
				<view style="position: absolute; bottom: 0; left: 0; right: 0; height: 46px;">
					<u-row>
						<u-col span="6">
							<button class="u-reset-button"
								style=" background: transparent; border-top: 1px solid #ccc; border-right: 1px solid #ccc; color: #909399"
								@click="cancelGetPhone">
								拒绝
							</button>
						</u-col>
						<u-col span="6">
							<button openType="getPhoneNumber" @getphonenumber="getPhoneNumber" @click="getPhone"
								class="u-reset-button"
								style="background: transparent; border-top: 1px solid #333; color: rgb(87, 107, 149) ">
								允许
							</button>
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
		props: {
			showPop: {
				type: Boolean,
				default: false
			},
			detailId: {
				type: Number,
				default: 0
			}
		},
		onShow(options) {
			console.log(options)
		},
		computed: {
			getShowPop() {
				return this.showPop
			}
		},
		methods: {
			getPhoneNumber(e) {
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					this.http.post('/User/getUserPhoneNumber', {
						code: e.detail.code
					}).then(res => {
						if (res.code === 1) {
							const userInfo = uni.getStorageSync('userInfo')
							userInfo.phone = res.data.phoneNumber
							uni.setStorageSync('userInfo', userInfo)
							this.userInfo = userInfo

							uni.reLaunch({
								url: '/components/vol-list/detail/detail?id=' + this.detailId
							})
						}
					})
				} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
					console.log('拒绝获得手机号')
					this.showPop = true
				}
			},
			getPhone() {
				this.showPop = false
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
