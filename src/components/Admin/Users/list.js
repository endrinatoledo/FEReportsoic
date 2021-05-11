import React, {useState,useEffect} from 'react';
import { Table, ConfigProvider, Tag,Input,Button,Space, Modal,message,Tooltip   } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined,RedoOutlined  } from '@ant-design/icons';
import ModalEditUser from './modalEditUser'

import Highlighter from 'react-highlight-words';
import esp from 'antd/es/locale/es_ES';
const axios = require('../../../utils/request').default;

const TableList = ({ dataSource, setConnErr,fillData,optionsRoles }) => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [visibleEditUser, setVisibleEditUser] = useState(false);
  const { confirm } = Modal;

  const [toEdit, setToEdit] = useState({usrName: '', usrLastName: '', usrEmail:'',usrPassword:'',usrCompany: '', usrRol: '',usrStatus:''});

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

  const resetPassword = (value)=>{

    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `¿Desea Reestablecer la contraseña de "${value.usrName}" ?`,
      onOk() { resetPasswordConfirm(value) },
      onCancel() { fillData() },
    });    
  }

  const resetPasswordConfirm = async (value) => {
    let result = (await axios.put('/updatePassword/'+ value.usrId, { 
    usrPasswordDefault: true
    }))

    if(result.data.ok == true){
      message.success(result.data.message)
    }else{
      message.error(result.data.message)
    }

  }

  const action = (value) => {

    return(
      <>     
            <Tooltip title="Editar Usuario"> 
                <EditOutlined style={{color:"#1890FF", marginRight:'20px' }} onClick={() => setEdit(value)} />
                {/*  */}
            </Tooltip>
            <Tooltip title="Reestablecer Contraseña">
              <RedoOutlined style={{color:"#1890FF", marginRight:'20px' }} onClick={() => resetPassword(value)}/>            
            </Tooltip>

            
            <Tooltip title="Eliminar Usuario">
                <DeleteOutlined style={{color:"#1890FF" }} onClick={() => showConfirm(value)}/>                
            </Tooltip>
            
          
        
        </>
      )
    }

    const showConfirm = async (value) => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: `¿Desea eliminar el Reporte "${value.usrName}" ?`,
        onOk() { destroyRol(value) },
        onCancel() { fillData() },
      });
    }

    const destroyRol = async (value) => {  
      let result = (await axios.delete('/user/'+ value.usrId))
  
      if(result.data.message == 'Error al eliminar usuario'){
        message.error(result.data.message)
      }else{
        message.success(result.data.message)
        fillData()
      }
    }

    function setEdit(value) {      
        setToEdit({...value, usrStatus: (value.usrStatus == 1)?'Activo':'Inactivo'})
        setVisibleEditUser(true)
        }


  const columns = [
    {
        title: 'Compañía',
        dataIndex: 'usrCompany',
        key: 'usrCompany',
        align: 'left',
        ...getColumnSearchProps('usrCompany','Compañía')
  
      },
    {
        title: 'Nombre',
        dataIndex: 'usrName',
        key: 'usrName',
        align: 'left',
        ...getColumnSearchProps('usrName','Nombre')
  
      },
    {
      title: 'Apellido',
      dataIndex: 'usrLastName',
      key: 'usrLastName',
      align: 'left',
      ...getColumnSearchProps('usrLastName','Apellido')
    },    
    {
      title: 'Email',
      with:200,
      dataIndex: 'usrEmail',
      key: 'usrEmail',
      align: 'left',
      
      ...getColumnSearchProps('usrEmail','Email')

    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      align: 'left',
      ...getColumnSearchProps('rol','Rol'),
    },    
    {
      title: 'Estatus',
      dataIndex: 'usrStatus',
      key: 'usrStatus',
      align: 'center',
      render: usrStatus => {
          if(usrStatus === 1){
            return <Tag color='green' key={usrStatus}> ACTIVO </Tag>
          }else{
            return<Tag color='red' key={usrStatus}> INACTIVO </Tag>
          }
      },
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.usrStatus - b.usrStatus
      

},{
  title: 'Acciones',
  key: 'action',
  render:action
}
];

  return (
    <ConfigProvider locale={esp}>
       <Table
       tableLayout='auto'
        dataSource={dataSource} 
        columns={columns}
        scroll={{ x: 1000, y: 500 }} 
        style={{ paddingTop: "1%", width: "100%", height: "70%" }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />
      {/* Editar Repor */}
      <ModalEditUser visibleEditUser={visibleEditUser} setVisibleEditUser={setVisibleEditUser}
        fillData={fillData} toEdit={toEdit} setConnErr={setConnErr} optionsRoles={optionsRoles}
         />
      
    </ConfigProvider> 
  );
}

export default TableList;
