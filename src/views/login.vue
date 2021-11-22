<template>
  <img :src="bg" class="wave" />
  <div class="container">
    <div class="img">
      <component :is="currentWeek"></component>
    </div>
    <div class="login-box">
      <div class="login-form">
        <avatar class="avatar" />
        <h2
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 100
            }
          }"
        >
          Vite-Template
        </h2>
        <div
          class="input-group user"
          :class="{ focus: userFocus }"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 200
            }
          }"
        >
          <div class="icon">
            <el-icon><User /></el-icon>
          </div>
          <div>
            <h5>用户名</h5>
            <input
              type="text"
              class="input"
              v-model="user"
              @focus="onUserFocus"
              @blur="onUserBlur"
            />
          </div>
        </div>
        <div
          class="input-group pwd"
          :class="{ focus: pwdFocus }"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 300
            }
          }"
        >
          <div class="icon">
            <el-icon><lock /></el-icon>
          </div>
          <div>
            <h5>密码</h5>
            <input
              type="password"
              class="input"
              v-model="pwd"
              @focus="onPwdFocus"
              @blur="onPwdBlur"
            />
          </div>
        </div>
        <button
          class="btn"
          v-motion
          :initial="{
            opacity: 0,
            y: 10
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 400
            }
          }"
          @click="onLogin"
        >
          登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { initRouter } from "/@/router";
import { storageSession } from "/@/utils/storage";
import bg from "/@/assets/images/login/bg.png";
import avatar from "/@/assets/images/login/avatar.svg";
import illustration0 from "/@/assets/images/login/illustration0.svg";
import illustration1 from "/@/assets/images/login/illustration1.svg";
import illustration2 from "/@/assets/images/login/illustration2.svg";
import illustration3 from "/@/assets/images/login/illustration3.svg";
import illustration4 from "/@/assets/images/login/illustration4.svg";
import illustration5 from "/@/assets/images/login/illustration5.svg";
import illustration6 from "/@/assets/images/login/illustration6.svg";

const router = useRouter();

const currentWeek = computed(() => {
  switch (String(new Date().getDay())) {
    case "0":
      return illustration0;
    case "1":
      return illustration1;
    case "2":
      return illustration2;
    case "3":
      return illustration3;
    case "4":
      return illustration4;
    case "5":
      return illustration5;
    case "6":
      return illustration6;
    default:
      return illustration4;
  }
});

let user = ref("admin");
let pwd = ref("123456");
let userFocus = ref(true);
let pwdFocus = ref(true);

const onLogin = (): void => {
  storageSession.setItem("info", {
    username: "admin",
    accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
  });
  initRouter("admin").then(() => {});
  router.push("/");
};

function onUserFocus() {
  userFocus.value = true;
}
function onUserBlur() {
  if (user.value.length === 0) userFocus.value = false;
}
function onPwdFocus() {
  pwdFocus.value = true;
}

function onPwdBlur() {
  if (pwd.value.length === 0) pwdFocus.value = false;
}
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 18rem;
  padding: 0 2rem;
}

.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.img img {
  width: 500px;
}

.login-box {
  display: flex;
  align-items: center;
  text-align: center;
}

.login-form {
  width: 360px;
}

.avatar {
  width: 350px;
  height: 80px;
}

.login-form h2 {
  text-transform: uppercase;
  margin: 15px 0;
  color: #999;
  font: bold 200% Consolas, Monaco, monospace;
}

.input-group {
  position: relative;
  display: grid;
  grid-template-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #d9d9d9;
}

.input-group:nth-child(1) {
  margin-bottom: 4px;
}

.input-group::before,
.input-group::after {
  content: "";
  position: absolute;
  bottom: -2px;
  width: 0;
  height: 2px;
  background-color: #c5d3f7;
  transition: 0.5s;
}

.input-group::after {
  right: 50%;
}

.input-group::before {
  left: 50%;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon i {
  color: #d9d9d9;
  transition: 0.5s;
}

.input-group > div {
  position: relative;
  height: 45px;
}

.input-group > div > h5 {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #d9d9d9;
  font-size: 18px;
  transition: 0.3s;
  margin: 0;
  padding: 0;
}

.input-group.focus .icon i {
  color: #5392f0;
}

.input-group.focus div h5 {
  top: -5px;
  font-size: 15px;
}

.input-group.focus::after,
.input-group.focus::before {
  width: 50%;
}

.input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: none;
  outline: none;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: #555;
  font-family: "Roboto", sans-serif;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #5392f0;
}

.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  margin: 1rem 0;
  font-size: 1.2rem;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #567dbe, #5392f0, #567dbe);
  cursor: pointer;
  color: #fff;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif;
  background-size: 200%;
  transition: 0.5s;
}

.btn:hover {
  background-position: right;
}

.copyright {
  position: absolute;
  width: 100%;
  height: 50px;
  bottom: 2px;
  color: #5392f0;
  text-align: center;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
}

@media screen and (max-width: 1080px) {
  .container {
    grid-gap: 9rem;
  }
}

@media screen and (max-width: 1024px) {
  .login-form {
    width: 290px;
  }

  .login-form h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img img {
    width: 360px;
  }

  .avatar {
    width: 280px;
    height: 80px;
  }
}

@media screen and (max-width: 768px) {
  .wave {
    display: none;
  }

  .img {
    display: none;
  }

  .container {
    grid-template-columns: 1fr;
  }

  .login-box {
    justify-content: center;
  }
}
</style>
