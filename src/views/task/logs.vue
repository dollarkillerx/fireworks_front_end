<template>
  <div class="app-container">
    {{title}}
    <br>
    <br>
    <el-table
        :data="logs"
        style="width: 100%">
      <el-table-column
          label="ID">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="RunTime">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="Task">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.task_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="Subtask">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.subtask_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="Task Type">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.task_type }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="状态">
        <template slot-scope="scope">
          <template v-if='scope.row.task_status === "wait"'>
            <span style="margin-left: 10px">  <el-button type="primary">Wait</el-button> </span>
          </template>
          <template v-else-if='scope.row.task_status === "failed"'>
            <span style="margin-left: 10px">  <el-button type="danger">Failed</el-button></span>
          </template>
          <template v-else-if='scope.row.task_status === "running"'>
            <span style="margin-left: 10px">  <el-button type="success">Running</el-button></span>
          </template>
          <template v-else-if='scope.row.task_status === "passed"'>
            <span style="margin-left: 10px">  <el-button type="success">Passed</el-button></span>
          </template>
          <template v-else>
            <span style="margin-left: 10px">  <el-button type="primary">{{ scope.row.task_stage }}</el-button> </span>
          </template>
        </template>
      </el-table-column>

      <el-table-column
          label="Task 阶段">
        <template slot-scope="scope">
          <template v-if='scope.row.task_stage === "build"'>
            <span style="margin-left: 10px">  <el-button type="primary">Build</el-button> </span>
          </template>
          <template v-else-if='scope.row.task_stage === "deploy"'>
            <span style="margin-left: 10px">  <el-button type="success">Deploy</el-button></span>
          </template>
          <template v-else-if='scope.row.task_stage === "test"'>
            <span style="margin-left: 10px">  <el-button type="warning">Test</el-button></span>
          </template>
          <template v-else>
            <span style="margin-left: 10px">  <el-button type="primary">{{ scope.row.task_stage }}</el-button> </span>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">  <el-button type="primary"  @click="handleShowLog(scope.$index, scope.row)">查看Log</el-button> </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "logs",
  data() {
    return {
      title: "",
      logs: [],
    }
  },
  beforeMount() {
    this.taskID = this.$route.query.task_id;
    this.taskName = this.$route.query.task_name;
    this.subtaskID = this.$route.query.subtask_id;
    this.subtaskName = this.$route.query.subtask_name;
    if (this.taskName !== undefined) {
      this.title += `Task: ${this.taskName} `
    }
    if (this.subtaskName !== undefined) {
      this.title += `Subtask: ${this.subtaskName}`
    }

    if (this.taskName === undefined && this.subtaskName === undefined) {
      this.title += `全局任务`
    }
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get(`task_logs?task_id=${this.taskID}&subtask_id=${this.subtaskID}`).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.logs = response.data.data
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
    handleShowLog(idx,row) {
      this.$alert(row.Log, 'Log', {
        confirmButtonText: '确定',
      });
    }
  }
}
</script>

<style scoped>

</style>
