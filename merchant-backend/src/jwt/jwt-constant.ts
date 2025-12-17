export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'dev-secret-key',
  expiresIn: 604800000,
};
