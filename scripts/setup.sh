#!/bin/bash

RED="\033[0;31m"
CYAN="\033[0;36m"
LIGHT_GREEN="\033[1;32m"
RESET="\033[0m"

heading() {
  echo -e "\n${CYAN}>>> $1${RESET}"
}

success() {
  echo -e "\n${LIGHT_GREEN}------------------------\n$1\n------------------------${RESET}"
}

error() {
  echo -e "\n${RED}>>> $1${RESET}"
  exit 1
}



# Build the project
heading "Building the project"
yarn build

# Prebuild the RN App}
heading "Prebuilding the RN App"
cd apps/InfiniteRedAI || error "Can't find apps/InfiniteRedAI"
npx expo prebuild

cd ../..

success "✔✔✔ Setup complete!"
