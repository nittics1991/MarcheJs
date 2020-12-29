#!/bin/bash
#
#   minify_css.sh sourcefile distfile
#

cd "$(dirname $0)"
cd ..

if [[ $# -ne 2 ]] ; then
    echo "error:minify_css.sh sourcefile distfile" 1>&2
    exit 1
fi


if [[ ! -e "$1" ]] ; then
    echo "error:sourcefile not found:$1" 1>&2
    exit 1
fi

if [[ ! -d $(dirname "$2") ]] ; then
    echo "error:dist dir not found:$2" 1>&2
    exit 1
fi

npx cleancss --output="$2" "$1"
