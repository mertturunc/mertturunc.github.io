---
category: blog
title: "vibe coding a chrome extension"
summary: "after taking a huge break in blogging scene i finally managed to start writing again."
lang: en
published: false
starred: false
hidden: true
sitemap: false
---

# intro
after taking a huge meaningless break in blogging scene i finally managed to start writing again. for a short recap, i'm currently working as a gis specialist in a company. in my daily workflow, i use python and [arcade](tab:https://developers.arcgis.com/arcade/), which is a restricted language of arcgis that looks like javascript in appearance.

recently, cursor [announced](tab:https://www.cursor.com/students) their free 1 year pro plan for students. luckily i'm pursuing a master's education so i instantly grabbed my free plan. in my daily work, i generally use claude to fix my garbage python codes or to create basic code snippets for arcpy library and arcade. on the one hand, there are times when i avoid using it because i want to get better at python and learn front-end, but in a business environment, tasks may not allow enough time for you to learn.

there are a lot of extensions that i actively use in google chrome. as such, i inevitably started to make small solutions for my own needs by taking advantage of the situation when llms are in their golden age. the only tangible extension i managed to make was the extension that allows me to display a full screen if a screen is shared in google meet, but the extension that tries to keep the positional information (latitude and longitude) of the visited sites in local storage has allowed me to create the basis of the plugin i am currently working on.

# the yellow site

[sahibinden.com](tab:https://www.sahibinden.com/) is a popular turkish classifieds platform for buying and selling real estate, vehicles, and second-hand goods and it's pretty old they started this website around the 2000s. due to its old age and the wide distribution of users, the interface within the platform is still simple. the site offers users detailed filtering options when searching for listings, the ability to save favorite listings and track price changes, and the ability to view home listings together on a map.

[screenshot of sahibinden]

however, since i'm in a geospatial field, i am trying to find an answer to the question of 'how to improve sahibinden.com's real estate listings spatially and ux-wise?'.

# my findings

## favorite ad listings

the main thing i missed out in favorite ad listings is a map. on my recent adventure of finding a rental place to live in istanbul i grouped my ads in multiple groups and named each one as district names. when you collect ads as district wise you expect them to see all in a single map that will also show point of interests (pois), transportation networks or user specific needs et cetera. 

[screenshot of fav ad listing page]

on google chrome if you set up a service worker for your extension it can visit sites while you are staying in the same page. with the same logic we can give task to our worker for gathering locations of ads on the fav ad page.

but we have to solve a much bigger problem, the poi dataset. sahibinden has it's own dataset provided by başarsoft. 

ama baktığın zaman hem favori haritaları olmadığı için oraya çağırmak zor olabilir (lisans telif ayıp) hem de skorlama sistemi bulunmuyor. 5 10 15 yürüme mesafesi isochroneları ile taçlandırılabilir.

transportation, education, building complexes, health, shopping, green areas, cultural sites

### dataset

at first glance openstreetmap's data should resolve our issues but unfortunately openstreetmap in turkey is not that populated that much. in istanbul, ankara and other crowded cities we have data but other cities suffers from lack of information. besides from lack of information also data update rate is very important too.

currently open data is a very popular topic in municipalities, those with more population and development have already started to launch open data portals and are trying to maintain them. with this abundance of local data we can combine osm's data and municiplaties open source datasets to achive much more accurate poi information.

so now our data source is set we need to settle our needs. since our focus is on real estate ads we should set our scoring system.

### scoring system


### isochrones

## filter pane

### lack of sliders

## ad page map

## custom profile page

# the extension

# conclusion