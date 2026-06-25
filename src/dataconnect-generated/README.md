# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUserData*](#listuserdata)
- [**Mutations**](#mutations)
  - [*CreateUserData*](#createuserdata)
  - [*UpdateUserData*](#updateuserdata)
  - [*DeleteUserData*](#deleteuserdata)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUserData
You can execute the `ListUserData` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserData(options?: ExecuteQueryOptions): QueryPromise<ListUserDataData, undefined>;

interface ListUserDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserDataData, undefined>;
}
export const listUserDataRef: ListUserDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserData(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserDataData, undefined>;

interface ListUserDataRef {
  ...
  (dc: DataConnect): QueryRef<ListUserDataData, undefined>;
}
export const listUserDataRef: ListUserDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserDataRef:
```typescript
const name = listUserDataRef.operationName;
console.log(name);
```

### Variables
The `ListUserData` query has no variables.
### Return Type
Recall that executing the `ListUserData` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserDataData {
  userDatas: ({
    id: UUIDString;
    contentText: string;
    createTS: TimestampString;
    updateTS: TimestampString;
  } & UserData_Key)[];
}
```
### Using `ListUserData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserData } from '@dataconnect/generated';


// Call the `listUserData()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserData(dataConnect);

console.log(data.userDatas);

// Or, you can use the `Promise` API.
listUserData().then((response) => {
  const data = response.data;
  console.log(data.userDatas);
});
```

### Using `ListUserData`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserDataRef } from '@dataconnect/generated';


// Call the `listUserDataRef()` function to get a reference to the query.
const ref = listUserDataRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserDataRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userDatas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userDatas);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUserData
You can execute the `CreateUserData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserData(vars: CreateUserDataVariables): MutationPromise<CreateUserDataData, CreateUserDataVariables>;

interface CreateUserDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserDataVariables): MutationRef<CreateUserDataData, CreateUserDataVariables>;
}
export const createUserDataRef: CreateUserDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserData(dc: DataConnect, vars: CreateUserDataVariables): MutationPromise<CreateUserDataData, CreateUserDataVariables>;

interface CreateUserDataRef {
  ...
  (dc: DataConnect, vars: CreateUserDataVariables): MutationRef<CreateUserDataData, CreateUserDataVariables>;
}
export const createUserDataRef: CreateUserDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserDataRef:
```typescript
const name = createUserDataRef.operationName;
console.log(name);
```

### Variables
The `CreateUserData` mutation requires an argument of type `CreateUserDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserDataVariables {
  contentText: string;
  createUserId: string;
  updateUserId: string;
}
```
### Return Type
Recall that executing the `CreateUserData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserDataData {
  userData_insert: UserData_Key;
}
```
### Using `CreateUserData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserData, CreateUserDataVariables } from '@dataconnect/generated';

// The `CreateUserData` mutation requires an argument of type `CreateUserDataVariables`:
const createUserDataVars: CreateUserDataVariables = {
  contentText: ..., 
  createUserId: ..., 
  updateUserId: ..., 
};

// Call the `createUserData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserData(createUserDataVars);
// Variables can be defined inline as well.
const { data } = await createUserData({ contentText: ..., createUserId: ..., updateUserId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserData(dataConnect, createUserDataVars);

console.log(data.userData_insert);

// Or, you can use the `Promise` API.
createUserData(createUserDataVars).then((response) => {
  const data = response.data;
  console.log(data.userData_insert);
});
```

### Using `CreateUserData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserDataRef, CreateUserDataVariables } from '@dataconnect/generated';

// The `CreateUserData` mutation requires an argument of type `CreateUserDataVariables`:
const createUserDataVars: CreateUserDataVariables = {
  contentText: ..., 
  createUserId: ..., 
  updateUserId: ..., 
};

// Call the `createUserDataRef()` function to get a reference to the mutation.
const ref = createUserDataRef(createUserDataVars);
// Variables can be defined inline as well.
const ref = createUserDataRef({ contentText: ..., createUserId: ..., updateUserId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserDataRef(dataConnect, createUserDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userData_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userData_insert);
});
```

## UpdateUserData
You can execute the `UpdateUserData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserData(vars: UpdateUserDataVariables): MutationPromise<UpdateUserDataData, UpdateUserDataVariables>;

interface UpdateUserDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserDataVariables): MutationRef<UpdateUserDataData, UpdateUserDataVariables>;
}
export const updateUserDataRef: UpdateUserDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserData(dc: DataConnect, vars: UpdateUserDataVariables): MutationPromise<UpdateUserDataData, UpdateUserDataVariables>;

