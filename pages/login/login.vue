<template>
	<view style="min-height: 100vh">
		<u-row>
			<u-col span="12">
				<view style="padding: 50% 0">
					<u-divider text="暂未登录" @click="wechatLogin"></u-divider>
					<view class="login-other">
						<u-button type="primary" shape="circle" @click="wechatLogin">
							<image class="img" :key="index" v-for="(src,index) in icons" :src="src">
								微信一键授权
						</u-button>
					</view>
				</view>
			</u-col>
		</u-row>
		<!-- 弹框询问电话 -->
		<phone-file :showPop="userInfo && !userInfo.phone" :detail-id="detailId"></phone-file>
	</view>
</template>

<script>
	import PhoneFile from '@/components/view-phone/phone-file.vue'
	export default {
		name: 'Login',
		components: {
			'phone-file': PhoneFile
		},
		data() {
			return {
				icons: [],
				dataParams: {},
				detailId: 0,
				timer: null,
				userInfo: null
			}
		},
		onLoad(option) {
			var that = this
			that.detailId = option.id
			that.timer = setTimeout(function() {
				uni.showModal({
					title: '提示',
					content: '为了提供更多的详情,小程序需要您的微信昵称, 头像授权',
					confirmText: '允许',
					cancelText: '拒绝',
					success: (res) => {
						if (res.confirm) {
							that.wechatLogin()
						} else if (res.cancel) {}
					},

				})
			}, 3000)
			that.timer
			// #ifdef MP-WEIXIN
			this.icons = ['https://img.yzcdn.cn/vant/share-icon-wechat.png']
			return
			// #endif
			this.icons = ['https://img.yzcdn.cn/vant/share-icon-qq.png',
				'https://img.yzcdn.cn/vant/share-icon-wechat.png',
				'https://img.yzcdn.cn/vant/share-icon-weibo.png'
			]
		},
		methods: {
			wechatLogin() {
				var that = this
				clearTimeout(that.timer)
				uni.getUserProfile({ // 调起微信询问是否登录，拿到用户信息
					desc: '用于完善会员信息',
					lang: 'zh_CN',
					success: res => {
						if (res) {
							res.userInfo.news_id = that.detailId
							wx.login({ // 拿到code
								success(res2) {
									let params = {
										userInfo: res.userInfo,
										code: res2.code
									}
									that.http.post("/User/login", params, true)
										.then((result) => {
											that.loading = false;

											if (result.code != 1) {
												that.loading = false;
												return that.$toast(result.msg)
											}
											uni.setStorageSync('userInfo', result.data)
											// 成功后跳转,扫码进来和好友从分享进来
											that.userInfo = result.data

											if (result.data.phone) {
												let url = '/pages/home/home'
												if (that.detailId > 0) {
													url =
														'/components/vol-list/detail/detail?id=' +
														that.detailId
												}

												uni.reLaunch({
													url: url
												})
											}
										});
								}
							})

						}
					},
					fail: err => {
						console.log('err', err)
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.login-other {
		width: 50%;
		margin: auto;
		margin-top: 80rpx;


		.img {
			width: 50rpx;
			height: 50rpx;
			margin-right: 20rpx;
		}
	}
</style>
