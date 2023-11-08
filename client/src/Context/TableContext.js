// TableContext.js
import React, { createContext, useContext, useState } from "react";

const TableContext = createContext();

export const useTableContext = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
  const [filterInput, setFilterInput] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  // Value to be passed to the provider
  const value = {
    filterInput,
    setFilterInput,
    globalFilter,
    setGlobalFilter,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
