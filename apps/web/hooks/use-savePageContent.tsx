import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface useSavePageContentProps{
    selectedEditor: string | null;
}


const  useSavePageContent = ({selectedEditor}: useSavePageContentProps) => {
  
    const [saveStatus , setSaveStatus] = useState<"Idle"|"Saving"|"Saved"|"Error">("Idle")

    const debouncedSave = useDebouncedCallback(async (content : string)=>{
        
        if(!selectedEditor) return ;

        try {
            console.log("useSaveContent " , content , selectedEditor)
            let response = await fetch(`http://localhost:5000/updateNote/${selectedEditor}`, {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({content})
            }) 
            console.log("After Stringify" ,content , selectedEditor )
            setSaveStatus("Saved");
            console.log(response);
        }
        catch(err){
            console.log("Failed to save note", err);
            setSaveStatus('Error');
        }
    },  2000);

    const handleEditorChange = (content : string)=>{
        if(!selectedEditor) return ;
        setSaveStatus("Saving");
        debouncedSave(content);
    }


   

    return {handleEditorChange , saveStatus}; 
}
export default useSavePageContent;