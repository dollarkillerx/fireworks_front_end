<template>
  <div class="app-container">
    <div style="text-align: center">
      <h1>Rime 任务中心</h1>
    </div>

    <el-descriptions class="margin-top" title="选择方法" :column="2" border>
      <el-descriptions-item>
        <template slot="label">
          选中方法
        </template>
        {{ insFuncName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          描述
        </template>
        {{ insFuncDescription }}
      </el-descriptions-item>
    </el-descriptions>

    <br>

    <el-button type="primary" @click="upload">提交</el-button>

    <br>
    <br>

    <el-select v-model="selectFunc" placeholder="请选择">
      <el-option
          v-for="item in listData"
          :key="item.func_id"
          :label="item.func_name"
          :value="item.func_id">
      </el-option>
    </el-select>

    <br>
    <br>
    <br>


    <div v-for="(item) in updateLoadCsvList">
      <div style="float: left; margin-right: 30px;margin-bottom: 25px">
        <el-tooltip class="item" effect="dark" :content="item.description" placement="top">
          <el-button :name=item.name @click="uploadCsv(item.key,item.type)" type="primary">{{
              item.display
            }}
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <input ref="filElem" type="file" class="upload-file" @change="getFile" style="display: none">


    <div style="clear:both"></div>


    <div v-for="(item) in updateLoadTextList">
      <el-form ref="form" label-width="80px">
        <div style="float: left; margin-right: 30px;margin-bottom: 25px">
          <el-form-item :label="item.display">
            <input :placeholder="item.description" @blur="uploadText($event,item.key)" class="cxbutton"></input>
          </el-form-item>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      dialogVisible: false,
      listData: [],
      testList: [{name: "v1", key: "vvv"}, {name: "v2", key: "vv22"}],
      selectFunc: "", // 选中的方法
      uploadFileID: "", // 上传文件的ID
      uploadFileType: "", // 当前上传文件的类型
      funcMap: new Map(),
      updateLoadCsvList: [],
      updateLoadTextList: [],
      uploadData: [],
      insFuncName: "下方选择请求方法",
      insFuncDescription: "",
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$http.get("config").then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          this.listData = response.data.data
          for (let i = 0; i < response.data.data.length; i++) {
            this.funcMap.set(response.data.data[i].func_id, response.data.data[i])
          }
          console.log(this.funcMap)
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
    uploadText(event, key) {
      console.log(event.target.value)
      console.log(key)
      this.uploadData.push({
        key: key,
        value: event.target.value,
        type: "text",
      })
    },
    uploadCsv(key, type) {
      this.uploadFileID = key
      this.uploadFileType = type
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
    },
    getFile() {
      let that = this;
      const inputFile = this.$refs.filElem.files[0];
      if (inputFile) {
        this.$alert(`上传成功: ${inputFile.name}`, 'Info', {
          confirmButtonText: '确定',
        });

        console.log(inputFile.type)
        if (inputFile.name.indexOf(this.uploadFileType) === -1) {
          this.$alert(`不是有效的${this.uploadFileType}文件！`, 'Error', {
            confirmButtonText: '确定',
          });
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(inputFile);
        reader.onload = function () {
          console.log(this.result)
          that.uploadData.push({
            key: that.uploadFileID,
            value: this.result,
            type: that.uploadFileType,
          })
        }
      }
    },
    upload() {
      if (this.uploadData.length === 0) {
        this.$alert(`请确定表单填写正确`, 'Error', {
          confirmButtonText: '确定',
        });
        return;
      }

      this.$http.post("generate", {
        func_id: this.selectFunc,
        payload: this.uploadData,
      }).then((response) => {
        console.log(response.data)
        if (response.data.code === "0") {
          console.log(response.data.data)

          for (let i = 0; i < response.data.data.length; i++) {
            console.log(response.data.data[i])

            const _res = response.data.data[i].body;
            // let blob = new Blob([_res], {type: 'application/csv'});

            // const b64toBlob = (base64, type = 'application/octet-stream') =>
            //     fetch(`data:${type};base64,${base64}`).then(res => res.blob())

            let blob = this.dataURItoBlob(_res);
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = `${response.data.data[i].name}.${response.data.data[i].type}`; //下载后文件名
            // downloadElement.download = name; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          }

          this.$alert(`成功导出 ${response.data.data.length} 个文件`, 'Info', {
            confirmButtonText: '确定',
          });
        } else {
          console.log(error)
          this.$alert(`错误: ${response.data.message}`, 'Error', {
            confirmButtonText: '确定',
          });
        }
      }).catch((error) => {
        console.log(error)
        this.$alert(`消息提交失败 错误: ${error.data.message}`, 'Notice', {
          confirmButtonText: '确定',
        });
      })
    },
    dataURItoBlob(data) {
      var byteString = atob(data); //base64 解码
      var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
      var intArray = new Uint8Array(arrayBuffer); //创建视图

      for (var i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      return new Blob([intArray], {type: 'application/octet-stream'});
    },
    getBase64Type(type) {
      switch (type) {
        case 'txt':
          return 'data:text/plain;base64,';
        case 'doc':
          return 'data:application/msword;base64,';
        case 'docx':
          return 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
        case 'xls':
          return 'data:application/vnd.ms-excel;base64,';
        case 'xlsx':
          return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
        case 'pdf':
          return 'data:application/pdf;base64,';
        case 'pptx':
          return 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,';
        case 'ppt':
          return 'data:application/vnd.ms-powerpoint;base64,';
        case 'png':
          return 'data:image/png;base64,';
        case 'jpg':
          return 'data:image/jpeg;base64,';
        case 'gif':
          return 'data:image/gif;base64,';
        case 'svg':
          return 'data:image/svg+xml;base64,';
        case 'ico':
          return 'data:image/x-icon;base64,';
        case 'bmp':
          return 'data:image/bmp;base64,';
      }
    }
  },
  watch: {
    'selectFunc':
        {
          handler: function () {
            console.log(this.selectFunc)
            if (this.funcMap.has(this.selectFunc)) {
              let t = this.funcMap.get(this.selectFunc)
              this.insFuncName = t.func_name
              this.insFuncDescription = t.func_description
              this.updateLoadCsvList = []
              this.updateLoadTextList = []
              this.uploadData = []
              for (let i = 0; i < t.payload.length; i++) {
                console.log(t.payload[i])
                switch (t.payload[i].type) {
                  case "text":
                    this.updateLoadTextList.push({
                      key: t.payload[i].key,
                      type: t.payload[i].type,
                      display: t.payload[i].display,
                      description: t.payload[i].description,
                    })
                    break
                  case "csv":
                    this.updateLoadCsvList.push({
                      key: t.payload[i].key,
                      type: t.payload[i].type,
                      display: t.payload[i].display,
                      description: t.payload[i].description,
                    })
                    break
                  default:
                    this.updateLoadCsvList.push({
                      key: t.payload[i].key,
                      type: t.payload[i].type,
                      display: t.payload[i].display,
                      description: t.payload[i].description,
                    })
                    break
                }
              }
            }
          }
        }
  }
}
</script>

<style scoped>
.cxbutton {
  -webkit-appearance: none;
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 100%;
}
</style>
