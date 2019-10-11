<template>
  <div>
    <i-form label-position="top" :model="registerForms" :rules="registerFormsRule">
      <alert v-if="error.show" type="error" show-icon closable @on-close="closeAlert">{{error.msg}}</alert>
      <form-item prop="mobile">
        <i-input v-model="registerForms.mobile" placeholder="请输入手机号" size="large"></i-input>
      </form-item>
      <form-item>
        <i-input v-model="registerForms.merchant" placeholder="请输入公司名称" size="large"></i-input>
      </form-item>
      <form-item prop="captcha">
        <i-input
          class="graphical"
          v-model="registerForms.captcha"
          placeholder="请输入图形识别码"
          size="large"
        >
          <span slot="append">
            <img
              ref="Img"
              @click="reloadImg"
              src="/auth/captcha"
              style="width: 110px; height: 36px"
              alt
            >
          </span>
        </i-input>
      </form-item>
      <form-item prop="code">
        <i-input
          :class="['code', {'prohibit': wait !== 0}]"
          v-model="registerForms.code"
          placeholder="请输入手机验证码"
          size="large"
        >
          <i-button
            type="primary"
            slot="append"
            @click="smsCode"
            style="width: 110px; font-size: 14px;"
          >{{wait === 0 ? `获取验证码` : `重新发送(${wait}s)`}}</i-button>
        </i-input>
      </form-item>
      <form-item prop="password">
        <i-input type="password" v-model="registerForms.password" placeholder="请设置密码" size="large"></i-input>
      </form-item>
      <form-item prop="isAgree">
        <checkbox v-model="registerForms.isAgree"></checkbox>我已阅读并接受
        <a href="javascript:void(0);" @click="readAgreement">《{{site.title}}用户服务条款》</a>
      </form-item>
      <form-item>
        <i-button
          class="comfirm-btn"
          type="primary"
          long
          size="large"
          @click="registerSubmit"
          :loading="registerLoading"
        >注&nbsp;&nbsp;册</i-button>
      </form-item>
    </i-form>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import agreement from "./agreement.vue";
import { validatePassword, isMobile } from "../../../../../scripts/utils/misc";
const site = AppData.site;
export default {
  components: {
    agreement
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error("密码为字符/数字/特殊符号至少两者及以上的组合!"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };
    return {
      registerForms: {
        mobile: "",
        merchant: "",
        captcha: "",
        code: "",
        password: "",
        isAgree: false
      },
      errorTypes: {
        mobile: "请输入手机号",
        merchant: "请输入公司名称",
        captcha: "请输入图形验证码",
        code: "请输入手机验证码",
        password: "请输入密码",
        isAgree: `请勾选我已阅读并接受《${site.title}用户服务条款》`
      },
      error: {
        show: false,
        msg: ""
      },
      //注册的手机号验证是否被通过
      isMobile: false,
      //注册等待60s重新发送
      wait: 0,
      registerLoading: false, //注册loading

      registerFormsRule: {
        password: [{ validator: validatePass, trigger: "blur" }],
        mobile: [{ validator: validateMobile, trigger: "blur" }]
      },
      site
    };
  },
  mounted() {
    // 短信验证错误
    App.registerApiFailed(-3003, async response => {
      this.showError(response.data.msg);
    });

    //手机号未注册
    App.registerApiFailed(-3004, async response => {
      this.showError(response.data.msg);
    });

    //图形验证码错误
    App.registerApiFailed(-3005, async response => {
      this.showError(response.data.msg);
    });

    //手机已注册
    App.registerApiFailed(-3006, async response => {
      this.showError(response.data.msg);
    });
  },
  methods: {
    //刷新图形验证码
    reloadImg() {
      this.$refs.Img.src = `/auth/captcha?tm=${Math.random()}`;
    },
    //获取手机验证码
    async smsCode() {
      const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (
        this.registerForms.mobile === "" ||
        !reg.test(this.registerForms.mobile)
      ) {
        this.error.show = true;
        this.error.msg = "请输入正确的手机号码";
        return false;
      }
      try {
        const result = await axios.get("/auth/validateRegisted", {
          params: { mobile: this.registerForms.mobile }
        });
        if (this.registerForms.captcha === "") {
          this.error.show = true;
          this.error.msg = "请输入图形验证码";
          return false;
        }
        const data = await axios.get("/auth/mobileCode", {
          params: {
            mobile: this.registerForms.mobile,
            captcha: this.registerForms.captcha
          }
        });
        this.wait = 60;
        this.settime();
      } catch (e) {
        return false;
      }
    },

    //注册倒计时60s
    settime() {
      if (this.wait === 0) {
        this.reloadImg();
        return false;
      } else {
        this.wait--;
      }
      setTimeout(() => {
        this.settime();
      }, 1000);
    },
    //注册提交
    registerSubmit() {
      if (this.registerLoading) {
        return;
      }
      for (let i in this.registerForms) {
        if (this.registerForms[i] === "" || this.registerForms[i] === false) {
          this.error.show = true;
          this.error.msg = this.errorTypes[i];
          return false;
        }
      }
      this.registerLoading = true;
      axios
        .post("/auth/register", this.registerForms)
        .then(result => {
          if(result && result.data && result.data.data.redirect === false){
              this.error.show = true;
              this.registerLoading = false;
              this.error.msg = "手机号码已注册!";
          } else {
            Cookies.set("username", this.registerForms.mobile);
            this.registerLoading = false;
            result = result.data;
            window.location.href = result.data.redirect;
          }
        })
        .catch(e => {
          this.registerLoading = false;
        });
    },
    //协议弹窗
    readAgreement() {
      App.modal({
        title: "会员注册协议",
        width: "small",
        render: h => {
          h = this.$createElement;
          return <agreement />;
        },
        onOk: () => {
          this.registerForms.isAgree = true;
        }
      });
    },
    closeAlert() {
      this.error.show = false;
      this.error.msg = "";
    },
    showError(msg) {
      this.error.show = true;
      this.error.msg = msg;
    }
  }
};
</script>

