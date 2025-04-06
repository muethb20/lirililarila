import {useTicketStore} from "@/store/TicketStore.ts";
import React from "react";
import {Navigate, Outlet} from "react-router";

interface RoleGuardProps {
    role: string;
    redirectTo?: string;
    children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ role, redirectTo = '/', children }) => {
    const { user } = useTicketStore ();


    if (user?.role === role) {
        return (
            <>
                {children}
                <Outlet />
            </>
        );
    } else {
        return <Navigate to={redirectTo} />;
    }
};
