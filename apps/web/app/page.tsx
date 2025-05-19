"use client";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Sidebar } from "@/components/tailwind/ui/Sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";
import { Children, useEffect, useState } from "react";
import useFetchRootNodes from "@/hooks/use-fetchRootData";
import useFetchNodeContent from "@/hooks/use-fetchNodeContent";
import { Content } from "next/font/google";
import { EditorRoot } from "novel";
import useAddRootPage from "@/hooks/use-addRootPage";
import useAddSubPage from "@/hooks/use-addSubPage";
import useSavePageContent from "@/hooks/use-savePageContent"; 

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
  const [isLoading , setIsLoading ] = useState(true);

  const rootNodes = useFetchRootNodes();
  const fetchContent = useFetchNodeContent(selectedEditor);
  const { addRootPage, isLoading: isCreating } = useAddRootPage();
  const { addSubPage } = useAddSubPage(setAllRootNode , setSelectedEditor)
  const {handleEditorChange , saveStatus} = useSavePageContent({selectedEditor});

  console.log("fetchContent for id", selectedEditor , "and content is", fetchContent );

  useEffect(() => {

    // const storedRootNodes = localStorage.getItem('rootNodes');

    // if(storedRootNodes){
    //   const parsedRootNodes = JSON.parse(storedRootNodes);
    //   setAllRootNode(parsedRootNodes);
    //   setSelectedEditor(parsedRootNodes[0]?.id || null);
    // }
    if (rootNodes.length > 0 ){
      
      localStorage.setItem('rootNodes' , JSON.stringify(rootNodes));
      setAllRootNode(rootNodes);
      setSelectedEditor(rootNodes[0]?.id || null);
      // const savedContents = JSON.parse(localStorage.getItem("editorContentMap") || "{}");
      // setEditorContentMap(savedContents);
      setIsLoading(false);
    }
  
  }, [rootNodes]);

  useEffect(() => {
    if (selectedEditor && fetchContent !== null) {
      setAllRootNode((prevNodes) =>
        prevNodes.map((node) =>
          node.id === selectedEditor && node.content !== fetchContent
            ? { ...node, content: fetchContent }
            : node
        )
      );
    }
  }, [fetchContent, selectedEditor]);


  const handleAddEditor = async (title: string , parentId : string | null = null) => {
    
    console.log("Priting parentID in page.tsx" , parentId, "Title ", title)

    if(parentId){
        addSubPage(title , parentId);
    }
    else{
      const updatedNodes = await addRootPage(title);
      if (updatedNodes) {
        setAllRootNode(updatedNodes);
        setSelectedEditor(updatedNodes[updatedNodes.length - 1]?.id ?? null);
      }
    }

   
  };
  
  

  // useEffect(() => {
  //   localStorage.setItem("editorEntries", JSON.stringify(allRootNode));
  //   localStorage.setItem("editorContentMap", JSON.stringify(editorContentMap));
  // }, [allRootNode, editorContentMap]);

  // const handleAddEditor = (title: string) => {
  //   const newNode : Node = {
  //     id: crypto.randomUUID(),
  //     title,
  //     parentId: null,
  //     gitPath: "",
  //     commitSha: "",
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     content: "",
  //     children: []

  //   }
  //   setAllRootNode(prev => [...prev , newNode]);
  //   setEditorContentMap(prev => ({...prev , [newNode.id] : ""}));
  //   setSelectedEditor(newNode.id);
  //   // const newEntry: EditorEntry = { id: crypto.randomUUID(), title };
    // setEditorEntries((prev) => [...prev, newEntry]);
    // setEditorContentMap((prev) => ({ ...prev, [newEntry.id]: "" }));
    // setSelectedEditor(newEntry.id);
  // };

  // const handleEditorChange = (content: string) => {
  //   if (selectedEditor) {
  //     setEditorContentMap((prev) => {
  //       const updated = { ...prev, [selectedEditor]: content };
  //       localStorage.setItem("editorContentMap", JSON.stringify(updated));
  //       return updated;
  //     });
  //   }
  // };

  // if(isLoading){
  //   return(
  //     <div className="flex min-h-screen w-full items-center justify-center">
  //     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  //   </div>
  //   )
  // }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        editorTitles={allRootNode}
        onAddEditor={(title , parentId)=>{
          handleAddEditor(title , parentId);
          alert(`${parentId} and ${title}`)
        }}
        onSelectEditor={(id)=>{
          console.trace("Printing id" , id);
          setSelectedEditor(id);
        }}
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
            initialRawContent={ allRootNode.find(node => node.id === selectedEditor) ?. content || 
              fetchContent 
            }
            onRawContentChange={handleEditorChange}
          />
        )}
      </main>
    </div>
  );
}
