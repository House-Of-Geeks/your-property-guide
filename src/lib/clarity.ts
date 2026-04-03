"use client";

import Clarity from "@microsoft/clarity";

export function clarityIdentify(
  userId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string
) {
  try {
    Clarity.identify(userId, sessionId, pageId, friendlyName);
  } catch {}
}

export function clarityTag(key: string, value: string | string[]) {
  try {
    Clarity.setTag(key, value);
  } catch {}
}

export function clarityEvent(name: string) {
  try {
    Clarity.event(name);
  } catch {}
}

export function clarityConsent() {
  try {
    Clarity.consent();
  } catch {}
}
