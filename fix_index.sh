for d in src/features/*/components src/features/*/pages; do
  if [ -d "$d" ]; then
    > "$d/index.ts"
    for f in "$d"/*.ts "$d"/*.tsx; do
      if [ -f "$f" ] && [ "$(basename "$f")" != "index.ts" ]; then
        name=$(basename "$f" | sed 's/\.tsx\?$//')
        echo "export * from './$name';" >> "$d/index.ts"
      fi
    done
    if [ -d "$d/chat-widgets" ]; then
      echo "export * from './chat-widgets';" >> "$d/index.ts"
    fi
  fi
done
