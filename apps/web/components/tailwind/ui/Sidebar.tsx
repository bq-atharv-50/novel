"use client";

import { useState } from "react";
import {Menu, X, Plus, FileText, ChevronDown, ChevronRight, ChevronsRight , ChevronsLeft} from "lucide-react";
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

  const [dropDown,setDropDown] = useState(false);

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
      <button className="absolute top-3 left-4 sm:left-8 z-50  p-2   border  border-gray-200 dark:border-gray-600 rounded-lg" onClick={() => setIsOpen(true)}>
      <ChevronsRight className="w-5 h-5 text-gray-800 dark:text-gray-200" />
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
          }
        )}
      >
        <div className="absolute inset-0 z-10 overflow-auto pr-4 pb-10">
          <div className="flex justify-end p-4 ">
            <button className=" p-2   border  border-gray-200 dark:border-gray-600 rounded-lg" onClick={() => setIsOpen(false)}>
              <ChevronsLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          </div>


          <div className="relative text-sm leading-5">
            <ul className="space-y-4 mt-4 pl-4" id="navigation-items">
              <li>
                <div className="flex items-center justify-between">
                  <span className="pl-4 font-semibold text-lg text-gray-900 dark:text-gray-200">
                    Saved Pages
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
                  "group pl-2 text-gray-700 dark:text-gray-300 cursor-pointer p-1 font-medium",
                  selectedEditor === entry.id && "font-bold dark:bg-gray-700 rounded-lg bg-gray-100"
                  )}
                  onClick={() => onSelectEditor(entry.id)}
                >
                  <div className="flex gap-2 pl-1 pr-3 items-center justify-between">
                    <div className="flex gap-2 pl-1 items-center">
                      <div className="group-hover:opacity-0 transition-opacity duration-300">
                        <FileText className="h-5 w-5 "/>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-sm absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        onClick={()=>setDropDown(!dropDown)}
                      >
                        {
                          dropDown ?   
                          <ChevronDown className="h-5 w-5"/> :  <ChevronRight className="h-5 w-5"/> 
                        }
                        
                      </div>
                      {entry.title}
                    </div>
                    <button className="flex justify-end  text-gray-400"
                      onClick={() => setShowModal(true)}
                    >
                      <Plus 
                        className="h-4 w-5 hover:text-gray-700 dark:hover:text-gray-200 hidden group-hover:block transition group-hover:delay-300"
                      />
                    </button>
                  </div>
                  
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
              Add New Page
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
