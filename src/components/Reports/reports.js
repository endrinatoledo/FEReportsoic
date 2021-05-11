import '../../assets/css/reports.css'
import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, message } from 'antd';
import ReportsMayoreo from './reportsMayoreo'
import ReportsCofersa from './reportsCofersa';
import ReportsMundiPartes from './reportsMundiPartes'
import ReportsOlo from './reportsOlo'
import ReportsSillaca from './reportsSillaca'
import ReportsBeval from './reportsBeval'
import ReportsFebeca from './reportsFebeca';

const axios = require('../../utils/request').default;

const { Title } = Typography;

const Reports = () => {

  const [Reload, SetReload] = useState(0);
  const [connErr, setConnErr] = useState(false)
  const [dataSource, setDataSource] = useState([]);

  const [mayoreo, setMayoreo] = useState(null)
  const [cofersa, setCofersa] = useState(null)
  const [mundipartes, setMundipartes] = useState(null)
  const [olo, setOLo] = useState(null)
  const [sillaca, setSillaca] = useState(null)
  const [beval, setBeval] = useState(null)
  const [febeca, setFebeca] = useState(null)

  const fillData = async () => {

    try {
      const result = (await axios.get("/activeReportsByRol/"+localStorage.usrRol)).data
      
      if(result){
        for (let index1 = 0; index1 < result.business.length; index1++) {
          (result.business[index1] === 'Mayoreo') && setMayoreo(true);
          (result.business[index1] === 'Cofersa') && setCofersa(true);
          (result.business[index1] === 'Mundipartes') && setMundipartes(true);
          (result.business[index1] === 'OLo') && setOLo(true);
          (result.business[index1] === 'Sillaca') && setSillaca(true);
          (result.business[index1] === 'Beval') && setBeval(true);
          (result.business[index1] === 'Febeca') && setFebeca(true);
        }  
      }else{
        setConnErr(true)
      }         
    } catch (error) {
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
          <Col xs={24} md={24} lg={24} xl={24}>
            <Title level={4} style={{textAlign:'center', textDecoration:'underline gray' }}>Oficina de Inteligencia Comercial</Title>           
          </Col>
          
        </Row>

        {mayoreo === true && <ReportsMayoreo setConnErr={setConnErr} connErr={connErr} Reload={Reload} /> }
        {cofersa === true && <ReportsCofersa setConnErr={setConnErr} connErr={connErr} Reload={Reload} />} 
        {mundipartes === true && <ReportsMundiPartes setConnErr={setConnErr} connErr={connErr} Reload={Reload} />}
        {olo === true && <ReportsOlo setConnErr={setConnErr} connErr={connErr} Reload={Reload} /> }
        {febeca === true && <ReportsFebeca setConnErr={setConnErr} connErr={connErr} Reload={Reload} />} 
        {sillaca === true && <ReportsSillaca setConnErr={setConnErr} connErr={connErr} Reload={Reload} />}
        {beval === true && <ReportsBeval setConnErr={setConnErr} connErr={connErr} Reload={Reload} /> }

        
    </div>
  );
  return content;
}

export default Reports;
