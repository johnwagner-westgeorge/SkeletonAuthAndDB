# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUserData, useUpdateUserData, useDeleteUserData, useListUserData } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUserData(createUserDataVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUserData(updateUserDataVars);

const { data, isPending, isSuccess, isError, error } = useDeleteUserData(deleteUserDataVars);

const { data, isPending, isSuccess, isError, error } = useListUserData();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUserData, updateUserData, deleteUserData, listUserData } from '@dataconnect/generated';


// Operation CreateUserData:  For variables, look at type CreateUserDataVars in ../index.d.ts
const { data } = await CreateUserData(dataConnect, createUserDataVars);

// Operation UpdateUserData:  For variables, look at type UpdateUserDataVars in ../index.d.ts
const { data } = await UpdateUserData(dataConnect, updateUserDataVars);

// Operation DeleteUserData:  For variables, look at type DeleteUserDataVars in ../index.d.ts
const { data } = await DeleteUserData(dataConnect, deleteUserDataVars);

// Operation ListUserData: 
const { data } = await ListUserData(dataConnect);


```