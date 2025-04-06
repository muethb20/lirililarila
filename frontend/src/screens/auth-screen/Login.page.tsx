import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {IUser} from "@/models/User.model.ts";
import {useNavigate} from "react-router";
import WSHandler from "@/websocket/WSHandler.ts";
import {IMessage} from "@/models/IMessage.ts";
import {useTicketStore} from "@/store/TicketStore.ts";

export default function LoginPage() {
    const [showPassword, setShowPassword] = React.useState(false)

    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const newUser: IUser = {
            email: email,
            password: password,
            firstname: "Test",
            lastname: "User",
            role: ""
        }

        WSHandler.sendMessage({
            type: "LOGIN",
            payload: newUser
        } as IMessage);

        setTimeout(() => {
            if (useTicketStore.getState().user) {
                if (useTicketStore.getState().user?.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/user");
                }
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login to HTL Ticket</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com"
                               onChange={(e) => {setEmail(e.currentTarget.value)}}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                onChange={(e) => {setPassword(e.currentTarget.value)}}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" onClick={handleLogin}>Log in</Button>
                </CardFooter>
            </Card>
            <footer className="mt-8 text-center text-sm text-gray-500">
                <div className="mt-2">Version: 1.0.0</div>
            </footer>
        </div>
    )
}

