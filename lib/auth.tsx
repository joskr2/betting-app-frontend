"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useAuth as useApiAuth } from "@/hooks/use-auth";
import type {
	UserLoginRequest,
	UserProfileData,
	UserRegistrationRequest,
} from "@/types/api";

interface AuthContextType {
	user: UserProfileData | null | undefined;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: any;
	login: {
		mutate: (data: UserLoginRequest) => void;
		mutateAsync: (data: UserLoginRequest) => Promise<any>;
		isPending: boolean;
		error: any;
	};
	register: {
		mutate: (data: UserRegistrationRequest) => void;
		mutateAsync: (data: UserRegistrationRequest) => Promise<any>;
		isPending: boolean;
		error: any;
	};
	logout: {
		mutate: () => void;
		mutateAsync: () => Promise<any>;
		isPending: boolean;
	};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const auth = useApiAuth();

	const contextValue: AuthContextType = {
		user: auth.user,
		isAuthenticated: auth.isAuthenticated,
		isLoading: auth.isLoading,
		error: auth.error,
		login: {
			mutate: auth.login.mutate,
			mutateAsync: auth.login.mutateAsync,
			isPending: auth.login.isPending,
			error: auth.login.error,
		},
		register: {
			mutate: auth.register.mutate,
			mutateAsync: auth.register.mutateAsync,
			isPending: auth.register.isPending,
			error: auth.register.error,
		},
		logout: {
			mutate: auth.logout.mutate,
			mutateAsync: auth.logout.mutateAsync,
			isPending: auth.logout.isPending,
		},
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
