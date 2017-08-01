<template>
  <div style="width: 100%">
      <div style="margin: 10px 0">
        <el-button size="small" @click="addshow">添加章节</el-button>
      </div>
      <el-table :data="booklist" style="width: 100%">
        <el-table-column prop="articleName" label="文章名称">
        </el-table-column>
         <el-table-column prop="articlePic" label="文章图片">
            <template scope='scope'><img :src="scope.row.articlePic" alt="" width="200"></template>
        </el-table-column>
        <el-table-column prop="articleDis" label="文章描述">
        </el-table-column>
        <el-table-column prop="articleUrl" label="文章链接">
        </el-table-column>
        <el-table-column prop="cTime" label="创建时间">
            <template scope='scope'>{{formate(scope.row.cTime)}}</template>
        </el-table-column>
        <el-table-column prop="upTime" label="修改时间">
            <template scope='scope'>{{formate(scope.row.upTime)}}</template>
        </el-table-column>
        <el-table-column label="操作">
            <template scope='scope'>
              <el-button size="small" @click="show(scope.row)">修改</el-button>
              <el-button size="small" @click="delet(scope.row.id)">删除</el-button>              
            </template>        
        </el-table-column>
      </el-table>
      <el-dialog title="添加章节" v-model="dialogVisible" size="small">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="title"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="dec"></el-input>
          </el-form-item>
          <el-form-item label="链接">
            <el-input v-model="link"></el-input>
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addbook">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改章节" v-model="dialogVisibleup" size="small">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="titleup"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="decup"></el-input>
          </el-form-item>
          <el-form-item label="链接">
            <el-input v-model="linkup"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <div id="btnwrap1">
              <label for="img1" class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i><span>点击上传图片</span>
              </label>
              <input type="file" id="img1" class="hide" style="display: none"/>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              <div class="sourceimg">
                <img :src="imgup" alt="" width="100">
              </div>
            </div>  
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleup = false">取 消</el-button>
          <el-button type="primary" @click="upbook">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'madegroup',
  data() {
      return {
       http: 'http://jianshenweixin.yourjam.cn',
       booklist: [],
       dialogVisible: false,
       title: '',
       dec: '',
       link: '',
       img: '',
       dialogVisibleup: false,
       titleup: '',
       decup: '',
       linkup: '',
       imgup: '',
       bookid: '',
       uptoken: '',
       articleId: ''
      };
    },
    methods: {
      delet: function (val) {
        var self = this
        this.axios.post(this.http + '/index.php?r=readweb/delarticle', {articleId: val})
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.$message('删除成功')
                  self.searchbook()
                }
                else{
                  self.$message('删除失败')                  
                }
                console.log(data)
              }, (response) => {
                  self.$message('删除失败')                                  
                console.log(response);
              });
      },
      addshow: function () {
        this.dialogVisible = true
        this.getuptoken()
      },
       formate:function(t){
        var d = new Date(t*1000);
        var year = d.getFullYear();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var hour = d.getHours();
        var minute = d.getMinutes();
        var f = year + "-" +this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
        return f;
      },
      init: function(d){
        return d>9?d:"0"+d;
      },
      searchbook() {
        var self = this
        this.axios.post(this.http + '/index.php?r=readweb/getarticles', {bookId: this.bookid})
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.booklist = data.data
                }
                console.log(data)
              }, (response) => {
                console.log(response);
              });
      },
      addbook() {
        var self = this
        if(!this.title || !this.link || !this.img){
          this.$message("请填写完整！")
          return false
        }
        this.axios.post(this.http + '/index.php?r=readweb/addarticle', {bookId: this.bookid, articleName: this.title, articlePic: this.img, articleDis: this.dec, articleUrl: this.link})
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.$message("添加成功") 
                  self.dialogVisible = false
                  self.searchbook()
                }
                else if(data.state == 1001){
                  self.$message(data.message)                   
                }
                console.log(data)
              }, (response) => {
                console.log(response);
              });
      },
      show(val){
        this.dialogVisibleup = true
        this.articleId = val.id
        this.titleup = val.articleName
        this.linkup = val.articleUrl
        this.imgup = val.articlePic
        this.decup = val.articleDis
        this.getuptoken()        
        // this.dateup = val.cTime
      },
      upbook() {
        var self = this
        if(!this.titleup || !this.linkup || !this.imgup){
          this.$message("请填写完整！")
          return false
        }
        this.axios.post(this.http + '/index.php?r=readweb/uparticle', {articleId: this.articleId, articleName: this.titleup, articlePic: this.imgup, articleDis: this.decup, articleUrl: this.linkup})
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.$message("修改成功") 
                  self.dialogVisibleup = false
                  self.searchbook()
                }
                else if(data.state == 1001){
                  self.$message(data.message)                   
                }
                console.log(data)
              }, (response) => {
                self.$message("修改失败")
                console.log(response);
              });
      },
      uploadimg1:function(){
        var self = this;
        var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'img1', //上传选择的点选按钮，**必需**
        uptoken: this.uptoken,
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://oe3slowqt.bkt.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'btnwrap1', //上传区域DOM ID，默认是browser_button的父元素，
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
            var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
            self.imgup = urlImg
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
        }
      });
    },
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
        domain: 'http://oe3slowqt.bkt.clouddn.com/',
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
            var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
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
      this.axios.get('http://tym.taoyumin.cn/index.php?r=search/token').then((response) => {
        var data = JSON.parse(response.data)        
        if(data.state == 1000){
          self.uptoken = data.data
          self.uploadimg1()
          self.uploadimg()              
        }
      }, (response) => {
        // error callback
      });
    }
    },
    created: function () {
      this.bookid = this.$route.query.bookid
      this.searchbook()
      this.getuptoken()
    }
}
</script>

<style>
  .admin-login{width: 400px;margin: auto;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
</style>
