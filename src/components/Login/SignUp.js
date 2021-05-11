import React, { useState,useEffect } from "react";
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import { message, Button,Form,Input, Row, Col  } from 'antd';
import ModalForgotPasswod from './ModalForgotPasswod';
import Login from './Login2'
import "../../assets/css/login.css";
const axios = require('../../utils/request').default;


const SignUp = () => {

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

  const validateDomain = async (value) => {

    let email =value.split("@");
    
    if (email[1] == 'beval.biz' || email[1] == 'mayoreo.biz' || email[1] == 'febeca.com' ||
    email[1] == 'cofersa.cr' ||email[1] == 'mundipartes.com' || email[1] == 'sillaca.biz'){
      return true
    }else{
      return false
    }

  }

  const SignUp = async (response) => {

    try {

        form
          .validateFields()
          .then(async values => {

            const validateDomain_ = (await validateDomain(values.usrEmail)) 

            if(validateDomain_){
                if(values.usrEmail == '' || values.usrEmail == null || values.usrEmail == undefined){
                  message.error("Email es Requerido"  )                     
                }else if( values.usrPassword == null || values.usrPassword == '' || values.usrPassword == undefined){
                  message.error("Contraseña es Requerida"  )      
                }else if( values.usrPassword2 == null || values.usrPassword2 == '' || values.usrPassword2 == undefined){
                  message.error("Confirmar Contraseña es Requerido"  )      
                }
                else if( values.usrPassword2 !== values.usrPassword){
                  message.error("Las contraseñas no coinciden"  )      
                }
                else{

                  let user = (await axios.post('/user', { 
                    usrName: 'Registro en proceso', 
                    usrLastName: 'Registro en proceso',
                    usrEmail: values.usrEmail,
                    usrCompany: 'Registro en proceso',
                    usrRol: 2,
                    usrStatus: 1,
                    usrPassword:values.usrPassword
                    }))
                   

                    if(user.data.ok == false){
                          message.error(user.data.message);
                      }else 
                      if(user.data.ok == true){
                        message.success(user.data.message)
                        ReactDOM.render(<Login />, document.getElementById('root'))
                      }   
                    
                }

            }else{
              message.error("Email no permitido")

            }
                        });

    } catch (error) {
      message.error('¡Error de conexión!');
    }
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
                  <Row>
                    <Col className="logo">
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} md={24} lg={15} xl={15} className="encabezado">
                      Inicia sesión en tu cuenta
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form form={form} layout="vertical">
                        <Form.Item
                          style={{ paddingLeft: "10%", paddingRight: "10%" }}
                          name="usrEmail"
                          rules={[
                            {
                              type: "email",
                              message: "No posee formato de email",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Introducir correo"
                            style={{ borderRadius: "10px", height: "35px" }}
                          />
                        </Form.Item>
                        <Form.Item className="spaceInputPassword" name="usrPassword" >
                          <Input.Password
                            placeholder="Introducir contraseña"
                            style={{ borderRadius: "10px", height: "35px" }}
                          />
                        </Form.Item>
                        <Form.Item className="spaceInputPassword" name="usrPassword2" >
                          <Input.Password
                            placeholder="Repetir contraseña"
                            style={{ borderRadius: "10px", height: "35px" }}
                          />
                        </Form.Item>
                        <div
                          style={{ paddingLeft: "10%", paddingRight: "10%" }}
                        >
                          <Button
                            onClick={SignUp}
                            style={{
                              borderRadius: "10px",
                              height: "35px",
                              width: "100%",
                              background: " #999999",
                              color: "white",
                              fontSize: "15px",
                              fontWeight: "bolder",
                              marginTop:"-10%"
                            }}
                          >
                            {" "}
                            Registrarse{" "}
                          </Button>
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
                        onClick={() =>
                          ReactDOM.render(
                            <Login />,
                            document.getElementById("root")
                          )
                        }
                      >
                        Inicia Sesión
                      </Button>
                    </Col>
                  </Row>                  
                  
                </Col>
              </Row>
              <Row style={{marginTop:'3.1%', marginBottom:'3%'}}>
                    <Col xs={24} md={24} lg={24} xl={24} >
                    <Row>
                    <Col span={3} className="logo_febecaSU"></Col>
                    <Col span={3} className="logo_bevalSU"></Col>
                    <Col span={3} className="logo_sillacaSU"></Col>
                    <Col span={3} className="logo_cofersaSU"></Col>
                    <Col span={2} className="logo_mundipartesSU"></Col>
                    <Col span={2} className="logo_oloSU"></Col>
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

export default SignUp;
