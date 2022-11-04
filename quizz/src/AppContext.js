import { createContext, useContext } from "react";

// - Context used to share data between components without drilling down props from parent
export const Store = createContext();
// - Used mainly for testing purposes
export const useAppContext = () => useContext(Store);
