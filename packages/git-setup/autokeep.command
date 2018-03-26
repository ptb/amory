#!/bin/sh
# Initialize New Terminal

if test -z "${1}"; then
  osascript - $0 << EOF
    on run { this }
      tell app "Terminal" to do script "source " & quoted form of this & " 0"
    end run
EOF
fi

# Define Function =ask=

ask () {
  osascript << EOF 2> /dev/null
    tell app "System Events" to return text returned of (display dialog "${1}" with title "${1}" buttons {"Cancel", "${2}"} default answer "${3}")
EOF
}

# Define Function =run=

run () {
  osascript << EOF 2> /dev/null
    tell app "System Events" to return button returned of (display dialog "${1}" with title "${1}" buttons {"${2}", "${3}"} cancel button 1 default button 2 giving up after 5)
EOF
}

# Define Function =github_username=

github_username () {
  if git config github.user > /dev/null 2>&1; then
    a="$(git config github.user)"
  elif git config user.email > /dev/null 2>&1; then
    a=$(curl --location --silent \
      "https://api.github.com/search/users?q=$(git config user.email)" | \
      sed -n 's/^.*html_url.*: ".*\.com\/\(.*\)".*/\1/p')
  fi

  if test -n "${a}"; then
    open "https://github.com/${a}?tab=repositories"
    printf "${a}"
  else
    printf "$(ask 'GitHub username' 'OK' '')"
  fi
}

# Define Function =autokeep=

autokeep () {
  if test -n "${1}"; then
    git init --separate-git-dir="${1}"
    echo "gitdir: ${1}" > .git
    echo "${1}/" >> "$(git rev-parse --git-dir)/info/exclude"
  elif ! git rev-parse --git-dir > /dev/null 2>&1; then
    git init
  fi

  if ! git rev-parse --verify HEAD > /dev/null 2>&1; then
    git commit --allow-empty --allow-empty-message --message=
  fi

  autokeep_remote
  autokeep_push
  autokeep_gitignore
  autokeep_post_commit
  autokeep_launchagent
}

# Define Function =autokeep_remote=

autokeep_remote () {
  if ! git ls-remote --exit-code > /dev/null 2>&1; then
    a=$(github_username)
    b="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

    test -n "${a}" && \
      c="git@github.com:${a}/$(basename ${b}).git"

    d=$(ask "Remote Git Repository" "Add Remote" "${c}")

    test -n "${d}" && \
      git remote add origin "${d}"
  fi
}

# Define Function =autokeep_push=

autokeep_push () {
  if git ls-remote --exit-code > /dev/null 2>&1; then
    if git push --all --porcelain --set-upstream origin | grep -q "rejected"; then
      if ! run "Git push failed. Force push?" "Force Push" "Cancel"; then
        git push --all --force --set-upstream origin
      fi
    fi
  fi
}

# Define Function =autokeep_gitignore=

autokeep_gitignore () {
  cat << 'EOF' >> ".gitignore"
.cache/
node_modules/
!.keep
EOF
}

# Define Function =autokeep_post_commit=

autokeep_post_commit () {
  cat << 'EOF' > "$(git rev-parse --git-dir)/hooks/post-commit"
#!/bin/sh

if git ls-remote --exit-code > /dev/null 2>&1; then
  git push --all
  git push --tags
fi
EOF
  chmod +x "$(git rev-parse --git-dir)/hooks/post-commit"
}

# Define Function =autokeep_launchagent=

autokeep_launchagent () {
  if run "Automatically monitor for changes?" "Don't Monitor" "Monitor for Changes"; then
    a="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"
    b="${HOME}/Library/LaunchAgents"
    c="com.github.ptb.autokeep.$(basename ${a})"
    d="${b}/${c}.plist"

    test -d "${b}" || \
      mkdir -m go= -p "${b}"

    test -f "${d}" && \
      launchctl unload "${d}" && \
      rm -f "${d}"

    printf "%s\t%s\t%s\n" \
      "Label" "-string" "${c}" \
      "ProgramArguments" "-array-add" "git" \
      "ProgramArguments" "-array-add" "commit" \
      "ProgramArguments" "-array-add" "--all" \
      "ProgramArguments" "-array-add" "--allow-empty-message" \
      "ProgramArguments" "-array-add" "--message=" \
      "RunAtLoad" "-bool" "true" \
      "WatchPaths" "-array-add" "${a}" \
      "WorkingDirectory" "-string" "${a}" \
    | while IFS="$(printf '\t')" read e f g; do
      defaults write "${d}" "${e}" $f "$g"
    done

    plutil -convert xml1 "${d}" && \
      chmod 600 "${d}" && \
      launchctl load "${d}"
  fi
}
