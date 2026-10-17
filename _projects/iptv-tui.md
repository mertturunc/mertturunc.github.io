---
layout: project
title: iptv-tui
title_en: iptv-tui
category: ai-native
category_en: ai-native
date: 2026-10-12
description: m3u ve xtream codes için terminalde çalışan iptv istemcisi. canlı/vod/dizi, epg, chromecast, mpv ile oynatma. go ile yazıldı.
description_en: terminal iptv client for m3u and xtream codes. live/vod/series, epg, chromecast, playback through mpv. written in go.
has_full_page: true
show_carousel: true
carousel_images: "demo.gif"
carousel_alts: "iptv-tui terminal demosu"
carousel_alts_en: "iptv-tui terminal demo"
site_url: https://github.com/mertturunc/iptv-tui
---
browse live, vod and series, read the epg, send to tv over chromecast, play through mpv with resume. the gif above runs on pseudo demo data.

## try it

needs go 1.27+ and `mpv` on `path` ([mpv.io](https://mpv.io)), or an absolute player path in settings. every route below leaves a bare `iptv-tui` on `path`.

macos:

```sh
brew install go mpv
go install github.com/mertturunc/iptv-tui@latest
```

if `command -v iptv-tui` finds nothing, add go's bin dir once:

```sh
echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

linux:

install go 1.27+ and mpv from your package manager or go.dev, then:

```sh
go install github.com/mertturunc/iptv-tui@latest
echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

windows (powershell):

```powershell
go install github.com/mertturunc/iptv-tui@latest
```

binary lands at `%USERPROFILE%\go\bin\iptv-tui.exe`. if `where iptv-tui` finds nothing, append that folder to your user `path` once, then open a new terminal:

```powershell
[Environment]::SetEnvironmentVariable('Path', $env:Path + ';$HOME\go\bin', 'User')
```

no go toolchain? grab the zip for your os from [releases](https://github.com/mertturunc/iptv-tui/releases), unzip, put the binary on `path`, verify against `SHA256SUMS` in the same release.

## use it

```sh
iptv-tui                  # launch the tui
iptv-tui -play <url>      # play a url or file directly with mpv, then exit
iptv-tui -add-source <m3u-url>  # add an m3u source, then exit
iptv-tui -version
iptv-tui -ascii           # plain-ascii rendering (also IPTV_TUI_ASCII=1)
```

keys (`?` in-app shows them, `←/→` inside help previews themes):

- `up/down`, `pgup/pgdn` navigate · `tab`, `left/right` (`h`/`l`) switch group and channel panes · `g` jumps to groups
- `enter` plays or expands · `o` plays · `c` sends to tv · `f` favorites · `/` filters
- inside series: `tab`, `left/right` switch season and episode panes · `backspace`/`esc` back to series
- `e` epg · `0-9` + `enter` jumps by channel number · `1/2/3` live, movies, series on xtream
- `s` sources · `a` adds · `k` toggles m3u and xtream in the add form · `d` deletes · `r` reloads · `x` stops mpv and tv · `m` keeps mpv on quit · `q` quits

playback position for vod and series resumes with `--start` on next launch. that needs mpv: without it the app falls back to vlc, then mpc-hc, which play fine but report no position, so no duration meter and no resume. if the playbar says `waiting for player…`, the mpv link never came up.

send to tv: press `c` on any channel. the sheet scans the lan for receivers or takes a typed address, remembers the last good tv, and keeps playing after quit like keep-mpv-on-quit. except dash (`.mpd`), streams proxy through your machine so provider headers travel server-side and throughput is measured; dash pulls direct with no headers and no bitrate. while casting the sheet polls receiver status every 2s: state, position, rate, drift, stalls, plus a proxy-throughput sparkline.

## what is inside

- live, vod, series over m3u and xtream codes, with favorites and history
- epg from xmltv, cached to disk so startup works offline and feels instant
- mpv launch with ipc position tracking, one-per-line `MpvArgs`, custom user agent
- chromecast send-to-tv: lan scan, castv2 sender, hls rewrite behind the proxy, no cgo
- 8 palettes, wcag aa pairs: gruvbox dark hard (default), dracula, nord, tokyo night, gruvbox light hard, solarized light, one light, catppuccin latte
- data on first run: `%AppData%\iptv-tui` on windows, `~/.config/iptv-tui` on linux, `~/Library/Application Support/iptv-tui` on macos

## build

```sh
go vet ./...
go test ./...
gofmt -l .
```

screenshots regenerate from pseudo demo data with `IPTV_TUI_GEN_SHOTS=1 go test ./internal/tui/ -run TestGenShots` plus `python3 docs/screenshots/render.py`. debug logging: `IPTV_TUI_DEBUG=1 iptv-tui` clears and records the cast path end to end; urls in the log carry host plus shape only.
