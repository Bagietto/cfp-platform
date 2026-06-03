import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('redirects the root path to the CFP page', () => {
    expect(appRoutes[0]).toMatchObject({
      path: '',
      redirectTo: 'cfp',
    });
  });
});
