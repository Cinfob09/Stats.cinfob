// src/lib/meta.ts

export const initMetaSDK = () => {
  return new Promise((resolve) => {
    (window as any).fbAsyncInit = function () {
      (window as any).FB.init({
        appId: '869094989394148', // Mets ton ID ici
        cookie: true,
        xfbml: true,
        version: 'v21.0',
      });
      resolve(true);
    };
  });
};

export const loginWithMeta = () => {
  return new Promise((resolve, reject) => {
    (window as any).FB.login(
      (response: any) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject('User cancelled login');
        }
      },
      {
        // Ces scopes doivent correspondre EXACTEMENT à ceux activés dans ton dashboard Meta
        scope:
          'pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,read_insights',
      }
    );
  });
};
