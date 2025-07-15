"use client";

import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await login.mutateAsync({
				email,
				password,
			});
			router.push("/");
		} catch (_err) {
			// Error handling is now done through the ErrorHandler in the mutation
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo/Brand */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center mb-4">
						<TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
						<h1 className="text-2xl font-bold text-gray-900">Sport Betting</h1>
					</div>
					<p className="text-gray-600">Inicia sesión en tu cuenta</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Iniciar Sesión</CardTitle>
						<CardDescription>
							Ingresa tus credenciales para acceder a tu cuenta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="tu@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={login.isPending}
							>
								{login.isPending && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Iniciar Sesión
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								¿No tienes una cuenta?{" "}
								<Link
									href="/register"
									className="text-blue-600 hover:underline"
								>
									Regístrate aquí
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
