import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  mom_code: string;
  floor: string;
}

const initialState: SessionState = {
  mom_code: '',
  floor: '',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.mom_code = action.payload.mom_code;
      state.floor = action.payload.floor;
    },
    clearSession: (state) => {
      state.mom_code = '';
      state.floor = '';
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
