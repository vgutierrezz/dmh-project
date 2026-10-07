import { IRecord } from '../../components';

export const parseRecordContent = (record: any, variant: any): IRecord => {
  return {
    content: { ...record },
    variant,
  };
};

export function parseJwt(token: string) {
  if (!token || typeof token !== 'string') {
    return null;
  }
  const base64Url = token.split('.')[1];
  if (!base64Url) {
    return null;
  }

  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return null;
  }
}
