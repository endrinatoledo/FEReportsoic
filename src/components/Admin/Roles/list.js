import React, {useState, useEffect} from 'react';
import { Table, ConfigProvider, Typography,Tag,Input,Button,Space, Tooltip,  Modal, Form, message, Select   } from 'antd';
import { SearchOutlined, EditOutlined,DeleteOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import esp from 'antd/es/locale/es_ES';

const axios = require('../../../utils/request').default;


const { Text } = Typography;
const TableList = ({ dataSource, setVisible, setDataSource, visible, setConnErr, setVisibleModal, visibleModal}) => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [form] = Form.useForm();
  const [toEdit, setToEdit] = useState({rolName: '', rolStatus: ''});
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [toDelete, setToDelete]=useState({});
  const { confirm } = Modal;


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

  const onOkAddRol = () => {
    form
      .validateFields()
      .then(async values => {

            if(values.rolName == '' || values.rolName == null || values.rolName == undefined){
              message.error("Nombre de Rol es Requerido"  )
            }else if(values.rolStatus == '' || values.rolStatus == null || values.rolStatus == undefined){
              message.error("Estatus de Rol es Requerido"  )
            }else{

              let result = (await axios.post('/rol', values, { 
                rolName: values.rolName, 
                rolStatus: values.rolStatus
                }))

                if(result.data.message == 'Nombre de Rol ya existe'){
                  message.error(`Nombre de Rol ya existe`  )
                }else{
                  message.success("Rol creado con éxito"  )
                  fillTable()
                  setToEdit({rolName: '', rolStatus: ''})
                  setVisibleModal(false)
                  form.resetFields();

                }
  
            }

            
        
      });
  }

  const onOk = () =>{
    form
      .validateFields()
      .then(async values => {

        if(values.rolName == '' || values.rolName == null || values.rolName == undefined){ 
          message.error("Nombre de Rol es Requerido"  )
        }else if(values.rolStatus == '' || values.rolStatus == null || values.rolStatus == undefined){
        message.error("Estatus de Rol es Requerido"  )
        }else{

        }

        let result = (await axios.put('/rol/'+ toEdit.rolId, { 
          rolName: (values.rolName === undefined ? toEdit.rolName : values.rolName), 
          rolStatus: (values.rolStatus === undefined ? toEdit.rolStatus : values.rolStatus)
          }))

          if(result.data.message == 'Nombre de Rol ya existe'){
            message.error(`Nombre de Rol ya existe`  )
          }else{
            message.success("Rol editado con éxito"  )
            fillTable()
            setToEdit({rolName: '', rolStatus: ''})
            setVisible(false)
            form.resetFields();
          }      
      });

  }
  const fillTable = async () => {
    try{
      const resultRoles = (await axios.get("roles")).data
      if( resultRoles){ setDataSource(resultRoles) }else{ setConnErr(true) }
    }catch{
      setConnErr(true)
  }
}

  const  setEdit = (value) => {
    setToEdit({...value, rolStatus: (value.rolStatus == 1)?'Activo':'Inactivo'})
    setVisible(true)
    }

  const destroyRol = async (value) => {

    let result = (await axios.delete('/rol/'+ value.rolId))

    if(result.data.message == 'Error al eliminar' || 
      result.data.message == 'Error al eliminar, Rol asociado a un reporte' ||
      result.data.message == 'Error al eliminar, Rol asociado a un usuario' ){
      message.error(result.data.message)
    }else{
      message.success("Rol eliminado con éxito"  )
      fillTable()
    }
  }

  const showConfirm = async (value) => {

    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `¿Desea eliminar el Rol "${value.rolName}" ?`,
      onOk() { destroyRol(value) },
      onCancel() { },
    });
  }

  const action = (value) => {
    return(
      <>
        <Tooltip title="Editar Rol">
            <EditOutlined style={{color:"#1890FF", alignItems:'center', marginRight:'20px'}} onClick={() => setEdit(value)} />
          </Tooltip>
          <Tooltip title="Eliminar Rol">
                <DeleteOutlined style={{color:"#1890FF" }} onClick={() => { showConfirm(value); }}/>
            </Tooltip>
        
        </>
      )
    }

    useEffect(() => {
      fillTable()
    }, []);
    useEffect(() => {
      form.resetFields()
    }, [toEdit]);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'rolName',
      key: 'rolName',
      align: 'left',
      ...getColumnSearchProps('rolName','Rol'),
    },     
    {
      title: 'Estatus',
      dataIndex: 'rolStatus',
      key: 'rolStatus',
      align: 'center',
      render: (rolStatus => {
          if(rolStatus === 1){
            return <Tag color='green' key={rolStatus}> ACTIVO </Tag>
          }else{
            return<Tag color='red' key={rolStatus}> INACTIVO </Tag>
          }
      }),
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.rolStatus - b.rolStatus


},{
  title: 'Acciones',
  key: 'action',
  render: action,
  align: "center"
}
];

  return (
    <ConfigProvider locale={esp}>
      <Table dataSource={dataSource} 
      columns={columns} 
      scroll={{ x: 800, y:400 }}  
       style={{ paddingTop:'1%', width: '100%', height:'70%' }} 
      pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50']}}
      />

    <Modal visible={visible} title="Editar Rol" okText="Editar" cancelText="Cancelar" onOk={onOk}
        onCancel={() => {
             fillTable();
            setVisible(false);
            form.resetFields();
        }}>
        <Form form={form} layout="vertical" initialValues={toEdit} >
            <Form.Item name='rolName' label="Nombre" >
                <Input placeholder="Nombre..." />
            </Form.Item>
            <Form.Item name='rolStatus' label="Estatus">
                <Select placeholder="Rol">
                <Select.Option value="1">Activo</Select.Option>
                <Select.Option value="0">Inactivo</Select.Option>
                </Select>
            </Form.Item>
          </Form>     
        </Modal>
        {/* Add Rol */}
        <Modal visible={visibleModal} title="Agregar Rol" okText="Agregar" cancelText="Cancelar" onOk={onOkAddRol}
        onCancel={() => {
             fillTable();
            setVisibleModal(false);
        }}>
        <Form form={form} layout="vertical" >
            <Form.Item name='rolName' label="Nombre" >
                <Input placeholder="Nombre..." />
            </Form.Item>
            <Form.Item name='rolStatus' label="Estatus">
                <Select placeholder="Seleccionar">
                <Select.Option value="1">Activo</Select.Option>
                <Select.Option value="0">Inactivo</Select.Option>
                </Select>
            </Form.Item>
          </Form>     
        </Modal>
      </ConfigProvider>
    )
}

export default TableList;
