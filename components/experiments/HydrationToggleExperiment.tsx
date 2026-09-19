"use client";

import { useState } from "react";
import { MockBrowser } from "@/components/experiments/MockBrowser";
import { OnOffControl } from "@/components/experiments/OnOffControl";

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  disabledReason?: string;
}

/**
 * One ingredient per row: the name and what it means on the left, its
 * OFF | ON control on the right, inside a single bordered card that turns
 * green when the ingredient is on. Nothing sits between a label and its
 * control, so there is no doubt which one belongs to which.
 */
function ToggleRow({ label, description, value, onChange, disabled, disabledReason }: ToggleRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-md border p-3 transition-colors"
      style={{ borderColor: value && !disabled ? "var(--state-got-it)" : "var(--color-border)", opacity: disabled ? 0.55 : 1 }}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
        <p className="mt-0.5 text-xs leading-snug text-[var(--color-text-muted)]">
          {disabled && disabledReason ? disabledReason : description}
        </p>
      </div>
      <OnOffControl label={label} value={value} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/**
 * Three independent switches (Server HTML, JavaScript, Hydration) and the
 * result of every combination in a mock browser, so "hydration makes it
 * interactive" is something you try rather than something you're told.
 */
export function HydrationToggleExperiment() {
  const [serverHtml, setServerHtml] = useState(true);
  const [javascript, setJavascript] = useState(true);
  const [hydration, setHydration] = useState(true);

  // Hydration needs both server HTML (something to attach to) and JS
  // (something to do the attaching). With no server HTML, React just
  // builds the page itself, which is CSR: visible and clickable together.
  const hydrationApplies = serverHtml && javascript;
  const visible = serverHtml || javascript;
  const interactive = javascript && (serverHtml ? hydration : true);

  let note: string;
  if (!serverHtml && !javascript) {
    note = "No HTML and no JavaScript, so there is nothing to show at all.";
  } else if (!serverHtml) {
    note = "No server HTML, so the page starts blank and JavaScript builds everything in the browser. That's CSR: once it runs, the page is visible and clickable together.";
  } else if (!javascript) {
    note = "The server's HTML shows right away, but with no JavaScript nothing can ever respond to a click.";
  } else if (!hydration) {
    note = "The HTML is visible and the JavaScript has loaded, but hydration hasn't attached the click handlers yet. Click the button to see nothing happen.";
  } else {
    note = "Fully hydrated: the click handlers are attached, so the button works.";
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-2">
          <ToggleRow
            label="Server HTML"
            description="The server sends a finished page, so there is content to show straight away."
            value={serverHtml}
            onChange={setServerHtml}
          />
          <ToggleRow
            label="JavaScript"
            description="The browser downloads and runs the app's code."
            value={javascript}
            onChange={setJavascript}
          />
          <ToggleRow
            label="Hydration"
            description="React attaches click handlers to the server's HTML."
            value={hydration}
            onChange={setHydration}
            disabled={!hydrationApplies}
            disabledReason={
              !javascript
                ? "Needs JavaScript on: something has to do the attaching."
                : "Needs Server HTML on: there is nothing to attach to, React builds the page itself."
            }
          />
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
            What the visitor gets
          </p>
          <MockBrowser visible={visible} interactive={interactive} note={note} />
        </div>
      </div>
    </div>
  );
}
