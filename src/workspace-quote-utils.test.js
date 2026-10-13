import { workspaceQuoteSiteName } from './workspace-quote-utils';

describe('Workspace quote project selection', () => {
  test('uses the selected project when the costing has no site or outlet', () => {
    expect(workspaceQuoteSiteName('', 'HSBC Leeds')).toBe('HSBC Leeds');
    expect(workspaceQuoteSiteName('  ', 'BNY Manchester')).toBe('BNY Manchester');
  });
  test('preserves a specifically entered outlet name', () => {
    expect(workspaceQuoteSiteName(' Café East ', 'DHL')).toBe('Café East');
  });
  test('allows saving a costing unassigned without requesting a site name', () => {
    expect(workspaceQuoteSiteName('', '')).toBe('Unassigned costing');
    expect(workspaceQuoteSiteName(null, null)).toBe('Unassigned costing');
  });
});
