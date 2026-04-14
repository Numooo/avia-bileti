"use client";

import { useSearchParams } from "next/navigation";
import { TrainsPage } from "@/features/trains/TrainsPage";
import { useRouter } from "@/i18n/routing";

export default function TrainsRoute() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("from");
  const destination = searchParams.get("to");
  
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <TrainsPage
      initialOrigin={origin}
      initialDestination={destination}
      onBack={handleBack}
    />
  );
}
