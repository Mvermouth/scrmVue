<style lang="less" scoped>
    .s_textarea {
        width: 444px;
        margin-bottom: 15px;
        padding: 5px 10px 0;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: relative;
        .s_editor {
            width: 100%;
            height: 100px;
            line-height: 20px;
            resize: none;
            font-size: 14px;
            outline: none;
            overflow: auto;
        }
        .s_textarea_bom {
            height: 30px;
            .emoji-wrap {
                float: left
            }
            .s_textarea_p {
                float: right;
                line-height: 30px;
                color: #bfc7cf;
            }
        }
    }
    .emoji-content {
        height: 200px;
        overflow-y: scroll;
    }
    .emoji-item {
        width: 42px;
        height: 42px;
        display: inline-block;
    }
</style>

<template>
    <div>
        <div class="s_textarea">
            <div class="s_editor s_editor_top" contenteditable="true" v-html="innerText" @input="updateValue">
            </div>
            <div class="s_textarea_bom">
                <div class="emoji-wrap">
                    <Poptip placement="top">
                        <icon type="happy-outline" :size="20"></icon>
                        <div slot="content" class="emoji-content">
                            <div class="emoji-list" v-for=" (item, key) in emojiArray" :key="`div_${key}`">
                                <span class="emoji-item" v-for="(value, index) in item" :key="`span_${index}`" v-emotion="value" @click="choseEmoji(value)"></span>
                            </div> 
                        </div>
                    </Poptip>
                </div>
                <p class="s_textarea_p">最多输入{{limit}}个字符</p>
            </div>
        </div>
    </div>
</template>
<script>
import { toEmotion } from '../../scripts/utils/misc'
    export default {
        props: {
            limit: {
                type: Number,
                default: 1000,
            },
            value: {
                type: String,
            },
            emoji: {
                type: Array,
                default: () => {
                    return ['[微笑]', '[撇嘴]', '[色]', '[发呆]', '[得意]', '[流泪]', '[害羞]', '[闭嘴]', '[睡]', '[大哭]', '[尴尬]', '[发怒]', '[调皮]', '[呲牙]', '[惊讶]', '[难过]', '[酷]', '[冷汗]', '[抓狂]', '[吐]', '[偷笑]', '[愉快]', '[白眼]', '[傲慢]', '[饥饿]', '[困]', '[惊恐]', '[流汗]', '[憨笑]', '[大兵]', '[奋斗]', '[咒骂]', '[疑问]', '[嘘]', '[晕]', '[折磨]', '[衰]', '[骷髅]', '[敲打]', '[再见]', '[擦汗]', '[抠鼻]', '[鼓掌]', '[糗大了]', '[坏笑]', '[左哼哼]', '[右哼哼]', '[哈欠]', '[鄙视]', '[委屈]', '[快哭了]', '[阴险]', '[亲亲]', '[吓]', '[可怜]', '[菜刀]', '[西瓜]', '[啤酒]', '[篮球]', '[乒乓]', '[咖啡]', '[饭]', '[猪头]', '[玫瑰]', '[凋谢]', '[示爱]', '[爱心]', '[心碎]', '[蛋糕]', '[闪电]', '[炸弹]', '[刀]', '[足球]', '[瓢虫]', '[便便]', '[月亮]', '[太阳]', '[礼物]', '[拥抱]', '[强]', '[弱]', '[握手]', '[胜利]', '[抱拳]', '[勾引]', '[拳头]', '[差劲]', '[爱你]', '[NO]', '[OK]', '[爱情]', '[飞吻]', '[跳跳]', '[发抖]', '[怄火]', '[转圈]', '[磕头]', '[回头]', '[跳绳]', '[挥手]', '[激动]', '[街舞]', '[献吻]', '[左太极]', '[右太极]', '[嘿哈]', '[捂脸]', '[奸笑]', '[机智]', '[皱眉]', '[耶]', '[红包]', '[鸡']
                }
            }
        },
        computed: {
            emojiArray() {
                return _.chunk(this.emoji, 8)
            }
        },
        data(){
            return {
                innerText: this.value
            }
        },
        methods: {

            updateValue(e) {
                this.innerText = e.target.innerText
                this.$emit('input', e.target.innerText)
            },

            choseEmoji(value) {
                const emoji = toEmotion(value)
                this.innerText = this.innerText + emoji
                this.$emit('input', this.innerText)
            }
        }
    }
</script>