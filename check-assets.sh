#!/bin/sh
# Run before pushing:  sh check-assets.sh
# GitHub Pages is CASE-SENSITIVE, so this lists any missing / wrongly-cased file.
missing=0
for f in $( (grep -oE '(src|href)="img/[^"]+"' index.html | sed -E 's/^(src|href)="//; s/"$//'; grep -oE "url\('img/[^']+'\)" style.css | sed -E "s/^url\('//; s/'\)$//") | sort -u ); do
  if [ ! -f "$f" ]; then echo "MISSING: $f"; missing=1; fi
done
[ $missing -eq 0 ] && echo "All files found. Safe to push." || echo "Add the files above, then push."
