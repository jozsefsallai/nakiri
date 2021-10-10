import config from '@/config';

const buildUrl = (path: string = ''): string => {
  const pathWithSlash = path[0] === '/' ? path : `/${path}`;

  const portWithColon = config.app.port ? `:${config.app.port}` : '';

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : `${config.app.protocol}://${config.app.domain}${portWithColon}`;

  return `${baseUrl}${pathWithSlash}`;
};

export default buildUrl;
