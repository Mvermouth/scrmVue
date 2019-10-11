<template>
    <div class='padding10-0 tl'>
		<span>
			<div>
				<span class='device-name'>手机UDID：</span>
				<span class='device-value'>{{device.udid || ''}}<span class='online' style="background: #8aef66; margin-right: 8px; text-align: left"></span></span>
			</div>
			<div>
				<span class='device-name'>设备编号：</span>
				<span class='device-value'>{{device.sn || ''}}</span>
			</div>
            <div>
				<span class='device-name'>设备名称：</span>
				<span class='device-value'>{{device.deviceName || ''}}</span>
			</div>
            <div>
				<span class='device-name'>设备版本：</span>
				<span class='device-value'>{{device.deviceVersion || ''}}</span>
			</div>
            <div>
				<span class='device-name'>系统：</span>
				<span class='device-value'>{{device.systemType || ''}}</span>
			</div>
            <div>
				<span class='device-name'>系统版本：</span>
				<span class='device-value'>{{device.systemVersion || ''}}</span>
			</div>
            <div>
				<span class='device-name'>运营商：</span>
				<span class='device-value'>{{device.carrier || ''}}</span>
			</div>
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

