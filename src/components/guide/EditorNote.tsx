import Image from "next/image";

interface EditorNoteProps {
  /** Name of the editor or contributor (shown in caps under the photo). */
  editorName?: string;
  /** Photo path under /public. Defaults to Andy's portrait. */
  editorImage?: string;
  /** Short role line (e.g. "Editor", "Property finance writer"). */
  editorRole?: string;
  /** The note body. Keep it short, one or two paragraphs maximum. */
  children: React.ReactNode;
}

/**
 * First-person editor's note for opening cornerstone guides. Sits at the
 * top of the article body (between TLDR and the first H2) and gives the
 * piece a human voice. Renders inside the prose-ypg flow but resets prose
 * via not-prose for clean control.
 *
 * Use sparingly: cornerstone guides and pieces where the editorial voice
 * should be loud.
 */
export function EditorNote({
  editorName = "Andy McMaster",
  editorImage = "/images/agents/andy-mcmaster.jpg",
  editorRole = "Editor",
  children,
}: EditorNoteProps) {
  return (
    <aside className="not-prose my-10 rounded-2xl border border-line-warm bg-surface-warm p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full overflow-hidden border border-line-warm">
          <Image
            src={editorImage}
            alt={`${editorName} portrait`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display italic text-primary text-sm leading-none mb-1.5">
            A note from the editor
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-subtle font-sans font-medium mb-4">
            {editorName} · {editorRole}
          </p>
          <div className="font-display font-light text-lg sm:text-xl text-ink leading-[1.4] [&>p:not(:first-child)]:mt-3 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
