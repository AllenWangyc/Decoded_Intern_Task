import { Layout, Typography, Button } from 'antd';
import './index.css'
import { Navigation, SideMenu } from '@/components';
import { Generate } from '@/pages';

const { Content } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <Layout className='P-app'>
      <Navigation />
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