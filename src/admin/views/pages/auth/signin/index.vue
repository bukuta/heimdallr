<template>
  <div>
    <Row v-if="isAuthorize=='logout'" class="auth-signin" type='flex' justify='center'>
      <Col :span="6" :offset="16">
      <Row style="background: white;" v-loading.lock="loading">
        <Col style="padding: 20px 40px 0 0 ;">
        <Form
          v-if="activeIndex==1"
          ref="signinForm"

          label-width="40px"

          :model="signinForm"
          :rules="rules"
          >
            <h3 style="text-align: center;">登录管理后台</h3>
            <FormItem prop="mobile">
              <Input v-model="signinForm.mobile" placeholder="请输入蓝信手机号"></Input>
            </FormItem>
            <FormItem prop="imageCaptcha">
              <Row>
                <Col :span="12">
                  <Input v-model="signinForm.imageCaptcha" placeholder="请填写图片验证码"></Input>
                </Col>
                <Col :span="12">
                  <img @click="refreshImageCaptcha" :src="imageCaptchaSource" style="cursor:pointer;width: 100%;height: 100%;background: red;"/>
                </Col>
              </Row>
            </FormItem>
            <FormItem  prop="sms">
              <Row>
                <Col :span="10">
                  <Input size="large" style="font-size: 14px"
                  v-model="signinForm.smsCaptcha"
                  placeholder="短信验证码"
                  class="verification"
                  @change="validateInput" />
                </Col>
                <Col :span="14">
                  <Button @click="sendSMS" :disabled="!mobileValidated||!imageCaptchaValidated||smsState=='sending'" style="width:100%;border-radius: 0; padding: 13px 0;">
                    {{smsState=='sending'? `(${remainTime}s)后重新发送验证码` : '获取短信验证码'}}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button @click="validateMobile" type="primary" style="width: 100%;">验证身份</Button>
            </FormItem>
          </Form>
          <div v-if="activeIndex==2">
            <h3 style="text-align:center;">我要登录</h3>
            <ul>
              <li v-for="org in userOrganizations" style="list-style:none;margin-bottom: 10px;">
                <Button @click="selectOrganization(org.id)" style="width:100%;" :disabled="org.status!='正常'" :type="org.status=='正常'?'primary':'normal'">{{org.name}}</Button>
              </li>
            </ul>
            <div style="text-align:center;margin-bottom:30px;">
              <Button @click="activeIndex=1;" style="margin-left: 40px;">返回上一步</Button>
            </div>
          </div>
          <div v-if="activeIndex==3">
            <Row>
              <Col :span="24" style="margin: 10px 0; text-align: center;">
              蓝信手机号码：{{signinForm.mobile}}
              </Col>
            </Row>
            <Form
              label-width="40px"
              ref="signinForm"
              :model="signinForm"
              :rules="rules"
              >
              <FormItem
                prop="password"
                >
                <Input
                placeholder="请输入蓝信登录密码"
                type="password"
                v-model="signinForm.password"/>
              </FormItem>
              <FormItem>
                <Row>
                  <Col>
                    <Button
                      style="widht:100%;"
                      type="primary"
                      @click="submitForm('signinForm')">登录</Button>
                    <Button @click="resetForm('signinForm')">重置</Button>
                  </Col>
              </Row>
              </FormItem>
            </Form>
          </div>
          <Form v-if="activeIndex==4">
            次数过多
          </Form>
        </Col>
      </Row>
      </Col>
    </Row>
    <div v-if="isAuthorize=='unknown'">
      loading
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'
//import apiConfig from '$app/config/apiConfig';
const apiConfig ={};
function validatePass (rule, value, callback) {
  let rules = [
    /\d+/,    //number
    /[a-zA-Z]+/, //alpha
    /[^0-9a-zA-Z]/ //others
  ];

  if(rules.some(reg=>!reg.test(value))){
    callback(new Error('必须包含字母，数字及其他字符'));
  }else{
    callback();
  }
};
function alphanumeric (rule,value,callback){
  if(/^(\d)+$/ .test(value)){
    callback();
  }else{
    callback(new Error('必须为数字'));
  }
};


