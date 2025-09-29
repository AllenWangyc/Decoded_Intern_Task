import React from 'react';
import { Form, Input, InputNumber, DatePicker, Switch, Button, Space, Typography } from 'antd';

const { Text } = Typography;

/**
 * 根据 field.type 渲染对应的输入控件
 */
function FieldInput({ field }) {
  const placeholder = field.placeholder || field.label || 'Enter value';

  switch ((field.type || 'text').toLowerCase()) {
    case 'email':
      return <Input type="email" placeholder={placeholder} />;
    case 'number':
      return <InputNumber style={{ width: '100%' }} placeholder={placeholder} />;
    case 'date':
      return <DatePicker style={{ width: '100%' }} placeholder={placeholder} />;
    case 'switch':
      return <Switch />;
    case 'textarea':
      return <Input.TextArea rows={4} placeholder={placeholder} />;
    case 'text':
    default:
      return <Input placeholder={placeholder} />;
  }
}

/**
 * 简化版 EntityForm
 * - 只负责展示，不做真正表单交互
 * - 不使用受控 form 实例
 */
const EntityForm = ({ spec }) => {
  if (!spec) return null;

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
      }}
    >
      <Space style={{ marginBottom: 12 }} align="baseline">
        <Text strong>{spec.entity}</Text>
      </Space>

      <Form layout="vertical">
        {(spec.fields || []).map((f) => (
          <Form.Item
            key={f.name || f.label}
            label={f.label || f.name}
          >
            <FieldInput field={f} />
          </Form.Item>
        ))}

        <Space>
          <Button type="primary">{spec.ctaLabel || 'Save'}</Button>
        </Space>
      </Form>
    </div>
  );
};

export default EntityForm;
