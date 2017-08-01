<template>
  <div class="admin-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="机器人名" prop="user">
          <el-input type="text" v-model="ruleForm.user"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input type="text" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: 'madegroup',
  data() {
      return {
        ruleForm: {
          user: '',
          name: ''
        },
        rules: {
          user: [
            { required: true, message: '请输入机器人名', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        var self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self.axios.post('http://120.26.3.118:7171/robot/create_manager',{robotWx: self.ruleForm.user, nickname: self.ruleForm.name})
              .then((response) => {
                var data = response.data
                if(data.code == 0){
                }
                console.log(data)
              }, (response) => {
                console.log(response);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style>
  .admin-login{width: 400px;margin: auto;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
</style>
