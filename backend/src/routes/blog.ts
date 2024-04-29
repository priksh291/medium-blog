import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign , verify } from 'hono/jwt'


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
    Variables:{
        userId:string
    }
}
>();

blogRouter.use("/*", async (c,next) => {
    const authHeader = c.req.header("authorization") || "";
    const token = await verify(authHeader,c.env.JWT_SECRET);
    if(token){
        c.set("userId" , token.id);
        await next()
    }
    else{
        return c.json({
            message:"you are not logged in"
        })
    }
})
blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const authorId = c.get("userId")
    const blog = await prisma.blog.create({
        data:{
            title :body.title,
            content: body.content,
            authorid:Number(authorId)
        }
    })
    return c.json({
        id:blog.id
    })
})
blogRouter.put('/', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
    
        const body = await c.req.json()
    
        const blog = await prisma.blog.update({
            where:{
                id:body.id
            },
            data:{
                title :body.title,
                content: body.content
            }
        })
        return c.json({
            id:blog.id
        })
})
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.blog.findMany()
    return c.json({
        blogs
    })
})
blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
    
        const id = c.req.param("id")
        try{
            const blog = await prisma.blog.findFirst({
                where:{
                    id: Number(id)
                }
            })
            return c.json({
                blog
            })
        }
        catch(e){
            c.status(411);
            return c.json({
                message: "invalid"
            })
        }
})

