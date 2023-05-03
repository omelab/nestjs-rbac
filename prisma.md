## Seed
```bash
yarn prisma db seed
```

## not equal
Here is an example of a not equal query using the equals operator:

```js
const users = await prisma.user.findMany({
  where: {
    id: {
      not: {
        equals: 1, // exclude users with id = 1
      },
    },
  },
});
```

Alternatively, you can use the in operator to exclude multiple values. Here is an example:

```js
const excludedIds = [1, 2, 3];

const users = await prisma.user.findMany({
  where: {
    id: {
      not: {
        in: excludedIds, // exclude users with ids in excludedIds array
      },
    },
  },
});
```

## Dynamicaly added where conditions
To create a where condition dynamically in Prisma, you can use object spread and the optional chaining operator in JavaScript. Here is an example of how you can do it:


```js
const where: any = {};

if (name) {
  where.name = {
    contains: name,
    mode: 'insensitive',
  };
}

if (age) {
  where.age = {
    equals: age,
  };
}

const users = await prisma.user.findMany({
  where,
});
```


## One to One Relationships

```javascript
model User {
  id          Int         @id @default(autoincrement())
  name        String
  email       String      @unique
  designation Designation?
  
  @@map(name: "users")
}

model Designation {
  id          Int         @id @default(autoincrement())
  title       String
  user        User        @relation(fields: [userId], references: [id])
  userId      Int         @unique
  
  @@map(name: "designations")
}
```


## One to Many Relationship
```javascript
model User {
  id                  Int           @id @default(autoincrement())
  name                String
  email               String        @unique
  designationId       Int
  designation         Designation   @relation(fields: [designationId], references: [id])

  @@map(name: "users")
}

model Designation {
  id         Int          @id @default(autoincrement())
  title      String 
  users User[]  
  @@map(name: "designations")
}
```


## Get data with relationship
Let's say you have a User model with a many-to-many relationship to a Role model, and you want to get a user's data along with their roles:

```javascript
const userWithRoles = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    roles: true,
  },
});
```

If you only want to include specific fields from the related model, you can use an object to specify the fields you want to include:

```javascript
const userWithRoles = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    roles: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});
```
In this example, we're including only the id and name fields from the related Role model.

You can also use the include method with nested relationships. For example, if the Role model has a many-to-many relationship to a Permission model, you can include both relationships in the query:


```javascript
const userWithRolesAndPermissions = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    roles: {
      include: {
        permissions: true,
      },
    },
  },
});
```

## Help
[Handle a Many-to-Many relationship](https://blog.tericcabrel.com/many-to-many-relationship-prisma/)