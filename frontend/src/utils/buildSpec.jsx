function decideMenuType(aiParsed = {}) {
  const roles = (aiParsed.roles || []).filter(Boolean);
  const features = (aiParsed.features || []).filter(Boolean);
  if (roles.length >= 1) return 'roles';
  if (features.length >= 1) return 'features';
  return 'features';
}

/**
 * 
 * @param {object} aiParsed - AI parsed results
 * Expected structure:
 *   aiParsed.entities: string[]
 *   aiParsed.entityFields: { [entityName]: Field[] }
 *   Field: { name, label, type, refEntity?, options? }
 */
function buildForms(aiParsed = {}) {
  const entities = (aiParsed.entities || []).filter(Boolean);
  const fieldsMap = aiParsed.entityFields || {};
  const forms = [];

  entities.forEach((ent) => {
    const given = Array.isArray(fieldsMap[ent]) ? fieldsMap[ent] : [];

    // Clean
    const cleaned = given
      .filter(Boolean)
      .slice(0, 3)
      .map((f) => ({
        name: String(f.name || '').trim() || `${ent.toLowerCase()}_field`,
        label: String(f.label || '').trim() || 'Field',
        type: String(f.type || 'text').trim(),
        ...(f.type === 'select' && f.refEntity ? { refEntity: f.refEntity } : {}),
        ...(Array.isArray(f.options) ? { options: f.options } : {})
      }));

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
      ctaLabel: 'Save'
    });
  });

  return forms;
}

function buildUiSpec(aiParsed = {}) {
  // 1) Base field normalization
  const appName = aiParsed.appName || 'My App';
  const roles = (aiParsed.roles || []).filter(Boolean);
  const features = (aiParsed.features || []).filter(Boolean);

  const roleEntityMap = aiParsed.roleEntityMap || {};
  const featureEntityMap = aiParsed.featureEntityMap || {};

  // 2) Decide the menu type
  const menuType = decideMenuType(aiParsed);
  const menu =
    menuType === 'roles'
      ? { type: 'roles', items: roles }
      : { type: 'features', items: features };

  // 3) Generated forms
  const forms = buildForms(aiParsed);

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

  // 5) return uiSpec
  return {
    appName,
    menu,            // { type, items }
    forms,           // [{ entity, fields[], ctaLabel }]
    roleEntityMap,   // 点击角色 → roleEntityMap[role] = [entities...]
    featureEntityMap // 点击功能 → featureEntityMap[feature] = [entities...]
  };
}

/**
 * - roles 菜单：使用 roleEntityMap
 * - features 菜单：使用 featureEntityMap
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
