---
layout: project
lang: en
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
iptv-tui is a terminal client for m3u playlists and xtream codes. browse live tv, movies and series, read the epg, and play through mpv, picking up where you left off. it can also send a stream to a chromecast from the same screen.

one go binary, no cgo, no account, no web ui. sources and the epg are cached on disk, so startup is instant and works offline. the demo above runs on pseudo data.

## features

- live, vod and series over m3u and xtream codes, with favorites and history
- epg from xmltv, cached to disk
- mpv playback with position tracking, so vod and series resume on the next launch
- chromecast: scans the lan, casts the stream, keeps playing after you quit. dash (`.mpd`) plays direct, everything else proxies through your machine
- 8 color palettes, all wcag aa: gruvbox, dracula, nord, tokyo night, solarized, one light, catppuccin latte

## install

needs go 1.27+ and [mpv](https://mpv.io) on `PATH`, or an absolute player path in settings.

```sh
go install github.com/mertturunc/iptv-tui@latest
```

the binary lands in `~/go/bin` (`%USERPROFILE%\go\bin` on windows). add that folder to `PATH` if `iptv-tui` isn't found. prebuilt binaries with `SHA256SUMS` are on the [releases](https://github.com/mertturunc/iptv-tui/releases) page.

## usage

```sh
iptv-tui                        # launch the tui
iptv-tui -play <url>            # play a url or file with mpv, then exit
iptv-tui -add-source <m3u-url>  # add a source, then exit
iptv-tui -ascii                 # plain-ascii rendering
```

| key | action |
| --- | --- |
| `enter` / `o` | play (`enter` also expands groups and series) |
| `c` | send to tv |
| `e` | epg |
| `f` | favorites |
| `/` | filter |
| `1` `2` `3` | live, movies, series (xtream) |
| `?` | all keys, in app |

## build

```sh
go vet ./...
go test ./...
```

source and issues on [github](https://github.com/mertturunc/iptv-tui).
