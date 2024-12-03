"use client";
import dynamic from "next/dynamic";
const Recorder = dynamic(() => import("@/components/recorder"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Recorder />
    </div>
  );
}
