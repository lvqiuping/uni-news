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
		methods: {
			toDetail(item) {
				const userInfo = uni.getStorageSync('userInfo')
				const url = !userInfo.phone ? '/pages/phone/phone' : '/components/vol-list/detail/detail?id=' + item.id +
					"&title=" + item.title
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>
<style lang="less" scoped>
</style>
