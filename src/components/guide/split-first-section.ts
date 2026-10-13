import { Children, isValidElement, type ReactNode } from "react";

/**
 * Split a guide body before its second top-level <h2>, so a CTA can sit
 * after the intro and first section. Guide bodies are flat lists of
 * headings, paragraphs and blocks, so the top-level h2s are the section
 * starts. With fewer than two (a short guide, or one whose sections are
 * wrapped), the whole body is the tail and the CTA goes at the top.
 */
export function splitAfterFirstSection(children: ReactNode): { head: ReactNode[]; tail: ReactNode[] } {
  const nodes = Children.toArray(children);
  let seen = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isValidElement(node) && node.type === "h2" && ++seen === 2) {
      return { head: nodes.slice(0, i), tail: nodes.slice(i) };
    }
  }
  return { head: [], tail: nodes };
}
