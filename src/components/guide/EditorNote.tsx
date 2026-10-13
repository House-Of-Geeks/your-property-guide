import Image from "next/image";

interface EditorNoteProps {
  /** Name of the editor or contributor. */
  editorName?: string;
  /** Photo path under /public. Defaults to Andy's portrait. */
  editorImage?: string;
  /** Short role line (e.g. "Editor", "Property finance writer"). */
  editorRole?: string;
  /** The note body. Keep it short, one or two paragraphs maximum. */
  children: React.ReactNode;
}

/**
 * First-person editor's note for opening cornerstone guides. Sits in the
 * article body and gives the piece a human voice: the person, their face and
 * role on one line, the note under it at full column width (phones too).
 * Marked .not-prose so article styles don't reach the portrait or text.
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
    <aside className="not-prose my-10 border-l-2 border-ink pl-5 sm:pl-6" aria-label={`A note from ${editorName}`}>
      <div className="flex items-center gap-3">
        <Image
          src={editorImage}
          alt={editorName}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover border border-line"
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">A note from {editorName}</p>
          <p className="mt-0.5 text-sm text-ink-muted">{editorRole}</p>
        </div>
      </div>
      <div className="mt-3 text-[1.0625rem] sm:text-lg text-ink leading-relaxed [&>p+p]:mt-3">
        {children}
      </div>
    </aside>
  );
}
