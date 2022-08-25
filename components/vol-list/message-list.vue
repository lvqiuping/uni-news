<template>
	<block>
		<view style="margin-bottom: 10px;">
			<u-row justify="space-between">
				<u-col span="12">
					<u-swiper :list="swiperList" :radius="0" indicator indicatorMode="dot" circular
						indicatorActiveColor="#FC5C5B" />
				</u-col>
			</u-row>
		</view>
		<u-row justify="space-between" style="margin-bottom: 10px;">
			<u-col span="12">
				<!-- <view class="news-info">
							<view class="news-info-inner">
								<u-row>
									<u-col span="4">
										<view class="n-left">
											<u--image width="80rpx" height="80rpx" :src="localImage1"></u--image>
											<view class="n-tips">快讯</view>
										</view>
									</u-col>
									<u-col span="8">
										<view class="n-right over_two_lines"></view>
									</u-col>
								</u-row>
						
							</view>
						</view> -->
			</u-col>
		</u-row>

		<block v-if="list.length > 0">
			<view v-for="(item, index) in list" style="padding-bottom: 10px;" :key="index">
				<u-row justify="space-between" gutter="10" @click="toDetail(item)">
					<u-col span="9">
						<u--text lines="2" :text="item.title" bold :margin="{ bottom: 16 }" style="margin-bottom: 16px">
						</u--text>
						<u--text type="info" size="12" block :text="'阅读 ' + item.read_count"></u--text>
					</u-col>
					<u-col span="3" justify="end">
						<u--image width="80px" height="80px" radius="15px" :src="item.cover_img || ''"></u--image>
					</u-col>
				</u-row>
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
		data() {
			return {
				localImage1: '/static/imgs/2x.png',
				swiperList: [
					'/static/swiper1.png',
					'/static/swiper2.png',
					'/static/swiper3.png'
				]
			}
		},
		created() {},
		// #ifdef MP-WEIXIN
		watch: {},
		// #endif
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
