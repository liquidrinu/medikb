#!/bin/bash

### concat script-files to single file

# initialize new file (overrides old bundle)
rm './medikb.html'
touch './medikb.html'

cat "./assets/h1.txt" >> ./medikb.html;
cat "./src/styles.css" >> ./medikb.html;
cat "./assets/h2.txt" >> ./medikb.html;
cat "./src/main.js" >> ./medikb.html;
cat "./assets/h3.txt" >> ./medikb.html;
