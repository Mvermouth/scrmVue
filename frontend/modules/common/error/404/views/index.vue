<style lang="less" scoped>
.exception {
    min-width: 500px;
    display: flex;
    align-items: center;

    .img-block {
        flex: 0 0 62.5%;
        width: 62.5%;
        padding-right: 152px;
        zoom: 1;

        .img {
            height: 360px;
            width: 100%;
            max-width: 430px;
            float: right;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            background-size: contain;
        }
    }

    .content {
        flex: auto;

        h1 {
            color: hsl(210, 14%, 31%);
            font-size: 72px;
            font-weight: 600;
            line-height: 72px;
            margin-bottom: 24px;
        }

        .desc {
            color: hsla(0, 0%, 0%, 0.45);
            font-size: 20px;
            line-height: 28px;
            margin-bottom: 16px;
        }
    }
}
</style>
<template>
    <div class="exception">
        <div class="img-block">
            <div class="img" :style="{backgroundImage: `url(${image})`}"></div>
        </div>
        <div class="content">
            <h1>{{status}}</h1>
            <p class="desc">{{message}}</p>
            <p v-if="error && error.code" class="desc">错误码: {{error.code}}</p>
            <p v-if="error && error.message" class="desc">错误消息: {{error.message}}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        status: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        error: {
            type: Object,
            required: false
        }
    }
}
</script>
