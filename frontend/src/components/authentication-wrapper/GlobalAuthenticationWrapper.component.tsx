import React from 'react';
import {useTicketStore} from "@/store/TicketStore.ts";
import LoginPage from "@/screens/auth-screen/Login.page.tsx";

export const GlobalAuthenticationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const {user} = useTicketStore();

        if (!user?.role) {
            return <LoginPage/>
        } else {
            return children;
        }
};

