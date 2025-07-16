"use client";

import { Shield, Zap, Trophy, CreditCard, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

const features = [
	{
		icon: Shield,
		title: "Seguridad Garantizada",
		description:
			"Tus datos y transacciones están protegidos con la más alta tecnología de encriptación SSL.",
		color: "from-green-500 to-emerald-600",
	},
	{
		icon: Zap,
		title: "Pagos Instantáneos",
		description:
			"Retira tus ganancias al instante. Procesamos los pagos en menos de 5 minutos.",
		color: "from-yellow-500 to-orange-600",
	},
	{
		icon: Trophy,
		title: "Mejores Cuotas",
		description:
			"Ofrecemos las cuotas más competitivas del mercado para maximizar tus ganancias.",
		color: "from-purple-500 to-indigo-600",
	},
	{
		icon: CreditCard,
		title: "Múltiples Métodos de Pago",
		description:
			"Deposita y retira usando tarjetas, transferencias, criptomonedas y más.",
		color: "from-blue-500 to-cyan-600",
	},
	{
		icon: Users,
		title: "Soporte 24/7",
		description:
			"Nuestro equipo de atención al cliente está disponible las 24 horas del día.",
		color: "from-red-500 to-pink-600",
	},
	{
		icon: Clock,
		title: "Transmisiones en Vivo",
		description:
			"Mira los eventos deportivos en tiempo real mientras realizas tus apuestas.",
		color: "from-teal-500 to-green-600",
	},
];

export function FeaturesCarousel() {
	return (
		<div className="relative">
			{/* Desktop View */}
			<div className="hidden md:block">
				<Carousel className="w-full max-w-7xl mx-auto">
					<CarouselContent>
						{features.map((feature) => (
							<CarouselItem
								key={feature.title}
								className="md:basis-1/2 lg:basis-1/3"
							>
								<div className="p-2">
									<Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
										<CardContent className="p-0">
											<div
												className={`bg-gradient-to-r ${feature.color} p-6 text-white`}
											>
												<feature.icon className="h-12 w-12 mb-4" />
												<h3 className="text-xl font-bold mb-2">
													{feature.title}
												</h3>
											</div>
											<div className="p-6">
												<p className="text-gray-600 leading-relaxed">
													{feature.description}
												</p>
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
						{features.map((feature) => (
							<CarouselItem key={feature.title}>
								<div className="p-1">
									<Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
										<CardContent className="p-0">
											<div
												className={`bg-gradient-to-r ${feature.color} p-6 text-white`}
											>
												<feature.icon className="h-12 w-12 mb-4" />
												<h3 className="text-xl font-bold mb-2">
													{feature.title}
												</h3>
											</div>
											<div className="p-6">
												<p className="text-gray-600 leading-relaxed">
													{feature.description}
												</p>
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
		</div>
	);
}
