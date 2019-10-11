<template>
    <div class="reply-content-layout">
        <ul style="list-style: none;">
            <li v-for="(message, key) in messages" :key="`message_${key}`">
                <i-input v-model="message.name">
                    <span slot="prepend"><icon :type="message.icon" ></icon>&nbsp;&nbsp;{{message.type}}</span>
                    <span slot="append"><icon type="edit" color="#2d8cf0"></icon>&nbsp; &nbsp;<icon type="trash-a" color="#ed3f14"></icon></span>
                </i-input>
            </li>
        </ul>
        <div style="margin-top: 10px">
            <i-button icon="plus" @click="add">新建回复消息</i-button>
        </div>
        <transition  name="fade" mode="out-in" appear>
            <div v-if="show" style="margin-top: 10px">
                <div>
                    <share-content :uploadType="uploadType"></share-content>
                </div>
                <div style="margin-top: 10px">
                    <i-button type="primary"  @click="submit">提交</i-button>
                    <i-button  @click="cancel">取消</i-button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import ShareContent from '../../../timeline/create/components/share-content.vue'
export default {
    components: {
        ShareContent
    },
    data() {
        return {
            show: false,
            uploadType: [{ icon: '', label: '文字', name: 'text' }, { icon: 'image', label: '图片', name: 'image' }, { icon: 'android-image', label: '图文', name: 'imageText' }],
            messages: [
                {name: '图片名称', icon: 'image', type: 'text', }
            ]
        }
    },
    methods: {
        add() {
            this.show = true
        },
        submit() {
            this.show = false
        },
        cancel() {
            this.show = false
        }
    }
}
</script>

