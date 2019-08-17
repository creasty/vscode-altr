# vscode-altr

Altr allows you to navigate to alternate files for the currently opened file.

**Why?**

Suppose that you're developing a Ruby on Rails project; It's quite often that you sequentially edit a set of specific files such as `app/models/user.rb`, `spec/models/user_spec.rb`, `app/serializers/user_serializer.rb`, etc.<br>
With this extension, you can cycle among these files with a single command, so you don't have to manually look for the other file.

## Commands

- `altr.switchToNextFile` - Open the next file which is inferred from the current file.
- `altr.switchToPreviousFile` - Open the previous file which is inferred from the current file.

## Configuration

```json
{
  "altr.rules": [
    ["%.c", "%.h", "%.m"],
    ["package.json", "package-lock.json", "yarn.lock"],
    ["src/%.js", "src/%.test.js", "test/%.js", "test/%.test.js"]
  ]
}
```

See `contributes.configuration` for the default rules.

- Groups: `["%.c", "%.h", "%.m"]`, `["package.json", "package-lock.json", "yarn.lock"]`, ...
  - Patterns: `%.c`, `%.h`, ..., `package.json`, ...

### Patterns

Patterns can have the following syntax:

- `*`
  - Matches any number of path segments, including none.
- `%`
  - Acts as a placeholder, which is replaced with the current pattern, for the other files.
  - Matches any number of path segments, including none.

## Acknowledgement

- Inspired by [vim-altr](https://github.com/kana/vim-altr).
