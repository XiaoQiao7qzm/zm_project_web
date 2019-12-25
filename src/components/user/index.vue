<template>
  <div class="login-wrap">
    <div class="login">
      <h1>
        {{type === 'register' ? '注册' : '登陆'}}
        <span @click="goViews('/login')">登陆</span>
        <span @click="goViews('/register')">注册</span>
      </h1>
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="username" style="width: 260px;">
          <Input type="text" v-model="formInline.username" placeholder="用户名">
            <Icon type="ios-person-outline" slot="prepend" size="15"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password" style="width: 260px;">
          <Input type="password" v-model="formInline.password" placeholder="密码">
            <Icon type="ios-lock-outline" slot="prepend" size="15"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="authcode" style="width: 170px; position: relative;">
          <Input type="text" v-model="formInline.authcode" placeholder="验证码" maxlength="4">
            <Icon type="ios-checkmark-circle-outline" slot="prepend" size="15"></Icon>
          </Input>
          <img :src="svgSrc" alt="验证码" class="auth-code" @click="refreshImg($event)" />
        </FormItem>
        <FormItem style="margin: 0; width: 260px; display: block; margin-top: 10px;">
          <Button @click="resetInput()" style="width: 60px; height: 38px; float: left;">重置</Button>
          <Button
            type="info"
            @click="handleSubmit('formInline')"
            style="width: 60px; height: 38px;  float: right;"
          >{{type === 'register' ? '注册' : '登陆'}}</Button>
        </FormItem>
      </Form>
    </div>
    <zmAlert></zmAlert>
  </div>
</template>

<script>
import zmAlert from "../alert"
import { mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      //svg
      svgSrc: this.$req_url + '/users/svgCaptcha?time=' + new Date().getTime(),
      // form
      formInline: {
        username: "",
        password: "",
        authcode: ""
      },
      ruleInline: {
        username: [
          {
            required: true,
            pattern: /[^\s]/,
            message: "请输入用户名",
            trigger: "focus"
          }
        ],
        password: [
          {
            required: true,
            pattern: /[^\s]/,
            message: "请输入密码",
            trigger: "focus"
          }
        ],
        authcode: [
          {
            required: true,
            pattern: /[^\s]/,
            message: "请输入验证吗",
            trigger: "focus"
          }
        ]
      }
    };
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  components: {
    zmAlert
  },
  methods: {
    ...mapActions({
      ac_register: 'users/ac_register',
      ac_login: 'users/ac_login'
    }),
    ...mapMutations({
      setAlertShow: 'alert/setAlertShow'
    }),
    goViews(route) {
      this.$router.replace(route);
    },
    // 刷新验证码
    refreshImg(e) {
      this.svgSrc = this.$req_url + '/users/svgCaptcha?time=' + new Date().getTime()
    },
    handleSubmit(name) {
      // this.$refs[name].validate(valid => {
      //   if (valid) {
      //     console.log(this[name])
      //   }
      // });
      if (this.formInline.username.trim() === "") {
        this.setAlertShow({msg: "请输入用户名"});
        return;
      }
      if (this.formInline.password.trim() === "") {
        this.setAlertShow({msg: "请输入密码"});
        return;
      }
      // 注册时验证格式
      if(this.type === 'register') {
        if(!(/^[0-9a-zA-Z]{6,10}$/.test(this.formInline.username))) {
          this.setAlertShow({msg: "用户名格式：6到10位 数字或字母（区分大小写）"});
          return;
        }
        if(!(/^[A-Z]{1}[0-9a-zA-Z]{5,17}$/.test(this.formInline.password))) {
          this.setAlertShow({msg: "密码格式：6到18位 数字或字母（区分大小写），第一位必须为大写字母"});
          return;
        }
      }
      if (this.formInline.authcode.trim() === "") {
        this.setAlertShow({msg: "请输入验证码"});
        return;
      }
      let data = {
        username: this.formInline.username,
        password: this.formInline.password,
        authcode: this.formInline.authcode
      }
      switch (this.type) {
        case "login":
          this.ac_login({
            url: '/users/login',
            data,
            cb: (res) => {
              if(res.code === 200) {
                this.setAlertShow({msg: res.data.message, type: 'success'});
                this.resetInput()
                localStorage.setItem('token', res.data.token)
                this.$router.replace('/layout')
              } else {
                this.setAlertShow({msg: res.data});
              }
              this.refreshImg()
            }
          })
          break
        case "register":
          this.ac_register({
            url: '/users/register',
            data,
            cb: (res) => {
              if(res.code === 200) {
                this.setAlertShow({msg: "注册成功，请前往登陆您的账号", type: 'success'});
                this.resetInput()
              } else {
                this.setAlertShow({msg: res.data});
              }
              this.refreshImg()
            }
          })
          break
        default:
          break
      }
    },
    resetInput() {
      this.formInline.username = "";
      this.formInline.password = "";
      this.formInline.authcode = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(#2db7f5, #5cadff);
  .login {
    width: 320px;
    // height: 340px;
    background: -webkit-linear-gradient(white, rgb(243, 239, 239));
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    padding: {
      left: 30px;
      right: 30px;
      top: 30px;
      bottom: 20px;
    }
    .auth-code {
      width: 80px;
      height: 31px;
      position: absolute;
      top: 0;
      right: -89px;
      z-index: 99;
    }
  }
  h1 {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #efefef;
    font-size: 22px;
    span {
      font-size: 14px;
      font-weight: normal;
      text-decoration: underline;
      cursor: pointer;
      color: #2db7f5;
      &:nth-child(1) {
        margin-left: 142px;
        margin-right: 10px;
      }
    }
  }
  .input-box {
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
    }
    input.ivu-input {
      padding-left: 20px !important;
    }
  }
}
</style>