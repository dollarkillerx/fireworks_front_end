<template>
  <div class="app-container">
    父任务: {{taskName}}
    <br>
    <br>
    <el-form :inline="true" class="demo-form-inline">
      <el-button type="primary" @click="addSubtaskVisible = true">添加子任务</el-button>
    </el-form>

    <el-table
        :data="subtasks"
        style="width: 100%">
      <el-table-column
          label="Subtask Name">
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
          label="Action">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.action }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="Branch OR Tag筛选">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.branch }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="Agent">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.agent_name }}</span>
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
          <span style="margin-left: 10px">  <el-button type="primary" style="margin-bottom: 10px"  @click="handleModify(scope.$index, scope.row)">修改</el-button> </span>
          <span style="margin-left: 10px">  <el-button type="primary"   @click="handleLogs(scope.$index, scope.row)">日志</el-button> </span>
          <span style="margin-left: 10px">  <el-button type="success"   @click="handleReboot(scope.$index, scope.row)">重启</el-button> </span>
          <span style="margin-left: 10px">  <el-button type="warning" style="margin-bottom: 10px"  @click="handleStop(scope.$index, scope.row)">停止</el-button> </span>
          <template v-if="scope.row.disabled">
            <span style="margin-left: 10px">  <el-button type="success"   @click="handleStatus(scope.$index, scope.row)">激活</el-button></span>
          </template>
          <template v-else>
            <span style="margin-left: 10px">  <el-button type="warning"   @click="handleStatus(scope.$index, scope.row)">禁用</el-button> </span>
          </template>
          <span style="margin-left: 10px">  <el-button type="danger"   @click="handleDelete(scope.$index, scope.row)">删除</el-button> </span>
          <span style="margin-left: 10px">  <el-button type="primary"   @click="handleConfiguration(scope.$index, scope.row)">配置中心</el-button> </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加子任务" :visible.sync="addSubtaskVisible" width="90%">
      <el-form ref="form" :model="subtask" label-width="80px">
        <el-form-item label="名称">
          <el-input
              type="text"
              v-model="subtask.name">
          </el-input>
        </el-form-item>

        <el-form-item label="Agent">
          <el-select v-model="subtask.agent_id" placeholder="请选择">
            <el-option
                v-for="item in agents"
                :key="item.id"
                :label="item.agent_name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="触发方式">
          <el-select v-model="action" placeholder="请选择">
            <el-option
                v-for="item in actions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="branchName">
          <el-input
              type="text"
              v-model="subtask.branch">
          </el-input>
        </el-form-item>
        <el-form-item label="指令">
          <el-input
              type="textarea"
              :autosize="{ minRows: 4}"
              v-model="subtask.instruction">
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
              type="text"
              v-model="subtask.description">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSubtaskVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubtask">添加 子任务</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改子任务" :visible.sync="modifySubtaskVisible" width="90%">
      <el-form ref="form" :model="modifySubtask" label-width="80px">
        <el-form-item label="名称">
          <el-input
              type="text"
              v-model="modifySubtask.name" :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="Agent">
          <el-input
              type="text"
              v-model="modifySubtask.agent_name" :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item label="触发方式">
          <el-input
              type="text"
              v-model="modifySubtask.action" :disabled="true">
          </el-input>
        </el-form-item>

        <el-form-item :label="branchName">
          <el-input
              type="text"
              v-model="modifySubtask.branch">
          </el-input>
        </el-form-item>
        <el-form-item label="指令">
          <el-input
              type="textarea"
              :autosize="{ minRows: 4}"
              v-model="modifySubtask.instruction">
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
              type="text"
              v-model="modifySubtask.description">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifySubtaskVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifySubtaskData">修改 子任务</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import router from "@/router";

