---
category: blog
title: "vibe coding a chrome extension"
summary: "after taking a huge meaningless break in blogging scene i finally managed to start writing again."
lang: en
geo: true
hidden: true
sitemap: false
---

# intro
after taking a huge meaningless break in blogging scene i finally managed to start writing again. i was going to use my [old github page](tab:https://mertturunc.github.io/) but with current dependencies github cannot build the site therefore i don't know how to fix it so here we are. for a short recap, i'm currently working as a gis specialist in a company. in my daily workflow, i use python and [arcade](tab:https://developers.arcgis.com/arcade/), which is a restricted language of arcgis that looks like javascript in appearance.

recently, cursor [announced](tab:https://www.cursor.com/students) their free 1 year pro plan for students. luckily i'm pursuing a master's education so i instantly grabbed my free plan. in my daily work, i generally use claude to fix my broken python code or to create basic code snippets for arcpy library and arcade. on the one hand, there are times when i avoid using it because i want to get better at python and learn front-end, but in a business environment, tasks may not allow enough time for you to learn.

there are a lot of extensions that i actively use in google chrome. as such, i inevitably started to make small solutions for my own needs by taking advantage of the situation when llms are in their golden age. the only tangible extension i managed to make was the extension that allows me to display a full screen if a screen is shared in google meet, but the extension that tries to keep the positional information of the visited sites in local storage has allowed me to create the basis of the plugin i am currently working on.
# the yellow site
[sahibinden.com](tab:https://www.sahibinden.com/) is a popular turkish classifieds platform for buying and selling real estate, vehicles, and second-hand goods and it's pretty old they started this website around the 2000s. due to its old age and the wide distribution of users, the interface within the platform is still simple. the site offers users detailed filtering options when searching for listings, the ability to save favorite listings and track price changes, and the ability to view home listings together on a map.

however, since i am a geomatics engineer with a gis expertise, i am trying to find an answer to the question of how to improve sahibinden.com spatially and ux-wise.

## missing features
