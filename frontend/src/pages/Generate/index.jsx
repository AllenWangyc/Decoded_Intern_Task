import "./index.css";
import { Row, Col, Typography, Input, Button, Card, Menu } from 'antd';
import { generateAPI } from "@/apis";
import { useMemo, useState, useEffect } from 'react';
import { buildUiSpec } from '@/utils/buildSpec'
import { AppMenu, EntityForm } from "@/components";

const { Title } = Typography;
const { TextArea } = Input;

const Generate = () => {
  const [inputValue, setInputValue] = useState(''); // User description input
  const [loading, setLoading] = useState(false); // Loading while request to backend
  const [uiSpec, setUiSpec] = useState(null); // Spec for Generated ai-parsed UI 
  const [selectedLabel, setSelectedLabel] = useState(null);

  // 1) 当前菜单项对应的实体列表
  const entities = useMemo(() => {
    if (!selectedLabel) return [];

    if (uiSpec.menu.type === 'roles') {
      return uiSpec.roleEntityMap[selectedLabel] || [];
    }
    // features
    return uiSpec.featureEntityMap[selectedLabel] || [];
  }, [selectedLabel]);

  const formsToRender = useMemo(() => {
    if (!entities.length) return [];
    return uiSpec.forms.filter(f =>
      entities.some(e => e.toLowerCase() === f.entity.toLowerCase())
    );
  }, [entities]);

  useEffect(() => {
    if (uiSpec?.menu?.items?.length) {
      setSelectedLabel(uiSpec.menu.items[0]);
    }
  }, [uiSpec]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    try {
      setLoading(true);
      const res = await generateAPI({ description: inputValue });
      console.log(res);
      const { aiParsed } = res.data;

      const spec = buildUiSpec(aiParsed);
      console.log(spec);

      setUiSpec(buildUiSpec(aiParsed));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Ant Design size regulation: xs: <576px, md: >=768px
  return (
    <div className="P-generate">
      <div className="desc-container">
        <Title className="desc">Describe your app idea, and let AI build a mock UI for you.</Title>
      </div>
      <Row className="section-wrapper" gutter={[24, 24]}>
        <Col className="left-section" xs={24} md={12}>
          <TextArea
            className="input"
            rows={6} placeholder="e.g. A course manager for students and teachers..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="btn-container">
            <Button
              type="primary"
              color="default"
              variant="solid"
              size="large"
              className="btn"
              loading={loading}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>

        </Col>
        <Col className="right-section" xs={24} md={12}>
          <Card className="generation">
            {uiSpec ? (
              <div>
                <AppMenu
                  spec={uiSpec}
                  selectedKey={selectedLabel}
                  onSelect={(key, label) => {
                    console.log("Selected:", key);
                    setSelectedLabel(key);
                  }}
                />
                <div style={{ marginTop: 16 }}>
                  {formsToRender.length ? (
                    formsToRender.map(spec => (
                      <EntityForm key={spec.entity} spec={spec} />
                    ))
                  ) : (
                    <p>Please select a menu item to see forms.</p>
                  )}
                </div>

              </div>

            ) :
              'Generated mock UI will appear here…'
            }
          </Card>
        </Col>
      </Row>

    </div>
  )
}

export default Generate;