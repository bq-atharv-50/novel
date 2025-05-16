"use client"
import React from "react";
import { useState, useEffect } from "react";

import data from '../../../data/data.json'

interface Node {
    id: string;
    title: string;
    parentId: string | null;
    gitPath: string;
    commitSha: string;
    createdAt: string; 
    updatedAt: string;
    content : string;
    children: { _id: string; title: string }[];
}

const useFetchRootNodes = () =>{

    const [rootNode , setRootNode ] = useState<Node[]>([]);

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await fetch('http://localhost:5000/getNoteParent')
                const data : Node[] = await response.json();
                setRootNode(data)
                console.log(data);
            }
            catch(error){
                console.log("Failed to Fetch the Pages" , error);
            }
        }

        fetchData();
    },[])

    return rootNode;
}

export default useFetchRootNodes;