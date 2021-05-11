import React, { useState } from 'react';
import { Layout, Menu, Typography, Divider, SettingFilled } from 'antd';
import 'antd/dist/antd.css';
// Components
import REPORTS from '../Reports/reports'
import REPORTSADMIN from '../Admin/Reports/reportAdmin'
import ROLESADMIN from '../Admin/Roles/rolesAdmin'
import USERSADMIN from '../Admin/Users/usersAdmin'
import CHANGEPASSWORD from '../Admin/Users/changePassword'

// Icons
import { LogoutOutlined,  FileTextOutlined,UserOutlined, LockOutlined } from '@ant-design/icons';
const logoMayoreo = require('../../assets/img/login.png')
require('../../assets/css/custom.css')
require('../../assets/css/febeca.css');
const styles = {
  logo: logoMayoreo,
  divider: '#01a2d8'
}
//localStorage.getItem("clientName").toUpperCase()
const { Title } = Typography;
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const SiderMenu = () => {

  const [selected, setSelected] = useState(String(localStorage.getItem('nav') === null ? (String(localStorage.getItem("usrRol")) != '1' ? 1 : 2) : localStorage.getItem('nav')))
  const getComponent = (select) =>{

    switch (String(select)) {
      
      case '1':
        return <REPORTS divider={styles.divider} />;  
        case '2':
        return <REPORTSADMIN divider={styles.divider} />;  
        case '3':
          return <ROLESADMIN divider={styles.divider} />;  
        case '4':
            return <USERSADMIN divider={styles.divider} />; 
        case '5':
            return <CHANGEPASSWORD divider={styles.divider} />;
      default:
        return <REPORTS handler={setSelected} divider={styles.divider} />;
      }
    }
  const selectNav = (value) => {
    localStorage.setItem('nav', value)
    setSelected(value)
    }
  const logout = () => {
    window.location.href="/"
    localStorage.removeItem("usrId");
    localStorage.removeItem('nav');
    localStorage.removeItem("usrCompany");
    localStorage.removeItem("usrEmail");
    localStorage.removeItem("usrName");
    localStorage.removeItem("usrLastName");
    localStorage.removeItem("usrRol");
    localStorage.removeItem("usrStatus");       
    }

  return (
    <Layout>
      <Sider 
      style={{backgroundColor:'rgb(239, 239, 239)'}}
        breakpoint="lg" collapsedWidth="0"
        onBreakpoint={broken => {}}
        onCollapse={(collapsed, type) => {}}
        >
        <a href="/">
          <img src={styles.logo} style={{paddingTop: "20px", paddingLeft:"20px", paddingBottom:"20px", maxWidth: '175px'}} alt="logo" />
          </a>
        <Menu  style={{backgroundColor:'rgb(239, 239, 239)'}} mode="inline" defaultSelectedKeys={selected} >
          {String(localStorage.getItem("usrRol")) != 1 ? (
            <Menu.Item icon={<FileTextOutlined />} key="1" onClick={() => selectNav(1)} className="customclass">
              Reportes
            </Menu.Item>
            ) : null}
            {String(localStorage.getItem("usrRol")) == 1 ? (
            <Menu.Item icon={<FileTextOutlined />} key="2" onClick={() => selectNav(2)} className="customclass">
              Reportes
            </Menu.Item>
            ) : null}
            {String(localStorage.getItem("usrRol")) == 1 ? (
            <Menu.Item icon={<LockOutlined />} key="3" onClick={() => selectNav(3)} className="customclass">
              Roles
            </Menu.Item>
            ) : null}

            {String(localStorage.getItem("usrRol")) == 1 ? (
              <Menu.Item icon={<UserOutlined />} key="4" onClick={() => selectNav(4)} className="customclass">
                Usuarios
              </Menu.Item>
              ) : null}
              <Menu.Item icon={<LockOutlined />} key="5" onClick={() => selectNav(5)} className="customclass">
                Cambiar Contraseña
              </Menu.Item>


            
            
          <Menu.Item key="exit" icon={<LogoutOutlined />} className="customclass" onClick={logout}>
            Salir
            </Menu.Item>
          </Menu>
        </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ paddingRight:0, paddingLeft:0}}>
          
          <Title level={4} style={{minHeight: '10%', paddingTop: "10px", paddingLeft:"20px", paddingBottom:"20px" }}> Sistema de Reportes OIC
          <p></p>
          
          <Divider style={{ color:'#999999', backgroundColor:'#999999', height: 5, marginTop: 10 }} />
          </Title>
          
          </Header>
          
        <Content
          className="site-layout-background"
          style={{            
            padding: 24,
            minHeight: '90%',
            flex: 'none',
          }}>
            
          {getComponent(selected)}
          </Content>
        </Layout>
      </Layout>
    );
  }
//textAlign: 'center',
export default SiderMenu
