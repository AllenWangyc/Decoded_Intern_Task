import { Layout, Button, Typography } from 'antd';
import logo from '@/assets/logo.png'
import './index.css'

const { Header } = Layout;
const { Title } = Typography;

const Navigation = () => {
  return (
    <Layout className='C-navi'>
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
  )
}

export default Navigation;