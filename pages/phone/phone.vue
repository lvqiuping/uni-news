<template>
	<view class="">
		<u-button openType="getPhoneNumber" @getphonenumber="getPhoneNumber">
			Çë°ó¶¨ÊÖ»úºÅ
		</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			getPhoneNumber(e) {
				console.log(e)
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					this.http.post('/User/getUserPhoneNumber', { code: e.detail.code }).then(res => {
						if (res.code === 1)  {
							const userInfo = uni.getStorageSync('userInfo')
							userInfo.phone = res.data.phoneNumber
							uni.setStorageSync('userInfo', userInfo)
							uni.switchTab({
								url: "/pages/home/home"
							})
						}
					})
				} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
					
				}
				
			}
		}
	}
</script>
<style lang="less" scoped>

</style>
