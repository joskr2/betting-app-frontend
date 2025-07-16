"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
	{
		name: "Carlos Rodríguez",
		role: "Apostador Profesional",
		content:
			"Sport Betting ha cambiado mi forma de apostar. Las cuotas son excelentes y los pagos son realmente instantáneos. ¡Muy recomendado!",
		rating: 5,
		avatar: "CR",
	},
	{
		name: "María González",
		role: "Usuaria Premium",
		content:
			"La plataforma es muy fácil de usar y el soporte al cliente es increíble. Siempre responden rápido y resuelven cualquier duda.",
		rating: 5,
		avatar: "MG",
	},
	{
		name: "Diego Martínez",
		role: "Apostador Recreativo",
		content:
			"Llevo 2 años usando Sport Betting y nunca he tenido problemas. Es confiable, seguro y las transmisiones en vivo son geniales.",
		rating: 5,
		avatar: "DM",
	},
	{
		name: "Ana Fernández",
		role: "Nueva Usuaria",
		content:
			"Me registré hace un mes y estoy muy satisfecha. El bono de bienvenida fue genial y ya he ganado varias apuestas.",
		rating: 5,
		avatar: "AF",
	},
	{
		name: "Luis Pérez",
		role: "Apostador Experto",
		content:
			"Sin duda la mejor plataforma de apuestas. Tienen los mejores mercados y las cuotas más competitivas del mercado.",
		rating: 5,
		avatar: "LP",
	},
];

export function TestimonialsCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative">
			{/* Desktop View */}
			<div className="hidden md:block">
				<Carousel className="w-full max-w-7xl mx-auto">
					<CarouselContent>
						{testimonials.map((testimonial) => (
							<CarouselItem
								key={testimonial.name}
								className="md:basis-1/2 lg:basis-1/3"
							>
								<div className="p-2">
									<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
										<CardContent className="p-8">
											<div className="flex items-center mb-4">
												{Array.from({ length: testimonial.rating }).map(
													(_, i) => (
														<Star
															key={`star-${i+1}`}
															className="h-5 w-5 text-yellow-400 fill-current"
														/>
													),
												)}
											</div>

											<p className="text-gray-200 mb-6 leading-relaxed italic">
												"{testimonial.content}"
											</p>

											<div className="flex items-center">
												<Avatar className="h-12 w-12 mr-4">
													<AvatarFallback className="bg-yellow-400 text-gray-900 font-bold">
														{testimonial.avatar}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-semibold text-white">
														{testimonial.name}
													</div>
													<div className="text-sm text-gray-300">
														{testimonial.role}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>

			{/* Mobile View */}
			<div className="md:hidden">
				<Carousel className="w-full max-w-sm mx-auto">
					<CarouselContent>
						{testimonials.map((testimonial) => (
							<CarouselItem key={testimonial.name}>
								<div className="p-1">
									<Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
										<CardContent className="p-8">
											<div className="flex items-center mb-4">
												{Array.from({ length: testimonial.rating }).map(
													(_, i) => (
														<Star
															key={`star-${i+1}`}
															className="h-5 w-5 text-yellow-400 fill-current"
														/>
													),
												)}
											</div>

											<p className="text-gray-200 mb-6 leading-relaxed italic">
												"{testimonial.content}"
											</p>

											<div className="flex items-center">
												<Avatar className="h-12 w-12 mr-4">
													<AvatarFallback className="bg-yellow-400 text-gray-900 font-bold">
														{testimonial.avatar}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-semibold text-white">
														{testimonial.name}
													</div>
													<div className="text-sm text-gray-300">
														{testimonial.role}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>

			{/* Indicators */}
			<div className="flex justify-center mt-8 space-x-2">
				{testimonials.map((testimonial, index) => (
					<button
						key={testimonial.name}
						onClick={() => setCurrentIndex(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentIndex ? "bg-yellow-400" : "bg-white/30"
						}`}
						type="button"
					/>
				))}
			</div>
		</div>
	);
}
