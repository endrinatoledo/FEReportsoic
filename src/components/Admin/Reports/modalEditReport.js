import React, {useState,useEffect} from 'react';
import { Table, ConfigProvider, Typography,Tag,Input,Button,Space, Form,Modal,Select,message,Tooltip,Spin   } from 'antd';
import 'antd/dist/antd'
const axios = require('../../../utils/request').default;


const ModalEditReports = ({setVisible, visible, toEdit,setToEdit,rolesselect, setRolesselect, setConnErr, selectProps, Reload,fillTable}) => {

    const [form] = Form.useForm();
    const { TextArea } = Input;


    const onOk = () =>{
        form
          .validateFields()
          .then(async values => {
            values.roles = rolesselect
            if(values.repName == '' || values.repName == null || values.repName == undefined){
              message.error("Nombre es Requerido"  )
            }else if(values.repCompany == '' || values.repCompany == null || values.repCompany == undefined){
              message.error("Compañía es Requerido"  )
            }else if(values.repUrl == '' || values.repUrl == null || values.repUrl == undefined){
              message.error("URL es Requerido"  )
            }else if(values.repStatus == '' || values.repStatus == null || values.repStatus == undefined){
              message.error("Estatus es Requerido"  )
            }else if( values.roles == null || values.roles == [] || values.roles == undefined || values.roles.length == 0){
              message.error("Roles es Requerido"  )
      
            }else{      
              try{
                let result = (await axios.put('/report/'+ toEdit.repId, { 
                  repName: (values.repName === undefined ? toEdit.repName : values.repName), 
                  repDescription: (values.repDescription === undefined ? toEdit.repDescription : values.repDescription), 
                  repCompany: (values.repCompany === undefined ? toEdit.repCompany : values.repCompany), 
                  repUrl: (values.repUrl === undefined ? toEdit.repUrl : values.repUrl), 
                  repStatus: (values.repStatus === undefined ? toEdit.repStatus : values.repStatus),
                  roles: values.roles
                  }))

                  if(result.data.message == 'URL ya asignado a otro reporte'){
                    message.error(result.data.message)
                  }else{
                    message.success("Reporte editado con éxito"  )
                    fillTable()
                    setToEdit({repName: '', repCompany: '', repDescription:'',repUrl: '', repStatus: '',roles:null})
                    setVisible(false)
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
          visible={visible}
          title="Editar Reporte"
          okText="Editar"
          cancelText="Cancelar"
          onOk={onOk}
          onCancel={() => {
            fillTable();
            setToEdit({repName: '', repCompany: '', repDescription:'',repUrl: '', repStatus: '',roles:null})            
            form.resetFields();
            setVisible(false);
          }}
        >
          {toEdit.repName == "" ||
          toEdit.repCompany == "" ||
          toEdit.repUrl == "" ||
          toEdit.repStatus == "" ? (
            <Spin style={{ marginLeft: "50%", marginTop: "50px" }} />
          ) : (
            <>
              <Form form={form} layout="vertical" initialValues={toEdit}>
                <Form.Item name="repName" label="Nombre">
                  <Input placeholder="Nombre..." />
                </Form.Item>
                <Form.Item name="repDescription" label="Descrición">
                  <TextArea rows={2} placeholder="Descrición..." />
                </Form.Item>
                <Form.Item name="repCompany" label="Compañía">
                  <Select placeholder="Seleccionar">
                    <Select.Option value="Mayoreo">Mayoreo</Select.Option>
                    <Select.Option value="Mundipartes">
                      Mundipartes
                    </Select.Option>
                    <Select.Option value="Cofersa">Cofersa</Select.Option>
                    <Select.Option value="Beval">Beval</Select.Option>
                    <Select.Option value="Sillaca">Sillaca</Select.Option>
                    <Select.Option value="Febeca">Febeca</Select.Option>
                    <Select.Option value="Olo">Olo</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="repUrl" label="URL">
                  <TextArea rows={3} placeholder="URL..." />
                </Form.Item>
                <Form.Item name="roles" label="Roles">
                  {rolesselect == null && rolesselect == [] ? (
                    <Spin style={{ marginLeft: "50%", marginTop: "50px" }} />
                  ) : (
                    <>
                      <Select placeholder="Seleccionar" {...selectProps} />
                    </>
                  )}
                </Form.Item>
                <Form.Item name="repStatus" label="Estatus">
                  <Select placeholder="Seleccionar">
                    <Select.Option value="1">Activo</Select.Option>
                    <Select.Option value="0">Inactivo</Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>
      </div>
    );
}

export default ModalEditReports;
