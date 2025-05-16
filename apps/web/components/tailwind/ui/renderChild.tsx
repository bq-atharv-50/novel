// components/RenderChildren.tsx

"use client";

import { useEffect, useState } from "react";
import { FileText, ChevronDown, ChevronRight, Plus } from "lucide-react";
import clsx from "clsx";
import useFetchChild from "@/hooks/use-fetchChild";

interface ChildNode {
  id: string;
  title: string;
  parentId: string | null;
}

interface RenderChildrenProps {
  parentId: string;
  openNodeIds: Set<string>;
  selectedEditor: string | null;
  onSelectEditor: (id: string) => void;
  onAddEditor: () => void;
  toggleNode: (id: string) => void;
}

export default function RenderChildren({
  parentId,
  openNodeIds,
  selectedEditor,
  onSelectEditor,
  onAddEditor,
  toggleNode,
}: RenderChildrenProps) {
    const [children, setChildren] = useState<ChildNode[]>([]);
    const isOpen = openNodeIds.has(parentId);
    const fetch = useFetchChild();

    useEffect(() => {
        if (isOpen) {
        fetch(parentId).then((res) => {
            
            const childrenInfo = res.children;
            console.log("Printing childrenInfo",childrenInfo)
            if (Array.isArray(childrenInfo)) {
                const mappedChildren = childrenInfo.map(child => ({
                    id: child._id,      // rename _id to id here
                    title: child.title,
                    parentId: parentId, // optional if needed
                  }));
            setChildren(mappedChildren);
            } else {
            console.error("Expected array of children but got:", res);
            setChildren([]);
            }
        });
        }
    }, [isOpen, parentId]);

    if (!isOpen || children.length === 0) return null;

    return (
        <>
        {children.map((child) => (
            <li
                key={child.id}
                className={clsx(
                    "group pl-2 text-gray-700 dark:text-gray-300 cursor-pointer p-1 font-medium",
                    selectedEditor === child.id && "font-bold dark:bg-gray-700 rounded-lg bg-gray-100"
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectEditor(child.id)
                    
                }}
            >
                <div className="flex items-center justify-between pr-3 relative">
                    {/* Left side: icon + title */}
                    <div className="flex items-center relative gap-2 pl-1">
                    {/* File icon (initial) */}
                    <div className="transition-opacity duration-200 group-hover:opacity-0">
                        <FileText className="h-4 w-4" />
                    </div>

                    {/* Chevron icon (on hover, overlays file icon) */}
                    <button
                        className="absolute left-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                        e.stopPropagation();
                        toggleNode(child.id);
                        }}
                    >
                        {openNodeIds.has(child.id) ? (
                        <ChevronDown className="h-4 w-4" />
                        ) : (
                        <ChevronRight className="h-4 w-4" />
                        )}
                    </button>

                    {/* Title, spaced right if chevron appears */}
                    <span className="ml-6">{child.title}</span>
                    </div>

                    {/* Right-side: plus button (only visible on hover) */}
                    <button
                    className="text-gray-400 hidden group-hover:block transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddEditor();
                    }}
                    >
                    <Plus className="h-4 w-4 hover:text-gray-700 dark:hover:text-gray-200" />
                    </button>
                </div>

                {/* Recursive render */}
                {openNodeIds.has(child.id) && (
                    <ul key={`ul-${child.id}`} className="ml-4 mt-2 space-y-2">
                        <RenderChildren
                            parentId={child.id}
                            openNodeIds={openNodeIds}
                            selectedEditor={selectedEditor}
                            onSelectEditor={onSelectEditor}
                            onAddEditor={onAddEditor}
                            toggleNode={toggleNode}
                        />
                    </ul>
                )}
            </li>

            ))}
        </>
    );
}
