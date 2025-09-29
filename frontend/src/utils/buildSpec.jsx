/**
 * 决定菜单类型：在本任务中只需要二选一（不做 hybrid）
 * 规则：存在至少 1 个角色 → 用 roles；否则若存在功能 → 用 features；再不行就 fallback 到 features
 */
function decideMenuType(aiParsed = {}) {
  const roles = (aiParsed.roles || []).filter(Boolean);
  const features = (aiParsed.features || []).filter(Boolean);
  if (roles.length >= 1) return 'roles';
  if (features.length >= 1) return 'features';
  return 'features';
}

/**
 * 从 aiParsed.entityFields 生成前端表单规范数组
 * @param {object} aiParsed - 后端 AI 解析结果
 * 期望结构：
 *   aiParsed.entities: string[]
 *   aiParsed.entityFields: { [entityName]: Field[] }
 *   Field: { name, label, type, refEntity?, options? }
 *
 * 兜底策略：
 * - 若某实体没有给出字段，则生成 2 个通用字段（Name/Description）
 * - 字段仅做轻量规范化（去空、限制数量）
 */
function buildForms(aiParsed = {}) {
  const entities = (aiParsed.entities || []).filter(Boolean);
  const fieldsMap = aiParsed.entityFields || {};
  const forms = [];

  entities.forEach((ent) => {
    const given = Array.isArray(fieldsMap[ent]) ? fieldsMap[ent] : [];

    // 轻量清洗：去空、截断到 3 个字段
    const cleaned = given
      .filter(Boolean)
      .slice(0, 3)
      .map((f) => ({
        name: String(f.name || '').trim() || `${ent.toLowerCase()}_field`,
        label: String(f.label || '').trim() || 'Field',
        type: String(f.type || 'text').trim(),
        // 仅当 type==='select' 时保留 refEntity（其合法性由后端已保证）
        ...(f.type === 'select' && f.refEntity ? { refEntity: f.refEntity } : {}),
        // 若后端给了静态 options，这里原样透传
        ...(Array.isArray(f.options) ? { options: f.options } : {})
      }));

    // 兜底：AI 未提供字段时，给一个非常小的通用表单
    const fallback =
      cleaned.length > 0
        ? cleaned
        : [
          { name: `${ent.toLowerCase()}_name`, label: 'Name', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' }
        ];

    forms.push({
      entity: ent,
      fields: fallback,
      ctaLabel: 'Save' // 默认文案；如用 features 菜单会在后面覆盖
    });
  });

  return forms;
}

/**
 * 把 aiParsed 转换为前端可直接渲染的 uiSpec
 * uiSpec 结构：
 * {
 *   appName: string,
 *   menu: { type:'roles'|'features', items: string[] },
 *   forms: Array<{ entity, fields, ctaLabel }>,
 *   roleEntityMap: Record<string, string[]>,
 *   featureEntityMap: Record<string, string[]>
 * }
 */
function buildUiSpec(aiParsed = {}) {
  // 1) 基础字段规范化
  const appName = aiParsed.appName || 'My App';
  const roles = (aiParsed.roles || []).filter(Boolean);
  const features = (aiParsed.features || []).filter(Boolean);

  const roleEntityMap = aiParsed.roleEntityMap || {};
  const featureEntityMap = aiParsed.featureEntityMap || {};

  // 2) 决策菜单类型
  const menuType = decideMenuType(aiParsed);
  const menu =
    menuType === 'roles'
      ? { type: 'roles', items: roles }
      : { type: 'features', items: features };

  // 3) 生成表单规范（直接使用 AI 返回的 entityFields）
  const forms = buildForms(aiParsed);

  // 4) 如果菜单是 features：把命中的实体表单 CTA 文案改为该 feature（更贴合语义）
  if (menu.type === 'features') {
    (menu.items || []).forEach((feat) => {
      const entitiesForFeat = featureEntityMap[feat] || [];
      entitiesForFeat.forEach((ent) => {
        const spec = forms.find(
          (f) => f.entity.toLowerCase() === String(ent).toLowerCase()
        );
        if (spec) spec.ctaLabel = feat; // 例如 'Create Course' / 'Enroll Student'
      });
    });
  }

  // 5) 返回 uiSpec
  return {
    appName,
    menu,            // { type, items }
    forms,           // [{ entity, fields[], ctaLabel }]
    roleEntityMap,   // 点击角色 → roleEntityMap[role] = [entities...]
    featureEntityMap // 点击功能 → featureEntityMap[feature] = [entities...]
  };
}

/**
 * 根据当前选中的菜单项（label）和菜单类型，取出应该展示的实体列表
 * - roles 菜单：使用 roleEntityMap
 * - features 菜单：使用 featureEntityMap
 * - 兜底：返回空数组（由上层决定是否展示全部或空态）
 */
function getEntitiesForSelection(uiSpec, selectedLabel) {
  if (!uiSpec || !selectedLabel) return [];
  const { menu, roleEntityMap = {}, featureEntityMap = {} } = uiSpec;

  if (menu?.type === 'roles') {
    return roleEntityMap[selectedLabel] || [];
  }
  if (menu?.type === 'features') {
    return featureEntityMap[selectedLabel] || [];
  }
  return [];
}

export { buildUiSpec, decideMenuType, getEntitiesForSelection };
export default buildUiSpec;
