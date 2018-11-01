# webpack-copy-noloop-plugin

## Why

When set `watch` to `true`, won't trigger infinite loop of updates.

## Notice

This is for webpack@4

## Install

```bash
npm i -D webpack-copy-noloop-plugin
# or
yarn add -D webpack-copy-noloop-plugin
```

## Usage

```js
const CopyPlugin = require("webpack-copy-noloop-plugin");

module.exports = {
  plugins: [
    new CopyPlugin({
      list: [
        {
          from: "dir/or/file",
          to: "dir/or/file"
        }
      ]
    })
  ]
};
```

## Config

### [root]

```js
new CopyPlugin({
  root: __dirname
});
```

Set the root for the `list` config.

If set, then all `from` and `to` in the `list` field will be resolved from `root` value.

### list

#### from

```ts
type from = string;
```

Source. Could be file or directory.

#### to

```ts
type to = string;
```

Destination. Could be file or directory.

> Type must match the corresponding `from`. If `from` is file, then `to` needs to be file. Same applies for directory.

#### [pattern]

```ts
type pattern = RegExp;
```

If `from` is directory then you can use `pattern` to match desire files.

#### [filter]

```ts
type filter = (from: string, to: string) => boolean;
```

Similar to `pattern`, but apply for both directory and file.

#### [flatten = false]

```ts
type flatten = boolean;
```

If `from` is directory and using `pattern` to filter files, then `flatten` could be set to flatten files in `to` directory.
