// hooks/useFetchNodeContent.ts
import { useState, useEffect } from "react";

const useFetchNodeContent = (id: string | null) => {
    console.log("Printing ID" , id)
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchContent = async () => {

      try {
        const response = await fetch(`http://localhost:5000/getNote/${id}`);
        const data = await response.json();
        console.log("Printing Fetch Content" , data);
        setContent(data.content);  // assuming the response has a `content` field
      } catch (error) {
        console.error("Failed to fetch node content", error);
        setContent(null);
      } finally {
      }
    };

    fetchContent();
  }, [id]);


  return content;
};

export default useFetchNodeContent;
