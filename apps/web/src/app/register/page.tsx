"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Register:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Бүртгүүлэх</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Нэр</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Таны нэр"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Имэйл</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Нууц үг</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Нууц үг"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Нууц үг баталгаажуулах</label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Нууц үг дахин"
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Бүртгүүлэх
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
