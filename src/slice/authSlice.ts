import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    lng: string;
    phone: number;
    type: string;
    userName: string;
    kissanId?: string;
    farmName?: string;
    country?: string;
    state?: string;
    city?: string;
    password?: string;
    village?: string;
    token: string;
}
interface LoginState {
    user: User | null;
    isLoggedIn: boolean;
}

const initialState: LoginState = {
    user: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      login: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      },
      logout: (state) => {
        state.user = null;
        state.isLoggedIn = false;
      },
      handleUser: (state, action: PayloadAction<any>) =>{
        state.user = {...state.user,...action.payload };
      }
    },
  });
  
  export const { login, logout, handleUser } = authSlice.actions;
  export default authSlice.reducer;