// hooks/use-addRootPage.ts
import { useState } from "react";

interface Node {
  id: string;
  title: string;
  parentId: string | null;
  gitPath: string;
  commitSha: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  children: { _id: string; title: string }[];
}

export default function useAddRootPage() {
  const [isLoading, setIsLoading] = useState(false);

  const addRootPage = async (title: string): Promise<Node[] | null> => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/createNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

    console.log("Priting response for saving",response);
      

      if (!response.ok) {
        throw new Error("Failed to create root node");
      }

      // Re-fetch root nodes after adding
      const updatedResponse = await fetch('http://localhost:5000/getNoteParent');
      console.log("Printing UYp[dated Response ", updatedResponse);
      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated nodes");
      }

      const data: Node[] = await updatedResponse.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { addRootPage, isLoading };
}
