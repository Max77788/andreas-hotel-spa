"use client";

import { createContext, useContext, type ReactNode } from "react";

interface CmsContextValue {
  address: string;
  heroVideoUrl: string;
}

const CmsContext = createContext<CmsContextValue>({ address: "", heroVideoUrl: "" });

export function CmsProvider({
  address,
  heroVideoUrl,
  children,
}: {
  address: string;
  heroVideoUrl: string;
  children: ReactNode;
}) {
  return (
    <CmsContext.Provider value={{ address, heroVideoUrl }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
