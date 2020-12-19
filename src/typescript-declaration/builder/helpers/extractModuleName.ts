export const extractModuleName = (requiredModule: string): string =>
  requiredModule.replace(/^.*[\/]/, '').replace(/\.[^/.]+$/, '');
