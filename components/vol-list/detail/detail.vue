<template>
	<view class="page-container">
		<view v-show="!showPhonePop">
			<view style="padding: 40rpx;">
				<view style="margin-bottom: 40rpx;">
					<u--text size="18" :text="newsInfo.title" bold></u--text>
				</view>
				<view>
					<u-row gutter="10">
						<u-col span="2">
							<u--text type="error" size="12" :text="appName"></u--text>
						</u-col>
						<u-col span="10">
							<u--text type="info" size="12" align="left" :text="newsInfo.create_time"></u--text>
						</u-col>
					</u-row>
				</view>
			</view>
			<view class="content-info">
				<view style="font-size: 14px; line-height: 1.5; margin-bottom: 80rpx;">
					<u-parse :content="newsInfo.content"></u-parse>
				</view>
				<u-row gutter="10">
					<u-col span="5">
						<u-row>
							<u-col span="4" v-for="(item, index) in iconList" :key="index"
								@click="gridClick(item.value, index, item.name)">
								<button :open-type="item.openType"
									style="width: 56px; height: 44px; background: transparent; border: none">
									<u-icon :color="item.color" size="20" :name="item.icon"></u-icon>
									<u--text type="info" size="12" :text="item.name"></u--text>
								</button>
							</u-col>
						</u-row>
					</u-col>
					<u-col span="4" offset="3" textAlign="right" justify="end">
						<u--text type="info" size="12" :text="'阅读 ' + newsInfo.read_count" margin="25px 0 0 0"
							align="right">
						</u--text>
					</u-col>
				</u-row>
			</view>

			<view style="padding: 30rpx;">
				<view style="margin-bottom: 50rpx;">
					<u-row gutter="10">
						<u-col span="4">
							<u--text text="精选留言"></u--text>
						</u-col>
						<u-col span="4" offset="4" textAlign="right">
							<u--text text="写留言" align="right" @click="getComment">
							</u--text>
						</u-col>
					</u-row>
				</view>
				<view v-for="(item, index) in commentList" :key="index" style="margin-bottom: 20rpx;">
					<u-row align="top" justify="space-between">
						<u-col span="1">
							<view>
								<u-avatar :src="item.user.header_img" shape="circle" size="30">
								</u-avatar>
							</view>
						</u-col>
						<u-col span="11">
							<view style="padding-left: 20rpx;">
								<u-row>
									<u-col span="10">
										<u--text type="info" :text="item.user.nickname"></u--text>
									</u-col>
									<u-col span="2">
										<view style="display: flex;" @click="support(item.id)">
											<u--text :color="item.support === 0? '#333' : commentsColor"
												:text="item.support" prefixIcon="thumb-up" align="right"
												:iconStyle="item.support === 0 ? 'color: #333': 'color: red'">
											</u--text>
										</view>
									</u-col>
								</u-row>
								<u-row>
									<u-col span="12">
										<u--text :text="item.content"></u--text>
									</u-col>
								</u-row>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>

			<view style="height: 20rpx;"></view>
			<!-- 弹框留言 -->
			<u-popup :show="addComment" mode="bottom" @close="close" @open="open" closeOnClickOverlay="false"
				duration="0">
				<view style="background-color: #f3f4f6; padding: 30rpx 30rpx 50rpx;">
					<view style="margin-bottom: 30rpx;">
						<u-row>
							<u-col span="6">
								<u--text type="info" text="写留言"></u--text>
							</u-col>
							<u-col span="6" textAlign="right">
								<u--text type="primary" text="取消" align="right" @click="cancel"></u--text>
							</u-col>
						</u-row>
					</view>
					<view>
						<u-row justify="center">
							<u-col span="10" justify="center">
								<u-textarea v-model="comment.content" :focus="focus" placeholder="请输入内容"
									cursorSpacing="70" @confirm="submit" @focus="getFocus"
									@keyboardheightchange="keyboardHeightChange" maxlength="-1">
								</u-textarea>
							</u-col>
						</u-row>
					</view>
				</view>
			</u-popup>
		</view>
		<view v-show="showPhonePop">
			<u--text text="无权限查看" type="info"></u--text>
		</view>
		<!-- 弹框询问电话 -->
		<phone-file v-if="showPhonePop" :showPop="showPhonePop" :detail-id="newsInfo.id"></phone-file>
	</view>
</template>

