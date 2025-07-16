"use client";

import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const { register } = useAuth();
	const router = useRouter();
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const { toast } = useToast();

	// Client-side validation function
	const validateForm = () => {
		const errors: string[] = [];
		
		if (formData.password !== formData.confirmPassword) {
			errors.push("Las contraseñas no coinciden");
		}
		
		if (formData.password.length < 6) {
			errors.push("La contraseña debe tener al menos 6 caracteres");
		}
		
		if (!/[A-Z]/.test(formData.password)) {
			errors.push("La contraseña debe contener al menos una letra mayúscula");
		}
		
		if (!/[a-z]/.test(formData.password)) {
			errors.push("La contraseña debe contener al menos una letra minúscula");
		}
		
		if (!/[0-9]/.test(formData.password)) {
			errors.push("La contraseña debe contener al menos un número");
		}
		
		if (!formData.fullName.trim()) {
			errors.push("El nombre completo es requerido");
		}
		
		if (!formData.email.trim()) {
			errors.push("El email es requerido");
		}
		
		return errors;
	};

	// Real-time validation
	useEffect(() => {
		const errors = validateForm();
		setValidationErrors(errors);
	}, [formData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Check for validation errors
		if (validationErrors.length > 0) {
			// Show toast for each validation error
			validationErrors.forEach(error => {
				toast({
					title: "Error de validación",
					description: error,
					variant: "destructive",
				});
			});
			return;
		}

		try {
			await register.mutateAsync({
				email: formData.email,
				password: formData.password,
				full_name: formData.fullName,
			});
			router.push("/");
		} catch (err: any) {
			// Handle API validation errors
			if (err?.response?.data?.validation_errors) {
				const apiErrors = err.response.data.validation_errors;
				apiErrors.forEach((error: string) => {
					toast({
						title: "Error de validación",
						description: error,
						variant: "destructive",
					});
				});
			}
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
							{validationErrors.length > 0 && (
								<Alert variant="destructive">
									<AlertDescription>
										<ul className="list-disc pl-4 space-y-1">
											{validationErrors.map((error, index) => (
												<li key={index}>{error}</li>
											))}
										</ul>
									</AlertDescription>
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
								disabled={register.isPending || validationErrors.length > 0}
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
