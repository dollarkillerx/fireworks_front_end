<template>
  <div class="app-container">
    配置中心: {{configurationName}}
    <br>
    <br>

    <el-form :inline="true" class="demo-form-inline">
      <el-button type="primary" @click="addConfiguration">添加配置</el-button>
    </el-form>

    <el-table
        :data="configuration"
        style="width: 100%">
      <el-table-column
          label="Configuration Name">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.filename }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="Update Time">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">  <el-button type="primary" style="margin-bottom: 10px"  @click="handleModify(scope.$index, scope.row)">修改</el-button> </span>
          <span style="margin-left: 10px">  <el-button type="warning" style="margin-bottom: 10px"  @click="handleDelete(scope.$index, scope.row)">删除</el-button> </span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "index",
  data() {
    return {
      configurationName: "",
      configuration: [],
    }
  },
  beforeMount() {
    this.subtaskID = this.$route.query.subtask_id;
    this.subtaskName = this.$route.query.subtask_name;
    this.taskName = this.$route.query.task_name;
    this.configurationName = `TaskName: ${this.taskName} SubtaskName ${this.subtaskName}`
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get(`configuration/index?subtask_id=${this.subtaskID}`).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.configuration = response.data.data
        } else {
          this.$alert(`错误: ${response.data.message}`, 'Error', {
            confirmButtonText: '确定',
          });
        }
      }).catch((error) => {
        this.$alert('消息提交失败', 'Notice', {
          confirmButtonText: '确定',
        });
      })
    },
    handleModify(idx,row) {
      router.push({
        path: "/modify_configuration", query: {
          "configuration_id": row.id,
          "title": this.configurationName,
        }
      })
    },
    handleDelete(idx,row) {

      console.log(row)

      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(`configuration/delete`,{
          configuration_id: row.id,
        }).then((response) => {
          console.log(response.data)
          if (response.data.code === "0") {
            this.$alert(`删除成功`, 'Notice', {
              confirmButtonText: '确定',
            });
            this.loadData()
          } else {
            this.$alert(`错误: ${response.data.message}`, 'Error', {
              confirmButtonText: '确定',
            });
          }
        }).catch((error) => {
          this.$alert('消息提交失败', 'Notice', {
            confirmButtonText: '确定',
          });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addConfiguration() {
      // add_configuration
      router.push({
        path: "/add_configuration", query: {
          "subtask_id": this.subtaskID,
          "title": this.configurationName,
        }
      })
    }
  }
}
</script>

<style scoped>

</style>