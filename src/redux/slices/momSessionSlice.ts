import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  mom_code: string;
  floor: string;
}

const initialState: SessionState = {
  mom_code: '',
  floor: '',
};

const momSessionSlice = createSlice({
  name: 'momSession',
  initialState,
  reducers: {
    setMom: (state, action: PayloadAction<SessionState>) => {
      state.mom_code = action.payload.mom_code;
      state.floor = action.payload.floor;
    },
    clearMom: (state) => {
      state.mom_code = '';
      state.floor = '';
    },
  },
});

export const { setMom, clearMom } = momSessionSlice.actions;
export default momSessionSlice.reducer;
