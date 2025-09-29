import { Layout, Menu } from "antd";
import { BuildOutlined, HistoryOutlined } from "@ant-design/icons"

const { Sider } = Layout;
const items = [
  {
    label: "Generate",
    key: "1", //
    icon: <BuildOutlined />
  },
  {
    label: "History",
    key: "2",
    icon: <HistoryOutlined />
  },
]

const SideMenu = () => {
  return (
    <Sider
      className="C-sider"
      theme="light"
      breakpoint="lg"
      collapsedWidth="0" // collapsed when width reach breakpoint
    >
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys='1' // hard coding
      />
    </Sider>
  )
}

export default SideMenu;