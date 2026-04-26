"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  updated_at: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
  };
}

export default function NoteEditorPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.noteId as string;

  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const saveNote = useCallback(async (noteIdToSave: string, titleToSave: string, contentToSave: string) => {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("notes")
      .update({ title: titleToSave, content: contentToSave })
      .eq("id", noteIdToSave);
    if (error) console.error("Save error:", error);
    setSaving(false);
  }, [user]);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user as User);

      if (noteId === "new") {
        setIsNew(true);
        const { data, error } = await supabase
          .from("notes")
          .insert({ title: "Untitled", content: "", user_id: user.id })
          .select()
          .single();

        if (error) {
          console.error("Insert error:", error);
          setLoading(false);
          return;
        }

        if (data) {
          setNote(data);
          setTitle(data.title);
          setContent(data.content);
          router.replace(`/app/${data.id}`);
        }
        setLoading(false);
      } else {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("id", noteId)
          .single();

        if (error) {
          console.error("Fetch error:", error);
          router.push("/app");
          return;
        }

        if (data) {
          setNote(data);
          setTitle(data.title);
          setContent(data.content);
        } else {
          router.push("/app");
        }
        setLoading(false);
      }
    };
    init();
  }, [noteId, router]);

  useEffect(() => {
    if (!note || !user) return;
    const timeout = setTimeout(() => {
      saveNote(note.id, title, content);
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, content, note, user, saveNote]);

  const handleDelete = async () => {
    if (!note || !confirm("Delete this note?")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("notes").delete().eq("id", note.id);
    router.push("/app");
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--ink-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--canvas)]">
      <main className="flex-1 flex flex-col">
        <header className="h-12 border-b border-[var(--border)] flex items-center px-4 gap-2">
          <Link
            href="/app"
            className="p-1.5 rounded hover:bg-[var(--hover-surface)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[var(--ink-secondary)]" />
          </Link>
          <div className="flex-1" />
          <span className="text-xs text-[var(--ink-tertiary)]">
            {saving ? "Saving..." : "Saved"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting || isNew}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="w-full text-3xl font-semibold text-[var(--ink-primary)] bg-transparent border-none outline-none placeholder:text-[var(--ink-tertiary)] mb-4"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full min-h-[400px] text-base text-[var(--ink-primary)] bg-transparent border-none outline-none resize-none placeholder:text-[var(--ink-tertiary)] leading-relaxed"
            />
          </div>
        </div>
      </main>
    </div>
  );
}