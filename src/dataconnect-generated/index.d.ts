import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateUserDataData {
  userData_insert: UserData_Key;
}

export interface CreateUserDataVariables {
  contentText: string;
  createUserId: string;
  updateUserId: string;
}

export interface DeleteUserDataData {
  userData_delete?: UserData_Key | null;
}

export interface DeleteUserDataVariables {
  id: UUIDString;
}

export interface ListUserDataData {
  userDatas: ({
    id: UUIDString;
    contentText: string;
    createTS: TimestampString;
    updateTS: TimestampString;
  } & UserData_Key)[];
}

export interface UpdateUserDataData {
  userData_update?: UserData_Key | null;
}

export interface UpdateUserDataVariables {
  id: UUIDString;
  contentText: string;
  updateUserId: string;
}

export interface UserData_Key {
  id: UUIDString;
  __typename?: 'UserData_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserDataVariables): MutationRef<CreateUserDataData, CreateUserDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserDataVariables): MutationRef<CreateUserDataData, CreateUserDataVariables>;
  operationName: string;
}
export const createUserDataRef: CreateUserDataRef;

export function createUserData(vars: CreateUserDataVariables): MutationPromise<CreateUserDataData, CreateUserDataVariables>;
export function createUserData(dc: DataConnect, vars: CreateUserDataVariables): MutationPromise<CreateUserDataData, CreateUserDataVariables>;

interface UpdateUserDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserDataVariables): MutationRef<UpdateUserDataData, UpdateUserDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserDataVariables): MutationRef<UpdateUserDataData, UpdateUserDataVariables>;
  operationName: string;
}
export const updateUserDataRef: UpdateUserDataRef;

export function updateUserData(vars: UpdateUserDataVariables): MutationPromise<UpdateUserDataData, UpdateUserDataVariables>;
export function updateUserData(dc: DataConnect, vars: UpdateUserDataVariables): MutationPromise<UpdateUserDataData, UpdateUserDataVariables>;

interface DeleteUserDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserDataVariables): MutationRef<DeleteUserDataData, DeleteUserDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserDataVariables): MutationRef<DeleteUserDataData, DeleteUserDataVariables>;
  operationName: string;
}
export const deleteUserDataRef: DeleteUserDataRef;

export function deleteUserData(vars: DeleteUserDataVariables): MutationPromise<DeleteUserDataData, DeleteUserDataVariables>;
export function deleteUserData(dc: DataConnect, vars: DeleteUserDataVariables): MutationPromise<DeleteUserDataData, DeleteUserDataVariables>;

interface ListUserDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserDataData, undefined>;
  operationName: string;
}
export const listUserDataRef: ListUserDataRef;

export function listUserData(options?: ExecuteQueryOptions): QueryPromise<ListUserDataData, undefined>;
export function listUserData(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserDataData, undefined>;

