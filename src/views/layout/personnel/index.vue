<template>
  <div class="personnel-wrap">
    <div class="top">
      <Input
        search
        placeholder="姓名或手机号查询"
        style="width: 200px;"
        @on-search="search()"
        v-model="searchData"
      />
      <div>
        <Button
          icon="ios-cloud-upload-outline"
          style="margin-right: 20px;"
          @click="upfile()"
        >上传excel</Button>
        <Button type="error" style="margin-right: 20px;" @click="allDel()">批量删除</Button>
        <Button type="info" style="margin-right: 1px;" @click="openAdd(true)">添加成员</Button>
        <input
          type="file"
          ref="file"
          @change="file($event)"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style="display: none;"
          v-if="inputFile"
        />
      </div>
    </div>
    <div class="personnel-table">
      <Table
        border
        :columns="columns7"
        :data="personnelList"
        @on-select="selectOne"
        @on-select-cancel="selectOneCancel"
        @on-select-all="selectAll"
        @on-select-all-cancel="selectAllCancel"
      ></Table>
    </div>
    <div style="margin-top: 10px;">
      <Page
        :total="total"
        :show-elevator="false"
        :page-size="pagenum"
        :current="page"
        @on-change="pageChange"
      />
    </div>
    <addPer v-if="addPerShow" @openAdd="openAdd" :addPerData="addPerData"></addPer>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import addPer from "../../../components/add_personnel";
export default {
  components: {
    addPer
  },
  data() {
    return {
      // 添加或编辑的 传递数据
      addPerData: {},
      addPerShow: false,
      inputFile: true,
      searchData: "",
      // 全选状态预存id列表  以便在取消全选时将这些_id在 selectIdList中删除
      allIdList: [],
      columns7: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "name",
          render: (h, params) => {
            return h("div", [h("strong", params.row.name)]);
          }
        },
        {
          title: "年龄",
          key: "age"
        },
        {
          title: "手机号",
          key: "phone"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row._id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      page: state => state.personnel.page,
      pagenum: state => state.personnel.pagenum,
      keywords: state => state.personnel.keywords,
      personnelList: state => state.personnel.personnelList,
      total: state => state.personnel.total,
      selectIdList: state => state.personnel.selectIdList
    })
  },
  mounted() {
    this.getPersonnelList();
  },
  methods: {
    ...mapActions({
      ac_perlist: "personnel/ac_perlist",
      ac_deletePersonnel: "personnel/ac_deletePersonnel",
      ac_upfilePersonnel: "personnel/ac_upfilePersonnel",
      ac_deleteBatchPersonnel: "personnel/ac_deleteBatchPersonnel"
    }),
    ...mapMutations({
      setPage: "personnel/setPage",
      setKeywords: "personnel/setKeywords",
      setSelectIdList: "personnel/setSelectIdList",

      setAlertShow: 'alert/setAlertShow'
    }),
    // 获取人员列表函数封装
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
    // 编辑 打开编辑窗口
    show(data) {
      this.addPerData = {
        name: data.name,
        age: data.age,
        phone: data.phone,
        _id: data._id,
        type: "put"
      };
      this.addPerShow = true;
    },
    // 删除
    remove(_id) {
      this.ac_deletePersonnel({
        url: "personnel/deletePersonnel",
        data: {
          _id
        },
        cb: res => {
          if (res.code === 200) {
            this.setAlertShow({msg: res.data, type: 'success'})
            this.getPersonnelList(() => {
              if (this.personnelList.length < 1 && parseInt(this.page) > 1) {
                this.setPage({ page: this.page - 1 });
                this.getPersonnelList();
              }
            });
            this.setSelectIdList({ type: "selectOneCancel", _id });
          } else {
            this.setAlertShow({msg: res.data})
          }
        }
      });
    },
    // 打开单个添加窗口
    openAdd(bool) {
      this.addPerShow = bool;
      this.addPerData = { type: "add" };
    },
    // 分页器切换
    pageChange(page) {
      this.setPage({ page });
      this.getPersonnelList();
    },
    // 上传excel
    upfile() {
      this.$refs["file"].click();
    },
    refreshFile() {
      this.inputFile = false;
      setTimeout(() => {
        this.inputFile = true;
      }, 0);
    },
    file(e) {
      let file = e.target.files[0];
      this.refreshFile();
      this.ac_upfilePersonnel({
        url: "personnel/upfilePersonnel",
        data: {
          file
        },
        cb: res => {
          if (res.code === 200) {
            this.setAlertShow({msg: res.data, type: 'success'})
            this.getPersonnelList();
          } else {
            this.setAlertShow({msg: res.data})
          }
        }
      });
    },
    // 搜索功能
    search() {
      this.setKeywords({ keywords: this.searchData });
      this.setPage({ page: 1 });
      this.getPersonnelList();
    },
    //多选选全选
    selectOne(selection, row) {
      this.setSelectIdList({ type: "selectOne", _id: row._id });
    },
    selectOneCancel(selection, row) {
      this.setSelectIdList({ type: "selectOneCancel", _id: row._id });
    },
    selectAll() {
      this.setSelectIdList({ type: "selectAll" });
    },
    selectAllCancel() {
      this.setSelectIdList({ type: "selectAllCancel" });
    },
    // 批量删除
    allDel() {
      if (this.selectIdList.length === 0) return;
      this.ac_deleteBatchPersonnel({
        url: "personnel/deleteBatchPersonnel",
        data: {
          idList: this.selectIdList
        },
        cb: res => {
          if (res.code === 200) {
            this.setAlertShow({msg: res.data, type: 'success'})
            this.setPage({ page: 1 });
            this.getPersonnelList();
            this.setSelectIdList({ type: "init" });
          } else {
            this.setAlertShow({msg: res.data})
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.personnel-wrap {
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
</style>