export function decideMenuType(parsed) {
  const roles = Array.isArray(parsed.roles) ? parsed.roles.filter(Boolean) : [];
  const features = Array.isArray(parsed.features) ? parsed.features.filter(Boolean) : [];

  // More than 1 roles
  if (roles.length > 1) return "roles";

  // The number of role is 1 and have more than 1 features
  if (roles.length === 1 && features.length >= 2) return "features";

  // There is no roles but have features
  if (roles.length === 0 && features.length > 0) return "features";

  // Default case
  return "features";
}
