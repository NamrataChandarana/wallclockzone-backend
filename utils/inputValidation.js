import {z} from 'zod';

const stringPasswordSchema = z.string().min(8, 'Password must be at most 8 characters long');
const numberPasswordSchema = z.number().min(99999999, 'Password must be at most 8 digits long');

export const registrationInput = z.object({
    firstname: z.string(),
    lastname: z.string(),
    companyname: z.string(),
    phoneNo: z.string().length(10, 'Input must be equal to 10 digits').regex(/^\d{10}$/, 'Input must be equal to 10 digits'),
    username: z.string(),
    password: z.union([stringPasswordSchema, numberPasswordSchema], ),
    category: z.string(),
    city: z.string(),
    state: z.string(),
    address: z.string(), 
    email: z.string().email("Enter valid email"),
    website: z.string().url().optional(),
})

export const loginInput = z.object({
    email: z.string().email(),
    password: z.union([stringPasswordSchema, numberPasswordSchema])
})