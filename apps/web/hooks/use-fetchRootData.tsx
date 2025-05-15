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
        const rootNodes = data.filter( (node) => node.parentId === null);

        setRootNode(rootNodes);
    },[])



    return rootNode;

}

export default useFetchRootNodes;