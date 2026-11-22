"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useEngagementStore } from "@/hooks/useEngagementStore";
import { currentStudent } from "@/lib/data/student";
import { currentInstructor } from "@/lib/data/instructor-dashboard";
import { DEMO_STUDENT_ID } from "@/lib/engagement/types";
import type { Course, Lesson } from "@/lib/types";
import { Bookmark, BookmarkCheck, MessageSquare, NotebookPen } from "lucide-react";
import { useMemo, useState } from "react";
import { formatStudentDateTime } from "@/app/student/utils";

export function LessonNotesPanel({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const { ready, getNote, saveNote, removeNote } = useEngagementStore();
  const existing = getNote(course.id, lesson.id);
  const noteSourceKey = `${course.id}:${lesson.id}:${existing?.updatedAt ?? "empty"}`;
  const [draft, setDraft] = useState(existing?.content ?? "");
  const [saved, setSaved] = useState(false);
  const [sourceKey, setSourceKey] = useState(noteSourceKey);

  if (noteSourceKey !== sourceKey) {
    setSourceKey(noteSourceKey);
    setDraft(existing?.content ?? "");
    setSaved(false);
  }

  if (!ready) {
    return <p className="text-sm text-muted">Loading notes…</p>;
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start gap-3">
        <NotebookPen className="mt-0.5 h-5 w-5 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">
            Personal notes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Saved in this browser only for “{lesson.title}”.
          </p>
          <textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setSaved(false);
            }}
            rows={6}
            className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Jot down key takeaways…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              type="button"
              onClick={() => {
                saveNote({
                  courseId: course.id,
                  lessonId: lesson.id,
                  content: draft,
                });
                setSaved(true);
              }}
            >
              Save note
            </Button>
            {existing ? (
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  removeNote(existing.id);
                  setDraft("");
                  setSaved(false);
                }}
              >
                Delete note
              </Button>
            ) : null}
          </div>
          {saved ? (
            <p className="mt-2 text-xs text-success">Note saved locally.</p>
          ) : null}
          {existing ? (
            <p className="mt-2 text-xs text-muted">
              Last updated {formatStudentDateTime(existing.updatedAt)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function LessonBookmarkButton({
  course,
  lesson,
}: {
  course: Course;
  lesson: Lesson;
}) {
  const { ready, isBookmarked, toggleLessonBookmark } = useEngagementStore();
  const bookmarked = ready && isBookmarked(course.id, lesson.id);

  return (
    <Button
      size="sm"
      variant="outline"
      type="button"
      disabled={!ready}
      onClick={() =>
        toggleLessonBookmark({
          courseId: course.id,
          courseSlug: course.slug,
          courseTitle: course.title,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
        })
      }
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          Bookmarked
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Bookmark
        </>
      )}
    </Button>
  );
}

export function CourseDiscussionPanel({
  course,
  mode = "student",
}: {
  course: Course;
  mode?: "student" | "instructor";
}) {
  const {
    ready,
    getDiscussions,
    postDiscussion,
    editDiscussion,
    removeDiscussion,
  } = useEngagementStore();
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [error, setError] = useState("");

  const posts = getDiscussions(course.id);
  const threads = useMemo(() => {
    const roots = posts.filter((post) => !post.parentId);
    return roots.map((root) => ({
      root,
      replies: posts.filter((post) => post.parentId === root.id),
    }));
  }, [posts]);

  const author =
    mode === "instructor"
      ? {
          id: currentInstructor.id,
          name: currentInstructor.name,
          role: "instructor" as const,
        }
      : {
          id: DEMO_STUDENT_ID,
          name: currentStudent.name,
          role: "student" as const,
        };

  const submitRoot = () => {
    setError("");
    if (body.trim().length < 3) {
      setError("Write at least 3 characters.");
      return;
    }
    postDiscussion({
      courseId: course.id,
      courseSlug: course.slug,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      body,
    });
    setBody("");
  };

  const submitReply = (parentId: string) => {
    setError("");
    if (replyBody.trim().length < 3) {
      setError("Reply needs at least 3 characters.");
      return;
    }
    postDiscussion({
      courseId: course.id,
      courseSlug: course.slug,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      parentId,
      body: replyBody,
    });
    setReplyTo(null);
    setReplyBody("");
  };

  if (!ready) {
    return <p className="text-sm text-muted">Loading discussion…</p>;
  }

  return (
    <div className="space-y-5 rounded-xl border border-border bg-white p-5">
      <div className="flex items-start gap-3">
        <MessageSquare className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Course discussion
          </h2>
          <p className="mt-1 text-sm text-muted">
            Local demo Q&amp;A for this course only — not shared across devices
            or real users.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder={
            mode === "instructor"
              ? "Post an instructor comment…"
              : "Ask a question or leave a comment…"
          }
        />
        {error && !replyTo ? (
          <p className="text-sm text-danger">{error}</p>
        ) : null}
        <Button size="sm" type="button" onClick={submitRoot}>
          Post
        </Button>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
          <p className="text-sm font-medium text-foreground">No posts yet</p>
          <p className="mt-1 text-sm text-muted">
            Be the first to start a discussion in this browser demo.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {threads.map(({ root, replies }) => (
            <li
              key={root.id}
              className="rounded-lg border border-border bg-surface/40 p-4"
            >
              <PostHeader
                name={root.authorName}
                role={root.authorRole}
                date={root.createdAt}
              />
              {editingId === root.id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={editBody}
                    onChange={(event) => setEditBody(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => {
                        editDiscussion(root.id, author.id, editBody);
                        setEditingId(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {root.body}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {root.authorId === author.id ? (
                  <>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary"
                      onClick={() => {
                        setEditingId(root.id);
                        setEditBody(root.body);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium text-muted hover:text-danger"
                      onClick={() => removeDiscussion(root.id, author.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : null}
                {mode === "instructor" || author.role === "student" ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-primary"
                    onClick={() => {
                      setReplyTo(root.id);
                      setReplyBody("");
                      setError("");
                    }}
                  >
                    Reply
                  </button>
                ) : null}
              </div>

              {replyTo === root.id ? (
                <div className="mt-3 space-y-2 border-t border-border pt-3">
                  <textarea
                    value={replyBody}
                    onChange={(event) => setReplyBody(event.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    placeholder="Write a reply…"
                  />
                  {error && replyTo ? (
                    <p className="text-sm text-danger">{error}</p>
                  ) : null}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => submitReply(root.id)}
                    >
                      Post reply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => setReplyTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}

              {replies.length > 0 ? (
                <ul className="mt-4 space-y-3 border-l-2 border-border pl-4">
                  {replies.map((reply) => (
                    <li key={reply.id}>
                      <PostHeader
                        name={reply.authorName}
                        role={reply.authorRole}
                        date={reply.createdAt}
                      />
                      {editingId === reply.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editBody}
                            onChange={(event) => setEditBody(event.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              type="button"
                              onClick={() => {
                                editDiscussion(reply.id, author.id, editBody);
                                setEditingId(null);
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              type="button"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-foreground">
                          {reply.body}
                        </p>
                      )}
                      {reply.authorId === author.id ? (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            className="text-xs font-medium text-primary"
                            onClick={() => {
                              setEditingId(reply.id);
                              setEditBody(reply.body);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs font-medium text-muted hover:text-danger"
                            onClick={() =>
                              removeDiscussion(reply.id, author.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PostHeader({
  name,
  role,
  date,
}: {
  name: string;
  role: "student" | "instructor";
  date: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-sm font-medium text-foreground">{name}</p>
      <Badge tone={role === "instructor" ? "secondary" : "muted"}>
        {role === "instructor" ? "Instructor" : "Student"}
      </Badge>
      <span className="text-xs text-muted">{formatStudentDateTime(date)}</span>
    </div>
  );
}
