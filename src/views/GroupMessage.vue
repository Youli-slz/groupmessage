<template>
  <div class="admin-message">
   <div class="messageleft">
     <ul>
       <li v-for="item in robotlist" @click="select(item.id, item.robotWx)" :class="{active: robotid == item.id}">
         <span>{{item.robotWx}}<template v-if="loginrobot[item.robotWx]"><br><i style="font-size: 12px">(已登录)</i></template></span>
       </li>
     </ul>
   </div>
   <div class="messagemiddle"> 
      <el-tabs type="border-card" v-model="activename">
        <el-tab-pane label="聊天" name="first">
          <ul>
              <li v-for="(item, index) in allmessagelist[robotid]" :class="{active: groupid==index}" @click="getusermessage(index)">
                <sub v-show="item.length != 0">{{item.length}}</sub>
                <span v-html="getuserdata(index)"></span>
              </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="second">
          <el-input v-model="searchcontent"></el-input>
           <ul>
              <li v-for="item in userlist" @click="queryuser(item)">
                <span>{{item.groupNickName}}<label style="color: #13ce66;margin-left: 4px">({{item.groupMemberNum}})</label></span>
              </li>
            </ul>
        </el-tab-pane>
      </el-tabs> 
   </div>
   <div class="messageright">
        <div class="rightcontainer">
            <div class="rightcontainertop">
                <ul>
                  <li @click="selecttype('a')" :class="{activename: active == 'a'}">最新消息</li>
                  <li @click="selecttype('b')" :class="{activename: active == 'b'}">群发记录</li>
                  <li @click="selecttype('c')" :class="{activename: active == 'c'}">全部群发记录</li>
                </ul>
            </div>
        </div>
        <div class="messagecontent" v-show="active == 'a'">
          <div class="messagetop" id="messagetop">
            <div class="more" @click="getmore" v-if="more">查看更多</div>
            <div class="messagelist messagelistleft" v-for="item in messagelist" :class="{messagelistright: item.fromName == robotWx}">
              <div style="text-align:center;font-size: 12px;color: #aaa">{{formate(item.createdAt)}}</div>
              <span><label for="" @click="show" class="chatname">{{item.fromName}}</label> <ul v-show='item.fromName != robotWx' class="chatul"><li @click="addcontent(item.fromName)">@</li><li @click="open1(item)">踢人</li></ul></span>
              
              <p v-html='item.content'></p>
            </div>
            <div v-if="messagelist.length == 0" style="text-align: center;font-size: 14px;color: #666;padding:100px 0">
              暂无聊天记录
            </div>
          </div>
          <div class="sendmessage" style="position: relative">
            <el-tabs v-model="activeName3" type="card">
              <el-tab-pane label="文字" name="first">
                <textarea rows="5" cols="" class="messagetextarea" v-model="sendcontentgroup" v-on:keyup.enter="sendgroup"></textarea>            
              </el-tab-pane>
              <el-tab-pane label="图片" name="second">
                <div class="imgcontainer">
                  <div id="btnwrap1">
                    <label for="img1" class="el-button el-button--primary el-button--small">
                      <i class="el-icon-upload"></i><span>点击上传图片</span>
                    </label>
                    <input type="file" id="img1" class="hide" style="display: none"/>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    <div class="sourceimg">
                      <img :src="img1" alt="" width="200">
                    </div>
                  </div>           
                </div>
              </el-tab-pane> 
            </el-tabs>
             <span @click="dialogVisible = true" style="position: absolute; top: 15px;left: 134px; color: #666;font-size: 14px;cursor: default;">踢人</span>
            <div class="btn">
              <el-button type="success" size="small" @click="sendgroup">发送</el-button>
            </div>
          </div>
        </div>   
        <div class="rightcontainerbottom" v-if="active == 'c'">
            <template>
              <el-table :data="allgroupmessagelist" style="width: 100%">
                <el-table-column prop="robotWx" label="群管"></el-table-column>
                <el-table-column prop="content" label="群前缀">
                  <template scope='scope'>
                    {{JSON.parse(scope.row.content).groupNamePrefix}}
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="内容" show-overflow-tooltip="true">
                  <template scope='scope'>
                    {{getjson(scope.row.content).msg}}
                  </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="发送时间">
                    <template scope='scope'>
                      {{formate(scope.row.createdAt)}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope='scope'>
                        {{scope.row.status? '发送成功': '发送中'}}
                    </template>
                </el-table-column>                                
              </el-table>
            </template>
        </div>
        <div class="messagecontent" v-show="active == 'b'">
          <div class="messagetop" id="messagetop">
            <template>
              <el-table :data="groupmessagelist" style="width: 100%">
                <el-table-column prop="robotWx" label="群管"></el-table-column>
                <el-table-column prop="content" label="群前缀">
                  <template scope='scope'>
                    {{JSON.parse(scope.row.content).groupNamePrefix}}
                  </template>
                </el-table-column>
                <el-table-column prop="content" label="内容" height="100" show-overflow-tooltip="true">
                  <template scope='scope'>
                    {{getjson(scope.row.content).msg}}
                  </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="发送时间">
                    <template scope='scope'>
                      {{formate(scope.row.createdAt)}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope='scope'>
                        {{scope.row.status? '发送成功': '发送中'}}
                    </template>
                </el-table-column>                                
              </el-table>
            </template>
          </div>
          <div class="sendmessage">
            <el-tabs v-model="activeName2" type="card">
              <el-tab-pane label="文字" name="first">
                <textarea rows="5" cols="" class="messagetextarea" v-model="sendcontent" v-on:keyup.enter="send"></textarea>            
              </el-tab-pane>
              <el-tab-pane label="图片" name="second">
                <div class="imgcontainer">
                  <div id="btnwrap">
                    <label for="img" class="el-button el-button--primary el-button--small">
                      <i class="el-icon-upload"></i><span>点击上传图片</span>
                    </label>
                    <input type="file" id="img" class="hide" style="display: none"/>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    <div class="sourceimg">
                      <img :src="img" alt="" width="200">
                    </div>
                  </div>  
                </div>  
              </el-tab-pane>
            </el-tabs>
            <div class="btn">
              <el-button type="success" size="small" @click="open3">群发</el-button>
            </div>
          </div>
        </div>   
   </div>
   <el-dialog title="踢人" v-model="dialogVisible" size="tiny">
        <el-input v-model="fromName" placeholder="用户昵称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tiren1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
document.addEventListener('click',function(e){
      if(e.target && e.target.className != 'chatname'){
        var node = document.getElementsByClassName('chatul')
        if(node.length){
          for(var item in node){
            if(node[item].style){
               if(node[item].style.visibility == 'visible'){
                  node[item].style.visibility = 'hidden'              
                }
            }
          }
        } 
      }
    })

export default {
  name: 'sendmessage',
  data() {
      return {
       groupid: '',
       grouplist: [],
       robotlist: [],
       userlist: [],
       alluserlist: [],
       messagelist: [],
       groupmessagelist: [],
       allgroupmessagelist: [],
       robotid: '',
       accountId: '',
       robotWx: '',
       sendcontent: '',
       sendcontentgroup: '',
       nickName: '',
       userName: '',
       messageuser: {},
       lastTime: 0,
       activename: 'first',
       intervalid: '',
       robotmessageuser: {},
       http: 'http://120.26.3.118:7171',
       activeName2: 'first',
       activeName3: 'first',
       img: '',
       img1: '',
       uptoken: '',
       active: 'a',
       groupUserName: '',
       groupNickName: '',
       allmessagelist: {},
       loginrobot: {},
       more: false,
       interval: 20,
       height: 0,
       searchcontent: '',
       dialogVisible: false,
      fromName: '' //  用户昵称
       
      };
    },
    watch: {
      searchcontent: function (val){
        var data = []
        for(var item in this.alluserlist){
          if(this.alluserlist[item].groupNickName.indexOf(val) > -1){
              data.push(this.alluserlist[item])            
          }
        }
        this.userlist = val ? data : this.alluserlist
      }
    },
    methods: {
      addcontent: function (val) {
          this.sendcontentgroup += '@' + val + ' '
      },
      getuserdata: function (val) {
          var groupNickName = _.result(_.find(this.alluserlist, function(chr) {
                    return chr.ID == val
                  }),'groupNickName')
          return groupNickName
      },
      queryuser: function (val){
          if(!this.allmessagelist[this.robotid][val.ID]){
            this.$set(this.allmessagelist[this.robotid], val.ID, []) 
            // var result = {messagelist: [], lastTime: 0}
            // this.$set(this.robotmessageuser[this.robotid],data.data[item].id,result)
          }
          this.activename = 'first'
          this.getusermessage(val.ID)
          // console.log(this.allmessagelist[val.ID])
          // this.messagelist = this.allmessagelist[val.ID] || []
      },
      getjson: function (val) {
          var data = JSON.parse(val).msg
          return data
      },
      selecttype: function (val) {
        this.active = val
      },
      reserve: function (val) {
        return val.reverse()
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
     handleClick(tab, event) {
        console.log(tab, event);
      },
      getrobotdata: function () {
        var self = this
        this.axios.post(this.http + '/manager/get_all_robots')
					.then((response) => {
						var data = response.data
            console.log(data)
            if(data.code == 0){
              self.robotlist = _.sortBy(data.data, 'robotWx') || []
              for(var item in data.data){
                var result = {messagelist: [], lastTime: 0}
                self.$set(self.robotmessageuser,data.data[item].id,result)
                self.$set(self.allmessagelist,data.data[item].id,{})                
              }
              self.robotid = '' 
            }
					}, (response) => {
						console.log(response);
					});
      },
      select: function (value, robotWx){
          this.robotid = value
          this.robotWx = robotWx
          this.groupNickName = '' 
          this.groupUserName = '' 
          this.messagelist = []          
          this.getuser(value, robotWx)
          this.getrobotmessage()
          var self = this
          clearInterval(this.intervalid)
          this.intervalid = setInterval(function (){
            self.getrobotmessage()
          }, 10000)
          this.getrobotmessagelist()
      },
       getuser: function (value, robotWx) {  
         var self = this 
        this.robotid = value
        this.robotWx = robotWx   
        // this.messageuser =  this.robotmessageuser[this.robotid].messageuser 
        // if(this.robotid == ''){
        //   return false
        // }
        // var self = this
        
        // clearInterval(this.intervalid)
        // this.intervalid = setInterval(function (){
        //   self.getrobotmessage()
        // }, 10000)
        this.axios.post(this.http+'/manager/get_groups',{robotId: value})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.userlist = _.sortBy(data.data.list,'groupNickName') || [] 
              self.alluserlist = data.data.list || []               
            }
					}, (response) => {
						console.log(response);
					});
      },
      getusermessage: function (val) {
          this.more = true
          var data = _.find(this.alluserlist, function(chr) {
                    return chr.ID == val
                  })
          this.groupUserName = data.userName
          this.groupNickName = data.groupNickName
          this.groupid = data.ID
          var result = _.groupBy(this.robotmessageuser[this.robotid].messagelist, function(n){
                return n.groupId
              })
          this.messagelist = _.sortBy(result[val], 'createdAt') || []
          this.allmessagelist[this.robotid][val] = []
          this.$nextTick(function(){
              this.height = document.getElementById('messagetop').scrollHeight              
              document.getElementById('messagetop').scrollTop = (document.getElementById('messagetop').scrollHeight - document.getElementById('messagetop').clientHeight) 
          })
      },
      getrobotmessagelist: function() {
        var self = this
        this.axios.post(this.http + '/manager/get_robot_group_mass',{robotWx: this.robotWx})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.groupmessagelist = data.data || []             
            }
					}, (response) => {
						console.log(response);
					});
      },
      getallmessage: function() {
        var self = this
        this.axios.post(this.http + '/manager/get_group_mass', {offset: 0, num: 200})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.allgroupmessagelist = data.data.list || []
            }
					}, (response) => {
						console.log(response);
					});
      },
      getrobotmessage: function() {
        // document.getElementById('messagetop').scrollTop = (document.getElementById('messagetop').scrollHeight - document.getElementById('messagetop').offsetHeight)          
        var self = this
        var lastTime = this.robotmessageuser[this.robotid].lastTime
        this.axios.post(this.http + '/manager/get_new_group_chat',{robotId: this.robotid, timestamp: lastTime})
					.then((response) => {
						var data = response.data;
            console.log(data)
            console.log(lastTime)            
            if(data.code == 0){
              for(var item in data.data){
                self.robotmessageuser[this.robotid].messagelist.push(data.data[item])
              }
              var s = _.groupBy(data.data, function(n){
                return n.groupId
              })
             
              var t = _.merge(self.allmessagelist[this.robotid], s, function(a, b) {
                if (_.isArray(a)) {
                  return a.concat(b);
                }
              })
              self.$set(data, self.allmessagelist[this.robotid], t)
              self.allmessagelist[this.robotid] = Object.assign({}, self.allmessagelist[this.robotid], {})
              // self.robotmessageuser[self.robotid].messageuser = self.messageuser
              if(data.data){
                self.robotmessageuser[this.robotid].lastTime = data.data[0].createdAt
              }
              // for(var item in data.data){
              //   self.messagelist.unshift(data.data[item])                  
              // }
            }
					}, (response) => {
						console.log(response);
					});
      },
      sendgroup: function () {
        if(!this.groupUserName){
          this.$message({
            message: '请选择群',
            type: 'warning'
          })
          return false
        }
        if(!this.loginrobot[this.robotWx]){
          this.$message({
            message: '未登录',
            type: 'warning'
          })
          return false
        }
        var self = this
        if(this.activeName3 == 'second'){
          var msgdata = {
            msgType: 'img',
            msg: this.img1,
            robotWx: this.robotWx,
            groupUserName: this.groupUserName,
            groupNickName: this.groupNickName
          }
        }
        else{
          var msgdata = {
            msgType: 'text',
            msg: this.sendcontentgroup,
            robotWx: this.robotWx,
            groupUserName: this.groupUserName,
            groupNickName: this.groupNickName
          }
        }
        this.axios.post(this.http + '/manager/send_group_msg', msgdata)
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
               this.$message('发送成功');
                var resultdata = {fromName: self.robotWx, toName: self.groupUserName, content: self.sendcontentgroup, createdAt: Number.parseInt(new Date().getTime()/1000)}
                self.messagelist.push(resultdata)
                self.sendcontentgroup = '' 
                self.$nextTick(function(){
                    document.getElementById('messagetop').scrollTop = (document.getElementById('messagetop').scrollHeight - document.getElementById('messagetop').clientHeight) 
                })             
            }
            else{
              self.$message.error('发送失败');
            }
					}, (response) => {
						console.log(response);
					});
      },
      send: function (val) {
        if(!this.robotWx){
          this.$message({
            message: '请选择用户',
            type: 'warning'
          })
          return false
        }
        if(!this.loginrobot[this.robotWx]){
          this.$message({
            message: '未登录',
            type: 'warning'
          })
          return false
        }
        var self = this
        if(this.activeName2 == 'second'){
          this.interval = 60
          var msg = {
            msgType: 'img',
            msg: this.img
          }
        }
        else{
          this.interval = 10          
          var msg = {
            msgType: 'text',
            msg: this.sendcontent
          }
        }
        this.axios.post(this.http + '/robot/group_mass',{robotWx: this.robotWx, groupMassType: 1, interval: this.interval, groupNamePrefix: val, msg: msg})
					.then((response) => {
						var data = response.data;
            if(data.code == 0){
              self.$message('发送成功')
              self.getallmessage()
              self.getrobotmessagelist()
            }
            else{
              self.$message.error('发送失败')
            }
					}, (response) => {
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
        domain: 'http://7xld1x.com1.z0.glb.clouddn.com/',
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
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
            self.img1 = urlImg
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
            var data = response.data      
            // if(data.state == 1000){
              self.uptoken = data.token
              self.uploadimg1()
              self.uploadimg()              
            // }
          }, (response) => {
            // error callback
          });
        },
        getloginrobot:function(){
          var self = this;
          this.axios.post(this.http + '/manager/get_all_login_robots').then((response) => {
              var data = response.data
              if(data.code == 0){
                 for(var item in data.data){
                   self.$set(self.loginrobot, data.data[item].robot, data.data[item].runTime)
                 }
              }            
          }, (response) => {
            // error callback
          });
        },
        tiren:function(val){
          var self = this
          var data = {
            wechatNick: this.robotWx,  // 群管昵称
            groupUserName: this.groupUserName, // 群username
            groupNickName: this.groupNickName, // 群名
            memberUserName: val.memberUserName, // 用户username
            memberNickName: val.fromName //  用户昵称
          }
          this.axios.post(this.http + '/manager/robot_group_tiren', data).then((response) => {
              var data = response.data
              if(data.code == 0){
                self.$message('成功踢掉')
              }            
          }, (response) => {
            // error callback
          });
        },
        tiren1:function(){
          var self = this
          if(!this.robotWx || !this.groupNickName){
            this.$message('请选择群')
            return false
          }
          var data = {
            wechatNick: this.robotWx,  // 群管昵称
            groupUserName: this.groupUserName, // 群username
            groupNickName: this.groupNickName, // 群名
            //memberUserName: val.memberUserName, // 用户username
            memberNickName: this.fromName //  用户昵称
          }
          this.axios.post(this.http + '/manager/robot_group_tiren', data).then((response) => {
              var data = response.data
              if(data.code == 0){
                self.dialogVisible = false
                self.$message('成功踢掉')
              }else{
                self.$message('失败')                
              }            
          }, (response) => {
            // error callback
                self.$message('失败')                            
          });
        },
        getmore:function(){
          var self = this
          var result = _.sortBy(this.messagelist, 'createdAt')
          var timestamp = result[0].createdAt
          var data = {
            robotId: this.robotid,  // 群管昵称
            groupId: this.groupid, // 群username
            timestamp: timestamp
          }
          this.axios.post(this.http + '/manager/get_group_chat_from_group', data).then((response) => {
              var data = response.data
              if(data.code == 0){
                if(!data.data){
                  self.$message("没有更多了")
                  self.more = false
                  return false
                }
                for(var item in data.data){
                self.messagelist.unshift(data.data[item])                  
                }
                 self.$nextTick(function(){
                    document.getElementById('messagetop').scrollTop = (document.getElementById('messagetop').scrollHeight - self.height) 
                    self.height = document.getElementById('messagetop').scrollHeight
                })
              }            
          }, (response) => {
            // error callback
          });
        },
        open3: function() {
          var self = this
          this.$prompt('请输入群前缀', '群前缀', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            self.open2(value)
          }).catch(() => {
                 
          })
        },
        open1: function(val) {
          var self = this
          this.$confirm('确认踢掉', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(({ value }) => {
            self.tiren(val)
          }).catch(() => {
                 
          })
        },
        open2(val) {
          this.$confirm('确定群发, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.send(val)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消群发'
            });          
          });
        },
        show: function (e) {
          e.target.nextElementSibling.style.visibility = e.target.nextElementSibling.style.visibility == 'visible' ? 'hidden' : 'visible'          
        }
    },
    created: function () {
      this.getrobotdata()
      this.getallmessage()
      this.getloginrobot() 
      var self = this  
      var a = setInterval(function(){
          self.getloginrobot()          
      }, 600000)
      this.getuptoken()
      
    }
}
</script>

