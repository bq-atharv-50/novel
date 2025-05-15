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
    return useCallback(function fetchChildren(parentId: string): Promise<ChildNode[]> {
      // Recursively build tree from flat data
      const getChildren = (pid: string): ChildNode[] => {
        return (data as any[])
          .filter((item) => item.parentId === pid)
          .map((item) => ({
            id: item.id,
            title: item.title,
            parentId: item.parentId,
            children: getChildren(item.id),
          }));
      };
  
      return Promise.resolve(getChildren(parentId));
    }, []);
  }