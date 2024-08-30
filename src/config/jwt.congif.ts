export const jwt_config = {
    access_token_secret: process.env.JWT_ACCESS_SECRET,
    expired: process.env.JWT_EXPIRED,
    refresh_token_secret: process.env.JWT_REFRESH_SECRET,
  };