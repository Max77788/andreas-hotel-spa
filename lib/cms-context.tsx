"use client";

import { createContext, useContext, type ReactNode } from "react";

interface CmsContextValue {
  address: string;
}

const CmsContext = createContext<CmsContextValue>({ address: "" });

export function CmsProvider({
  address,
  children,
}: {
  address: string;
  children: ReactNode;
}) {
  return (
    <CmsContext.Provider value={{ address }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
