import { validateToken } from "../../src/utils/checktoken";
import { jest, describe, it, expect } from "@jest/globals";

import jwt from "jsonwebtoken";



describe('validateToken', () => {
  const secretKey = process.env.JWT_SECRET||"secret";

  it('devrait retourner valid: true pour un token valide', () => {
    
    const payload = { id: '123', email: 'test@test.com' };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    const result = validateToken(token);

   
    expect(result.valid).toBe(true);
    expect(result.decoded).toHaveProperty('id', '123');
    expect(result.decoded).toHaveProperty('email', 'test@test.com');
  });

  it('devrait retourner valid: false pour un token invalide', () => {
   
    const invalidToken = 'thisisnotavalidtoken';

   
    const result = validateToken(invalidToken);

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid or expired token');
  });

  it('devrait retourner valid: false pour un token expiré', () => {
   
    const payload = { id: '123', email: 'test@test.com' };
    const expiredToken = jwt.sign(payload, secretKey, { expiresIn: '1ms' });

    
    setTimeout(() => {
      
      const result = validateToken(expiredToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid or expired token');
    }, 10); 
  });
});
