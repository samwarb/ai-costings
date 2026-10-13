// Quote titles follow the selected Workspace project when the costing has no outlet name.
export function workspaceQuoteSiteName(siteName, projectName) {
  return (typeof siteName === 'string' ? siteName.trim() : '') ||
    (typeof projectName === 'string' ? projectName.trim() : '') ||
    'Unassigned costing';
}
