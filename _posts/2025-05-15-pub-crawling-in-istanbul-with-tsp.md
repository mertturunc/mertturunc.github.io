---
category: blog
title: "mapping istanbul’s booziest routes with tsp"
summary: "how can we visit as many great pubs as possible without walking all over the place?"
lang: en
geo: true
hidden: true
sitemap: false
---


## introduction

exploring a vibrant city like istanbul presents a fun optimization challenge: how can we visit as many great pubs as possible without walking all over the place? this is exactly the kind of problem we enjoy solving for fun—mixing geospatial analysis with a bit of algorithmic flair.

in this project, we approached pub crawling as a variation of the traveling salesman problem (tsp). instead of solving one huge tsp across the entire city, we used geospatial clustering to group nearby venues into walkable clusters. then, we optimized the route within each cluster to keep things efficient—and the drinks flowing. it’s a playful blend of maps, math, and nightlife.

## the problem

istanbul offers hundreds of bars, pubs, and nightlife venues scattered across the city. visiting all of them in a single trip is impractical due to:

1. the sheer number of venues
2. the geographical spread of the city
3. the limited time available for any visitor

our goal was to create an algorithm that:
- groups venues into walkable clusters
- ensures each cluster has a reasonable number of pois
- generates optimal routes within each cluster
- presents the results visually for easy navigation

## methods and technologies

### data collection and preparation

we started with a dataset of istanbul pois containing geographical coordinates (latitude and longitude) for each venue. the data was structured as follows:

```python
# sample data structure
{
  "name": "venue name",
  "lat": 41.0082,
  "lon": 28.9784,
  "type": "bar"
}
```

### clustering approaches

we implemented and compared several clustering methods:

1. **dbscan** (density-based spatial clustering of applications with noise)
   - advantages: automatically determines number of clusters, handles noise points
   - parameters: `eps` (maximum distance between points), `min_samples` (minimum points to form a cluster)

2. **k-means**
   - advantages: simple, well-known, creates evenly-sized clusters
   - parameters: `n_clusters` (number of clusters to create)

3. **hierarchical clustering**
   - advantages: creates intuitive distance-based clusters
   - parameters: `max_distance` (maximum distance between any two points in a cluster)

for our final implementation, we used a hybrid approach:
- initial clustering with dbscan
- splitting of large clusters based on maximum distance
- further splitting to ensure no cluster exceeds a maximum number of pois

### the traveling salesman problem

once we had our clusters, we needed to determine the optimal route within each cluster. we used the lkh (lin-kernighan-helsgaun) algorithm, one of the most efficient tsp solvers available:

1. for each cluster, we created a tsp file with node coordinates
2. used the lkh solver to find the optimal tour
3. mapped the results back to the original pois

### constraints and parameters

our solution had to satisfy multiple constraints:
- **maximum distance**: no two points in a cluster should be more than 0.5 km apart (walkable distance)
- **maximum pois**: each cluster should contain at most 35 pois (reasonable for a single outing)
- **minimum pois**: clusters with fewer than 3 pois were excluded (not worth optimizing)

## implementation

the implementation followed a modular workflow:

```
1. extract pois from data source
2. cluster pois using selected algorithm
3. split large clusters to meet constraints
4. generate tsp files for each valid cluster
5. solve tsp for each cluster using lkh
6. visualize results on interactive maps
```

### key algorithms

the core of our clustering approach is implemented as follows:

```python
# initial dbscan clustering
db = dbscan(eps=eps, min_samples=min_samples).fit(x_scaled)
labels = db.labels_

# split clusters that exceed maximum distance
for cluster_id in clusters_to_check:
    cluster_points = pois[pois['cluster'] == cluster_id]
    # calculate maximum distance within cluster
    max_dist = calculate_max_distance(cluster_points)
    if max_dist > args.max_distance:
        # split cluster using hierarchical clustering
        split_cluster(cluster_points, max_distance=args.max_distance)

# split clusters that have too many pois
for cluster_id in clusters_to_check:
    cluster_points = pois[pois['cluster'] == cluster_id]
    if len(cluster_points) > args.max_pois:
        # split cluster using k-means or hierarchical clustering
        split_cluster_by_size(cluster_points, max_pois=args.max_pois)
```

### distance calculation

a critical component was the accurate calculation of distances between venues. we used the haversine formula to compute geospatial distances:

```python
def haversine(lat1, lon1, lat2, lon2):
    """calculate the great circle distance between two points in kilometers"""
    # convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # radius of earth in kilometers
    return c * r
```

## results and visualization

our algorithm successfully:
1. processed 446 pois across istanbul
2. generated 118 distinct clusters
3. created 46 valid cluster files for tsp solving (clusters with ≥3 pois)
4. produced optimized routes within each cluster

### cluster statistics

| cluster size | number of clusters |
|--------------|-------------------|
| 1-2 pois     | 72                |
| 3-10 pois    | 22                |
| 11-20 pois   | 11                |
| 21-30 pois   | 8                 |
| 31-35 pois   | 5                 |

the visualization was implemented using folium, creating interactive html maps with:
- color-coded clusters
- popup information for each venue
- lines showing the optimal tour within each cluster
- statistics about each cluster (number of pois, maximum distance)

## challenges and solutions

throughout the project, we encountered several challenges:

1. **balancing cluster size and walkability**
   - solution: implemented a hierarchical splitting approach with distance and size constraints

2. **handling noise points from dbscan**
   - solution: assigned noise points to their nearest cluster

3. **tour mismatch after re-clustering**
   - solution: implemented a workflow that regenerates both clusters and tours

4. **performance with large distance matrices**
   - solution: used optimized algorithms for distance calculation and matrix operations

## conclusion

this project demonstrates a practical application of clustering algorithms and tsp solvers to a real-world optimization problem. the approach successfully breaks down a complex city-wide optimization challenge into manageable neighborhood-sized problems.

the methodology is extensible to other cities and types of pois, making it valuable for tourism planning, logistics optimization, and urban exploration.

future improvements could include:
- integration with real-time traffic data
- consideration of venue opening hours
- user preferences for venue selection
- multi-day planning for larger clusters

## code availability

the complete implementation is available as a set of python scripts that handle:
- data preparation and poi extraction
- clustering and constraint enforcement
- tsp file generation and solving
- result visualization

the workflow is designed to be modular and adaptable to different parameters and constraints.

---

*this project combines concepts from computational geometry, operations research, and geospatial analysis to create an efficient and practical solution to the age-old question: "where should we go next?"* 