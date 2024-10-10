import jwt from 'jsonwebtoken';


export const validateToken = (token: string): { valid: boolean; decoded?:{email:string,id:string}, error?: string } => {
  try {
    const secretKey = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secretKey) as {email:string,id:string} ;
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid or expired token' };
  }
};