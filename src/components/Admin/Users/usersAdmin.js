import React, { useEffect, useState } from 'react';
import { Row, Col, Typography,Spin,message, Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import List from './list';
import ModalAddUser from './modalAddUser'
const axios = require('../../../utils/request').default;


const { Title } = Typography;

const UsersAdmin = () => {

  const [Reload, SetReload] = useState(0);
  const [connErr, setConnErr] = useState(false)
  const [dataSource, setDataSource] = useState([]);
  const [visibleAddUser, setVisibleAddUser] = useState(false);

  const [optionsRoles, setOptionsRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  const fillData = async () => { 

    try{      
      const resultUsers = (await axios.get("users")).data
      if(resultUsers){
        setDataSource(resultUsers)     
    }else{
        setConnErr(true)
    } 
      
  }catch{
      setConnErr(true)
  }
    
  }

  const selectRoles = async () => {

    try{
      const resultRoles = (await axios.get("activeroles")).data
      
      setOptionsRoles((resultRoles == [] ? [] : resultRoles.map((el) => {  
        return {
          ...el,
          label: el.rolName,
          value: el.rolId         
        }
        })        
      ))
    }      
    catch{
      setConnErr(true)
  }    
    }

  useEffect(() => {  
    setDataSource(null)  
    fillData()
    selectRoles()
    }, [Reload]);
    useEffect(() => {
      if(connErr){
          setDataSource([])
          message.error('¡Error de conexión!');
      }
  }, [connErr]);   
    

  let content = (
    <div style={{paddingBottom: "50px"}}>

        <Row>
         <Col xs={22} md={22} lg={22} xl={22}>
            <Title level={4} style={{textAlign:'center', textDecoration:'underline gray' }}>Listado de Usuarios</Title>           
          </Col>
          <Col  style={{ paddingTop:'2%' }} xs={2} md={2} lg={2} xl={2}> 
              
          <Tooltip title="Crear Usuario">
              <PlusCircleOutlined style={{ fontSize: '30px' }} onClick={() => setVisibleAddUser(true)} /> 
          </Tooltip>
          </Col>          
        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
          {(dataSource == null && dataSource != [] && !connErr) ? 
          <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/>
           : 
           <>  <List dataSource={dataSource} setConnErr={setConnErr} fillData={fillData} optionsRoles={optionsRoles} />  </>
           }
          </Col>

        </Row>
        <ModalAddUser setVisibleAddUser ={setVisibleAddUser} visibleAddUser={visibleAddUser} 
        fillData={fillData} optionsRoles={optionsRoles} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        
    </div>
  );
  return content;
}

export default UsersAdmin;
