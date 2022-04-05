<template>
  <div class="app-container">
    Modify 配置文件: {{configurationName}}
    <br>
    <br>
    <el-form ref="form" :model="newConfiguration" label-width="80px">
      <el-input v-model="newConfiguration.filename" placeholder="配置文件名称"></el-input>
      <br>
      <br>
      <codemirror
          ref="myCode"
          :value="code"
          :options="cmOptions"
          class="code">
      </codemirror>
      <br>
      <br>
      <el-button type="success" @click="modifyConfiguration">修改</el-button>
    </el-form>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/theme/liquibyte.css';//导入选中的theme主题,与初始化theme配置一致
import 'codemirror/addon/hint/show-hint.css';//导入自动提示核心样式

import 'codemirror/mode/sql/sql.js';//导入使用的语言语法定义文件，初始化mode配置一致
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/hint/show-hint.js';//导入自动提示核心文件
import 'codemirror/addon/hint/sql-hint.js';
//导入指定语言的提示文件

export default {
  name: "modify",
  // props: {
  //   code: String,
  // },
  data() {
    return {
      configurationName: "",
      newConfiguration: {
        filename: ""
      },
      code: "",
      editor: {},
      cmOptions:{
        value:'',//编辑器的起始值。可以是字符串，也可以是文档对象。
        mode:"text/x-hive",//第一个将模式名称映射到它们的构造函数，第二个将MIME类型映射到模式规范。
        theme: "liquibyte",//编辑器样式的主题
        indentWithTabs: true,//在缩进时，是否tabSize 应该用N个制表符替换前N *个空格。默认值为false。
        smartIndent: true,//是否使用模式提供的上下文相关缩进（或者只是缩进与之前的行相同）。默认为true。
        lineNumbers: true,//是否在编辑器左侧显示行号。
        matchBrackets : true,//括号匹配
        autofocus: true,//可用于使CodeMirror将焦点集中在初始化上
        extraKeys: {"Ctrl-Space": "autocomplete"},//按键配置
        hintOptions: {tables: {
            users: ["name", "score", "birthDate"],
            countries: ["name", "population", "size"]
          }}
      },
    }
  },
  components:{
    codemirror
  },
  mounted() {
    this.configurationID = this.$route.query.configuration_id;
    this.configurationName = this.$route.query.title;
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get(`configuration/item?configuration_id=${this.configurationID}`).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.configuration = response.data.data
          console.log(this.configuration)
          this.newConfiguration.filename = this.configuration.filename
          this.newConfiguration.body = this.configuration.body
          this.code = this.newConfiguration.body;
          console.log("==================")
          console.log(this.code)
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
    modifyConfiguration() {
      this.newConfiguration.subtask = this.subtaskID;
      this.newConfiguration.body = this.$refs.myCode.content;
      this.newConfiguration.configuration_id = this.configurationID;

      if (this.newConfiguration.body === ''||this.newConfiguration.filename === '') {
        this.$alert('请认真填写表单', 'Notice', {
          confirmButtonText: '确定',
        });
        return
      }

      this.$http.post(`configuration/modify`,this.newConfiguration).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.$alert(`修改成功`, 'Notice', {
            confirmButtonText: '确定',
          });
          this.$router.go(-1)
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