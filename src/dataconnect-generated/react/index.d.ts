import { CreateUserDataData, CreateUserDataVariables, UpdateUserDataData, UpdateUserDataVariables, DeleteUserDataData, DeleteUserDataVariables, ListUserDataData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUserData(options?: useDataConnectMutationOptions<CreateUserDataData, FirebaseError, CreateUserDataVariables>): UseDataConnectMutationResult<CreateUserDataData, CreateUserDataVariables>;
export function useCreateUserData(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserDataData, FirebaseError, CreateUserDataVariables>): UseDataConnectMutationResult<CreateUserDataData, CreateUserDataVariables>;

export function useUpdateUserData(options?: useDataConnectMutationOptions<UpdateUserDataData, FirebaseError, UpdateUserDataVariables>): UseDataConnectMutationResult<UpdateUserDataData, UpdateUserDataVariables>;
export function useUpdateUserData(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserDataData, FirebaseError, UpdateUserDataVariables>): UseDataConnectMutationResult<UpdateUserDataData, UpdateUserDataVariables>;

export function useDeleteUserData(options?: useDataConnectMutationOptions<DeleteUserDataData, FirebaseError, DeleteUserDataVariables>): UseDataConnectMutationResult<DeleteUserDataData, DeleteUserDataVariables>;
export function useDeleteUserData(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserDataData, FirebaseError, DeleteUserDataVariables>): UseDataConnectMutationResult<DeleteUserDataData, DeleteUserDataVariables>;

export function useListUserData(options?: useDataConnectQueryOptions<ListUserDataData>): UseDataConnectQueryResult<ListUserDataData, undefined>;
export function useListUserData(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserDataData>): UseDataConnectQueryResult<ListUserDataData, undefined>;
