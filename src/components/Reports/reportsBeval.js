import "../../assets/css/reports.css"
import React, { useEffect, useState } from 'react';
import ModalReport from './modalReport'
import { Row, Col, Typography,Divider, Spin,message  } from 'antd';
const { Title } = Typography;

const axios = require('../../utils/request').default;
const ReportsBeval = ({Reload, connErr, setConnErr }) => {

    const [dataSource, setDataSource] = useState([]);
    const [modalReport, setModalReport] = useState(false)
    const [dataReport, setDataReport] = useState(false)




    const fillData = async () => {
        try{
            const result = (await axios.get("activeReports/company/Beval/rol/"+localStorage.usrRol)).data
            if(result){
                setDataSource(result)
            }else{
                setConnErr(true)
            }
            
        }catch{
            setConnErr(true)
        }
    }
    function openModal(nameReport, company, url){
        setDataReport({ nameReport, company, url })
        setModalReport(true)    
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
        <div style={{paddingBottom: "10px"}}>
            <br></br>
        <Row>
            <Col xs={24} md={24} lg={24} xl={24}>
                <Title level={3}>Beval</Title>           
            </Col> 
        </Row>
        <Row>               
            <Col xs={24} md={24} lg={24} xl={24}>
            <Divider className="divider" />
          </Col>
        </Row>
        <br></br>
        <Row>
            {(dataSource == null && dataSource != [] && !connErr) ? 
            <Spin className="spin"/> 
            :
            <>
            {dataSource.map(element => {
               return ( 
                <Col xs={22} md={10} lg={6} xl={4}  style={{marginRight:"20px"}}>
                    <a>
                        <div className='item' title={element.repName} 
                        onClick={() =>openModal(element.repName, element.repCompany, element.repUrl ) }>
                            <p className="textItem"  > {element.repName} </p> 
                        </div>
                    </a>                  
                </Col>               
                )
            })}            
            </>}
        </Row>
        <ModalReport modalReport={modalReport} setModalReport={setModalReport} 
        dataReport={dataReport}/>
        
    </div>
  );
  return content;
}

export default ReportsBeval;