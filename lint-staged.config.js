const config = {
  "**/*.(md|json)": "prettier --write",
  "**/*.scss": ["stylelint --fix", "prettier --write"],
  "*": ['cspell --no-must-find-files --exclude "src/content" --no-progress'],
};

export default config;
