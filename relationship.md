## Create Category and SubCategory relation

To create a parent-child relationship between categories and subcategories in NestJS using Prisma and PostgreSQL, you can follow these steps:

1. Create a new NestJS project using the Nest CLI command nest new project-name.
2. Install the necessary dependencies using npm install @nestjs/typeorm typeorm pg @nestjsx/crud @nestjs/swagger.
3. Set up your PostgreSQL database and configure your Prisma ORM by creating a new file called prisma/schema.prisma.
4. Define your database schema in schema.prisma using the following code:

```js
model Category {
  id        Int      @id @default(autoincrement())
  name      String
  parentId  Int?
  children  Category[] @relation("SubCategory", references: [id])
  parent    Category? @relation("SubCategory", fields: [parentId])
}
```
This model definition creates a self-referential relationship between the Category model and itself, where each category can have zero or one parent category, and zero or many child categories.

5. Run the following command in your terminal to generate the Prisma client:

```bash
npx prisma generate
```
This will generate the necessary TypeScript typings for your database schema and allow you to interact with the database from your NestJS application.

6. Create a new NestJS controller using the nest g controller category command.

7. In your category.controller.ts file, import the necessary dependencies and inject the Prisma client into the controller:

```js
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Category, PrismaClient } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly prisma: PrismaClient) {}
  
  // Controller actions will go here
}
```
8. Implement a GET endpoint to retrieve all categories and their subcategories:
```js
@Get()
async findAll(): Promise<Category[]> {
  const categories = await this.prisma.category.findMany({
    include: { children: { include: { children: true } } },
  });
  return categories;
}
```
This endpoint uses the findMany method to retrieve all categories from the database and includes their children and grandchildren using the Prisma ORM include syntax.

9. Implement a POST endpoint to create a new category:

```js
@Post()
async create(@Body() categoryData: Category): Promise<Category> {
  const category = await this.prisma.category.create({
    data: categoryData,
  });
  return category;
}
```

This endpoint creates a new category in the database using the create method and returns the newly created category.

10. Implement a GET endpoint to retrieve a specific category by ID:

```js
@Get(':id')
async findOne(@Param('id') id: string): Promise<Category> {
  const category = await this.prisma.category.findUnique({
    where: { id: parseInt(id) },
    include: { children: { include: { children: true } } },
  });
  return category;
}
```


## Many-to-Many relationship between users and roles
In a NestJS application using Prisma and PostgreSQL, you can create a many-to-many relationship between users and roles by defining a join table.

1. Define your User and Role models in Prisma. For example, in your schema.prisma file:

```bash
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String
  roles     Role[]  @relation("UserRoles")
}

model Role {
  id        Int     @id @default(autoincrement())
  name      String
  users     User[]  @relation("UserRoles")
}
```

2. Add a join table to represent the many-to-many relationship between users and roles. For example, in your schema.prisma file:

```bash 

model UserRole {
  id        Int     @id @default(autoincrement())
  userId    Int
  roleId    Int
  createdAt DateTime @default(now())

  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
  
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role    @relation(fields: [roleId], references: [id], onDelete: Cascade)
}

```

3. Update your User and Role models to use the join table. In your User model:

```bash
model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique
  name      String
  userRoles UserRole[] @relation("UserRoles")
  roles     Role[]     @relation("UserRoles", fields: [userRoles], references: [roleId])
}
```

In your Role model:

```bash
model Role {
  id        Int        @id @default(autoincrement())
  name      String
  userRoles UserRole[] @relation("UserRoles")
  users     User[]     @relation("UserRoles", fields: [userRoles], references: [userId])
}
```

4. Generate Prisma client to create the tables in the database:

```bash
npx prisma generate
```

5. Migrate the database:

```bash
npx prisma migrate dev --name initial
```

Now you can use Prisma client to create and query users and roles with their respective many-to-many relationships.

For example, to create a new user with roles:


```js
const user = await prisma.user.create({
  data: {
    email: 'john.doe@example.com',
    name: 'John Doe',
    roles: {
      connect: [
        { id: 1 }, // role ID 1
        { id: 2 }, // role ID 2
      ],
    },
  },
});
```

And to query a user with their roles:

```js
const userWithRoles = await prisma.user.findUnique({
  where: { id: 1 }, // user ID 1
  include: { roles: true },
});
```


For example, to delete a role with ID 1 and all related UserRole rows, you can use the Prisma client:
```js
const deletedRole = await prisma.role.delete({
  where: { id: 1 },
});
```