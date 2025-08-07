---
category: blog
title: "installing osrm with docker for a specific area"
summary: "this guide will walk you through setting up osrm using docker on wsl 2."
guide: true
wip: false
sitemap: false
lang: en
header: "https://example.com/example.jpeg"
translations:
  - lang: tr
    url: /blog/docker-ile-osrm-kurulumu/
  - lang: en
    url: /blog/installing-osrm-via-docker/
---

# installing osrm with docker for a specific working area

this guide will walk you through setting up osrm (open source routing machine) using docker on wsl 2, for this guide i will configure it for the istanbul area. we'll use osmium-tools to clip openstreetmap data to the istanbul region using a polygon boundary file.

## prerequisites

- wsl 2 installed on windows
- docker installed and running in wsl 2
- basic familiarity with command line operations
- sufficient disk space for map data files
- adequate ram for osrm operations (approximately 5x the map file size)

## step 1: install required tools

first, install osmium-tools in your wsl 2 environment:

```bash
sudo apt update
sudo apt install osmium-tool wget curl
```

## step 2: create istanbul polygon boundary file

create a `.poly` file that defines the istanbul boundary. this file uses a simple polygon format to specify the geographic area.

create a file named `istanbul.poly`:

```bash
mkdir data && cd data
nano istanbul.poly
```

add the following content (approximate istanbul boundary):

```
polygon
1
   27.8419996589802 41.681380046807476    // Xmin Ymax
   27.8419996589802 40.72975311315034     // Xmin Ymin
   29.992113225541146 40.72975311315034   // Xmax Ymin
   29.992113225541146 41.681380046807476  // Xmax Ymax
   29.992113225541146 41.681380046807476  // Xmax Ymax (repeat to close polygon)
END
END
```

