#!/bin/bash
export NODE_VER=$(node -v)
NODE_VER=${NODE_VER:1:2}
NODE_VER=${NODE_VER/./}
echo "NODE_VER=${NODE_VER}"
export BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)
echo "BRANCH=${BRANCH}"
GK=0
if [[ "${BRANCH}" == greenkeeper/* ]]; then
  GK=1
fi
echo npm install
npm install
npm run bootstrap
