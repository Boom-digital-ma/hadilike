"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getBrand, getCities, getCategories, getSiteSettings } from '@/lib/api';

interface BrandContextType {
  brand: any;
  cities: any[];
  currentCity: any;
  categories: any[];
  settings: Record<string, any>;
  isLoading: boolean;
  setCurrentCity: (city: any) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<any>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [currentCity, setCurrentCity] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initBrand() {
      try {
        // 1. Get the brand (Hardcoded to 'hadilike' for now, can be dynamic based on domain)
        const brandData = await getBrand('hadilike');
        setBrand(brandData);

        // 2. Get cities
        const citiesData = await getCities(brandData.id);
        setCities(citiesData);
        if (citiesData.length > 0) {
          setCurrentCity(citiesData[0]); // Default to Marrakech
        }

        // 3. Get global data
        const [catsData, settingsData] = await Promise.all([
          getCategories(brandData.id),
          getSiteSettings(brandData.id)
        ]);

        setCategories(catsData);
        setSettings(settingsData);
      } catch (err) {
        console.error("Error initializing brand data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initBrand();
  }, []);

  return (
    <BrandContext.Provider value={{ 
      brand, 
      cities, 
      currentCity, 
      categories, 
      settings, 
      isLoading,
      setCurrentCity 
    }}>
      {!isLoading && children}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
          <div className="animate-pulse font-serif text-xl">HADILIKE...</div>
        </div>
      )}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
