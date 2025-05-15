"use client";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Sidebar } from "@/components/tailwind/ui/Sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useFetchRootNodes from "@/hooks/use-fetchRootData";

interface Node {
  id: string;
  title: string;
  parentId : null | string;
  gitPath : string;
  commitSha : string;
  createdAt : string;
  updatedAt : string;
  content : string;
  children : {_id : string ; title : string}[];
}

export default function Page() {
  const [ allRootNode, setAllRootNode] = useState<Node[]>([]);
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);
  const [editorContentMap, setEditorContentMap] = useState<Record<string, string>>({});
  const rootNodes = useFetchRootNodes();

  useEffect(() => {

    const storedRootNodes = localStorage.getItem('rootNodes');

    // if(storedRootNodes){
    //   const parsedRootNodes = JSON.parse(storedRootNodes);
    //   setAllRootNode(parsedRootNodes);
    //   setSelectedEditor(parsedRootNodes[0]?.id || null);
    // }
    if (rootNodes.length > 0 ){
      
      localStorage.setItem('rootNodes' , JSON.stringify(rootNodes));
      setAllRootNode(rootNodes);
      setSelectedEditor(rootNodes[0].id);
      const savedContents = JSON.parse(localStorage.getItem("editorContentMap") || "{}");
      setEditorContentMap(savedContents);
    }
  
  }, [rootNodes]);

  useEffect(() => {
    localStorage.setItem("editorEntries", JSON.stringify(allRootNode));
    localStorage.setItem("editorContentMap", JSON.stringify(editorContentMap));
  }, [allRootNode, editorContentMap]);

  const handleAddEditor = (title: string) => {
    // const newEntry: EditorEntry = { id: crypto.randomUUID(), title };
    // setEditorEntries((prev) => [...prev, newEntry]);
    // setEditorContentMap((prev) => ({ ...prev, [newEntry.id]: "" }));
    // setSelectedEditor(newEntry.id);
  };

  const handleEditorChange = (content: string) => {
    if (selectedEditor) {
      setEditorContentMap((prev) => {
        const updated = { ...prev, [selectedEditor]: content };
        localStorage.setItem("editorContentMap", JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        editorTitles={allRootNode}
        onAddEditor={handleAddEditor}
        onSelectEditor={setSelectedEditor}
        selectedEditor={selectedEditor}
      />

      {/* Main Content */}
      <main className="flex  flex-col flex-1 items-center gap-4 py-4 sm:px-5 lg:ml-[18rem]">
         <div className="flex justify-end  w-full  items-center gap-2 px-4 mb-20 sm:gap-1">
        {/*  <Button size="icon" variant="outline">
            <a href="https://github.com/steven-tey/novel" target="_blank" rel="noreferrer">
              <GithubIcon />
            </a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml gap-2">
                <BookOpen className="h-4 w-4" />
                Usage in dialog
              </Button>
            </DialogTrigger>
            <DialogContent className="flex max-w-3xl h-[calc(100vh-24px)]">
              <ScrollArea className="max-h-screen">
                <TailwindAdvancedEditor />
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Link href="/docs" className="ml-auto">
            <Button variant="ghost">Documentation</Button>
          </Link> */}
          <Menu/>
        </div> 

        {/* Editor */}
        {selectedEditor && (
          <TailwindAdvancedEditor
            key={selectedEditor}
            editorKey={selectedEditor}
            initialRawContent={editorContentMap[selectedEditor] ?? ""}
            onRawContentChange={handleEditorChange}
          />
        )}
      </main>
    </div>
  );
}
