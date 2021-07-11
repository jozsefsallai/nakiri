#!/bin/bash

mkdir -p public/docs;
rm -rf public/docs/*;
npx insomnia-documenter -c insomnia.json -l public/favicon-48x48.png -o public/docs;
rm public/docs/insomnia.json;
cp public/favicon.ico public/docs/favicon.ico;
sed -i 's/id="app"/id="app" data-root="\/docs"/g' public/docs/index.html
