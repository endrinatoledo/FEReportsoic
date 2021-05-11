import React from 'react';
import { Modal } from 'antd';
import Iframe from 'react-iframe'
import 'antd/dist/antd'

const ModalReports = ({modalReport, setModalReport, dataReport}) => {

    return (
        <div >
          <Modal
            title={`${dataReport.company} - ${dataReport.nameReport}`}            
            visible={modalReport}
            onOk={() => setModalReport(false)}
            onCancel={() => setModalReport(false)}            
            style={{ top: 20}}
            width={'80%'} >
               <br/>
              <Iframe url={dataReport.url}
                  width="100%"
                  height="470"
                  frameBorder="0"
                  allow="fullscreen"                  
                  />
              <br/> 
          </Modal>
        </div>
      );
}

export default ModalReports;
