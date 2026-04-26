"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ChevronDown, ChevronRight, Search, SquarePen, FileText, Settings, Ellipsis, Plus, LogOut } from "lucide-react";

interface Note {
  id: string;
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

export default function AppShell() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fetchNotes = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    setNotes(data || []);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user as User);
      await fetchNotes(user.id);
      setLoading(false);
    };
    getUser();
  }, [router, fetchNotes]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : user?.email?.split("@")[0].slice(0, 2).toUpperCase() || "?";

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";

  return (
    <div className="flex h-screen bg-[var(--canvas)]">
      <aside className="w-[240px] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col">
        <div className="p-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)]">
            <div className="w-5 h-5 bg-[var(--accent)] rounded flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{initials[0]}</span>
            </div>
            <span className="text-sm font-medium text-[var(--ink-primary)] flex-1">
              {displayName}&apos;s Workspace
            </span>
            <ChevronDown className="w-4 h-4 text-[var(--ink-tertiary)]" />
          </div>

          <Link
            href="/app/new"
            className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)]"
          >
            <Search className="w-4 h-4 text-[var(--ink-secondary)]" />
            <span className="text-sm text-[var(--ink-secondary)] flex-1">Search</span>
            <kbd className="px-1.5 py-0.5 bg-[var(--canvas)] border border-[var(--border)] rounded text-xs text-[var(--ink-tertiary)]">⌘K</kbd>
          </Link>

          <Link
            href="/app/new"
            className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)]"
          >
            <SquarePen className="w-4 h-4 text-[var(--ink-secondary)]" />
            <span className="text-sm text-[var(--ink-secondary)]">New page</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <div className="mb-1">
            <div className="px-2 py-1">
              <span className="text-[11px] font-semibold text-[var(--ink-tertiary)] tracking-wider">PRIVATE</span>
            </div>
            {loading ? (
              <div className="px-2 py-1.5 text-sm text-[var(--ink-tertiary)]">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-[var(--ink-tertiary)]">No notes yet</div>
            ) : (
              notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/app/${note.id}`}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)]"
                >
                  <ChevronRight className="w-4 h-4 text-[var(--ink-tertiary)]" />
                  <FileText className="w-[18px] h-[18px] text-[var(--ink-secondary)]" />
                  <span className="text-sm text-[var(--ink-primary)] truncate">{note.title || "Untitled"}</span>
                </Link>
              ))
            )}
          </div>

          <Link
            href="/app/new"
            className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)] text-[var(--ink-tertiary)]"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add a page</span>
          </Link>
        </div>

        <div className="border-t border-[var(--border)] p-2 flex flex-col gap-1">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)]">
            <Settings className="w-4 h-4 text-[var(--ink-secondary)]" />
            <span className="text-sm text-[var(--ink-secondary)]">Settings</span>
          </div>

          <div className="relative">
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[var(--hover-surface)]"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--ink-primary)] truncate">{displayName}</div>
                <div className="text-xs text-[var(--ink-secondary)] truncate">{email}</div>
              </div>
              <Ellipsis className="w-4 h-4 text-[var(--ink-tertiary)]" />
            </div>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[var(--canvas)] border border-[var(--border)] rounded-md shadow-md overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--ink-secondary)] hover:bg-[var(--hover-surface)]"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-12 border-b border-[var(--border)] flex items-center px-4">
          <h1 className="text-sm font-medium text-[var(--ink-primary)]">Pages</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[var(--ink-primary)] mb-2">Welcome to Pagewise</h2>
            <p className="text-sm text-[var(--ink-secondary)] mb-4">Select a page from the sidebar or create a new one</p>
            <Link
              href="/app/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ink-primary)] text-white rounded-md text-sm font-medium hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              New page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}