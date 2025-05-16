"use client";

import { useCallback } from "react";
import data from "../../../data/data.json"; 

export interface ChildNode {
  id: string;
  title: string;
  parentId: string | null;
  children?: ChildNode[];
}
export default function useFetchChild() {
    return useCallback(async function fetchChildren(parentId: string) {
      // Recursively build tree from flat data
        try{

            const response = await fetch(`http://localhost:5000/getNote/${parentId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            })
            
            if(!response.ok){
                throw new Error("Failed to Fetch Sub pages");
            }
            const data  = await response.json();
            return data;         
        }
        catch(error){
            console.log("Error in Fetching sub Pages", error);
            return [];
        }
  
    }, []);
  }