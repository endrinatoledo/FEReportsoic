import React, { useEffect, useState } from 'react';
import { Row, Col, Typography,Spin,message, Tooltip} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import List from './list';

const axios = require('../../../utils/request').default;

const { Title } = Typography;

const RolesAdmin = () => {

  const [Reload, SetReload] = useState(0);
  const [connErr, setConnErr] = useState(false)
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  

  const fillData = async () => { 
    try{
      
      const resultRoles = (await axios.get("roles")).data
      if( resultRoles){ setDataSource(resultRoles)  }else{ setConnErr(true) } 
      
  }catch{
      setConnErr(true)
  }
    
  }

  useEffect(() => {  
    setDataSource(null)  
    fillData()
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
            <Title level={4} style={{textAlign:'center', textDecoration:'underline gray' }}>Listado de Roles</Title>           
          </Col>
           <Col  style={{ paddingTop:'2%' }} xs={2} md={2} lg={2} xl={2}> 
            <Tooltip title="Crear Rol">
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
            <List dataSource={dataSource} setVisible={setVisible} setDataSource={setDataSource} visible={visible} 
            setConnErr={setConnErr} setVisibleModal={setVisibleModal} visibleModal={visibleModal}/> 
            </>
           }
          </Col>

        </Row>

        
        
    </div>
  );
  return content;
}

export default RolesAdmin;
