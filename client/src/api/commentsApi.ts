import { axiosInstance } from "./api";

export async function fetchCommentsForBug(bugId: number) {
  const res = await axiosInstance.get(`/bugs/${bugId}/comments`);
  return res.data; // Array of comments
}

export async function addCommentForBug(bugId: number, content: string) {
  const res = await axiosInstance.post(`/bugs/${bugId}/comments`, {
    content,
  });
  return res.data; // Newly created comment
}

export async function updateComment(commentId: number, content: string) {
  const res = await axiosInstance.put(`/comments/${commentId}`, { content });
  return res.data; // Updated comment
}

export async function deleteComment(commentId: number) {
  await axiosInstance.delete(`/comments/${commentId}`);
}
