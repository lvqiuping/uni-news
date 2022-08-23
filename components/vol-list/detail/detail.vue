<template>
	<view class="page-container">
		<view class="title-info">
			<view class="t-title over_two_lines">{{data.title}}</view>
			<view class="t-tips">
				<text class="t-user">东莞本地宝</text>
				<text>{{data.create_time}}</text>
			</view>
		</view>
		<view class="content-info">
			<view class="text_indent_two c-content">
				<view v-html="unescapeEntity(data.content)"></view>
			</view>
			<view class="c-bottom">
				<view class="grid-list">
					<view class="grid-item" @click="gridClick(item)" v-for="(item,index) in iconList" :key="index">
						<view class="grid-icon">
							<u-icon :color="item.color" size="22" :name="item.icon"></u-icon>
						</view>
						<view class="grid-text">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="c-count">阅读 <text>{{data.read_count}}</text></view>
			</view>
		</view>
		<view class="footer-info">
			<view class="f-title">
				<text>精选留言</text>
				<view @click="getComment">写留言</view>
			</view>
			<view class="f-list">
				<view v-for="(item, index) in list" style="display: flex; justify-content: space-between">
					<view>{{item.content}}</view>
					<view style="display: flex;" @click="support(item.id)">
						<u-icon color="#dd6161" size="22" name="thumb-up" />{{item.support}}
					</view>
				</view>
			</view>
		</view>

		<view style="height: 20rpx;"></view>
		<!-- 弹框 -->
		<u-popup :show="show" mode="bottom" @close="close" @open="open">
			<view class="u-po">
				<view class="u-po-title">东莞本地宝
					<u-icon name="arrow-right" color="#333333" size="20" style="margin-left: 20rpx;" />
				</view>
				<view class="c-bottom">
					<view class="grid-list" v-for="(item,index) in grid">
						<view class="grid-title">
							<view class="grid-title-text">
								{{item.name}}
							</view>
						</view>
						<view class="grid-item" @click="gridClick(data.value)" v-for="(data,dindex) in item.data"
							:key="dindex">
							<view class="grid-icon" :class="data.bg">
								<u-icon color="#333" size="22" :name="data.icon"></u-icon>
							</view>
							<view class="grid-text">
								{{data.name}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="addComment" mode="bottom" @close="close" @open="open">
			<u--form labelPosition="left" :model="comment" ref="form1">
				<u-form-item prop="content" borderBottom>
					<u--textarea v-model="comment.content" placeholder="请输入内容"></u--textarea>
				</u-form-item>
			</u--form>
			<view style="margin: 60rpx 30rpx; display: flex;">
				<u-button icon="lock-open" size="mini" shape="circle" @click="cancel" type="info" text="取消">
				</u-button>
				<u-button icon="lock-open" size="mini" shape="circle" @click="submit" type="primary" text="确定">
				</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				addComment: false,
				loading: true,
				collect: false,
				data: {},
				userInfo: {},
				iconList: [{
					name: "分享",
					icon: "share",
					value: "share",
					color: "#333"
				}, {
					name: "收藏",
					icon: "star",
					value: "collect",
					color: "#333"
				}, {
					name: "点赞",
					icon: "thumb-up",
					value: "support",
					color: "#333"
				}],
				list: [],
				id: 0,
				page: 0,
				comment: {
					content: '',
				},

			}
		},


		onLoad(option) {
			var that = this;
			uni.setNavigationBarTitle({
				title: option.title
			})
			that.userInfo.id = option.id
		},
		onShow() {
			var that = this;
			that.userInfo.openid = that.$store.state.userInfo.openid
			let params = {
				id: that.userInfo.id,
				openid: that.userInfo.openid
			}
			that.http.get("/News/read", params, false).then(result => {
					that.data = result.data;
					that.loading = false;
				}),
				that.getList();
			that.gridClick('read_count'); // 进入页面就加一次阅读量
		},
		methods: {
			getComment() {
				this.addComment = true
			},
			open() {
				// console.log('open');
			},

			close() {
				this.show = false
				this.addComment = false
			},
			support(id) {
				var that = this
				let params = {
					openid: that.userInfo.openid,
					id: id
				}
				that.http.get("/NewsComments/setInc", params, false).then(result => {
					console.log("点赞", result)
					that.getList()
				})
			},
			gridClick(p) {
				var that = this;
				let params = {}
				if (p.value === 'share') {
					// 	// params = {id: that.userInfo.id, openid: that.userInfo.openid, share: 1}
					// 	// let routes = getCurrentPages();
					// 	// let curRoute = routes[routes.length - 1].$page.fullPath
					// 	uni.share({
					// 		provider: "weixin",
					// 		scene: 'WXSceneSession', //分享场景
					// 		type: '1',
					// 		href: '',
					// 		title: '率秋萍',
					// 		summary: '888',
					// 		imageUrl: '',
					// 		success:function(res) {
					// 			that.posters = false
					// 		},
					// 		fail: function(err) {
					// 			uni.showToast({
					// 				title: '分享失败',
					// 				icon: 'none',
					// 				duration:2000
					// 			})
					// 			that.posters = false
					// 		}
					// 	})
				} else if (p.value === 'collect') {
					params = {
						id: that.userInfo.id,
						openid: that.userInfo.openid,
						collect: 1
					}
				} else if (p.value === 'support') {

					params = {
						id: that.userInfo.id,
						openid: that.userInfo.openid,
						support: 1
					}
				} else if (p.value === 'read_count') {
					params = {
						id: that.userInfo.id,
						openid: that.userInfo.openid,
						read_count: 1
					}
				}

				console.log('params8888', params)
				return
				that.http.get("/News/setInc", params, false).then(result => {
					console.log("更新", result)
				})
			},
			getList() {
				var that = this;
				let params = {
					openid: that.userInfo.openid,
					news_id: that.userInfo.id
				}
				that.http.get("/NewsComments/index", params, false).then(result => {
					that.list = result.data;
					that.loading = false;
				})
			},
			submit() {
				var that = this
				let params = {
					openid: that.userInfo.openid,
					news_id: that.userInfo.id,
					content: that.comment.content
				}
				that.http.post("/NewsComments/save", params, false).then(res => {
					that.addComment = false
					that.getList()
				});
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
			 if (str === null) {
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
	.text_indent_two {
		text-indent: 20rpx;
	}

	.over_two_lines {
		display: -webkit-box;
		word-break: break-all;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: pre-line;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.page-container {
		margin: 20rpx 40rpx;
		height: calc(100vh - 110rpx);
		overflow: scroll;
		color: #333333;

		.title-info {
			font-size: 60rpx;

			.t-title {
				text-align: center;
				margin-bottom: 40rpx;
			}

			.t-tips {
				font-size: 30rpx;
				color: #999999;
				display: flex;
				justify-content: space-between;

				.t-user {
					color: #FC5C5B;
				}
			}
		}


		.content-info {
			background-color: #E1EFFE;
			margin: 27rpx 0;

			.c-title {
				color: #333333;
				font-size: 40rpx;
				text-align: center;
				padding: 30rpx 0 20rpx;
			}

			.c-content {
				padding: 24rpx;
			}

		}

		.c-bottom {
			display: flex;
			padding: 20rpx;
			justify-content: space-between;


			.grid-list {
				width: 75%;
				display: inline-block;

				.grid-item {
					margin-right: 20rpx;
					text-align: center;
					float: left;
				}

				.grid-icon {
					height: 80rpx;
					position: relative;
				}

				.grid-text {
					font-size: 24rpx;
					color: #7e7e7e;
				}
			}

			.c-count {
				display: flex;
				flex-direction: cloumn;
				align-items: flex-end;
			}
		}

		.footer-info {
			.f-title {
				display: flex;
				justify-content: space-between;
			}

			.f-list {
				color: #999999;
				margin: 20rpx 0;
			}

		}

		.u-po {
			height: 300rpx;

			.u-po-title {
				display: flex;
				font-size: 50rpx;
				color: #333333;
				margin: 20rpx 40rpx;
			}
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
