#!/usr/bin/env bash
set -x
which node
node -v
hash -t node || true
echo PATH=$PATH
strace -f -e execve -o strace.log npm run dev 2>&1 | head -n 40
