<style lang="less">
.modal-uim {
  .ivu-modal-header {
    border-bottom: none;
  }
  .ivu-modal-footer {
    border-top: none;
  }
}
</style>
<style lang="less" scoped>
.modal-uim {
  .content {
    width: 280px;
    margin: 0 auto;

    .tips {
      font-size: 18px;
      color: hsl(0, 0%, 25%);
      line-height: 26px;
      text-align: center;
    }

    .download {
      display: block;
      width: 118px;
      height: 32px;
      line-height: 32px;
      background: hsl(209, 90%, 41%);
      border-radius: 2px;
      margin: 19px auto 19px auto;
      font-size: 14px;
      color: hsl(0, 0%, 100%);
      text-align: center;
      cursor: pointer;
    }

    .warn {
      width: 226px;
      margin: 0 auto;
      font-size: 12px;
      position: relative;

      .open-im {
        display: inline-block;
        color: hsl(210, 79%, 62%);
        position: absolute;
        left: 0;
        cursor: pointer;
      }

      .line {
        width: 1px;
        height: 12px;
        background: hsl(0, 0%, 85%);
        position: absolute;
        top: 3px;
        left: 117px;
      }

      a {
        display: inline-block;
        color: hsl(0, 0%, 45%);
        right: 0;
        position: absolute;
      }
    }

    .rem {
      margin: 0 auto;
      padding-top: 38px;
      padding-left: 20px;
      color: hsl(0, 0%, 45%);
      font-size: 12px;

      span {
        display: inline-block;
        padding-left: 5px;
      }
    }
  }
}
</style>
<template>
  <modal class="modal-uim" width="360" v-model="model" transfer :transition-names="transition">
    <div slot="header"></div>
    <div slot="footer"></div>
    <div class="content">
      <div class="tips">为了得到更好的聊天体验，建议使用SCRM聊天桌面版联系客户</div>
<!--       <a href="//www.qiaoqiaowan.net" target="_blank" class="download">下载桌面版</a> -->
      <div class="warn">
<!--         <div class="open-im" @click="openIm(1)">已安装，直接打开</div>
        <div class="line"></div> -->
        <a @click="openIm(2)" class="open-im" style="text-align: center;">使用网页版</a>
      </div>
      <div class="rem">
        <input type="checkbox" v-model="remember">
        <span>
          记住我的选择，30天内不再出现该弹窗
          <span></span>
        </span>
      </div>
    </div>
  </modal>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "modal-uim",
  data() {
    return {
      model: false,
      remember: false,
      openType: 0,
      accountId: "",
      contactId: ""
    };
  },
  computed: {
    transition() {
      if (this.model) {
        // 准备开始打开
        return ["ease", "fade"];
      } else {
        // 准备开始关闭
        return ["none", "none"];
      }
    }
  },
  watch: {
    model() {
      // 关闭对话框
      if (!this.model) {
        if (this.remember && this.openType > 0) {
          // 记住用户选项
          Cookies.set("uim_open_type", this.openType, { expires: 30 });
        }
        this.accountId = "";
        this.contactId = "";
        this.remember = false;
      }
    }
  },
  methods: {
    async open(accountId = "", contactId = "") {
      this.accountId = accountId;
      this.contactId = contactId;
      let openType = Cookies.get("uim_open_type");
      console.log("openType:",openType)
      if (!openType) {
        // 打开对话框
        this.model = true;
        return;
      }
      openType = parseInt(openType);
      switch (openType) {
        case 1: {
          this.openApp();
          this.accountId = "";
          this.contactId = "";
          break;
        }
        case 2: {
          await this.openWeb();
          this.accountId = "";
          this.contactId = "";
          break;
        }
        default: {
          this.model = true;
          break;
        }
      }
    },

    async openIm(type) {
      this.openType = type;
      switch (type) {
        case 1: {
          this.openApp();
          break;
        }
        case 2: {
          await this.openWeb();
          break;
        }
        default: {
          break;
        }
      }
    },

    async openApp() {
      // TODO @fioman 唤起桌面软件
      const result = await axios.get("/auth/uim", {
        params: { accountId: this.accountId, contactId: this.contactId }
      });
      const data = result.data.data;
      const url = data.url;
      this.model = false;
      // 这里延时确保打开前modal关闭
      setTimeout(() => window.open(url, "_blank"), 30);
    },

    async openWeb() {
      const result = await axios.get("/auth/uim", {
        params: { accountId: this.accountId, contactId: this.contactId }
      });
      const data = result.data.data;
      const url = data.url;
      this.model = false;
      // 这里延时确保打开前modal关闭
      setTimeout(() => window.open(url, "_blank"), 30);
    }
  }
};
</script>

