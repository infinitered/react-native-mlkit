#!/bin/bash

args=("$@")

# Check conditions
if [[ -t 1 && (-z "$CI" && -z "$EXPO_NONINTERACTIVE" && -z "$TURBO_HASH") ]]; then
  args+=("--watch")
fi

# Run TypeScript compiler with arguments
tsc "${args[@]}"
