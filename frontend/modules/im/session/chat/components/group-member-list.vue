<template>
    <Scroll :height="height" :on-reach-bottom="onReachBottom">
        <div v-if="groupMembers.length > 0" class="contact-list"> 
            <group-member-list-item v-for="groupMember in groupMembers"  :key="groupMember.id" :item="groupMember.contact"></group-member-list-item>
        </div>
        <div v-else class="noData">
            {{ placeholder }}
        </div>
    </Scroll>
</template>
<script>
import GroupMemberListItem from './group-member-list-item.vue'

export default {
    props: {
        height: {
            type: Number,
            required: true
        },
        groupMembers: {
            type: Array,
            required: true
        },
        onReachBottom: {
            type: Function,
            required: false,
            default: async() => {}
        },
        placeholder: {
            type: String,
            default: '',
        }
    },
    components: {
        GroupMemberListItem
    }
}
</script>
