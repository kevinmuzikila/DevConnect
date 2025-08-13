'use client'
import Image from "next/image";
import Header from '../(components)/Header'
import Navbar from '../(components)/Navbar'
import Footer from '../(components)/Footer'
import MainContent from '../(components)/MainContent'
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Homepage } from '../(components)/Homepage'
const SUPER_USER = process.env.SUPER_USER;

export default function Home() {
  const SUPER_USER_EMAIL = "devconnect12@gmail.com";

          const { user, isLoaded } = useUser();
          const router = useRouter();

          useEffect(() => {
            if (!isLoaded) return;

            const email = user?.emailAddresses?.[0]?.emailAddress;
            if (email === SUPER_USER_EMAIL) {
              router.replace("/admin");
            } else if (user) {
              router.replace("/dashboard");
            }
          }, [isLoaded, user, router]);

          // ⛔ Avoid rendering page if still loading or redirecting
          if (!isLoaded || user) return null;
          
  
  return (
    <div className="">
        <Header/>
    
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 text-center text-sm">
        We've added 120 new developers weekly! 🚀
      </div>
    <Homepage/>
      <Footer/>
    </div>
  );
}






















