'use client'
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import HeaderS from '../../(components)/HeaderS';



export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelect = async (role) => {
    if (!isLoaded) return;

    setLoading(true);
    setSelectedRole(role);

    await user?.update({
      publicMetadata: { role },
    });

    router.push("/dashboard"); // or wherever you want
  };

  return (
<div>
   <HeaderS/>
   <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 text-center text-sm">
        We've added 120 new developer jobs today! 🚀
      </div>
    <div className=" section_back ">



      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          What best describes you?
        </h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSelect("developer")}
            className={`p-4 rounded-xl border-2 transition ${
              selectedRole === "developer"
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent"
                : "border-gray-300 hover:border-blue-500"
            }`}
            disabled={loading}
          >
            I'm a Developer
          </button>

          <button
            onClick={() => handleSelect("recruiter")}
            className={`p-4 rounded-xl border-2 transition ${
              selectedRole === "recruiter"
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent"
                : "border-gray-300 hover:border-purple-500"
            }`}
            disabled={loading}
          >
            I'm a Recruiter
          </button>
        </div>
        {loading && <p className="mt-4 text-center text-sm text-gray-600">Saving your role...</p>}
      </div>
    </div>
    </div>
  );
}
