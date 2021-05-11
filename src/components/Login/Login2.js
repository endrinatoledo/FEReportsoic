import React, { useState,useEffect } from "react";
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import { message, Button,Form,Modal,Input, Row, Col  } from 'antd';
import "../../assets/css/login.css";
import ModalForgotPasswod from './ModalForgotPasswod';
import SignUp from './SignUp'
import WaitingPage from './waitingPage'
const axios = require('../../utils/request').default;


const Login = () => {

    const [Reload, SetReload] = useState(0);
  const [connErr, setConnErr] = useState(false)
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();


  const responseGoogle = async (response) => {
    if(response){
      if(response.profileObj){
        try {
          const user = (await axios.post('/userByEmail', {usrEmail: response.profileObj.email})).data
          console.log(user)
          if(user !== "ERROR"){
            if(user.usrId){

                  localStorage.setItem("usrId", user.usrId);
                  localStorage.setItem("usrCompany", user.usrCompany);
                  localStorage.setItem("usrEmail", user.usrEmail);
                  localStorage.setItem("usrName", user.usrName);
                  localStorage.setItem("usrLastName", user.usrLastName);
                  localStorage.setItem("usrRol", user.rolId);
                  localStorage.setItem("usrStatus", user.usrStatus);               
                  localStorage.setItem("notReg", false);
                  localStorage.setItem("token", user.token);
                  localStorage.setItem("notReg", false);
                  
            }else{
              localStorage.setItem("notReg", true);
            }
             window.location.reload();
          }else{
            message.error('¡Error de conexión!');
          }
        } catch (error) {
          message.error('¡Error de conexión!');
        }
      }
    }
  }


  const ForceLogin = async (response) => {

    try {

        form
          .validateFields()
          .then(async values => {
      
                 if(values.usrEmail == '' || values.usrEmail == null || values.usrEmail == undefined){
                  message.error("Email es Requerido"  )                     
                }else if( values.usrPassword == null || values.usrPassword == '' || values.usrPassword == undefined){
                  message.error("Contraseña es Requerida"  )      
                }
                else{
      
                    const user = (await axios.post('/login', {email:values.usrEmail, password:values.usrPassword})).data
 
                    if(user.ok == false){
                        message.error(user.message);
                    }else 
                    if(user.ok == true){
                      
                            localStorage.setItem("usrId", user.user_.usrId);
                            localStorage.setItem("usrCompany", user.user_.usrCompany);
                            localStorage.setItem("usrEmail", user.user_.usrEmail);
                            localStorage.setItem("usrName", user.user_.usrName);
                            localStorage.setItem("usrLastName", user.user_.usrLastName);
                            localStorage.setItem("usrRol", user.user_.rolId);
                            localStorage.setItem("usrStatus", user.user_.usrStatus);               
                            localStorage.setItem("notReg", false);
                            localStorage.setItem("token", user.user_.token);
                            localStorage.setItem("notReg", false);
                            window.location.reload();
                    }else{
                        message.error('¡Error de conexión!');
                    }
                    
                }
                
                        });

    } catch (error) {
      message.error('¡Error de conexión!');
    }
  }

  const OpenModal = () =>{
    setVisible(true)
  }

  useEffect(() => {  

    }, [Reload]);
    useEffect(() => {
      if(connErr){
          message.error('¡Error de conexión!');
      }
  }, [connErr]);   
    

  let content = (
    <>
      <Row>
        <Col xs={24} md={24} lg={24} xl={24} className="fondo">
          <Row>
            <Col xs={24} md={24} lg={24} xl={24} className="styleBodySign">
              <Row>
                <Col xs={20} md={20} lg={7} xl={7} className="contenedorSignUp">
                {/* <Col span={7} offset={11} className="contenedorSignUp"> */}
                  <Row>
                    <Col className="logo">
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} md={24} lg={15} xl={15} className="encabezado">
                    {/* <Col span={15} offset={5} className="encabezado"> */}
                      Inicia sesión en tu cuenta
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                    <Form form={form} layout="vertical">
               <Form.Item 
              style={{ paddingLeft:'10%', paddingRight:'10%'}}
                name="usrEmail" rules={[
                  { type: "email", message: "No posee formato de email" },
                ]}
              >
                <Input placeholder="Introducir correo"  style={{borderRadius:'10px',height:'35px'}}/>
              </Form.Item>
              <Form.Item className="spaceInputPassword"
                name="usrPassword"
              > 
                <Input.Password placeholder="Introducir contraseña" style={{borderRadius:'10px',height:'35px'}}/>
              </Form.Item>
                <div style={{ paddingLeft:'10%', paddingRight:'10%'}}>
                <Button 
                onClick={ForceLogin}
                style={{borderRadius:'10px',height:'35px', width:'100%', background:' #999999',
                                color:'white', fontSize:'15px', fontWeight:'bolder'}}> Continuar </Button>
                </div>
              
            </Form> 
                      
                      <p
                        style={{
                          marginTop: "10px",
                          fontWeight: "bolder",
                          color: "#aeaeae",
                        }}
                      >
                        {" "}
                        O BIEN{" "}
                      </p>
                      <div
                        style={{
                          paddingLeft: "5%",
                          paddingRight: "5%",
                          // marginTop: "5px",
                        }}
                      >
                        <GoogleLogin
                          className="btn-google"
                          clientId={process.env.REACT_APP_CLIENT_ID_INTELIX}
                          buttonText="Continuar con Google"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                        />
                      </div>

                      <Button
                        type="link"
                        className="link"
                        onClick={() => setVisible(true)}
                        disabled
                      >
                        ¿No puedes iniciar sesión?
                      </Button>
                      <br></br>
                      <Button
                        type="link"
                        className="link"
                        onClick={() => ReactDOM.render(<SignUp />, document.getElementById('root'))}
                      >
                        Registrate
                      </Button>
                    </Col>
                  </Row>                  
                  
                </Col>
              </Row>
              <Row className="logos" >
              {/* span={20} offset={4} */}
                    <Col xs={24} md={24} lg={24} xl={24} >
                    <Row>
                    <Col span={3} className="logo_febeca"></Col>
                    <Col span={3} className="logo_beval"></Col>
                    <Col span={3} className="logo_sillaca"></Col>
                    <Col span={3} className="logo_cofersa"></Col>
                    <Col span={2} className="logo_mundipartes"></Col>
                    <Col span={2} className="logo_olo"></Col>
                    </Row>

                    </Col>
                  </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <ModalForgotPasswod visible={visible} setVisible={setVisible} />
    </>

  );
  return content;
}

export default Login;
