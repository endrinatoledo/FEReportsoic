import React, {useEffect} from 'react';
import {Input,Form,Modal,Select,message } from 'antd';
import 'antd/dist/antd'
const axios = require('../../../utils/request').default;
const { Option } = Select;

const ModalEditUser = ({visibleEditUser, setVisibleEditUser, fillData, toEdit,setConnErr,optionsRoles }) => {

    const [form] = Form.useForm();

    const onOk = () =>{
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
            message.error("Compañía es Requerido"  )
          }else if( values.rolId == null || values.rolId == [] || values.rolId == undefined){
            message.error("Rol es Requerido"  )      
          }else if( values.usrStatus == null || values.usrStatus == [] || values.usrStatus == undefined){
            message.error("Estatus es Requerido"  )     
          }else{      
            try{
              let result = (await axios.put('/user/'+ toEdit.usrId, { 
                usrName: (values.usrName === undefined ? toEdit.usrName : values.usrName), 
                usrLastName: (values.usrLastName === undefined ? toEdit.usrLastName : values.usrLastName), 
                usrEmail: (values.usrEmail === undefined ? toEdit.usrEmail : values.usrEmail), 
                usrCompany: (values.usrCompany === undefined ? toEdit.usrCompany : values.usrCompany), 
                usrStatus: (values.usrStatus === undefined ? toEdit.usrStatus : values.usrStatus),
                rolId: (values.rolId === undefined ? toEdit.rolId : values.rolId)
                }))

                if(result.data.message == 'Email ya se encuentra registrado'){
                  message.error(result.data.message)
                }else{
                  message.success(result.data.message)
                  fillData()
                  setVisibleEditUser(false)
                  form.resetFields();
  
                }      
            }catch{
              setConnErr(true)      
            }                     
          }
        });    
    }

      useEffect(() => {
        form.resetFields()
      }, [toEdit]);

    return (
      <div>
        <Modal
          style={{ top: 20 }}
          visible={visibleEditUser}
          title="Editar Usuario"
          okText="Editar"
          cancelText="Cancelar"
            onOk={onOk}
            onCancel={() => {
              form.resetFields();
              fillData();
              setVisibleEditUser(false);
            }}
        >
          <Form form={form} layout="vertical" initialValues={toEdit}>
            <Form.Item name="usrName" label="Nombre">
              <Input placeholder="Nombre..." />
            </Form.Item>
            <Form.Item name="usrLastName" label="Apellido">
              <Input placeholder="Apellido..." />
            </Form.Item>
            <Form.Item
              name="usrEmail"
              label="Email"
              rules={[{ type: "email", message: "No posee formato de email" }]}
            >
              <Input placeholder="Email..." />
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
            <Form.Item name="rolId" label="Rol" >
                <Select  placeholder="Seleccionar rol" >
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

export default ModalEditUser;
