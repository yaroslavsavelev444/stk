"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Contact, MenuEntry } from "./types";

/**
 * Максимальное количество кнопок вокруг основной кнопки.
 *
 * Последняя кнопка при переполнении:
 * "Все контакты"
 */
export const MAX_VISIBLE_CONTACTS = 5;

function toMenuContact(contact: Contact): MenuEntry {
  return {
    ...contact,
    kind: "contact",
  };
}

function createOverflowEntry(): MenuEntry {
  return {
    id: "overflow-all-contacts",
    kind: "overflow",
  };
}

/**
 * Ограничивает количество отображаемых кнопок.
 *
 * Например:
 *
 * 10 контактов ->
 *
 * [1]
 * [2]
 * [3]
 * [4]
 * [Все контакты]
 */
export function buildMenuEntries(contacts: Contact[]): MenuEntry[] {
  if (contacts.length <= MAX_VISIBLE_CONTACTS) {
    return contacts.map(toMenuContact);
  }

  return [
    ...contacts.slice(0, MAX_VISIBLE_CONTACTS - 1).map(toMenuContact),

    createOverflowEntry(),
  ];
}

interface UseFloatingContactsOptions {
  contacts: Contact[];
}

interface UseFloatingContactsResult {
  isOpen: boolean;

  toggle: () => void;

  close: () => void;

  entries: MenuEntry[];

  containerRef: React.RefObject<HTMLDivElement | null>;

  hasContacts: boolean;
}

export function useFloatingContacts({
  contacts,
}: UseFloatingContactsOptions): UseFloatingContactsResult {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => buildMenuEntries(contacts), [contacts]);

  const hasContacts = entries.length > 0;

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const container = containerRef.current;

      if (
        container &&
        event.target instanceof Node &&
        !container.contains(event.target)
      ) {
        close();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  return {
    isOpen,
    toggle,
    close,
    entries,
    containerRef,
    hasContacts,
  };
}
