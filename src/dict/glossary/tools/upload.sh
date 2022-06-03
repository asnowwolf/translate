#!/usr/bin/env sh

cd $(dirname $0)/..

mkdir merged

cat programming.tsv angular.tsv >merged/angular.tsv
gsutil cp merged/angular.tsv gs://nt-glossaries/angular.tsv

cat programming.tsv angular.tsv material.tsv >merged/material.tsv
gsutil cp merged/material.tsv gs://nt-glossaries/material.tsv

cat programming.tsv spring.tsv >merged/spring.tsv
gsutil cp merged/spring.tsv gs://nt-glossaries/spring.tsv
