<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 头像区域 -->
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line
  data () {
    return {
      // 登陆表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // eslint-disable-next-line
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    /* eslint-disable */
    login () {
      // validate调用有一个回调函数，可以判断返回的布尔值
      // eslint-disable-next-line
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post("login", this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.error("登陆失败！");
        } else {
          this.$message.success("登陆成功！");
          window.sessionStorage.setItem("token", res.data.token)
          this.$router.push("/home")
          // 将后端的接口返回的token保存至sessionStorage，仅会话期间生效
          // 1.1 其他后端接口需要token验证
          // 1.2 token只在打开网站期间生效，不能一直存在
          //登录成功之后跳转到管理端首页
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b2b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 3px;
  position: absolute; // 加了绝对位置之后可以设置偏离的范围
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); // 横轴位移-50%，纵轴位移-50%

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end; //右对齐
  }
}
</style>
