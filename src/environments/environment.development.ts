export const environment = {
  production: false,
  // baseUrl: 'http://192.168.200.169/freelancer/winorhelpbackend',// SERVER HOST,
    baseUrl: 'http://localhost:8080/winorhelpbackend',
  STORAGE_KEY: '@WINHELP_STORAGE',
  emailPattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  mobilePattern: /^[0]?[1234567890]\d{9}$/,
  SALT_SECRET: '@WINHELP!DEC_2024~'
};