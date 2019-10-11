<template>
    <div>
        <i-form ref="forms" :label-width="120">
            <form-item label="群名" prop="group_name">
                <i-input type="input" v-model="group_name"></i-input>
            </form-item>
        </i-form>
    </div>
</template>
<script>
export default {
    props:{
        group_name:{
            type:String
        }
    }
    ,data() {
        return {

        }
    },
    methods: {

    }
}
</script>

