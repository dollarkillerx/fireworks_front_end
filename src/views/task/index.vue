<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-button type="primary" @click="addTaskVisible = true">添加Task</el-button>
    </el-form>

    <el-table
        :data="tasks"
        style="width: 100%">
      <el-table-column
          label="TaskName">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="Description">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="Token">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.disabled">
            <span style="margin-left: 10px">  <el-button type="danger">禁用</el-button> </span>
          </template>
          <template v-else>
            <span style="margin-left: 10px">  <el-button type="success">正常</el-button></span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">  <el-button type="primary" @click="handleSubtasks(scope.$index, scope.row)">子任务</el-button> </span>
          <template v-if="scope.row.disabled">
            <span style="margin-left: 10px">  <el-button type="success" @click="handleStatus(scope.$index, scope.row)">激活</el-button></span>
          </template>
          <template v-else>
            <span style="margin-left: 10px">  <el-button type="warning" @click="handleStatus(scope.$index, scope.row)">禁用</el-button> </span>
          </template>
          <span style="margin-left: 10px">  <el-button type="danger"
                                                       @click="handleDelete(scope.$index, scope.row)">删除</el-button> </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加Task" :visible.sync="addTaskVisible" width="50%">
      <el-form ref="form" :model="task" label-width="80px">
        <el-form-item label="名称">
          <el-input
              type="text"
              v-model="task.name">
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
              type="text"
              v-model="task.description">
          </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTask">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "index",
  data() {
    return {
      tasks: [],
      addTaskVisible: false,
      task: {}
    }
  },
  beforeMount() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get("task/index").then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.tasks = response.data.data
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
    addTask() {
      this.$http.post("task/create", this.task).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.$alert(`添加成功`, 'Error', {
            confirmButtonText: '确定',
          });

          this.loadData()
          this.addTaskVisible = false
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
    handleStatus(idx, row) {
      this.$http.post("task/disabled", {"task_id": row.id}).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.$alert(`操作成功`, 'Notice', {
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
    },
    handleDelete(idx, row) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("task/delete", {"task_id": row.id}).then((response) => {
          console.log(response.data)
          if (response.data.code === "0") {

            this.$message({
              type: 'success',
              message: '删除成功!'
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
    handleSubtasks(idx, row) {
      console.log(row)
      router.push({
        path: "subtasks", query: {
          "task_id": row.id,
          "task_name": row.name,
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