export default {
  data() {
    var imageCaptchaValidator =(rule,value,callback)=>{
      // dorequest..and get result
      this.$store.dispatch('verifyImageCaptcha',{imageCaptcha:value}).then(rs=>{
        console.warn('验证通过');
        callback();
        this.imageCaptchaValidated=true;
      }).catch(err=>{
        console.warn('验证码错误');
        callback(new Error('验证码错误'));
      });
      return;
      console.log('imagecaptchaValidator');
      if(this.loginState.imageCaptchaValidated){
        callback();
      }else{
        callback(new Error('验证码错误'));
      }
    };

    return {
      activeIndex: 1, // 当前进行第几步

      imageCaptchaSource:apiConfig.User.getImageCaptcha, // 图片验证码地址
      loading:false,    // 是否显示loading
      mobileValidated : false,    // mobile的前端验证
      imageCaptchaValidated:false,
      smsState: 'normal',// normal/sending  // 是否发送短信验证码计时中
      remainTime: 10, // 短信倒计时

      signinForm: {
        mobile: '',
        imageCaptcha:'',
        smsCaptcha:'',
        organization:'',
        password:'',
      },

      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max:11, message: '长度11', trigger: 'blur' },
          { validator: alphanumeric,  trigger: 'blur' },
        ],
        imageCaptcha:[
          { required: true, message: '请填写图片验证码', trigger: 'blur' },
          { min: 4, max:4, message: '长度4', trigger: 'blur' },
          { validator: imageCaptchaValidator,  trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          {validator: validatePass,trigger:'blur'}, // 自定义验证
        ],
      }
    };
  },
  mounted(){
    console.log('mounted',this.isAuthorize);
    if(this.isAuthorize){
      this.$router.push('/contacts');
    }
  },
  computed:{
    ...mapGetters([
      'userOrganizations',
      'isAuthorize',
      'loginState',
    ]),
  },
  watch:{
    'signinForm.mobile':function(value){
      this.mobileValidated=/^(\d){11}$/ .test(value);
    },
    //'signinForm.imageCaptcha':function(value){
    //  if(value.length==4){
    //    this.$store.dispatch('verifyImageCaptcha',{imageCaptcha:value});
    //  }
    //},
    'loginState.imageCaptchaValidated':function(value){
      this.imageCaptchaValidated=value;
      this.$nextTick(()=>{
        this.$refs['signinForm'].validateField('imageCaptcha');
      });
    },
    'isAuthorize':function(value){
      console.log('watch.isAuthorize',value);
      if(value=='login'){
        this.$router.push('/contacts/');
      }else{
      }
    },
  },
  methods: {
    ...mapActions(
      [
        'signin'
      ]
    ),
    validateMobile(){
      // getorganizations by mobile
      this.loading=true;
      this.$store.dispatch('verifyIdentity',{
        mobile:this.signinForm.mobile,
        imageCaptcha:this.signinForm.imageCaptcha,
        smsCaptcha:this.signinForm.smsCaptcha,
      }).then(rs=>{
        return this.$store.dispatch('getOrganizations',{mobile:this.signinForm.mobile})
      }).then(rs=>{
        this.activeIndex=2;
        this.loading=false;
      }).catch(err=>{
        this.errormsg=err.message;
        this.activeIndex=1;
        this.loading=false;
      });
      //setTimeout(()=>{
      //},1000);
    },
    validateInput(){

    },
    selectOrganization(orgid){
      console.log('selectOrganization',orgid);
      this.loading=true;
      this.$store.dispatch('selectOrganization',{orgid}).then(()=>{
        this.signinForm.organization=orgid;
        this.activeIndex=3;
        this.loading=false;
      }).catch(err=>{
        this.activeIndex=2;
        this.loading=false;
      });
    },
    sendSMS() {
      this.smsState= 'sending';
      this.remainTime=10;
      let data = {
        mobile:this.signinForm.mobile,
        purpose:'login',
        image_captcha:this.signinForm.imageCaptcha,
      };
      this.$store.dispatch('getSMSCaptcha',data);

      let interval=setInterval(() => {
        this.remainTime--;
        if(this.remainTime === 0) {
          this.smsState = 'normal';
          clearInterval(interval);
        }
      }, 1000)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading=true;
          this.signin(this.signinForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    refreshImageCaptcha(){
      this.signinForm.imageCaptcha='';
      this.imageCaptchaSource=apiConfig.User.getImageCaptcha+'?'+Date.now();
    },
  }
}
</script>

<style lang="less">
.auth-signin {
  position: relative;
  height: 500px;
  width: 100%;
  flex-direction: column;
  margin-bottom: 30px;
}
.app-auth {
  background:#476294 url('https://lanxin.cn/pc/images/lx_home_build.png') no-repeat bottom center;
  .main-wrapper{
    margin: 0;
    padding: 0;
    background: none;

  }
  .footer{
      background: white;
    }
}
</style>
