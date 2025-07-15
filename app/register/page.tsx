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

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const { register } = useAuth();
	const router = useRouter();
	const [validationError, setValidationError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
		// Clear validation error when user starts typing
		if (validationError) {
			setValidationError("");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError("");

		if (formData.password !== formData.confirmPassword) {
			setValidationError("Las contraseñas no coinciden");
			return;
		}

		if (formData.password.length < 6) {
			setValidationError("La contraseña debe tener al menos 6 caracteres");
			return;
		}

		try {
			await register.mutateAsync({
				email: formData.email,
				password: formData.password,
				full_name: formData.fullName,
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
					<p className="text-gray-600">Crea tu cuenta y comienza a apostar</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Crear Cuenta</CardTitle>
						<CardDescription>
							Completa los datos para crear tu cuenta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{validationError && (
								<Alert variant="destructive">
									<AlertDescription>{validationError}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor="fullName">Nombre Completo</Label>
								<Input
									id="fullName"
									name="fullName"
									type="text"
									placeholder="Juan Pérez"
									value={formData.fullName}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="tu@email.com"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="••••••••"
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									placeholder="••••••••"
									value={formData.confirmPassword}
									onChange={handleChange}
									required
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={register.isPending}
							>
								{register.isPending && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Crear Cuenta
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								¿Ya tienes una cuenta?{" "}
								<Link href="/login" className="text-blue-600 hover:underline">
									Inicia sesión aquí
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
