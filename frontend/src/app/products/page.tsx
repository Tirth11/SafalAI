"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuthStore, useProductsStore } from "@/lib/store";
import type { SafalProductId } from "@/types";
import { ArrowRight, CheckCircle, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";

const productCatalogue: { id: SafalProductId; name: string; status: "Live" | "Launching Soon"; logo: string; desc: string }[] = [
  { id: "safalmybuy", name: "SafalMyBuy", status: "Live", logo: "/logos/safalmybuy.png", desc: "Manage expenses, purchases, receipts, and warranties." },
  { id: "safalirdrainmate", name: "SafalIRDrainMate", status: "Live", logo: "/logos/safalirdrainmate.png", desc: "Inspection, reporting, and workflow automation." },
  { id: "safalvendors", name: "SafalVendors", status: "Launching Soon", logo: "/logos/safalvendors.svg", desc: "Vendor management and communication." },
  { id: "safalcalendar", name: "SafalCalendar", status: "Launching Soon", logo: "/logos/safalcalendar.svg", desc: "Smart scheduling and calendar management." },
  { id: "safalsubscriptions", name: "SafalSubscriptions", status: "Launching Soon", logo: "/logos/safalsubscriptions.png", desc: "Track and optimize your recurring subscriptions." },
  { id: "safalreviews", name: "SafalReviews", status: "Launching Soon", logo: "/logos/safalreviews.svg", desc: "Customer review analytics and response automation." },
  { id: "safaldrive", name: "SafalDrive", status: "Launching Soon", logo: "/logos/safaldrive.png", desc: "Secure cloud storage and document management." },
  { id: "safalutilities", name: "SafalUtilities", status: "Launching Soon", logo: "/logos/safalutilities.svg", desc: "Access useful utility tools and automation features." },
];

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { connections } = useProductsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) return null;

  return (
    <DashboardLayout
      activeKey="nav:products"
      onNavigate={(_key, path) => router.push(path)}
      headerTitle="SafalVir Products"
      headerSubtitle="Connect and automate with the SafalVir ecosystem"
    >
      <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 animate-fade-in pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-400" /> 
              SafalVir Ecosystem
            </h1>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
              Connect these powerful applications to your AI Workspace. 
              Automate your workflows, extract insights, and get things done instantly with simple prompts.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {productCatalogue.map((product) => {
            const isConnected = !!connections[product.id]?.connected;
            const isLive = product.status === "Live";

            return (
              <Card key={product.id} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white border-gray-100 hover:border-indigo-100">
                
                {isConnected && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10 shadow-sm">
                    <CheckCircle className="w-3 h-3" /> CONNECTED
                  </div>
                )}
                
                {!isLive && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-10 shadow-sm">
                    COMING SOON
                  </div>
                )}

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden relative">
                      <Image 
                        src={product.logo} 
                        alt={product.name} 
                        width={32} 
                        height={32} 
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mt-1">
                        {isLive ? "Available Now" : "In Development"}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 flex-1 line-clamp-3 leading-relaxed mb-6">
                    {product.desc}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {isLive ? (
                      <Button 
                        className="w-full justify-center group/btn" 
                        variant={isConnected ? "outline" : "primary"}
                        onClick={() => router.push(`/chat?product=${product.id}`)}
                      >
                        {isConnected ? (
                          <>Open Workspace <ExternalLink className="w-4 h-4 ml-1.5 opacity-70 group-hover/btn:opacity-100" /></>
                        ) : (
                          <>Connect Now <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" /></>
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full justify-center opacity-60 cursor-not-allowed" variant="secondary" disabled>
                        Join Waitlist
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
