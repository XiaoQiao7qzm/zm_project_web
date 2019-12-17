<template>
  <div class="add_personnel">
    <div class="con">
      <h2>{{addPerData.type === 'add' ? '添加人员' : '编辑人员'}}</h2>
      <Form :model="formLeft" label-position="left" :label-width="60">
        <FormItem label="姓名">
          <Input v-model="formLeft.name"></Input>
        </FormItem>
        <FormItem label="年龄">
          <Input v-model="formLeft.age"></Input>
        </FormItem>
        <FormItem label="手机号">
          <Input v-model="formLeft.phone"></Input>
        </FormItem>
      </Form>
      <div class="btn">
        <Button type="info" style="margin-right: 30px;" @click="ok()">确定</Button>
        <Button @click="qx()">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      formLeft: {
        name: this.addPerData.name || "",
        age: this.addPerData.age || "",
        phone: this.addPerData.phone || ""
      }
    };
  },
  props: {
    addPerData: {
      type: Object,
      required: true,
      default: {}
    }
  },
  computed: {
    ...mapState({
      page: state => state.personnel.page,
      pagenum: state => state.personnel.pagenum,
      keywords: state => state.personnel.keywords
    })
  },
  methods: {
    ...mapActions({
      ac_addPersonnel: "personnel/ac_addPersonnel",
      ac_perlist: "personnel/ac_perlist",
      ac_updatePersonnel: "personnel/ac_updatePersonnel"
    }),
    ...mapMutations({
      setAlertShow: "alert/setAlertShow"
    }),
    // 获取人员列表
    getPersonnelList(cb) {
      this.ac_perlist({
        url: "/personnel/perlist",
        data: {
          page: this.page,
          pagenum: this.pagenum,
          keywords: this.keywords
        },
        cb: cb || null
      });
    },
    qx() {
      this.$emit("openAdd", false);
    },
    ok() {
      if (
        this.formLeft.name.trim() === "" ||
        this.formLeft.age.trim() === "" ||
        this.formLeft.phone.trim() === ""
      ) {
        return;
      }
      let data = {
        name: this.formLeft.name,
        age: this.formLeft.age,
        phone: this.formLeft.phone
      };
      this.$emit("openAdd", false);
      switch (this.addPerData.type) {
        case "add":
          // 调添加接口
          this.ac_addPersonnel({
            url: "/personnel/addPersonnel",
            data,
            cb: res => {
              if (res.code === 200) {
                this.setAlertShow({ msg: res.data, type: "success" });
                this.getPersonnelList();
              } else {
                this.setAlertShow({ msg: res.data });
              }
            }
          });
          break;
        case "put":
          // 调编辑接口
          this.ac_updatePersonnel({
            url: "personnel/updatePersonnel",
            data: {
              _id: this.addPerData._id,
              ...data
            },
            cb: res => {
              if (res.code === 200) {
                this.setAlertShow({ msg: res.data, type: "success" });
                this.getPersonnelList();
              } else {
                this.setAlertShow({ msg: res.data });
              }
            }
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add_personnel {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  .con {
    width: 600px;
    height: 300px;
    position: absolute;
    background: white;
    box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    padding: 30px;
    padding-top: 0px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .btn {
      display: flex;
      justify-content: center;
    }
    h2 {
      padding: {
        top: 20px;
        bottom: 20px;
      }
    }
  }
}
</style>