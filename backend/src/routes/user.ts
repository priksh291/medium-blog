import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign , verify } from 'hono/jwt'
import { signupInput } from "@priksh/meduim-common";


export const userRouter = new Hono<{
Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
}}
>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if(!success){
        c.status(411)
        return c.json({
            message:"inputs are invalid"
        })
    }
    try{
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
        }
      })
      //@ts-ignore
      const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    
      return c.json({
        token: token,
        message: "User Signedup"
      })
    }
    catch(e){
      return c.json({
        message:"invalid"
      })
    }
})

userRouter.post('api/v1/user/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
  
    const user = await prisma.user.findUnique({
      where: {
        password:body.password,
        email: body.email
      }
    })
    if(!user){
      c.status(403)
      return c.json({
        message: "user not found"
      })
    }
  
    const jwt =  await sign({ id: user?.id }, c.env.JWT_SECRET)
    return c.json({
      jwt
    })
  })