<template>
	<view class="">
		<u-button openType="getPhoneNumber" @getphonenumber="getPhoneNumber">
			手机授权
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
				
			}
		}
	}
</script>
<style lang="less" scoped>

</style>
