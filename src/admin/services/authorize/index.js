const state=[
  'unknown',
  'login',
  'logout',
];
const authorizeState={
  state:'unknown',
};
export default {
  updateState(state){
    authorizeState.state=state;
  },
  isState(state){
    return authorizeState.state==state;
  },
  get isAuthorize(){
    return authorizeState.state=='login';
  },
};
