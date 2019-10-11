<template>
    <div class='padding10-0 tl'>
		<span>
			<div>
				<span class='info-name'>下单总金额：</span>
				<span class='info-value'>{{0}}</span>
			</div>
			<div>
				<span class='info-name'>签收总金额：</span>
				<span class='info-value'>{{0}}</span>
			</div>
			<div>
                <span class='info-name'>签收订单数：</span>
                <span class='info-value'>{{0}}</span>
            </div>
			<!-- <div>
				<span class='info-name'>客单价：</span>
				<span class='info-value'>{{0}}</span>
			</div> -->
		</span>
	</div>
</template>
<script>
export default {
	props: {
		order: {
			type: Object,
			required: false
		}
	}
}
</script>

