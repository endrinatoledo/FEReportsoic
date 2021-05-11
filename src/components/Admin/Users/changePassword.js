import React, {useEffect} from 'react';
import { Input,Form,Select,message, Row, Col,Typography,Button   } from 'antd';
import 'antd/dist/antd'
const axios = require('../../../utils/request').default;

const { Title } = Typography;


const ChangePassword = () => {


    const [form] = Form.useForm();
    

    const onOk = async (response) => {

        try {
    
            form
              .validateFields()
              .then(async values => {
    
                    if( values.usrPassword == null || values.usrPassword == '' || values.usrPassword == undefined){
                      message.error("Contraseña es Requerida"  )      
                    }else if( values.usrPassword2 == null || values.usrPassword2 == '' || values.usrPassword2 == undefined){
                      message.error("Confirmar Contraseña es Requerido"  )      
                    }
                    else if( values.usrPassword2 !== values.usrPassword){
                      message.error("Las contraseñas no coinciden"  )      
                    }
                    else{

                        let result = (await axios.put('/updatePassword/'+ localStorage.usrId, { 
                            usrPassword: values.usrPassword
                            }))
    
                            if(result.data.ok == false){
                                message.error(result.data.message);
                            }else 
                            if(result.data.ok == true){
                                message.success(result.data.message)
                                form.resetFields();
                            }     
                        
                    }
    
                            });
    
        } catch (error) {
          message.error('¡Error de conexión!');
        }
      }

    return (
      <div>
        <Row>
         <Col xs={24} md={24} lg={24} xl={24}>
            <Title level={4} style={{textAlign:'center', textDecoration:'underline gray' }}>Cambiar contraseña</Title>           
          </Col>        
        </Row>
        <Row style={{marginTop:'5%'}}>  
            <Col xs={24} md={15} lg={15} xl={10} className="changePassword" >
            <Form form={form} layout="vertical">
                        <Form.Item
                          style={{ paddingLeft: "10%", paddingRight: "10%" }}
                          name="usrPassword"
                        >
                          <Input.Password
                            placeholder="Introducir contraseña"
                            style={{ borderRadius: "10px", height: "35px" }}
                          />
                        </Form.Item>
                        <Form.Item
                          style={{ paddingLeft: "10%", paddingRight: "10%" }}
                          name="usrPassword2"
                        >
                          <Input.Password
                            placeholder="Repetir contraseña"
                            style={{ borderRadius: "10px", height: "35px" }}
                          />
                        </Form.Item>
                        <div
                          style={{ paddingLeft: "10%", paddingRight: "10%" }}
                        >
                        </div>
                      </Form>
                      <div style={{ paddingLeft: "10%", paddingRight: "10%" }} >
                        <Button
                                onClick={onOk}
                                style={{
                                borderRadius: "10px",
                                height: "35px",
                                width: "100%",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: "bolder",
                                }}
                                type="primary"
                            > Guardar</Button>  
                        </div>  
            </Col>
        </Row>
        <Row style={{marginTop:'3%'}}>
            <Col span={10} offset={7} >
                      <Button
                            onClick={onOk}
                            style={{
                              borderRadius: "10px",
                              height: "35px",
                              width: "100%",
                              background: " #999999",
                              color: "white",
                              fontSize: "15px",
                              fontWeight: "bolder",
                            }}
                          ></Button>   
            </Col>
        </Row>
      </div>
    );
}

export default ChangePassword;
