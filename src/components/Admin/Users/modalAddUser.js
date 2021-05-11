import React, {useEffect} from 'react';
import { Input,Form,Modal,Select,message   } from 'antd';
import 'antd/dist/antd'
const axios = require('../../../utils/request').default;


const { Option } = Select;

const ModalAddUser = ({setVisibleAddUser, visibleAddUser, fillData, optionsRoles, selectedRole, setSelectedRole}) => {

    const [form] = Form.useForm();
    

    const onOkAddReport = () => {

        form
          .validateFields()
          .then(async values => {
      
                if(values.usrName == '' || values.usrName == null || values.usrName == undefined){
                  message.error("Nombre es Requerido"  )
                }else if(values.usrLastName == '' || values.usrLastName == null || values.usrLastName == undefined){
                  message.error("Apellido es Requerido"  )
                }else if(values.usrEmail == '' || values.usrEmail == null || values.usrEmail == undefined){
                  message.error("Email es Requerido"  )
                }else if(values.usrCompany == '' || values.usrCompany == null || values.usrCompany == undefined){
                  message.error("Compañía es Requerida"  )
                }else if( values.usrRol == null || values.usrRol == [] || values.usrRol == undefined){
                  message.error("Rol es Requerido"  )      
                }else if( values.usrStatus == null || values.usrStatus == [] || values.usrStatus == undefined){
                  message.error("Estatus es Requerido"  )      
                }else if( values.usrPassword == null || values.usrPassword == '' || values.usrPassword == undefined){
                  message.error("Contraseña es Requerida"  )      
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
                      fillData()
                      setVisibleAddUser(false)
                      form.resetFields();
      
                    }
      
                }
 
          });
      }

      function onChange(value) {
            const rol = optionsRoles.filter( data => data.rolId == value)
            setSelectedRole(rol)
      }

    return (
      <div>
        <Modal
          style={{ top: 20 }}
          visible={visibleAddUser}
          title="Agregar Usuario"
          okText="Agregar"
          cancelText="Cancelar"
          onOk={onOkAddReport}
          onCancel={() => {
            form.resetFields();
            fillData();            
            setVisibleAddUser(false);
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="usrName" label="Nombre" >
              <Input placeholder="Nombre..." />
            </Form.Item>
            <Form.Item name="usrLastName" label="Apellido">
              <Input placeholder="Apellido..." />
            </Form.Item>
            <Form.Item name="usrEmail" label="Email" rules={[ { type: "email", message:"No posee formato de email" }]}>
              <Input placeholder="Email..." />
            </Form.Item>
            <Form.Item name="usrPassword" label="Contraseña" >
              <Input.Password placeholder="Contraseña..." />
            </Form.Item>
            <Form.Item name="usrCompany" label="Compañía">
            <Select placeholder="Seleccionar compañía">
              <Select.Option value="Mayoreo">Mayoreo</Select.Option>
              <Select.Option value="Mundipartes">Mundipartes</Select.Option>
              <Select.Option value="Cofersa">Cofersa</Select.Option>
              <Select.Option value="Beval">Beval</Select.Option>
              <Select.Option value="Sillaca">Sillaca</Select.Option>
              <Select.Option value="Febeca">Febeca</Select.Option>
              <Select.Option value="Olo">Olo</Select.Option>
            </Select>
          </Form.Item>
            <Form.Item name="usrRol" label="Rol" >
                <Select  placeholder="Seleccionar rol"
                    showSearch
                    value={selectedRole}
                    onChange={onChange}
                    >
                    {optionsRoles.map(d => 
                    <Option key={d.rolId} value={d.rolId}>{d.rolName}</Option>
                    )}
                </Select>
          </Form.Item>
            <Form.Item name="usrStatus" label="Estatus">
              <Select placeholder="Seleccionar estatus">
                <Select.Option value="1">Activo</Select.Option>
                <Select.Option value="0">Inactivo</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        
      </div>
    );
}

export default ModalAddUser;
