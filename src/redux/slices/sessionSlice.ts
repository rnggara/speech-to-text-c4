import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  username: string;
  token: string;
}

const initialState: SessionState = {
  username: '',
  token: '',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.token = '';
      state.username = '';
    },
  },
});

export const { setSession, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
