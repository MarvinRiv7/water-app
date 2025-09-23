import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";

interface AuthState {
  token: string | null;
}

interface DecodedToken {
  exp: number;
  iat?: number;
  [key: string]: any;
}

// ✅ Revisar si hay un token válido en sessionStorage
function getValidToken(): string | null {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.exp * 1000 > Date.now()) {
      return token; // válido
    }
    sessionStorage.removeItem("token"); // expirado
    return null;
  } catch {
    sessionStorage.removeItem("token"); // inválido
    return null;
  }
}

const initialState: AuthState = {
  token: getValidToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      sessionStorage.setItem("token", action.payload); // ✅ usar sessionStorage
    },
    logout: (state) => {
      state.token = null;
      sessionStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
