export const API_PORT = 3000;

export enum ApplicationServiceURL {
  Users = 'http://localhost:3340/api/users',
  Shop = 'http://localhost:3341/api/shop/products',
  Files = 'http://localhost:3342/api/files',
}

export const ClientConfig = {
  HttpMaxRedirects: 5,
  HttpTimeout: 3000,
  Name: 'Guitar Shop',
  Url: 'http://localhost:5173',
} as const;
