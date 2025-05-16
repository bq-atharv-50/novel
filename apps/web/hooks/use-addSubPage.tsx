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

export default function useAddSubPage(setAllRootNode: (nodes: Node[]) => void, setSelectedEditor: (id: string) => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSubPage = async (title: string, parentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, parentId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create subpage");
      }

      const createdNode: Node = await res.json();
      setSelectedEditor(createdNode.id);

      // Fetch updated nodes
      const updatedRes = await fetch("/api/nodes");
      if (!updatedRes.ok) {
        throw new Error("Failed to fetch updated nodes");
      }

      const updatedNodes: Node[] = await updatedRes.json();
      setAllRootNode(updatedNodes);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { addSubPage, loading, error };
}