<script>
	const app = getApp()
	import PhoneFile from '@/components/view-phone/phone-file.vue'
	export default {
		components: {
			'phone-file': PhoneFile
		},
		data() {
			return {
				appName: '',
				addComment: false,
				loading: true,
				collect: false,
				newsInfo: {},
				iconList: [{
					name: "分享",
					icon: "share",
					value: "share",
					color: "#909399",
					openType: "share"
				}, {
					name: "收藏",
					icon: "star",
					value: "collect",
					color: "#909399",
					openType: ""
				}, {
					name: "点赞",
					icon: "thumb-up",
					value: "support",
					color: "#909399",
					openType: ""
				}],
				commentList: [],
				id: 0,
				page: 1,
				comment: {
					content: '',
				},
				supportColor: {
					color: "#909399"
				},
				params: {
					openid: ''
				},
				userInfo: null,
				isShare: false,
				commentsColor: '#FC5C5B',
				cursorSpacing: 0,
				focus: false,
				startViewTime: 0,
				endViewTime: 0
			}
		},
		computed: {
			showPhonePop() {
				return !!this.userInfo && !this.userInfo?.phone
			}
		},
		// 分享给朋友
		onShareAppMessage: function(options) {
			var that = this
			// must return custom share data when user share.
			return {
				title: that.newsInfo.title,
				path: '/components/vol-list/detail/detail?id=' + that.newsInfo.id + '&openid=' + that.userInfo.openid,
				success(res) {
					console.log('分享成功', res)
				},
				fail(res) {
					console.log('分享失败', res)
				}
			}

		},
		// 分享到朋友圈，加上这个上面微信自带的按钮才会能选择
		onShareTimeline: function() {
			var that = this
			var query = {
				id: that.newsInfo.id,
				openid: that.userInfo.openid
			}
			return {
				title: that.newsInfo.title,
				query: query
			}
		},
		onLoad(option) {
			this.isShare = option.isShare
			// 如果没有登录,就登录, 分享进来的话option.id存在要传给登录页
			this.appName = app.globalData.appName
			this.newsInfo.id = option.id
			this.newsInfo.title = option.title ?? ''
			this.userInfo = uni.getStorageSync('userInfo')
			if (!this.userInfo) {
				uni.redirectTo({
					url: '/pages/login/login?id=' + this.newsInfo.id
				})
			} else {
				// 初始化新闻内容
				this.http.get("/News/read", {
					id: this.newsInfo.id
				}).then(result => {
					result.data.content = this.unescapeEntity(result.data.content)
					this.newsInfo = Object.assign({}, this.newsInfo, result.data);
					this.loading = false;
					uni.setNavigationBarTitle({
						title: result.data.title
					})
				})
				this.getList()
				this.startViewTime = Date.now()
			}
		},
		onReady() {},
		onUnload() {
			// 保存浏览历史记录
			if (this.startViewTime > 0) {
				this.endViewTime = Date.now()
				this.http.post('/News/setViewHistory', {
					id: this.newsInfo.id,
					view_time: this.endViewTime - this.startViewTime
				})
			}

			if (this.isShare) {
				uni.redirectTo({
					url: '/pages/home/home'
				})
			}
		},
		methods: {
			getFocus(e) {
				console.log('focus', e)
			},
			keyboardHeightChange(e) {
				console.log('keyboardHeightChange', e)
				this.cursorSpacing = e.detail.height
			},
			getComment() {
				this.addComment = true
				this.comment = {
					content: '',
				}
			},
			open() {
				this.focus = true
			},
			close() {
				this.show = false
				this.addComment = false
				this.focus = false
			},
			support(id) {
				var that = this
				let params = {
					id: id
				}
				that.http.get("/NewsComments/setInc", params).then(result => {
					that.getList()
				})
			},
			gridClick(p, index, name = '') {
				var that = this;
				let params = {
					id: that.newsInfo.id
				}
				params[p] = 1
				that.http.get("/News/setInc", params).then(result => {
					if (!['share', 'read_count'].includes(p)) {
						uni.showToast({
							title: name + '成功'
						})
						that.iconList[index].color = "#FC5C5B"
					}
				})
			},
			getList() {
				var that = this;
				let params = {
					news_id: that.newsInfo.id
				}
				that.http.get("/NewsComments/index", params).then(result => {
					result.data.color = "#333"
					that.commentList = result.data;
					that.loading = false;
				})
			},
			submit(e) {
				var that = this
				that.addComment = false
				let params = {
					news_id: that.newsInfo.id,
					content: that.comment.content
				}
				that.http.post("/NewsComments/save", params).then(res => {
					that.getList()
				});
			},
			cancel() {
				this.addComment = false
			},
			cancelGetPhone() {
				uni.redirectTo({
					url: '/pages/home/home'
				})
			},
			unescapeEntity(str) {
				var reg =
					/&(?:nbsp|#160|lt|#60|gt|62|amp|#38|quot|#34|cent|#162|pound|#163|yen|#165|euro|#8364|sect|#167|copy|#169|reg|#174|trade|#8482|times|#215|divide|#247);/g,
					entity = {
						'&nbsp;': ' ',
						' ': ' ',
						'&lt;': '<',
						'<': '<',
						'&gt;': '>',
						'&62;': '>',
						'&amp;': '&',
						'&': '&',
						'&quot;': '"',
						'"': '"',
						'&cent;': '￠',
						'¢': '￠',
						'&pound;': '£',
						'£': '£',
						'&yen;': '¥',
						'¥': '¥',
						'&euro;': '€',
						'€': '€',
						'&sect;': '§',
						'§': '§',
						'&copy;': '©',
						'©': '©',
						'&reg;': '®',
						'®': '®',
						'&trade;': '™',
						'™': '™',
						'&times;': '×',
						'×': '×',
						'&divide;': '÷',
						'÷': '÷'
					};
				if (!str) {
					return '';
				}
				str = str.toString();
				return str.indexOf(';') < 0 ? str : str.replace(reg, function(chars) {
					return entity[chars];
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	button::after {
		border: none;
	}

	.page-container {
		height: calc(100vh - 110rpx);
		overflow: scroll;
		color: #333333;

		.content-info {
			background-color: #E1EFFE;
			padding: 40rpx;
		}
	}
</style>
<style scoped>
	.grid-list /deep/ .u-icon {
		flex-direction: column !important;
		position: absolute;
		top: 48%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
