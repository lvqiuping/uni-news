<template>
	<view class="">
		<u-divider text="授权登陆" @click="wechatLogin"></u-divider>
		<view class="login-other">
			<image @click="wechatLogin" class="img" :key="index" v-for="(src,index) in icons" :src="src">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				icons: [],
			}
		},
		onLoad() {
			uni.showModal({
					title: '授权登录',
					content: '是否授权',
					success: (res) => {
						if (res.confirm) {
							this.wechatLogin()
						} else if (res.cancel) {}

					},

				}),
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
				console.log('444')
				var that = this
				uni.getUserProfile({ // 调起微信询问是否登录，拿到用户信息
					desc: '用于完善会员信息',
					lang: 'zh_CN',
					success: res => {
						if (res) {
							wx.login({ // 拿到code
								success(res2) {
									let params = {
										userInfo: res.userInfo,
										code: res2.code
									}
									that.http.post("/User/login", params, "正在登录....")
										.then((result) => {
											if (result.code != 1) {
												that.loading = false;
												return that.$toast(result.msg)
											}
											// that.$toast("登录成功,正在跳转!")
											uni.setStorageSync('userInfo', result.data)
											uni.navigateTo({
												url: "/pages/home/home"
											})
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
		display: flex;
		justify-content: center;

		.img {
			width: 50px;
			height: 50px;
		}
	}
</style>
