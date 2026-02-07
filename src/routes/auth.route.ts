import { Router } from 'express';
import { signUp, signIn } from '../controllers';
import { validateRequest } from '../middleware/validationMiddleware';
import { signInSchema, signUpSchema } from '../validation-schema/auth.schema';

const authRoute = Router();

// =============================================================================
// SWAGGER TAGS
// =============================================================================

/**
 * @swagger
 * tags:
 * name: Auth
 * description: User authentication and registration
 */

// =============================================================================
// AUTH ROUTES
// =============================================================================

/**
 * @swagger
 * /auth/signUp:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [username, email, password]
 * properties:
 * username:
 * type: string
 * example: "Chibuikem"
 * email:
 * type: string
 * format: email
 * example: "dex@example.com"
 * password:
 * type: string
 * format: password
 * example: "securePassword123"
 * role:
 * type: string
 * enum: [ADMIN, USER]
 * default: USER
 * example: "USER"
 * responses:
 * 201:
 * description: User registered successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "User created successfully"
 * data:
 * type: object
 * properties:
 * id:
 * type: string
 * email:
 * type: string
 * 400:
 * description: Validation error or missing fields
 * 409:
 * description: Email already exists
 */
authRoute.post('/auth/signUp', validateRequest(signUpSchema), signUp);

/**
 * @swagger
 * /auth/signIn:
 * post:
 * summary: Log in an existing user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, password]
 * properties:
 * email:
 * type: string
 * format: email
 * example: "dex@example.com"
 * password:
 * type: string
 * format: password
 * example: "securePassword123"
 * responses:
 * 200:
 * description: Login successful
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "Login successful"
 * token:
 * type: string
 * description: JWT Bearer token
 * example: "eyJhbGciOiJIUzI1NiIsInR..."
 * 401:
 * description: Invalid email or password
 */
authRoute.post('/auth/signIn', validateRequest(signInSchema), signIn);

export { authRoute };
