import {Button, Form,FormItem, Input} from 'element-ui';
export default {
  data(){
    return {
      model:{
        name:'',
        age:'',
      },
      rules:{
        name:[
          {required:true,message:'name.required',trigger:'change'},
        ],
      },
    };
  },
  render(){
    let items = [
        <FormItem key={1} label="name" rules={this.rules.name} prop="name">
          <Input value={this.model.name} onChange={this.onChange.bind(this,'name')} placeholder="name input"/>
        </FormItem>
    ];
    return <div>
      settings
      <Form ref="form" model={this.model}>
        {items}
      </Form>
      <Button onClick={this.onSubmit}>submit</Button>
      <Button onClick={this.onReset}>reset</Button>
      </div>
  },
  methods:{
    onSubmit(){
      console.log('onSubmit');
      console.log('form',this.$refs.form);
      console.log('model',this.model);
    },
    onChange(path,value){
      console.log('onChange',...arguments);
      this.model[path] = value;
    },
    onReset(){
      console.log('onReset');
      this.$refs.form.resetFields();
    },
  },
};
