import { createSlice, PayloadAction,createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

export interface RoleState {
    value: string,
    status: string,
    error: any,
  }

const initialState: RoleState = {
    value: "ROLE_USER",
    status: 'idle',
    error: null,
  }

export const roleSlice = createSlice({
    name: 'role',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
      // Use the PayloadAction type to declare the contents of `action.payload`
      getRole: (state, action: PayloadAction<string>) => {
        state.value = action.payload
      },
    },
  })
  
  export const { getRole } = roleSlice.actions
  
  // Other code such as selectors can use the imported `RootState` type
  export const selectRole = (state: RootState) => state.role.value
  
  export default roleSlice.reducer


  export const setRole = (role: string) => ({
  type: 'role/set',
  payload: role,
});