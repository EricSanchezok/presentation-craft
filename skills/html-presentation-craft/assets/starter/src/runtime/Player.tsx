import { useEffect, useRef, useState } from "react";
import type { DeckDefinition, SlideDefinition } from "./types";
import { move, normalize, positionHash, readPosition, validateDeck } from "./navigation";

function Slide({
  slide,
  index,
  count,
  step,
  print = false,
}: {
  slide: SlideDefinition;
  index: number;
  count: number;
  step: number;
  print?: boolean;
}) {
  const { Scene } = slide;
  return (
    <article
      className={`stage layout-${slide.layout ?? "standard"} ${print ? "print-stage" : ""}`}
      aria-label={`${index + 1}. ${slide.title}`}
      data-slide={index + 1}
      data-step={step}
    >
      <header>
        <span>{slide.id}</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </header>
      <div className="heading">
        <h1>{slide.title}</h1>
        {slide.subtitle && <p>{slide.subtitle}</p>}
      </div>
      <div className="scene">
        <Scene step={step} print={print} />
      </div>
      {slide.beats[step].takeaway && <p className="takeaway">{slide.beats[step].takeaway}</p>}
      <footer>
        {slide.source?.url ? (
          <a href={slide.source.url} target="_blank" rel="noreferrer">
            {slide.source.label}
          </a>
        ) : (
          slide.source?.label
        )}
      </footer>
    </article>
  );
}
function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
export function Player({ deck }: { deck: DeckDefinition }) {
  validateDeck(deck);
  const [position, setPosition] = useState(() => readPosition(deck, window.location.hash));
  const [dialog, setDialog] = useState<"notes" | "overview" | null>(null);
  const [focus, setFocus] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const notesButton = useRef<HTMLButtonElement>(null);
  const overviewButton = useRef<HTMLButtonElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const slide = deck.slides[position.slide];
  const go = (direction: -1 | 1) => setPosition((p) => move(deck, p, direction));
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFocus(true);
      setStatus("浏览器未允许全屏，已隐藏控件。按 P 恢复。");
    }
  };
  useEffect(() => {
    document.title = deck.title;
  }, [deck.title]);
  useEffect(() => {
    if (window.location.hash !== positionHash(position))
      history.replaceState(null, "", positionHash(position));
  }, [position]);
  useEffect(() => {
    const restore = () => setPosition(readPosition(deck, location.hash));
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, [deck]);
  useEffect(() => {
    if (!running) return;
    const start = Date.now() - elapsed * 1000;
    const timer = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - start) / 1000)),
      250,
    );
    return () => window.clearInterval(timer);
  }, [running]); // elapsed is captured only when resuming the clock.
  useEffect(() => {
    if (!modal.current) return;
    if (dialog) {
      origin.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      modal.current.showModal();
    } else {
      modal.current.close();
      origin.current?.focus();
    }
  }, [dialog]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return;
      if (dialog) {
        if (event.key === "Escape") {
          event.preventDefault();
          setDialog(null);
        }
        if (event.key === "Tab") {
          const items = [
            ...(modal.current?.querySelectorAll<HTMLElement>(
              'button,a[href],input,textarea,select,[tabindex="0"]',
            ) || []),
          ];
          const first = items[0],
            last = items.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (
        ["ArrowRight", "PageDown"].includes(event.key) ||
        (event.key === " " && !target.closest("button,a"))
      ) {
        event.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setPosition({ slide: 0, step: 0 });
      } else if (event.key === "End") {
        event.preventDefault();
        setPosition(
          normalize(deck, {
            slide: deck.slides.length - 1,
            step: deck.slides.at(-1)!.beats.length - 1,
          }),
        );
      } else if (event.key.toLowerCase() === "n") {
        notesButton.current?.focus();
        setDialog("notes");
      } else if (event.key.toLowerCase() === "o") {
        overviewButton.current?.focus();
        setDialog("overview");
      } else if (event.key.toLowerCase() === "p") setFocus((v) => !v);
      else if (event.key.toLowerCase() === "f") void fullscreen();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  return (
    <main style={deck.theme} className={focus ? "presentation focus-mode" : "presentation"}>
      <div className="live-stage">
        <Slide
          key={slide.id}
          slide={slide}
          index={position.slide}
          count={deck.slides.length}
          step={position.step}
        />
      </div>
      <nav className="controls" aria-label="演示控制">
        <button onClick={() => go(-1)} aria-label="上一步">
          ←
        </button>
        <span className="progress" aria-live="polite">
          {position.slide + 1} / {deck.slides.length} · {position.step + 1} / {slide.beats.length}
        </span>
        <button onClick={() => go(1)} aria-label="下一步">
          →
        </button>
        <button ref={overviewButton} onClick={() => setDialog("overview")}>
          总览 O
        </button>
        <button ref={notesButton} onClick={() => setDialog("notes")}>
          讲稿 N
        </button>
        <button
          onClick={() => setRunning((v) => !v)}
          aria-label={running ? "暂停计时" : "开始计时"}
        >
          {running ? "暂停" : "计时"} {clock(elapsed)}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setElapsed(0);
          }}
          aria-label="重置计时"
        >
          归零
        </button>
        <button onClick={() => void fullscreen()}>全屏 F</button>
        <button onClick={() => window.print()}>打印</button>
        <button onClick={() => setFocus(true)} aria-label="隐藏控件">
          隐藏 P
        </button>
      </nav>
      {focus && (
        <button className="restore" onClick={() => setFocus(false)}>
          显示控件 P
        </button>
      )}
      <span className="sr-only" role="status">
        {status}
      </span>
      <dialog
        ref={modal}
        onCancel={(e) => {
          e.preventDefault();
          setDialog(null);
        }}
        aria-labelledby="dialog-title"
      >
        <div className="dialog-heading">
          <h2 id="dialog-title">{dialog === "notes" ? slide.title : deck.title}</h2>
          <button autoFocus onClick={() => setDialog(null)}>
            关闭 Esc
          </button>
        </div>
        {dialog === "notes" ? (
          <>
            <p className="muted">
              建议用时 {slide.duration} 秒 · 当前：{slide.beats[position.step].label}
            </p>
            <div className="notes">{slide.notes}</div>
          </>
        ) : (
          <>
            <p>
              {deck.subtitle} · 预计 {clock(deck.slides.reduce((sum, s) => sum + s.duration, 0))}
            </p>
            <div className="overview">
              {deck.slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setPosition({ slide: i, step: 0 });
                    setDialog(null);
                  }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </button>
              ))}
            </div>
          </>
        )}
      </dialog>
      <div className="print-deck" aria-hidden="true">
        {deck.slides.map((s, i) => (
          <Slide
            key={s.id}
            slide={s}
            index={i}
            count={deck.slides.length}
            step={s.printStep ?? s.beats.length - 1}
            print
          />
        ))}
      </div>
    </main>
  );
}
