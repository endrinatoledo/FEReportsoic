import React, { useEffect, useState } from 'react';
import { Row, Col, Typography,Spin,message, Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import List from './list';

const axios = require('../../../utils/request').default;


const { Title } = Typography;

const ReportsAdmin = () => {

  const [Reload, SetReload] = useState(0);
  const [connErr, setConnErr] = useState(false)
  const [dataSource, setDataSource] = useState([]);
  const [roles, setRoles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [optionsRoles, setOptionsRoles] = useState([]);


  const fillData = async () => { 

    try{
      
      const resultReport = (await axios.get("reportsRol")).data

      if(resultReport){
        setDataSource(resultReport)     
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
            <Title level={4} style={{textAlign:'center', textDecoration:'underline gray' }}>Listado de Reportes</Title>           
          </Col>
          <Col  style={{ paddingTop:'2%' }} xs={2} md={2} lg={2} xl={2}> 
              
          <Tooltip title="Crear Reporte">
              <PlusCircleOutlined style={{ fontSize: '30px' }} onClick={() => setVisibleModal(true)} /> 
          </Tooltip>
          </Col>          
        </Row>
        <Row>
          <Col xs={24} md={24} lg={24} xl={24}>
          {(dataSource == null && dataSource != [] && !connErr) ? 
          <Spin style={{ marginLeft: '50%', marginTop: '50px' }}/>
           : 
           <> 
            <List dataSource={dataSource} setDataSource={setDataSource} setConnErr={setConnErr}
            visible={visible} setVisible={setVisible} 
            setVisibleModal={setVisibleModal} visibleModal={visibleModal} optionsRoles={optionsRoles} 
            SetReload={SetReload} Reload={Reload}
           /> 
            </>
           }
          </Col>

        </Row>

        
    </div>
  );
  return content;
}

export default ReportsAdmin;
