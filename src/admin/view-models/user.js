import User from '$models/user';
import Vue from 'vue';
console.log('userModel',User);
const userModel = new User();

const state = {
  userinfo:{},
  isAuthorize:'unknown',
  menu:{},
  organizations:[],
  login:{
    imageCaptchaValidated:false,
    smsSendingState:'init',// init/success/failed
    identityValidated:false,
    logingState:'init', // init/success/failed/retry
  },
};

const mutations={
  signin(state,userinfo){
    state.userinfo = {...userinfo}
    state.isAuthorize='login';
    //Vue.set(state,'userinfo' , userinfo);
  },
  logout(state){
    Vue.set(state,'userinfo' , {});
    state.isAuthorize='logout';
  },
  getOrganizations(state,orgs){
    console.log('setOrganizations',orgs);
    Vue.set(state,'organizations' , orgs);
  },
  updateImageCaptchaState(state,validated){
    state.login.imageCaptchaValidated=validated;
  },
  updateIdentityState(state,validated){
    state.login.identityValidated=validated;
  },
  updateLoginState(state,loginState){
    state.login.loginState=loginState;
  },

};

const actions ={
  verifyImageCaptcha({commit,state},{imageCaptcha}){
    console.log('actions.verifyImageCaptcha',imageCaptcha);
    return userModel.verifyImageCaptcha({imageCaptcha}).then(rs=>{
      console.log(rs);
      //commit('updateImageCaptchaState',true);
      return true;
    }).catch(err=>{
      //commit('updateImageCaptchaState',false);
      return false;
    });
  },
  getSMSCaptcha({commit,state},data){
    userModel.getSMSCaptcha(data).then(rs=>{
    }).catch(err=>{
    });
  },
  verifyIdentity({commit,state},{mobile,imageCaptcha,smsCaptcha}){
    console.log('actions.verifyIdentity',{mobile,imageCaptcha,smsCaptcha});
    return userModel.verifyIdentity({mobile,imageCaptcha,smsCaptcha}).then(rs=>{
      console.log(rs);
      //commit('updateImageCaptchaState',true);
      return true;
    }).catch(err=>{
      //commit('updateImageCaptchaState',false);
      return false;
    });
  },
  getOrganizations({commit,state},mobile){
    return userModel.getOrganizations(mobile).then(data=>{
      if(data&&data.org_list&&data.org_list.length){
        data=data.org_list;
      }else{
        data= [
          {id:1,name:'中国石油化集团北京分公司',status:'正常'},
          {id:2,name:'中国石油化集团南京分公司',status:'冻结'},
          {id:3,name:'中国石油化集团东京分公司',status:'未注册'},
          {id:4,name:'中国石油化集团西京分公司',status:'未授权'},
        ];
      }
      commit('getOrganizations',data);
      return data;
    });
  },
  selectOrganization({commit},{orgid}){
    return userModel.selectOrganization({orgid}).then(data=>{
      return data;
    });
  },
  signin({commit,state},form){
    // do request
    let data = {...form};
    data.passwd=data.password;
    return userModel.signin(form).then(data=>{
      let userinfo = {user_id:'123456',name:'test-name',oid:'123'};
      commit('signin', userinfo);
      return userinfo;
    });
  },
  logout({commit,state}){
    userModel.logout().then(()=>{
      commit('logout');
    });
  },
  initdata({commit}){
    userModel.initdata().then((data)=>{
      console.warn(data);
      let userinfo = data;
      commit('signin', userinfo);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
