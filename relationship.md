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

