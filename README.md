# Lyric Video Pipeline

Audio rein → automatische Transkription (faster-whisper) → Remotion rendert
Waveform + Karaoke-Lyrics → fertiges MP4 als GitHub Artifact und/oder Telegram.

## Setup (einmalig)

1. Repository klonen.
2. Optional für Telegram-Versand, als Repo-Secrets anlegen:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. Falls Trigger via Hermes-Termux gewünscht: ein GitHub PAT mit `repo`-Scope
   erzeugen und in Hermes hinterlegen.
4. Optional lokal prüfen: `cd remotion && npm ci && npm run typecheck`.

## Nutzung — Variante A: Datei pushen

```bash
cp mein_song.mp3 audio/
git add audio/mein_song.mp3
git commit -m "Neuer Track: Kellerlicht"
git push
```
→ Workflow läuft automatisch, Video landet als Artifact + (falls Secrets
gesetzt) auf Telegram.

## Nutzung — Variante B: Von Hermes-Termux aus triggern

Wenn die Audiodatei online erreichbar ist (z.B. temporärer Link, Drive,
eigener Server):

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_PAT" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{
    "event_type": "render-lyric-video",
    "client_payload": {
      "audio_url": "https://.../kellerlicht.mp3",
      "title": "Kellerlicht"
    }
  }'
```

## Manuell testen (workflow_dispatch)

GitHub → Actions → "Lyric Video Rendern" → "Run workflow" → `audio_url` +
`title` eintragen.

## Bekannte Stolpersteine

- **Whisper-Genauigkeit bei Hard-Rap/schnellen Vocals**: `medium`-Modell ist
  der Standard (Kompromiss Geschwindigkeit/Genauigkeit auf CPU-Runnern).
  Bei viel Slang/Ad-libs ggf. `--model large-v3` in der Action anpassen
  (langsamer, aber genauer) — oder Lyrics manuell in `lyrics.json`
  korrigieren, bevor gerendert wird.
- **Rendering-Dauer**: für einen ~3-Minuten-Track realistisch 5–10 Minuten
  Workflow-Laufzeit (Whisper + Remotion-Render zusammen) auf dem Standard-
  Runner.
- **Payload-Limit bei repository_dispatch**: `client_payload` ist auf
  ca. 64 KB begrenzt — deshalb Audio nicht als Base64 mitschicken, sondern
  per `audio_url` verlinken oder direkt pushen (Variante A).
