import { Layout } from 'antd';
import './index.css'
import { Navigation, SideMenu } from '@/components';
import { Generate } from '@/pages';

const { Content } = Layout;

const App = () => {
  return (
    <Layout className='P-app'>
      <Navigation className='navigation' />
      <Layout className='main-wrapper'>
        <SideMenu />
        <Content className='content'>
          <Generate />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App;