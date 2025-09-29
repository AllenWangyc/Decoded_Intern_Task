import { Menu } from "antd";

/**
 * General AppMenu component, which is a part of generated mock UI
 * @param {Object} props
 * @param {Object} props.spec - aiParsed resource returned by backend
 * @param {string} props.selectedKey
 * @param {function} props.onSelect - callback function when the menu item is clicked
 */
const AppMenu = ({ spec, selectedKey, onSelect }) => {
  if (!spec) return null;

  const { menu } = spec;

  const items = (menu.items || []).map((item, index) => ({
    key: `${item}`,
    label: item
  }))

  const handleClick = (info) => {
    const clickedItem = items.find(it => it.key === info.key);
    if (onSelect) {
      onSelect(info.key, clickedItem?.label);
    }
  };

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onClick={handleClick}
      items={items}
    />
  );
};

export default AppMenu;
