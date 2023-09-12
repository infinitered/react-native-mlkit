#!/bin/bash

SED_COMMAND="sed -i .bak"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'  # No Color

# Define the rename rules as indexed array pairs
RENAME_RULES=(
  "ExpoMLKit:RNMLKit"
  "ExpoMlKit:RNMLKit"
  "expo-mlkit:react-native-mlkit"
  "expomlkit:reactnativemlkit"
)

# Function to safely escape strings for sed
sed_escape() {
  echo "$1" | sed -e 's/\\/\\\\/g' -e 's/[\/&]/\\&/g' -e 's/\./\\./g'
}

# Function to replace inside files
replaceInFiles() {
  local FROM_STRING="$1"
  local TO_STRING="$2"

  # Iterate through files directly, excluding the script itself ('rr.sh'), .git directory, and binary files
  for file in $(find "$TARGET_PATH" -type f -not -path "*/.git/*" -not \( -iname "*.tflite" -o -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "string-replace.log" \)); do
    if [ "$file" != "./rr.sh" ]; then
      echo "checking $file"
      # Use plain string replacement without regular expression interpretation
      content=$(<"$file")
      new_content="${content//$FROM_STRING/$TO_STRING}"

      # Check if the content has changed before updating the file
      if [ "$content" != "$new_content" ]; then
        echo -e "${GREEN}Modifying:${NC} $file ${RED}$FROM_STRING${NC} -> ${GREEN}$TO_STRING${NC}" | tee -a string-replace.log
        echo "$new_content" > "$file"
      fi
    fi
  done
}

# Function to rename files
renameFiles() {
  local FROM_STRING="$1"
  local TO_STRING="$2"

  # Rename files first
  find "$TARGET_PATH" -type f -not -path "*/.git/*" -not \( -iname "*.tflite" -o -iname "*.jpg" -o -iname "*.png" -o -iname "*.jpeg" -o -iname "string-replace.log" \) -exec bash -c '
    for file; do
        new_file="${file//$0/$1}"
        if [ "$file" != "$new_file" ]; then
            echo -e "${GREEN}Renaming:${NC} ${RED}$file${NC} -> ${GREEN}$new_file${NC}" | tee -a string-replace.log
            mv "$file" "$new_file"
        fi
    done
  ' "$FROM_STRING" "$TO_STRING" {} +
}

# Function to rename directories
renameDirs() {
  local FROM_STRING="$1"
  local TO_STRING="$2"

  # Rename directories next in a depth-first fashion
  find "$TARGET_PATH" -type d -not -path "*/.git/*" -exec bash -c '
    for dir; do
        new_dir="${dir//$0/$1}"
        if [ "$dir" != "$new_dir" ]; then
            echo -e "${GREEN}Renaming:${NC} ${RED}$dir${NC} -> ${GREEN}$new_dir${NC}" | tee -a string-replace.log
            mv "$dir" "$new_dir"
        fi
    done
  ' "$FROM_STRING" "$TO_STRING" {} +
}

# Define the target path
TARGET_PATH="."

# Log the start of the script
echo -e "${GREEN}Starting the string replacement script.${NC}" | tee -a string-replace.log

# Apply each rename rule to replace text in files
for rule in "${RENAME_RULES[@]}"; do
  IFS=":" read -r FROM_STRING TO_STRING <<< "$rule"
  echo -e "${GREEN}Applying rule:${NC} Replace '$FROM_STRING' with '$TO_STRING' in files" | tee -a string-replace.log
  replaceInFiles "$FROM_STRING" "$TO_STRING"
done

# Apply each rename rule to rename files
for rule in "${RENAME_RULES[@]}"; do
  IFS=":" read -r FROM_STRING TO_STRING <<< "$rule"
  echo -e "${GREEN}Applying rule:${NC} Rename files: '$FROM_STRING' to '$TO_STRING'" | tee -a string-replace.log
  renameFiles "$FROM_STRING" "$TO_STRING"
done

# Apply each rename rule to rename directories
for rule in "${RENAME_RULES[@]}"; do
  IFS=":" read -r FROM_STRING TO_STRING <<< "$rule"
  echo -e "${GREEN}Applying rule:${NC} Rename directories: '$FROM_STRING' to '$TO_STRING'" | tee -a string-replace.log
  renameDirs "$FROM_STRING" "$TO_STRING"
done

# Log the end of the script
echo -e "${GREEN}String replacement script finished.${NC}" | tee -a string-replace.log
