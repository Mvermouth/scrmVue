<template>
	<div v-if="timeline.length !==0" class="discovery-layout" :key="timeline.id">
		<div class="content">
			<div class="avatar" :style="{backgroundImage: `url(${timeline.contact.avatar})`}"></div>
			<div class="info">
				<div class="recommend" @click="handleRecommend(timeline.id, timeline.publishTime)"><i-button type="primary" size="small">推荐</i-button></div>
				<div class="user-nickname" style="{text-overflow: ellipsis}">{{timeline.contact.nickname}}</div>

				<div class="text" v-emotion="timeline.content"></div>

				<timeline-content-media class="medium" :nickname="timeline.contact.nickname" :timeline="timeline" />
				<div>
					<div class="system"> 
						<div class="time">{{dateFormat(timeline.publishTime)}}</div>
						<div class="comment-icon"></div>
					</div>

					<div class="sign">
						<div class="likes" v-if="timeline.likeUsers && timeline.likeUsers.length>0">
							<span v-for="(like, index) in timeline.likeUsers" :key="`like_${index}`">{{`${like.nickname},`}}</span>
						</div>
						<div class="comments" v-if="timeline.comments && timeline.comments.length>0">
							<div v-for="(comments, index) in timeline.comments" :key="`comments_${index}`" v-if="comments.refCommentID && obtainRefCommentNickName(comments.refCommentID, timeline.comments)">
								{{comments.nickname}}<span class="reply">回复</span>{{obtainRefCommentNickName(comments.refCommentID, timeline.comments)}}<span>:</span><span>{{comments.content}}</span>
							
							</div>
							<div v-else>
								{{comments.nickname}}<span>:</span><span>{{comments.content}}</span> 
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template> 
<script>
import TimelineContentMedia from "./timeline-content-media.vue";
import Timeline from "../../../models/im/timeline";
import RecommendForm from "./recommend-form.vue";

export default {
  components: {
    TimelineContentMedia,
    RecommendForm
  },
  props: {
    timeline: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    obtainRefCommentNickName(refCommentID, comments) {
      const comment = _.find(comments, it => {
        return it.commentID === refCommentID;
      });
      return comment ? comment.nickname : null;
    },
    dateFormat(dateString) {
      return dateformat(dateString, "yyyy年mm月dd日 HH:MM");
    },
    handleRecommend(id, time) {
      App.modal({
        title: "推荐朋友圈",
        width: 850,
        loading: true,
        render: h => {
          h = this.$createElement;
          const info = { id: id, time: time, type: "timeline" };
          return <recommend-form info={info} />;
        },
        onOk: async (recommend, $modal) => {
          try {
            const bool = await recommend.submit();
            if(bool){
              this.$Notice.success({ title: "推荐成功" })
              App.removeModal();
            }
            $modal.cancelLoading();
          } catch (e) {
            $modal.cancelLoading();
          }
        }
      });
    }
  }
};
</script>