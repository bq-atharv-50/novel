"use client";

import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";
import clsx from "clsx";

interface EditorEntry{
  id : string;
  title : string;
}

interface SidebarProps {
  editorTitles: EditorEntry[];
  onAddEditor: (title: string) => void;
  onSelectEditor: (title: string) => void;
  selectedEditor: string | null;
}

export function Sidebar({
  editorTitles,
  onAddEditor,
  onSelectEditor,
  selectedEditor,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEditorTitle, setNewEditorTitle] = useState("");

  const handleAdd = () => {
    if (newEditorTitle.trim()) {
      onAddEditor(newEditorTitle.trim());
      setNewEditorTitle("");
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button className="lg:hidden absolute top-16 left-4 sm:left-8 z-50 p-2 bg-white shadow rounded" onClick={() => setIsOpen(true)}>
        <Menu className="w-6 h-6 text-gray-800" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 bottom-0 z-50 w-[18rem] bg-white dark:bg-zinc-900 shadow-lg transition-transform transform",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "lg:translate-x-0": true,
          }
        )}
      >
        <div className="absolute inset-0 z-10 overflow-auto pr-8 pb-10">
          <div className="flex justify-end lg:hidden p-4">
            <button onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>

          <div className="relative text-sm leading-5">
            <div className="sticky top-0 h-8 bg-gradient-to-b from-white dark:from-zinc-900" />

            <ul className="space-y-4 mt-4 pl-4" id="navigation-items">
              <li>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    Saved Editor
                  </span>
                  <button
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
                    onClick={() => setShowModal(true)}
                  >
                    <Plus className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </li>

              {editorTitles.map((entry) => (
                <li
                  key={entry.id}
                  className={clsx(
                    "pl-2 text-gray-700 dark:text-gray-300 cursor-pointer p-1",
                    selectedEditor === entry.id && "font-bold dark:bg-gray-700 rounded-xl bg-gray-100"
                  )}
                  onClick={() => onSelectEditor(entry.id)}
                >
                  {entry.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Editor
            </h2>
            <input
              type="text"
              placeholder="Enter title"
              value={newEditorTitle}
              onChange={(e) => setNewEditorTitle(e.target.value)}
              className="w-full p-2 mb-4 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
