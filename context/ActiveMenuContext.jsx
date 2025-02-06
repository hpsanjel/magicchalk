"use client";

import React, { createContext, useContext, useState } from "react";

const ActiveMenuContext = createContext({
	activeMenu: "gurungknsadmin1234",
	setActiveMenu: (menu) => {},
});

export const useActiveMenu = () => useContext(ActiveMenuContext);

export const ActiveMenuProvider = ({ children }) => {
	const [activeMenu, setActiveMenu] = useState("gurungknsadmin1234");

	return <ActiveMenuContext.Provider value={{ activeMenu, setActiveMenu }}>{children}</ActiveMenuContext.Provider>;
};