**note:** or, you can use [https://boundingbox.klokantech.com/](https://boundingbox.klokantech.com/) to retrieve xmin ymin xmax ymax coordinates for your area of interest.

## step 3: download turkey openstreetmap data

download the openstreetmap turkey data from geofabrik:

```bash
wget https://download.geofabrik.de/europe/turkey-latest.osm.pbf
```

## step 4: extract istanbul area using osmium

use osmium-tool to clip the turkey data to just the istanbul area:

```bash
osmium extract -p istanbul.poly turkey-latest.osm.pbf -o istanbul.osm.pbf
```

by clipping the pbf file, we not only get a much smaller `istanbul.osm.pbf` containing just the istanbul area, but also significantly reduce the amount of ram needed by routing machine.

## step 5: set up osrm with docker

now we'll process the istanbul data with osrm using docker containers.

### extract road network

pre-process the istanbul data with the car profile:

```bash
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/istanbul.osm.pbf || echo "extract process failed"
```

the flag `-v "${PWD}:/data"` creates the directory `/data` inside the docker container and makes the current working directory `${pwd}` available there. this process can take some time depending on the size of your data.

### partition and customize

run the partition and customize steps:

```bash
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/istanbul.osrm || echo "partition process failed"
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/istanbul.osrm || echo "customize process failed"
```

**note:** there is no `istanbul.osrm` file, but multiple `istanbul.osrm.*` files. the `istanbul.osrm` is not a file path, but a "base" path referring to a set of files.

#### partition process

the partitioning process in osrm is a fundamental step that enhances the routing engine's efficiency by segmenting the map data into smaller, more manageable parts. the partitioning algorithm's primary objective is to divide the graph, represented by the map data, into \( k \) equal-sized subsets of vertices. this is accomplished by maximizing the number of local edges, which are edges with both endpoints within the same subset.

in graph theory terms, given an undirected graph \( G = (V, E) \), where \( V \) is the set of vertices and \( E \) is the set of edges, the goal is to partition \( V \) into \( k \) subsets such that the number of edges with both endpoints in the same subset is maximized. this strategy reduces the complexity of routing queries by limiting the search space to the relevant partition, thereby improving the performance of dijkstra's algorithm, which osrm uses for shortest path calculations. the algorithm's efficiency is particularly evident as it reduces the running time, which is proportional to the sum of the number of edges and vertices, specifically $ \Theta(&#124;E&#124; + &#124;V&#124;\log&#124;V&#124;) $.

for routing queries that span multiple partitions, osrm employs contraction hierarchies, a sophisticated technique that further accelerates the shortest path computation by precomputing shortcuts in the graph. this dual approach of partitioning and contraction hierarchies ensures that osrm can handle large-scale routing queries with high efficiency and speed.


### start the routing server

start the osrm routing engine http server on port 5000:

```bash
docker run -t -i -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/istanbul.osrm
```

## step 6: test the installation

make requests against the http server to test routing in istanbul:

```bash
curl "http://localhost:5000/route/v1/driving/29.0136,41.0053;28.9784,41.0082?steps=false"
```

it will return something like this:

```json
{"code":"Ok","routes":[{"legs":[{"steps":[],"weight":1097.9,"summary":"","duration":1097.9,"distance":13785.3}],"weight_name":"routability","geometry":"{zgyF{vapDnQ}^kDyShR_GqMuZNsAnH_FoC{LlCuGcN}IcAlCaCeB_AxEd@jAqIzz@hGvo@sEflAWp]nBfTtV|bB`A`[QlJeFpYeA|c@{CjYGfOx@rIs@vAkPHqIkENw[_CU^sJlDaPzMdDnDgUeCeQsBfC}@MwE{RbG{F`DaHfBSbCaDi@mHaGkGbBsC{GaJq@dApA~AqC`F_BmB","weight":1097.9,"duration":1097.9,"distance":13785.3}],"waypoints":[{"hint":"zUZTgf___38XAAAATwAAAGsAAACaAAAAzfLUQbEqdEL0yutCNForQxcAAABPAAAAawAAAJoAAAClFAEA6ba6AWmxcQJgtroB9LBxAgQAPwgAAAAA","location":[29.013737,41.005417],"name":"Burhan Felek Caddesi","distance":17.36628242},{"hint":"9DUegBktqYAGAAAAXAAAAAAAAABqAAAAKfGYQF3DfEIAAAAA19iSQgYAAABcAAAAAAAAAGoAAAClFAEA-zG6AdC4cQLgLLoBSLxxAgAArwIAAAAA","location":[28.979707,41.007312],"name":"Bab-I Hümayun Caddesi","distance":147.6762278}]}
```

### example api endpoints

- **route calculation:** this endpoint calculates the optimal route between specified coordinates using a given profile. use `GET /route/v1/{profile}/{coordinates}` to access it.
- **nearest road:** this endpoint finds the closest road to a given coordinate. access it via `GET /nearest/v1/{profile}/{coordinate}`.
- **distance matrix:** this endpoint provides a matrix of distances and durations between multiple coordinates. it can be accessed with `GET /table/v1/{profile}/{coordinates}`.

## updating the road network on each start

to keep your osrm instance up to date with the latest road network, you can automate the update process every time you start osrm. this involves downloading the newest osm extract, processing it, and then launching the routing server.

### bash approach

here’s a simple bash script that performs these steps:

```bash
#!/bin/bash
set -e
cd data
 
# remove old data files and download the latest osm extract for turkey
rm -f turkey-latest.osm.pbf istanbul.osm.pbf istanbul.osrm*
wget -q https://download.geofabrik.de/europe/turkey-latest.osm.pbf
osmium extract -p istanbul.poly turkey-latest.osm.pbf -o istanbul.osm.pbf

# process with osrm
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/istanbul.osm.pbf
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/istanbul.osrm
docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/istanbul.osrm

# start server
docker run -t -i -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/istanbul.osrm
```

### docker compose approach

for a simpler, automated solution, use docker compose to handle everything in one command. this approach uses two containers:

1. **data-prep**: downloads and prepares the map data
2. **osrm**: processes the data and starts the routing server

#### setup

create a `docker-compose.yml` file in your project directory. you can find the complete configuration at [blog/osrm-docker/docker-compose.yml](/blog/osrm-docker/docker-compose.yml).

#### usage

```bash
# start everything
docker compose up

# run in background
docker compose up -d

# view logs
docker compose logs -f

# stop everything
docker compose down
```

#### what it does

- automatically downloads the latest turkey map data
- extracts just the istanbul area
- processes the data for routing
- starts the routing server on port 5000
- shows detailed progress logs

this is the easiest way to get a fully automated osrm setup that updates with fresh data each time you start it.

## routing profiles

you can use different routing profiles by changing the `-p` parameter:

- **car:** `/opt/car.lua`
- **bicycle:** `/opt/bicycle.lua`
- **foot:** `/opt/foot.lua`

### custom profile

to create a custom osrm profile, you can modify routing behaviors to suit specific needs. here's a brief overview:

1. **profile structure**: a lua script that defines how roads are processed, including nodes, ways, and turns, with settings for speed and penalties.

2. **key components**:
   - **setup**: configures maximum speed, turn penalties, and preferences.
   - **process node**: handles node attributes such as traffic lights.
   - **process way**: sets speed and access rules for road segments.
   - **process turn**: manages turn restrictions and penalties.

3. **example profile**:
   - **speeds**: assign fixed speeds to different road types.
   - **penalties**: establish penalties for traffic signals and u-turns.
   - **exclusions**: identify road classes to exclude from routing.

4. **implementation**:
   - save the script as a `.lua` file.
   - use it with `osrm-extract` and `osrm-contract`.
   - start osrm with your custom profile.

custom profiles allow for optimized routing tailored to specific vehicle types or testing scenarios.

## references

afi.io. (n.d.). *introduction to osrm: setting up osrm backend using docker*. retrieved from [https://www.afi.io/blog/introduction-to-osrm-setting-up-osrm-backend-using-docker](https://www.afi.io/blog/introduction-to-osrm-setting-up-osrm-backend-using-docker). last accessed on 31.07.2025

project osrm. (n.d.). *osrm backend github repository*. github. retrieved from [https://github.com/project-osrm/osrm-backend](https://github.com/project-osrm/osrm-backend). last accessed on 31.07.2025
