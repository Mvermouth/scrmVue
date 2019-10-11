<template>
    <div>
        <Tabs :value="currentIconName" @on-click="name => currentIconName = name" size="small">
            <TabPane v-for="name in iconNames" :key="`tab-${name}`" :name="name" :label="name"></TabPane>
        </Tabs>
        <div v-for="name in iconNames" :key="`icons-${name}`" v-show="name === currentIconName" class="flex">
            <span v-for="i in icons[name]" :key="`i-${i}`" :class="`flex-item dpib tc w2f h2f m4 pointer ${(name === model.name && i === model.value) ? 'c-bg-info br-xs' : ''}`"
                @click="onSelectIcon(name, i)">
                <i v-html="`&#x${i};`" :class="`${name} f-xxl lh2f ${(name === model.name && i === model.value) ? 'c-info' : ''}`"></i>
            </span>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'

export default {

    props:{

        value: {
            type: Object,
            required: true
        },

        // 候选图标
        icons: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            currentIconName: this.value.name || '',
            iconNames: _.keys(this.icons),
            model: _.assign({
                name: '',
                value: ''
            }, this.value)
        }
    },

    mounted() {
        this.model.name = this.model.name || this.iconNames[0]
        this.model.value = this.model.value || this.icons[this.model.name][0]
        this.currentIconName = this.model.name
    },

    watch: {

        value() {
            this.model = this.value
        },

        model: {
            deep: true,
            handler: function() {
                this.$emit('input', this.model)
            }
        }
    },

    methods: {

        onSelectIcon(name, value) {
            console.log("icon:name:",name)
            console.log("icon:value:",value)
            this.model = {
                name, value
            }
        }
    }
}
</script>


