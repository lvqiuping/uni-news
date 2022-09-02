<template>
	<view class="page-container">
		<view v-show="userInfo && userInfo.phone">
			<view style="padding: 40rpx;">
				<view style="margin-bottom: 40rpx;">
					<u--text size="18" :text="newsInfo.title" bold></u--text>
				</view>
				<view>
					<u-row gutter="10" justify="space-between">
						<u-col span="4">
							<u--text type="success" size="12" :text="appName"></u--text>
						</u-col>
						<u-col span="8">
							<u--text type="info" size="12" align="right" :text="newsInfo.create_time"></u--text>
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
						<u-row gutter="10">
							<u-col textAlign="center" align="center" span="4" v-for="(item, index) in iconList"
								:key="index" @click="gridClick(item.value, index, item.name)">
								<view style="height: 44px;">
									<button :open-type="item.openType" class="u-reset-button"
										style="width: 56px; height: 44px; background: transparent; border: none">
										<u-icon :color="item.color" size="20" :name="item.icon"></u-icon>
										<u--text type="info" size="12" :text="item.name"></u--text>
									</button>
								</view>
							</u-col>
						</u-row>
					</u-col>
					<u-col span="4" offset="3" textAlign="right" justify="end">
						<view style="height: 44px;">
							<button class="u-reset-button"
								style="width: 56px; height: 44px; background: transparent; border: none">
								<u-icon size="20" name="eye" color="#909399"></u-icon>
								<u--text type="info" size="12" :text="newsInfo.read_count" margin="0 0 0 10rpx">
								</u--text>
							</button>
						</view>
					</u-col>
				</u-row>
			</view>

			<view style="padding: 40rpx;">
				<view style="margin-bottom: 50rpx;">
					<u-row gutter="10">
						<u-col span="4">
							<u--text type="info" text="精选留言"></u--text>
						</u-col>
						<u-col span="4" offset="4" textAlign="right">
							<u--text :color="commentsColor" text="写留言" align="right" @click="getComment"></u--text>
						</u-col>
					</u-row>
				</view>
				<view v-for="(item, index) in commentList" :key="index" style="margin-bottom: 30rpx;">
					<u-row align="top">
						<u-col span="2">
							<view style="padding: 0 20rpx">
								<u-avatar :src="item.user.header_img" shape="square" size="30">
								</u-avatar>
							</view>
						</u-col>
						<u-col span="10">
							<u-row>
								<u-col span="9">
									<u--text :color="commentsColor" :text="item.user.nickname"></u--text>
								</u-col>
								<u-col span="3" textAlign="right">
									<view style="display: flex;" @click="support(item.id)">
										<u--text :color="commentsColor" :text="item.support" prefixIcon="thumb-up"
											align="right" :iconStyle="{ fontSize: '20px', color: commentsColor }">
										</u--text>
									</view>
								</u-col>
							</u-row>
							<u-row>
								<u-col span="12">
									<u--text :text="item.content"></u--text>
								</u-col>
							</u-row>
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
									cursorSpacing="120" @confirm="submit" @focus="getFocus"
									@keyboardheightchange="keyboardHeightChange" maxlength="-1" :showConfirmBar="false">
								</u-textarea>
							</u-col>
						</u-row>
					</view>
				</view>
			</u-popup>
		</view>
		<view v-show="userInfo && !userInfo.phone">
			<u--text text="无权限查看" type="info"></u--text>
		</view>
		<!-- 弹框询问电话 -->
		<phone-file :showPop="userInfo && !userInfo.phone" :detail-id="newsInfo.id"></phone-file>
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
				commentsColor: '#2b85e4',
				cursorSpacing: 0,
				focus: false
			}
		},
		// 分享给朋友
		onShareAppMessage: function(options) {
			// must return custom share data when user share.
			return {
				title: this.newsInfo.title,
				path: '/components/vol-list/detail/detail?id=' + this.newsInfo.id + '&openid=' + this.$store.state
					.userInfo.openid,
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
			var that = this.newsInfo.title
			var testQuery = `id=` + that.newsInfo.id + '&openid=' + that.$store.state.userInfo.openid
			return {
				title: this.newsInfo.title,
				query: testQuery
			}
		},
		onLoad(option) {
			console.log('option', option)
			var that = this;
			this.isShare = option.isShare
			// 如果没有登录,就登录, 分享进来的话option.id存在要传给登录页
			this.appName = app.globalData.appName
			that.newsInfo.id = option.id
			that.newsInfo.title = option.title
		},
		onShow() {
			var that = this;
			this.userInfo = uni.getStorageSync('userInfo')
			if (!this.userInfo) {
				uni.navigateTo({
					url: '/pages/login/login?id=' + this.newsInfo.id
				})
			} else {
				let params = {
					id: that.newsInfo.id
				}
				// 初始化新闻内容
				that.http.get("/News/read", params).then(result => {
					result.data.content = this.unescapeEntity(result.data.content)
					that.newsInfo = Object.assign({}, that.newsInfo, result.data);
					that.loading = false;
					uni.setNavigationBarTitle({
						title: result.data.title
					})
				})
				that.getList();
				that.gridClick('read_count'); // 进入页面就加一次阅读量
			}
		},
		onUnload() {
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
				// console.log('open');
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
				console.log(e)
				var that = this
				let params = {
					news_id: that.newsInfo.id,
					content: that.comment.content
				}
				console.log(params)
				that.http.post("/NewsComments/save", params).then(res => {
					that.addComment = false
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
