First remove node modules,  dist, .parcel-cache, package.json and package-lock.json as soon as you clone before doing the following steps

1) npm init
2) npm install -g parcel-bundler   (/* use command to get parcel bundler*/) 
3) npm install kaboom

4) Do the follwing 5) and 6) for package.json
5) add "start": "parcel src/index.html -p 8000",
    "build": "parcel build src/index.html",
    to scripts
    
6) Add at the end "alias": {
    "kaboom": "./node_modules/kaboom/dist/kaboom.mjs"
  }
  
  
7) npm run start 
8) Go to localhost: 8000
9) Do production build using "npm run build"

remove "type='module'" from index.html if you get error "parcelRequired is not defined"

Demo of game developed in Fall 2021: https://bhawn.github.io/CSCE_606_Project/index.html
Demo of game developed in Sprint 2022: https://vaccine-hesitancy-game-606.herokuapp.com/