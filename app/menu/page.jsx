"use client"
import CardItem1 from "@/components/cardItem1";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

export default function Page() {
  const {products} = useContext(AppContext)

  return (
    <div className="w-full flex">
      <div className="w-[75%] grid grid-cols-4 gap-5">
        {products.map((product) => {
          return (
            <CardItem1 
              key={product._id} 
              id={product._id}
              image={product.image} 
              name={product.name}
              description={product.description}
              discount={product.discount}
              type={product.type}
            />
          );
        })}
      </div>
    </div>
  );
}
