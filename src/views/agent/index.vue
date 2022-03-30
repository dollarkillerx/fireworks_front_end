<template>
  <div class="app-container">
    <el-table
        :data="agents"
        style="width: 100%">
      <el-table-column
          label="最近在线时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.live_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="AgentName">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.agent_name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="AgentIP">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.agent_url }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="备注">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="Workspace">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.workspace }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="是否在线">
        <template slot-scope="scope">
          <template v-if="scope.row.live">
            <span style="margin-left: 10px">  <el-button type="success">在线</el-button> </span>
            </template>
            <template v-else>
              <span style="margin-left: 10px">  <el-button type="danger">离线</el-button></span>
            </template>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: "index",
  data(){
    return {
      agents: []
    }
  },
  beforeMount() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get("agents").then((response) => {
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
    }
  }
}
</script>

<style scoped>

</style>
