"use client";

import React from 'react'
import { AdminDashboard } from './(components)/AdminDashboard'
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


const SUPER_USER_EMAIL = "";



function page() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    <div>
      <AdminDashboard/>
    

    </div>
  )
}

export default page