import React from 'react';
import { Layout, Typography, Button } from 'antd';
import logo from '../assets/logo.png'
import './App.css'

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <Layout className='P-app'>
      <Layout className='header-wrapper'>
        <Header className='header'>
          <div className='title-wrapper'>
            <div className='logo-container'>
              <img src={logo} alt="" className='logo' />
            </div>
            <div className='title-container'>
              <Title level={3} className='title'>Decoded.</Title>
            </div>
          </div>
          <div className='button-container'>
            <Button
              className='button'
              size='large'
              color='default'
              variant='solid'
            >
              Login
            </Button>
          </div>
        </Header>
      </Layout>
      <Layout className='main-wrapper'>
        <Sider>
          Sider
        </Sider>
        <Content>
          Content
        </Content>
      </Layout>
    </Layout>
  )
}

export default App;