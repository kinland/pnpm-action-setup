# Setup pnpm

Install pnpm package manager.

## Inputs

### `version`

Version of pnpm to install.

**Optional** when there is a [`packageManager` field in the `package.json`](https://nodejs.org/api/corepack.html).

otherwise, this field is **required** It supports npm versioning scheme, it could be an exact version (such as `6.24.1`), or a version range (such as `6`, `6.x.x`, `6.24.x`, `^6.24.1`, `*`, etc.), or `latest`.

### `dest`

**Optional** Where to store pnpm files.

### `run_install`

**Optional** (_default:_ `null`) If specified, run `pnpm install`.

If `run_install` is either `null` or `false`, pnpm will not install any npm package.

If `run_install` is `true`, pnpm will install dependencies recursively.

If `run_install` is a YAML string representation of either an object or an array, pnpm will execute every install commands.

#### `run_install.recursive`

**Optional** (_type:_ `boolean`, _default:_ `false`) Whether to use `pnpm recursive install`.

#### `run_install.cwd`

**Optional** (_type:_ `string`) Working directory when run `pnpm [recursive] install`.

#### `run_install.args`

**Optional** (_type:_ `string[]`) Additional arguments after `pnpm [recursive] install`, e.g. `[--frozen-lockfile, --strict-peer-dependencies]`.

### `package_json_file`

**Optional** (_type:_ `string`, _default:_ `package.json`) File path to the `package.json` to read "packageManager" configuration.

### `standalone`

**Optional** (_type:_ `boolean`, _default:_ `false`) When set to true, [@pnpm/exe](https://www.npmjs.com/package/@pnpm/exe), which is a Node.js bundled package, will be installed, enabling using `pnpm` without Node.js.

This is useful when you want to use a incompatible pair of Node.js and pnpm.

### `cache`

**Optional** (_type:_ `boolean`, _default:_ `false`) When set to true, the pnpm store will be cached between runs to reduce installation time, using cache_key_prefix combined with pnpm-lock.yaml hash as the key provided to actions/cache.

### `cache_key_prefix`

**Optional** (_type:_ `string`, _default:_ `${{ runner.os }}-pnpm-store-`) Prefix for an explicit key for restoring and saving the cache; will have a hash based on pnpm-lock.yaml appended. Does nothing if cache is not set to true.

This is passed to `actions/cache@v3` as follows:

```yaml
    - name: Setup pnpm cache
      if: ${{ inputs.cache == 'true' }}
      uses: actions/cache@v3
      with:
        path: ${{ inputs.dest }}
        key: ${{ inputs.cache_key_prefix }}${{ hashFiles('**/pnpm-lock.yaml') }}
        restore-keys: |
          ${{ inputs.cache_key_prefix }}
```

## Outputs

### `dest`

Expanded path of inputs#dest.

### `bin_dest`

Location of `pnpm` and `pnpx` command.

## Usage example

### Just install pnpm

```yaml
on:
  - push
  - pull_request

jobs:
  install:
    runs-on: ubuntu-latest

    steps:
      - uses: pnpm/action-setup@v2
        with:
          version: 8
```

### Install pnpm and a few npm packages

```yaml
on:
  - push
  - pull_request

jobs:
  install:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: |
            - recursive: true
              args: [--frozen-lockfile, --strict-peer-dependencies]
            - args: [--global, gulp, prettier, typescript]
```

### Use cache to reduce installation time

```yaml
on:
  - push
  - pull_request

jobs:
  cache-and-install:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - uses: pnpm/action-setup@v2
        name: Install pnpm
        with:
          version: 8
          cache: true
          run_install: true
```

**Note:** You don't need to run `pnpm store prune` at the end; post-action has already taken care of that.

## Notes

This action does not setup Node.js for you, use [actions/setup-node](https://github.com/actions/setup-node) yourself.

## License

[MIT](https://git.io/JfclH) © [Hoàng Văn Khải](https://github.com/KSXGitHub/)
