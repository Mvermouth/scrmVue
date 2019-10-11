<template>
    <div class='padding10-0 tl'>
		<span>
			<div>
				<span class='device-name'>手机UDID：</span>
				<span class='device-value'>{{device.udid || ''}}<span class='online' style="background: #8aef66; margin-right: 8px; text-align: left"></span></span>
			</div>
			<!-- <div>
				<span class='device-name'>设备编号：</span>
				<span class='device-value'>{{device.sn || ''}}</span>
			</div> -->
			<div>
				<span class='device-name'>录入时间：</span>
				<span class='device-value'>{{device.ctime || ''}}</span>
			</div>
		</span>
	</div>
</template>
<script>
export default {
    props: {
        device: {
            type: Object,
            require: true
        }
    }
}
</script>

