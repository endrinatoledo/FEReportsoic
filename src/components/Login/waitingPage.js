import React, { Component } from "react";
import { Result, Button } from 'antd';

function logout() {
    localStorage.removeItem("notReg");
    localStorage.removeItem("status");
    window.location.href="/"
  }
class View extends Component {
    render() {
      return (
        <Result
            status="error"
            title={"Usuario no Autorizado"}
            subTitle="¡Contacte con el personal encargado y solicite su autorización en la aplicación!"
            extra={[
                <Button type="primary" key="console" onClick={logout}>
                    Salir
                </Button>
            ]}
        />)
    }
}
export default View;