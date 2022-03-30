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
          <span style="margin-left: 10px">  <el-button type="primary"   @click="handleSubtasks(scope.$index, scope.row)">子任务</el-button> </span>
          <template v-if="scope.row.disabled">
            <span style="margin-left: 10px">  <el-button type="success"   @click="handleStatus(scope.$index, scope.row)">激活</el-button></span>
          </template>
          <template v-else>
            <span style="margin-left: 10px">  <el-button type="warning"   @click="handleStatus(scope.$index, scope.row)">禁用</el-button> </span>
          </template>
          <span style="margin-left: 10px">  <el-button type="danger"   @click="handleDelete(scope.$index, scope.row)">删除</el-button> </span>
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
  </div>
</template>

<script>
export default {
  name: "subtasks",
  data() {
    return {
      taskID: "",
      taskName: "",
      subtasks: [],
      branchName: "分支",
      addSubtaskVisible: false,
      subtask: {
        instruction:"",
        branch:"",
        action: "",
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

      this.$http.get(`subtask/create`,this.subtask).then((response) => {
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

      this.defaultSubtask()
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