export default {
  name: "subtasks",
  data() {
    return {
      taskID: "",
      taskName: "",
      subtasks: [],
      branchName: "分支",
      addSubtaskVisible: false,
      modifySubtaskVisible: false,
      subtask: {
        instruction:"",
        branch:"",
        action: "",
      },
      modifySubtask: {
        instruction: "",
        description: "",
        branch: "",
      },
      agents: [],
      action: "",
      actions: [
        {
          name: "Push",
          value: "push"
        },
        {
          name: "Tag",
          value: "tag_push"
        },
        {
          name: "Merge",
          value: "merge_request"
        },
        {
          name: "Push Or Merge",
          value: "push_or_merge"
        }
      ]
    }
  },
  beforeMount() {
    this.taskID = this.$route.query.task_id;
    this.taskName = this.$route.query.task_name;
    this.loadData()
    this.defaultSubtask()
  },
  methods: {
    defaultSubtask() {
      this.subtask = {
        branch: "",
        action: "",
        instruction: `{
    "build":[

    ],
    "test":[

    ],
    "deploy":[

    ],
    "reboot":[

    ],
    "stop":[

    ],
    "delete":[

    ]
}`
      }
    },
    loadData() {
      this.$http.get(`subtask/index?task_id=${this.taskID}`).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.subtasks = response.data.data
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

      this.$http.get(`agents`).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.agents = response.data.data
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
    addSubtask() {
      this.subtask.action = this.action
      this.subtask.task_id = this.taskID

      console.log(this.subtask)

      this.$http.post(`subtask/create`,this.subtask).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.subtasks = response.data.data
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.defaultSubtask()
          this.loadData()
          this.addSubtaskVisible = false
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
      console.log(row)
      if (row.action === "tag") {
        this.branchName = "tag匹配"
      }else {
        this.branchName = "branch"
      }

      this.modifySubtask.name = row.name
      this.modifySubtask.subtask_id = row.id
      this.modifySubtask.agent_name = row.agent_name
      this.modifySubtask.action = row.action
      this.modifySubtask.branch = row.branch
      this.modifySubtask.instruction = row.instruction
      this.modifySubtask.description = row.description
      this.modifySubtaskVisible = true
    },
    modifySubtaskData() {
      this.$http.post(`subtask/update`,this.modifySubtask).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.subtasks = response.data.data
          this.$message({
            type: 'success',
            message: '修改!'
          });
          this.loadData()
          this.modifySubtaskVisible = false
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
    handleStatus(idx,row) {
      console.log(row)
      this.$confirm('是否更新状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("subtask/disabled", {"subtask_id": row.id}).then((response) => {
          console.log(response.data)
          if (response.data.code === "0") {

            this.$message({
              type: 'success',
              message: '更新成功!'
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
    handleDelete(idx,row) {
      this.$confirm('是否删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("subtask/delete", {"subtask_id": row.id}).then((response) => {
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
    handleReboot(idx,row) {
      this.$confirm('是否重启', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("subtask/reboot", {"subtask_id": row.id}).then((response) => {
          console.log(response.data)
          if (response.data.code === "0") {

            this.$message({
              type: 'success',
              message: '任务下发成功!'
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
    handleStop(idx,row) {
      this.$confirm('是否停止服务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post("subtask/stop", {"subtask_id": row.id}).then((response) => {
          console.log(response.data)
          if (response.data.code === "0") {

            this.$message({
              type: 'success',
              message: '任务下发成功!'
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
    handleLogs(idx,row) {
      router.push({
        path: "logs", query: {
          "subtask_id": row.id,
          "subtask_name": row.name,
          "task_id": row.task_id,
          "task_name": this.taskName,
        }
      })
    },
    handleConfiguration(idx,row) {
      console.log(row)
      router.push({
        path: "/configuration", query: {
          "subtask_id": row.id,
          "subtask_name": row.name,
          "task_name": this.taskName,
        }
      })
    }
  },
  watch: {
    action(val) {
      if (val  === "tag_push") {
        this.branchName = "tag监听值"
      }else {
        this.branchName = "分支"
      }
    }
  },
}
</script>

<style scoped>
</style>
