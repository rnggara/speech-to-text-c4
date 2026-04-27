import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Attendance {
  id: string;
  name: string;
}

interface MomSessionState {
  mom_code: string;
  attendance: Attendance[];
}

const initialState: MomSessionState = {
  mom_code: '',
  attendance: [],
};

const momSessionSlice = createSlice({
  name: 'momSession',
  initialState,
  reducers: {
    setMom: (state, action: PayloadAction<{ mom_code: string; attendance: Attendance[] }>) => {
      state.mom_code = action.payload.mom_code;
      state.attendance = action.payload.attendance;
    },
    clearMom: (state) => {
      state.mom_code = '';
      state.attendance = [];
    },
  },
});

export const { setMom, clearMom } = momSessionSlice.actions;
export default momSessionSlice.reducer;
