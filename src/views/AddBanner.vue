<template>
  <div>
      <div class="banner" >
        <div>
          <label for="">图片:</label> 
          <img :src="bannerdata.picUrl" alt="" width="200">
        </div>
        <div>
          <label for="">链接:</label> <span>{{bannerdata.renderUrl}}</span>
        </div>
      </div>
      <hr>
      <div>
          <el-form label-width="80px">
            <el-form-item label="图片链接">
              <el-input v-model="imgurl"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <div id="btnwrap">
                <label for="img" class="el-button el-button--primary el-button--small">
                  <i class="el-icon-upload"></i><span>点击上传图片</span>
                </label>
                <input type="file" id="img" class="hide" style="display: none"/>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                <div class="sourceimg">
                  <img :src="img" alt="" width="100">
                </div>
              </div>  
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addbanner">添加</el-button>
            </el-form-item>
          </el-form>
      </div>
      
  </div>
</template>

<script>
export default {
  name: 'addbanner',
  data() {
      return {
        bannerdata: '',
        img: '',
        imgurl: '',
        uptoken: ''
      };
    },
    methods: {
      uploadimg:function(){
        var self = this;
        var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'img', //上传选择的点选按钮，**必需**
        uptoken: this.uptoken,
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://7xld1x.com1.z0.glb.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'btnwrap', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [
              {title : "Image files", extensions : "jpg,png"} // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'UploadProgress': function(up, files) {
          },
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
            self.img = urlImg
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
        }
      });
    },
    getuptoken:function(){
      var self = this;
      this.axios.get('http://wxmp.gatao.cn/mypic/gettoken').then((response) => {
        var data = response.data;        
        // if(data.state == 1000){
          self.uptoken = data.token
          self.uploadimg()              
        // }
      }, (response) => {
        // error callback
      });
    },
      getbanner: function () {
          var self = this
        this.axios.post('http://jianshenweixin.yourjam.cn/index.php?r=readweb/getbanner')
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.bannerdata = data.data
                }
                console.log(data)
              }, (response) => {
                console.log(response);
              });
      },
      addbanner: function () {
          var self = this
        this.axios.post('http://jianshenweixin.yourjam.cn/index.php?r=readweb/setbanner', {picUrl: this.img, renderUrl: this.imgurl})
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.$message('添加成功')
                  self.getbanner()
                }
                console.log(data)
              }, (response) => {
                console.log(response);
              });
      }
    },
    created: function () {
      this.getbanner()
      this.getuptoken()
    }
}
</script>

<style>
  .admin-login{width: 400px;margin: auto;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
  .banner>div{margin: 20px;font-size: 14px;color: #666}
  hr{margin: 20px 0}
</style>
