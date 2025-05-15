import { FileText, ChevronDown, ChevronRight, Plus } from "lucide-react";
import clsx from "clsx";
import RenderChildren from "@/components/tailwind/ui/renderChild";

interface Node {
  id: string;
  title: string;
  parentId: null | string;
  gitPath: string;
  commitSha: string;
  createdAt: string;
  updatedAt: string;
  children: { _id: string; title: string }[];
}

interface UseRenderNodeProps {
  editorTitles: Node[];
  openNodeIds: Set<string>;
  selectedEditor: string | null;
  onSelectEditor: (id: string) => void;
  toggleNode: (id: string) => void;
  onAddEditor: () => void;
}

export default function useRenderNode({
  editorTitles,
  openNodeIds,
  selectedEditor,
  onSelectEditor,
  toggleNode,
  onAddEditor,
}: UseRenderNodeProps) {
  return editorTitles.map((entry) => {

    const isOpen = openNodeIds.has(entry.id);
    const hasChildren = entry.children.length > 0;


    return (
        <li
        key={entry.id}
        className={clsx(
            "group pl-2 text-gray-700 dark:text-gray-300 cursor-pointer p-1 font-medium",
            selectedEditor === entry.id && "font-bold dark:bg-gray-700 rounded-lg bg-gray-100"
        )}
        onClick={() => onSelectEditor(entry.id)}
        >
        <div className="flex gap-2 pl-1 pr-3 items-center justify-between">
            <div className="flex gap-2 pl-1 items-center relative">
            {/* Static icon fades on hover */}
            <div className="group-hover:opacity-0 transition-opacity duration-300">
                <FileText className="h-5 w-5" />
            </div>

            {/* Chevron toggle appears on hover */}
            {hasChildren && (
                <button
                className="bg-gray-50 dark:bg-gray-800 rounded-sm absolute left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(entry.id);
                }}
                >
                {isOpen ? (
                    <ChevronDown className="h-5 w-5" />
                ) : (
                    <ChevronRight className="h-5 w-5" />
                )}
                </button>
            )}

            <span className={hasChildren ? "ml-6" : ""}>{entry.title}</span>
            </div>

            <button
            className="flex justify-end text-gray-400"
            onClick={(e) => {
                e.stopPropagation();
                onAddEditor();
            }}
            >
            <Plus
                className="h-4 w-5 hover:text-gray-700 dark:hover:text-gray-200 hidden group-hover:block transition group-hover:delay-300"
            />
            </button>
        </div>

        {/* Recursive children rendering */}
        {isOpen && hasChildren && (
            <ul className="ml-4 mt-2 space-y-2">
            <RenderChildren
                parentId={entry.id}
                openNodeIds={openNodeIds}
                selectedEditor={selectedEditor}
                onSelectEditor={onSelectEditor}
                onAddEditor={onAddEditor}
                toggleNode={toggleNode}
            />
            </ul>
        )} 
        </li>

    );
  });
}
