/**
 * Copies `value` to the clipboard.
 *
 * Prefers the async Clipboard API (`navigator.clipboard.writeText`), which
 * requires a secure context (https/localhost). Falls back to the legacy
 * `document.execCommand('copy')` trick for older browsers or non-secure
 * contexts, so the "copy" affordance in FloatingContactItem keeps working
 * even where the modern API is unavailable.
 *
 * Resolves to `true` on success, `false` if every strategy failed — callers
 * decide how to surface that (e.g. a toast) without this module depending
 * on any UI library.
 */
export async function copyToClipboard(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the legacy strategy (e.g. permission denied).
    }
  }

  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);

  const previousSelection = document.getSelection();
  const previousRange =
    previousSelection && previousSelection.rangeCount > 0
      ? previousSelection.getRangeAt(0)
      : null;

  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }

  document.body.removeChild(textarea);

  if (previousSelection && previousRange) {
    previousSelection.removeAllRanges();
    previousSelection.addRange(previousRange);
  }

  return succeeded;
}
