<template>
  <div style="width: 100%">
      <div style="margin: 10px 0">
        <el-button size="small" @click="dialogVisible = true">添加书名</el-button>
      </div>
      <el-table :data="booklist" style="width: 100%">
        <el-table-column prop="bookName" label="书名">
        </el-table-column>
        <el-table-column prop="WNun" label="周刊的周数">
            <template scope='scope'>{{scope.row.WNun}}</template>
        </el-table-column>
        <el-table-column prop="cTime" label="创建时间">
            <template scope='scope'>{{formate(scope.row.cTime)}}</template>
        </el-table-column>
        <el-table-column prop="upTime" label="修改时间">
            <template scope='scope'>{{formate(scope.row.upTime)}}</template>
        </el-table-column>
        <el-table-column prop="state" label="是否显示">
            <template scope='scope'>{{scope.row.state ? '显示' : '隐藏'}}</template>
        </el-table-column>
        <el-table-column label="操作">
            <template scope='scope'>
              <el-button size="small" @click="show(scope.row)">修改</el-button>
              <el-button size="small" @click="golink(scope.row.id)">详情</el-button>              
            </template>        
        </el-table-column>
      </el-table>
      <el-dialog title="添加书名" v-model="dialogVisible" size="tiny">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="title"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch on-text="" off-text="" v-model="state"></el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addbook">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改书名" v-model="dialogVisibleup" size="tiny">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="titleup"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch on-text="" off-text="" v-model="stateup"></el-switch>
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
       date: '',
       state: 1,
       dialogVisibleup: false,
       titleup: '',
       dateup: '',
       stateup: 1,
       booktime: ''
      };
    },
    methods: {
      golink: function (val) {
          this.$router.push('/chapter?bookid='+val)
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
        this.axios.post(this.http + '/index.php?r=readweb/getbooks', {WNum: this.booktime})
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
        if(!this.title){
          this.$message("请填写完整！")
          return false
        }
        var state = this.state ? 1 : 0
        this.axios.post(this.http + '/index.php?r=readweb/addbook', {bookName: this.title, WNum: this.booktime, state: state})
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
        this.bookid = val.id
        this.stateup = val.state
        this.titleup = val.bookName
        // this.dateup = val.cTime
      },
      upbook() {
        var self = this
        if(!this.titleup){
          this.$message("请填写完整！")
          return false
        }
        var state = this.stateup ? 1 : 0
        this.axios.post(this.http + '/index.php?r=readweb/upbook', {bookId: this.bookid, bookName: this.titleup, WNum: this.booktime, state: state})
              .then((response) => {
                var data = response.data
                if(data.state == 1000){
                  self.$message("添加成功") 
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
      }
    },
    created: function () {
      this.booktime = this.$route.query.date
      this.searchbook()
    }
}
</script>

<style>
  .admin-login{width: 400px;margin: auto;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
</style>
