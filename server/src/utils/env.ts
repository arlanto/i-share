import 'dotenv/config'

export const env = {
  APP_PORT: Number(process.env.APP_PORT),
  DB_URI: <string>process.env.DB_URI,
  COOKIE_SECRET: <string>process.env.COOKIE_SECRET,
  ACCESS_TOKEN_SECRET: <string>process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: <string>process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: <string>process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: <string>process.env.REFRESH_TOKEN_EXPIRY,
  ALLOWED_DOMAIN: <string>process.env.ALLOWED_DOMAIN,
}
