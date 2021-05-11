import React, {useEffect,useState} from 'react';
import { Input,Form,Modal,message   } from 'antd';
import 'antd/dist/antd'
const axios = require('../../utils/request').default;


const ModalForgotPasswod = ({email, visible,setVisible}) => {

    const [form] = Form.useForm();
    const [recover, SetRecover] = useState({email:email});
    

    const onOk = () => {

        form
          .validateFields()
          .then(async values => {
      
                if(values.usrEmail == '' || values.usrEmail == null || values.usrEmail == undefined){
                  message.error("Email es Requerido"  )
                }
                else{
      
                  let result = (await axios.post('/user', values, { 
                    usrName: values.usrName, 
                    usrLastName: values.usrLastName,
                    usrEmail: values.usrEmail,
                    usrCompany: values.usrCompany,
                    usrRol: values.usrRol,
                    usrStatus: values.usrStatus,
                    usrPassword:values.usrPassword
                    }))
      
                    if(result.data.message == 'Email ya se encuentra registrado'){
                      message.error(result.data.message)
                    }else{
                      message.success(result.data.message)
                      form.resetFields();
      
                    }
      
                }
 
          });
      }

    return (
      <div>
        <Modal
          style={{ top: 20, width:10 }}
          visible={visible}
          title="Olvide Contraseña"
          okText="Recuperar"
          cancelText="Cancelar"
          onOk={onOk}
          onCancel={() => {
            form.resetFields();           
            setVisible(false);
          }}
        >
          <Form form={form} layout="vertical" initialValues={recover}>
            <Form.Item name="email" label="Email" value={recover.email} rules={[ { type: "email", message:"No posee formato de email" }]}>
              <Input placeholder="Email..." />
            </Form.Item>
          </Form>
        </Modal>
        
      </div>
    );
}

export default ModalForgotPasswod;
