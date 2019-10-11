<style lang="less" scoped>
.device-container {
  padding: 8px;
}
.device-item {
  border-radius: 4px;
  width: 150px;
  height: 250px;
  padding: 0 6px;
  background: #f8f8f8;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  cursor: pointer;
  &:hover {
    border: 1px solid #ccc rgba(0, 0, 0, 0.2);
    box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.3);
  }
  .top-bar {
    height: 20px;
  }
  .bottom-bar {
    height: 40px;
  }
  .screen {
    width: 138px;
    height: 184px;
    background: #e8e8e8;
    .device-top {
      width: 100%;
      height: 30px;
      padding: 5px;

      .left {
        float: left;
        .info {
          height: 100%;
          display: inline-block;
          vertical-align: top;
        }
      }
      .right {
        float: right;
      }
    }
    .device-middle {
      height: 140px;
      span {
        word-break: break-all;
      }
    }
    .device-bottom {
    }
  }
  .apple {
    background: url("../images/apple.png") no-repeat;
    background-size: contain;
  }
  .android {
    background: url("../images/android.png") no-repeat;
    background-size: contain;
  }
}
</style>   
<template>
	<div class="device-container">
		<div class="device-item">
			<div class="top-bar">
			</div>
			<div :class="['screen', {'apple': device.device.systemType==='IOS'},{'android': device.device.systemType!=='IOS'}]">
				<div class="device-top">
					<div class="left">
						<div class="info" v-html="get_lang_zh(device.device.carrier)"></div>   
						<div class="info wifi"></div>
					</div>
					<battery-widget class="right" :value="device.device.battery/100" />
				</div>
			</div>
			<div class="bottom-bar device-bottom">
				<div>{{device.device.systemType}} {{device.device.deviceVersion }} </div>
				<div>编号：{{device.device.sn}}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { get_lang_zh } from "../../../../../scripts/utils/misc";
import BatteryWidget from "./battery-widget.vue";
export default {
  components: {
    BatteryWidget
  },
  props: {
    device: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    // 截取中文
    get_lang_zh(strValue) {
      return get_lang_zh(strValue, "无SIM卡");
    }
  }
};
</script>  
