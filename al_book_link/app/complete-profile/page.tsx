"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CompleteProfilePage() {
  const { user } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/save-profile", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        userId: user?.id
      }),
    });

    if (res.ok) {
      alert("Profile saved!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="flex flex-col gap-3 w-80" onSubmit={handleSubmit}>
        <input
          className="border p-2"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="bg-blue-600 text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
