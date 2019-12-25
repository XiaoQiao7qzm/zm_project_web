<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="head" style="position: absolute;" @click="upfile()" title="点击修改头像">
            <img
              :src="userInfo.head ?  headUrl + userInfo.head : require('../../assets/img/head.jpeg')"
              alt
            />
            <input
              type="file"
              ref="headfile"
              @change="file($event)"
              accept="image/*"
              style="display: none;"
              v-if="headFile"
            />
          </div>
          <div class="layout-logo">欢迎你，{{userInfo.username}}</div>
          <div class="layout-nav">
            <!-- <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-paper"></Icon>Item 3
            </MenuItem> -->
            <MenuItem name="4">
              <Icon type="ios-analytics"></Icon>
              <span @click="liginout()">退出登陆</span>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu
            :active-name="menuName"
            theme="light"
            width="auto"
            :open-names="['1']"
            :accordion="false"
          >
            <MenuItem name="1" style="display: flex; align-items: center;" to="/layout/personnel">
              <Icon type="md-document" />
              <span style="margin-top: 2px;">人员管理</span>
            </MenuItem>
            <MenuItem
              name="2"
              style="display: flex; align-items: center;"
              to="/layout/monthly-profit"
            >
              <Icon type="md-leaf" />
              <span style="margin-top: 2px;">月收入统计</span>
            </MenuItem>
            <!-- <Submenu name="3">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>Items
              </template>
              <MenuItem name="3-1">list 1</MenuItem>
              <MenuItem name="3-2">list 2</MenuItem>
            </Submenu> -->
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem v-for="(item, index) in topTitle" :key="index">{{item}}</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <zmAlert></zmAlert>
    <div class="exit" v-if="exitShow">
      <Card style="width:300px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <h2>提示</h2>
          <h3 style="margin-bottom: 30px; margin-top: 10px;">确定要退出登陆吗?</h3>
          <div>
            <Button type="info" style="margin-right: 30px;" @click="ok()">确定</Button>
            <Button @click="qxExit()">取消</Button>
          </div>
           
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import zmAlert from '../../components/alert'
export default {
  data() {
    return {
      user: localStorage.getItem("user"),
      topTitle: [],
      menuName: "1",
      headFile: true,
      exitShow: false,

      headUrl: process.env.NODE_ENV === 'production' ? 'http://111.229.118.199:3000' : 'http://localhost:3000'
    };
  },
  components: {
    zmAlert
  },
  computed: {
    ...mapState({
      userInfo: state => state.users.userInfo
    })
  },
  created() {
    this.setTopTitleAndMenu(this.$route);
  },
  mounted() {
    //获取用户信息
    this.ac_getUserInfo({
      url: "users/getUserInfo"
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.setTopTitleAndMenu(to);
    next();
  },
  methods: {
    ...mapActions({
      ac_getUserInfo: "users/ac_getUserInfo",
      ac_uploadHead: "users/ac_uploadHead",
      ac_exit: 'users/ac_exit'
    }),
    ...mapMutations({
      setAlertShow: "alert/setAlertShow"
    }),
    setTopTitleAndMenu(api) {
      switch (api.path) {
        case "/layout/personnel":
          this.topTitle = [];
          this.topTitle.push("人员管理");
          this.menuName = "1";
          break;
        case "/layout/monthly-profit":
          this.topTitle = [];
          this.topTitle.push("月收入统计");
          this.menuName = "2";
          break;
        default:
          this.topTitle = [];
          this.topTitle.push("--------");
          break;
      }
    },
    liginout() {
      this.exitShow = true
    },
    qxExit() {
      this.exitShow = false
    },
    // 上传头像
    // 上传excel
    upfile() {
      this.$refs["headfile"].click();
    },
    refreshFile() {
      this.headFile = false;
      setTimeout(() => {
        this.headFile = true;
      }, 0);
    },
    file(e) {
      let head = e.target.files[0];
      this.refreshFile(); // input['file']标签重新渲染
      this.ac_uploadHead({
        url: "users/uploadHead",
        data: {
          head
        },
        cb: res => {
          if (res.code === 200) {
            //获取用户信息
            this.ac_getUserInfo({
              url: "users/getUserInfo"
            });
          }
        }
      });
    },
    // 退出登陆
    ok() {
      this.ac_exit({
        url: 'users/exit',
        data: {
          username: this.userInfo.username,
          uid: this.userInfo.uid
        },
        cb: (res) => {
          this.exitShow = false
          if(res.code === 200) {
            this.setAlertShow({msg: res.data, type: 'success'})
            localStorage.removeItem("token");
            this.$router.push("/login");
          } else {
            this.setAlertShow({msg: res.data})
          }
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
  .ivu-layout {
    height: 100%;
  }
}
.head {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  top: 9px;
  background: url('../../assets/img/head.jpeg') no-repeat top left;
  background-size: 100% 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
.layout-logo {
  // width: 100px;
  padding: {
    left: 20px;
    right: 20px;
  }
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 50px;
  line-height: 30px;
  text-align: center;
  color: #f5f7f9;
}
.layout-nav {
  // width: 420px;
  float: right;
  margin: 0 auto;
  margin-right: 20px;
}
.exit {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .3);
  z-index: 1000;
}
</style>