import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";
export function PostDetail({ post, deleteMutation, updatepost }) {
  // replace with useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["COMMENTS", post.id],
    queryFn: () => fetchComments(post.id),

    staleTime: 3000,
  });
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && (
          <p className="loading">deleting the post...</p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            we have an error:{deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">delet is success</p>
        )}
      </div>{" "}
      <div>
        <button onClick={() => updatepost.mutate(post.id)}>Update title</button>
        {updatepost.isPending && <p className="loading">updating the title</p>}
        {updatepost.isErroe && (
          <p className="error">
            we have an error:{updatepost.error.toString()}
          </p>
        )}
        {updatepost.isSuccess && <p>update the post successd</p>}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
