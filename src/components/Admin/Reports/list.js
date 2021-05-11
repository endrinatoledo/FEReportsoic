import React, {useState,useEffect} from 'react';
import { Table, ConfigProvider, Typography,Tag,Input,Button,Space, Form,Modal,Select,message,Tooltip,Spin   } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import ModalReport from '../../Reports/modalReport'
import ModalEditReport from './modalEditReport'
import Highlighter from 'react-highlight-words';
import esp from 'antd/es/locale/es_ES';

const axios = require('../../../utils/request').default;

const { Text } = Typography;
const TableList = ({ dataSource, setDataSource,setConnErr,visible, setVisible, setVisibleModal, visibleModal,optionsRoles,SetReload,Reload}) => {

  const [modalReport, setModalReport] = useState(false)
  const [dataReport, setDataReport] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [toEdit, setToEdit] = useState({repName: '', repCompany: '', repDescription:'',repUrl: '', repStatus: '',roles:[]});
  const [rolesselect, setRolesselect] = useState([]);
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const { TextArea } = Input;

  function seeReportModal(nameReport, company, url){
    setDataReport({ nameReport, company, url })    
    setModalReport(true)    
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            TableList.searchInput = node;
          }}
          placeholder={`Buscar ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => TableList.searchInput.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const fillTable = async () => {
    try{
      const resultReports = (await axios.get("reportsRol")).data
      if( resultReports){ setDataSource(resultReports) }else{ setConnErr(true) }

    }catch{
      setConnErr(true)
  }
}

const selectProps = {
  mode: 'multiple' ,
  style: { width: '100%' },
  value:rolesselect,
  options:optionsRoles,
  onChange: (newValue) => {
    setRolesselect(newValue);
  },
  placeholder: 'Seleccionar Roles...',
  maxTagCount: 'responsive',
};

const onOkAddReport = () => {

  form
    .validateFields()
    .then(async values => {  

          if(values.repName == '' || values.repName == null || values.repName == undefined){
            message.error("Nombre es Requerido"  )
          }else if(values.repCompany == '' || values.repCompany == null || values.repCompany == undefined){
            message.error("Compañía es Requerido"  )
          }else if(values.repUrl == '' || values.repUrl == null || values.repUrl == undefined){
            message.error("URL es Requerido"  )
          }else if(values.repStatus == '' || values.repStatus == null || values.repStatus == undefined){
            message.error("Estatus es Requerido"  )
          }else if( values.roles == null || values.roles == [] || values.roles == undefined){
            message.error("Roles es Requerido"  )
  
          } else {

            let result = (await axios.post('/report', values, { 
              repName: values.repName, 
              repCompany: values.repCompany,
              repDescription: values.repDescription,
              repUrl: values.repUrl,
              repStatus: values.repStatus,
              roles: values.roles
              }))  


              if(result.data.status == 0){

                message.error(result.data.message, 6)
              }else{
                message.success(result.data.message)
                fillTable()
                setToEdit({repName: '', repCompany: '', repDescription:'',repUrl: '', repStatus: '',roles:[]})
                setVisibleModal(false)
                form.resetFields();

              }

          }

          
      
    });
}



function setEdit(value) {

  setToEdit({...value, repStatus: (value.repStatus == 1)?'Activo':'Inactivo'})
  setVisible(true)
  updateRoles (value)
  }

  const updateRoles  = async (value) => {
    setRolesselect([])
    const rolesbyreport = (await axios.get("/rolreport/byreport/"+value.repId)).data

    if(rolesbyreport){
      
      let r=[]
      
      for(let i=0; i<rolesbyreport.length;i++){
        r.push(rolesbyreport[i].rolId)
      }
      setRolesselect(r)

    } 
    
  }

  const showConfirm = async (value) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `¿Desea eliminar el Reporte "${value.repName}" ?`,
      onOk() { destroyRol(value) },
      onCancel() { },
    });
  }

  const destroyRol = async (value) => {  
    
    let result = (await axios.delete('/report/'+ value.repId))

    if(result.data.message == 'Error al eliminar'){
      message.error(result.data.message)
    }else{
      message.success("Reporte eliminado con éxito"  )
      fillTable()
    }
  }

  const action = (value) => {

    return(
      <>
             <Tooltip title="Ver Reporte">
                <EyeOutlined style={{color:"#1890FF", alignItems:'center', marginRight:'20px'}} onClick={() =>seeReportModal(value.repName, value.repCompany, value.repUrl ) }/>
            </Tooltip>      
            <Tooltip title="Editar Reporte"> 
                <EditOutlined style={{color:"#1890FF", marginRight:'20px' }} onClick={() => setEdit(value)} />
            </Tooltip>
            <Tooltip title="Eliminar Reporte">
                <DeleteOutlined style={{color:"#1890FF" }} onClick={() => showConfirm(value)}/>
            </Tooltip>
            
          
        
        </>
      )
    }

    const actionRoles  = (value) => {
      
      let rol = ''
      for(let i=0; i < value.roles.length; i++){
        (rol == '')? rol = value.roles[i] : rol = `${rol}, ${value.roles[i]}`
      }
      return rol
    }

  const columns = [
    {
        title: 'Compañía',
        dataIndex: 'repCompany',
        key: 'repCompany',
        align: 'left',
        ...getColumnSearchProps('repCompany','Compañía'),
  
      },
    {
      title: 'Nombre',
      dataIndex: 'repName',
      key: 'repName',
      align: 'left',
      ...getColumnSearchProps('repName','Nombre'),
    },    
    {
      title: 'Descripción',
      dataIndex: 'repDescription',
      key: 'repDescription',
      align: 'left',
      ...getColumnSearchProps('repDescription','Descripción'),
    },
    {
      title: 'Roles',
      dataIndex:'nameRoles',
      key: 'nameRoles',
      align: 'left',
      ...getColumnSearchProps('nameRoles','Roles'),
    },    
    {
      title: 'Estatus',
      dataIndex: 'repStatus',
      key: 'repStatus',
      align: 'center',
      render: repStatus => {
          if(repStatus === 1){
            return <Tag color='green' key={repStatus}> ACTIVO </Tag>
          }else{
            return<Tag color='red' key={repStatus}> INACTIVO </Tag>
          }
      },
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.repStatus - b.repStatus
      

},{
  title: 'Acciones',
  key: 'action',
  render:action
}
];

  return (
    <ConfigProvider locale={esp}>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 800, y: 400 }}
        style={{ paddingTop: "1%", width: "100%", height: "70%" }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />
      <ModalReport modalReport={modalReport} setModalReport={setModalReport} dataReport={dataReport} />

      {/* Editar Report */}
      <ModalEditReport setVisible = {setVisible} visible={visible} toEdit={toEdit} setToEdit={setToEdit} 
      rolesselect={rolesselect} setRolesselect={setRolesselect} setConnErr={setConnErr} selectProps={selectProps}
      Reload={Reload} fillTable={fillTable}
      />

      {/* Add Repor */}
      <Modal
        style={{ top: 20 }}
        visible={visibleModal}
        title="Agregar Reporte"
        okText="Agregar"
        cancelText="Cancelar"
        onOk={onOkAddReport}
        onCancel={() => { 
          fillTable();
          setVisibleModal(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="repName" label="Nombre">
            <Input placeholder="Nombre..." />
          </Form.Item>
          <Form.Item name="repDescription" label="Descrición">
            <TextArea rows={2} placeholder="Descrición..." />
          </Form.Item>
          <Form.Item name="repCompany" label="Compañía">
            <Select placeholder="Seleccionar">
              <Select.Option value="Mayoreo">Mayoreo</Select.Option>
              <Select.Option value="Mundipartes">Mundipartes</Select.Option>
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
            <Select placeholder="Seleccionar" {...selectProps} />
          </Form.Item>
          <Form.Item name="repStatus" label="Estatus">
            <Select placeholder="Seleccionar">
              <Select.Option value="1">Activo</Select.Option>
              <Select.Option value="0">Inactivo</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default TableList;
