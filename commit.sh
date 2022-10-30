#!/bin/sh
set -e
BRANCH=$(git branch --show-current)
git add -A
git commit -m "$*"

if [ -z "$(git ls-remote --heads --exit-code origin "$(git symbolic-ref --short HEAD)")" ]
then
	git push -u origin "$BRANCH"
	echo "Pushed changes and set upstream branch"
else
	git push
	echo "Pushed changes to origin branch"
fi