<style scoped>
  .admin-message{display: flex;display: -webkit-flex;border: 1px solid #eee;width: 100%;height: 100%;min-height: 600px;}
  .messageleft,.messagemiddle{font-size: 14px;overflow-y:scroll}
  .messageleft ul li{padding: 10px;border-bottom: 1px solid #222;color: #f1f2f4;cursor: pointer}
  .messageleft ul li.active{background: #475669}
  .messagemiddle ul li.active{background: #EFF2F7}  
  .messagemiddle ul li span{display: block; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
  .messageleft{background: #324057;width: 160px;}
  .messagemiddle{width: 240px}
  .messagemiddle ul li{padding: 10px;border-bottom: 1px solid #eee;position: relative}
  .messagemiddle ul li sub{position: absolute;color: red;right: 10px}
  .messageright{flex: 1;-webkit-flex: 1;background: #f1f2f4;padding-bottom: 48px}
  .messagecontent{display: flex;display: -webkit-flex;flex-direction: column;height: 100%}
  .messagecontent .messagetop{flex: 1;-webkit-flex:1;border-bottom: 1px solid #ddd;overflow-y: scroll;padding-bottom: 20px;}
  .messagecontent .sendmessage{height: 200px}
  .sendmessage .messagetextarea{width: 100%;border: none;outline: none;padding: 6px 12px;font-size: 14px;color: #666;background: #f1f2f4}
  .btn{text-align: right;padding-right: 10px}
  .el-tree{border: none}
  .messagelist{font-size: 14px;margin-left: 20px;margin-top: 20px}
  .messagelist p{word-break: break-all;text-align: left;display: inline-block;background: #fff;margin-top: 12px;padding: 10px;border-radius: 4px;max-width: 400px;position: relative;line-height: 20px;}
  .messagelist p:before{position: absolute;content: '';width: 0;height: 0;border: 8px solid transparent;border-bottom-color: #fff;top: -14px}
  .messagelist span{display: block;color: #999;cursor: default;position: relative}
  .messagelist span ul{visibility: hidden;display: inline-block;position: absolute;background: rgb(140, 216, 69);z-index: 9;color: #000;border-radius: 4px;top: 0;margin-left: 10px;}
  .messagelist span ul li{padding: 6px 10px}
  .messagelistright{text-align: right;margin-right: 20px}
  .messagelist.messagelistright p{background: rgb(140, 216, 69);color: #000;border-bottom-color: rgb(140, 216, 69);word-break: break-all;}
  .messagelist.messagelistright p:before{right: 6px;border-bottom-color: rgb(140, 216, 69);}
  .el-tabs--border-card>.el-tabs__header{position: fixed; width: 240px; z-index: 999;}
  .el-tabs--border-card>.el-tabs__content{padding-top: 58px}
  .imgcontainer,.imgcontainerqun{height: 100px;overflow: scroll;}
  .rightcontainer .rightcontainertop ul{background: #ddd}
  .rightcontainer .rightcontainertop ul li{display: inline-block;padding: 10px 20px;font-size: 14px}
  .rightcontainer .rightcontainertop ul li.activename{color: red;background:#f1f2f4}
  .rightcontainerbottom{display: flex;display: -webkit-flex;overflow-y: scroll;flex-direction: column;height: 100%;padding-bottom: 10px}
  .more{text-align: center;padding: 10px 0;font-size: 14px;color: #666;cursor: default}
</style>
