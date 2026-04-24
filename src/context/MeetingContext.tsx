"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MeetingContextType {
  meetingCode: string;
  floor: string;
  setMeetingData: (code: string, floor: string) => void;
  resetMeetingData: () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
  const [meetingCode, setMeetingCode] = useState("");
  const [floor, setFloor] = useState("");

  const setMeetingData = (code: string, floor: string) => {
    setMeetingCode(code);
    setFloor(floor);
  };

  const resetMeetingData = () => {
    setMeetingCode("");
    setFloor("");
  };

  return (
    <MeetingContext.Provider value={{ meetingCode, floor, setMeetingData, resetMeetingData }}>
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error("useMeeting must be used within a MeetingProvider");
  }
  return context;
}
