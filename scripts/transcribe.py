#!/usr/bin/env python3
"""
Transkribiert eine Audiodatei mit faster-whisper und schreibt Word-Level-
Timestamps als JSON raus. Wird von der GitHub Action vor dem Remotion-Render
aufgerufen.

Output-Format (lyrics.json):
[
  {"word": "Ich", "start": 0.32, "end": 0.58},
  {"word": "geh'", "start": 0.58, "end": 0.81},
  ...
]
"""
import argparse
import json
import sys

from faster_whisper import WhisperModel


def transcribe(audio_path: str, model_size: str = "medium") -> list[dict]:
    # int8 auf CPU-Runnern: guter Kompromiss aus Geschwindigkeit und Genauigkeit
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    segments, info = model.transcribe(
        audio_path,
        word_timestamps=True,
        vad_filter=True,          # schneidet Stille/Instrumental-Parts raus
        vad_parameters={"min_silence_duration_ms": 400},
    )

    print(f"Erkannte Sprache: {info.language} (p={info.language_probability:.2f})",
          file=sys.stderr)

    words = []
    for segment in segments:
        if not segment.words:
            continue
        for w in segment.words:
            words.append({
                "word": w.word.strip(),
                "start": round(w.start, 3),
                "end": round(w.end, 3),
            })
    return words


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio", required=True, help="Pfad zur Audiodatei")
    parser.add_argument("--output", required=True, help="Zielpfad für lyrics.json")
    parser.add_argument("--model", default="medium",
                         help="Whisper-Modellgröße (tiny/base/small/medium/large-v3)")
    args = parser.parse_args()

    words = transcribe(args.audio, args.model)

    if not words:
        print("WARNUNG: Keine Wörter erkannt — Stille/Instrumental oder VAD zu aggressiv.",
              file=sys.stderr)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"{len(words)} Wörter geschrieben nach {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
