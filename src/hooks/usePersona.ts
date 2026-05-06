"use client";

import { useCallback, useEffect, useState } from "react";
import { PERSONA_STORAGE_KEY, PERSONA_BY_ID, type PersonaId } from "@/lib/constants/journey";

// Persona-aware hook. Stores the user's chosen persona (first-home / selling /
// upgrading / investing) in localStorage so persona-tailored CTAs can render
// downstream without forcing the user to re-pick. SSR-safe.

const PERSONA_CHANGE_EVENT = "ypg:persona-change";

function readPersona(): PersonaId | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(PERSONA_STORAGE_KEY);
    return v && v in PERSONA_BY_ID ? (v as PersonaId) : null;
  } catch {
    return null;
  }
}

function writePersona(id: PersonaId | null) {
  if (typeof window === "undefined") return;
  try {
    if (id === null) {
      window.localStorage.removeItem(PERSONA_STORAGE_KEY);
    } else {
      window.localStorage.setItem(PERSONA_STORAGE_KEY, id);
    }
    window.dispatchEvent(new CustomEvent(PERSONA_CHANGE_EVENT, { detail: id }));
  } catch {
    // localStorage may be disabled (private mode); fail silently.
  }
}

export interface UsePersonaReturn {
  persona: PersonaId | null;
  setPersona: (id: PersonaId | null) => void;
  isHydrated: boolean;
}

export function usePersona(): UsePersonaReturn {
  const [persona, setPersonaState] = useState<PersonaId | null>(null);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPersonaState(readPersona());
    setHydrated(true);
  }, []);

  useEffect(() => {
    function onChange(e: Event) {
      const detail = (e as CustomEvent<PersonaId | null>).detail;
      setPersonaState(detail ?? null);
    }
    function onStorage(e: StorageEvent) {
      if (e.key === PERSONA_STORAGE_KEY) setPersonaState(readPersona());
    }
    window.addEventListener(PERSONA_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(PERSONA_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setPersona = useCallback((id: PersonaId | null) => {
    setPersonaState(id);
    writePersona(id);
  }, []);

  return { persona, setPersona, isHydrated };
}
