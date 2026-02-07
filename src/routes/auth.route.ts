import { Router } from 'express';
import { signUp, signIn } from '../controllers';
import { validateRequest } from '../middleware/validationMiddleware';
import { signInSchema, signUpSchema } from '../validation-schema/auth.schema';

const authRoute = Router();

authRoute.post('/auth/signUp', validateRequest(signUpSchema), signUp);
authRoute.post('/auth/signIn', validateRequest(signInSchema), signIn);

export { authRoute };
