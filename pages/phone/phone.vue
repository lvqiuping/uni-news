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
						
						// uni.setStorageSync()
					})
				} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
					
				}
				
			}
		}
	}
</script>
<style lang="less" scoped>

</style>