interface UpdateUserDataRef {
  ...
  (dc: DataConnect, vars: UpdateUserDataVariables): MutationRef<UpdateUserDataData, UpdateUserDataVariables>;
}
export const updateUserDataRef: UpdateUserDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserDataRef:
```typescript
const name = updateUserDataRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserData` mutation requires an argument of type `UpdateUserDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserDataVariables {
  id: UUIDString;
  contentText: string;
  updateUserId: string;
}
```
### Return Type
Recall that executing the `UpdateUserData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserDataData {
  userData_update?: UserData_Key | null;
}
```
### Using `UpdateUserData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserData, UpdateUserDataVariables } from '@dataconnect/generated';

// The `UpdateUserData` mutation requires an argument of type `UpdateUserDataVariables`:
const updateUserDataVars: UpdateUserDataVariables = {
  id: ..., 
  contentText: ..., 
  updateUserId: ..., 
};

// Call the `updateUserData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserData(updateUserDataVars);
// Variables can be defined inline as well.
const { data } = await updateUserData({ id: ..., contentText: ..., updateUserId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserData(dataConnect, updateUserDataVars);

console.log(data.userData_update);

// Or, you can use the `Promise` API.
updateUserData(updateUserDataVars).then((response) => {
  const data = response.data;
  console.log(data.userData_update);
});
```

### Using `UpdateUserData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserDataRef, UpdateUserDataVariables } from '@dataconnect/generated';

// The `UpdateUserData` mutation requires an argument of type `UpdateUserDataVariables`:
const updateUserDataVars: UpdateUserDataVariables = {
  id: ..., 
  contentText: ..., 
  updateUserId: ..., 
};

// Call the `updateUserDataRef()` function to get a reference to the mutation.
const ref = updateUserDataRef(updateUserDataVars);
// Variables can be defined inline as well.
const ref = updateUserDataRef({ id: ..., contentText: ..., updateUserId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserDataRef(dataConnect, updateUserDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userData_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userData_update);
});
```

## DeleteUserData
You can execute the `DeleteUserData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUserData(vars: DeleteUserDataVariables): MutationPromise<DeleteUserDataData, DeleteUserDataVariables>;

interface DeleteUserDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserDataVariables): MutationRef<DeleteUserDataData, DeleteUserDataVariables>;
}
export const deleteUserDataRef: DeleteUserDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserData(dc: DataConnect, vars: DeleteUserDataVariables): MutationPromise<DeleteUserDataData, DeleteUserDataVariables>;

interface DeleteUserDataRef {
  ...
  (dc: DataConnect, vars: DeleteUserDataVariables): MutationRef<DeleteUserDataData, DeleteUserDataVariables>;
}
export const deleteUserDataRef: DeleteUserDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserDataRef:
```typescript
const name = deleteUserDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserData` mutation requires an argument of type `DeleteUserDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserDataVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUserData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserDataData {
  userData_delete?: UserData_Key | null;
}
```
### Using `DeleteUserData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserData, DeleteUserDataVariables } from '@dataconnect/generated';

// The `DeleteUserData` mutation requires an argument of type `DeleteUserDataVariables`:
const deleteUserDataVars: DeleteUserDataVariables = {
  id: ..., 
};

// Call the `deleteUserData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserData(deleteUserDataVars);
// Variables can be defined inline as well.
const { data } = await deleteUserData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserData(dataConnect, deleteUserDataVars);

console.log(data.userData_delete);

// Or, you can use the `Promise` API.
deleteUserData(deleteUserDataVars).then((response) => {
  const data = response.data;
  console.log(data.userData_delete);
});
```

### Using `DeleteUserData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserDataRef, DeleteUserDataVariables } from '@dataconnect/generated';

// The `DeleteUserData` mutation requires an argument of type `DeleteUserDataVariables`:
const deleteUserDataVars: DeleteUserDataVariables = {
  id: ..., 
};

// Call the `deleteUserDataRef()` function to get a reference to the mutation.
const ref = deleteUserDataRef(deleteUserDataVars);
// Variables can be defined inline as well.
const ref = deleteUserDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserDataRef(dataConnect, deleteUserDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userData_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userData_delete);
});
```

