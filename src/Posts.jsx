import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  // usemutaton->deletmutation
  const deleteMutation = useMutation({
    mutationFn: (postID) => deletePost(postID),
  });
  const updatepost = useMutation({
    mutationFn: (postID) => updatePost(postID),
  });
  //prefetching
  const quertClient = useQueryClient();
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextpage = currentPage + 1;
      quertClient.prefetchQuery({
        queryKey: ["POSTS", nextpage],
        queryFn: () => fetchPosts(nextpage),
      });
    }
  }, [currentPage, quertClient]);

  // replace with useQuery
  // const data = [];
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["POSTS", currentPage, updatePost],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 3000,
  });
  if (isLoading) {
    return <h3>Loading...</h3>; //  beacause of async await function and for data is undefined
  }
  if (isError) {
    return (
      <>
        <h3>oops,something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  }
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              setSelectedPost(post);
              updatePost.reset();
            }}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updatepost={updatepost}
        />
      )}
    </>
  );
}
