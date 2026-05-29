"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Textarea } from "./textarea";
import { formatDistanceToNow } from "date-fns";
import { io } from "socket.io-client";
import axiosInstance from "@/lib/axiosinstance";
interface Comment {
  commentBody: string;
  userCommented: string;
  commentedon: string | number | Date;
  _id: string;
  videoId: string;
  userId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
const Comments = ({ videoId }: any) => {
  const user: any = {
    id: "1",
    name: "Binit Kumar",
    email: "binitkumar1233@gmail.com",
    image: "https://github.com/shadcn.png?height=32&width=32",
  };
  const fetchedComments: Comment[] = [
    {
      _id: "1",
      videoId,
      userId: "1",
      comment: "Great video! Learned a lot.",
      commentBody: "Great video! Learned a lot.",
      userCommented: "Binit Kumar",
      commentedon: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "2",
      videoId,
      userId: "2",
      comment: "Awesome content! Keep up the good work.",
      commentBody: "Awesome content! Keep up the good work.",
      userCommented: "Virat Kohli",
      commentedon: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
  const [comment, setNewComment] = useState<Comment[]>(fetchedComments);
  const [newComment, setNewcomment] = useState("");
  const [isSubmiting, setSubmiting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadComments();
    // connect socket and join video room
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const socket = io(backend, { autoConnect: true });
    socket.emit("joinVideo", videoId);

    socket.on("comment:new", (newComment: any) => {
      const exists = comment.some((c) => String(c._id) === String(newComment._id));
      if (exists) return;
      const normalized = {
        _id: String(newComment._id ?? Date.now()),
        videoId: String(newComment.videoId ?? videoId),
        userId: String(newComment.userId ?? newComment.userId ?? ""),
        userCommented: String(newComment.usercommented ?? newComment.userCommented ?? "User"),
        commentBody: String(newComment.commentbody ?? newComment.comment ?? ""),
        comment: String(newComment.comment ?? newComment.commentbody ?? ""),
        commentedon: newComment.commentedon ?? newComment.createdAt ?? new Date().toISOString(),
        createdAt: String(newComment.createdAt ?? new Date().toISOString()),
        updatedAt: String(newComment.updatedAt ?? new Date().toISOString()),
      };
      setNewComment((prev) => [normalized, ...prev]);
    });

    return () => {
      try {
        socket.disconnect();
      } catch (e) {
        /* ignore */
      }
    };
  }, [videoId]);
  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      const data = res.data;
      // Normalize mixed API keys so UI keeps working with mock and backend payloads.
      const normalized = (Array.isArray(data) ? data : []).map((item: any) => ({
        _id: String(item._id ?? Date.now()),
        videoId: String(item.videoId ?? item.videoid ?? videoId),
        userId: String(item.userId ?? item.userid ?? ""),
        userCommented: String(
          item.userCommented ??
            item.userName ??
            item.username ??
            item.user?.name ??
            item.user?.username ??
            "User",
        ),
        commentBody: String(item.commentBody ?? item.comment ?? ""),
        comment: String(item.comment ?? item.commentBody ?? ""),
        commentedon:
          item.commentedon ?? item.createdAt ?? new Date().toISOString(),
        createdAt: String(item.createdAt ?? new Date().toISOString()),
        updatedAt: String(item.updatedAt ?? new Date().toISOString()),
      }));
      setNewComment(normalized.length ? normalized : fetchedComments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitComment = async (
    _event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!user || !newComment.trim()) return;

    setSubmiting(true);
    try {
      const payload = {
        videoId,
        userId: user.id,
        commentbody: newComment.trim(),
        usercommented: user.name,
      };

      // Post to backend; server will emit to other clients
      await axiosInstance.post(`/comment`, payload);
      setNewcomment("");
    } finally {
      setSubmiting(false);
    }
  };

  function handaleUpdateComment(
    _event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    if (!editingCommentId || !editText.trim()) return;
    setNewComment((prev) =>
      prev.map((item) =>
        item._id === editingCommentId
          ? {
              ...item,
              commentBody: editText.trim(),
              comment: editText.trim(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
    setEditingCommentId(null);
    setEditText("");
  }

  function handleCancelEdit(_event: React.MouseEvent<HTMLButtonElement>): void {
    setEditingCommentId(null);
    setEditText("");
  }

  function handaleEdit(comment: Comment): void {
    setEditingCommentId(comment._id);
    setEditText(String(comment.commentBody ?? comment.comment ?? ""));
  }

  function handaleDelete(commentId: string): void {
    setNewComment((prev) => prev.filter((item) => item._id !== commentId));
  }

  return (
    <div className="mt-8 px-1">
      {/* Header */}
      <h2 className="text-lg font-semibold text-foreground mb-6">
        {comment.length} Comments
      </h2>

      {/* New Comment Input */}
      {user && (
        <div className="flex gap-3 mb-8">
          <Avatar className="h-9 w-9 shrink-0 mt-1">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col gap-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewcomment(e.target.value)}
              placeholder="Add a comment..."
              rows={1}
              className="resize-none border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground text-sm placeholder:text-muted-foreground transition-colors"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNewcomment("")}
                disabled={!newComment.trim()}
                className="px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmiting}
                className="px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmiting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        <div>
          {comment.map((comment) => (
            <div key={comment._id} className="flex gap-3 group">
              <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                  {String(comment.userCommented || "U")[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">
                    {comment.userCommented || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.commentedon), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {editingCommentId === comment._id ? (
                  <div>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={handaleUpdateComment}>save</button>
                    <button onClick={handleCancelEdit}>cancel</button>
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed break-words">
                    {String(comment.commentBody ?? comment.comment ?? "")}
                    {comment.userId === user.id && (
                      <>
                        <button onClick={() => handaleEdit(comment)}>
                          Edit
                        </button>
                        <button onClick={() => handaleDelete(comment._id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                    </svg>
                  </button>
                  <button className="ml-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-full hover:bg-secondary transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;
