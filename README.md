# generate-project [![NPM version](https://img.shields.io/npm/v/generate-project.svg?style=flat)](https://www.npmjs.com/package/generate-project) [![NPM downloads](https://img.shields.io/npm/dm/generate-project.svg?style=flat)](https://npmjs.org/package/generate-project) [![Build Status](https://img.shields.io/travis/generate/generate-project.svg?style=flat)](https://travis-ci.org/generate/generate-project)

Scaffold out complete code projects from the command line, or use this generator as a plugin in other generators to provide baseline functionality.

## TOC

- [What is "Generate"?](#what-is-generate)
- [Command line usage](#command-line-usage)
  * [Install globally](#install-globally)
  * [Running generate-project](#running-generate-project)
  * [Running tasks](#running-tasks)
- [Available tasks](#available-tasks)
- [Examples](#examples)
  * [project:min](#projectmin)
  * [project:gulp-plugin](#projectgulp-plugin)
  * [Running multiple generators](#running-multiple-generators)
    + [generate-install](#generate-install)
    + [generate-dest](#generate-dest)
- [API usage](#api-usage)
  * [Install locally](#install-locally)
  * [Register as a plugin](#register-as-a-plugin)
  * [Run tasks](#run-tasks)
- [Customization](#customization)
  * [Destination directory](#destination-directory)
  * [Overriding templates](#overriding-templates)
- [Customization](#customization-1)
- [About](#about)
  * [Related projects](#related-projects)
  * [Contributing](#contributing)
  * [Running tests](#running-tests)
  * [Author](#author)
  * [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

**Example**

Templates are [customizable](#customization) and can be overridden.

![generate-project demo](https://raw.githubusercontent.com/generate/generate-project/master/docs/demo.gif)

<br>
<br>

## What is "Generate"?

Generate is a command line tool and developer framework for scaffolding out new GitHub projects using [generators](https://github.com/generate/generate/blob/master/docs/generators.md) and [tasks](https://github.com/generate/generate/blob/master/docs/tasks.md). Answers to prompts and the user's environment can be used to determine the templates, directories, files and contents to build. Support for [gulp](http://gulpjs.com), [base](https://github.com/node-base/base) and [assemble](https://github.com/assemble/assemble) plugins, and much more.

For more information about Generate:

* Visit the [generate project](https://github.com/generate/generate)
* Visit the [generate documentation](https://github.com/generate/generate/blob/master/docs/)
* Find [generators on npm](https://www.npmjs.com/browse/keyword/generate-generator) (help us [author generators](https://github.com/generate/generate/blob/master/docs/micro-generators.md))

<br>
<br>

## Command line usage

### Install globally

**Installing the CLI**

To run the `project` generator from the command line, you'll need to install [generate](https://github.com/generate/generate) globally first. You can do that now with the following command:

```sh
$ npm install --global generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory.

**Install generate-project**

You may now install this module with the following command:

```sh
$ npm install --global generate-project
```

### Running generate-project

You should now be able to run `generate-project` with the following command:

```js
$ gen project
```

**What will happen?**

Running `$ gen project` will run the generator's [default task](#packagedefault), which will prompt you for any information that's missing, then it will render templates using your answers and write a [the resulting files](#available-tasks) to the current working directory.

### Running tasks

Tasks on `generate-project` are run by passing the name of the task to run after the generator name, delimited by a comma:

```sh
$ gen project:foo
       ^       ^
generator     task
```

**Example**

The following will run generator `foo`, task `bar`:

```sh
$ gen foo:bar
```

**Default task**

If a task is not explicitly passed Generate's CLI will run the `default` task.

<br>
<br>

## Available tasks

**Common files**

All of the tasks include the following files, unless specified otherwise:

* `editorconfig`: generated by [generate-editorconfig](https://github.com/generate/generate-editorconfig)
* `eslint`: generated by [generate-eslint](https://github.com/generate/generate-eslint)
* `gitattributes`: generated by [generate-git](https://github.com/generate/generate-git)
* `gitignore`: generated by [generate-git](https://github.com/generate/generate-git)
* `travis`: generated by [generate-travis](https://github.com/generate/generate-travis)
* `package`: generated by [generate-package](https://github.com/generate/generate-package)
* `license`: generated by [generate-license](https://github.com/generate/generate-license)

### [project](index.js#L54)

Scaffold out a basic node.js project. This task is run by the [default task](#project). Also, this task is aliased as `project:project` to simplify using this generator as a plugin in other generators.

**Example**

```sh
$ gen project
# also aliased as
$ gen project:project
```

### [gulp-plugin](index.js#L68)

Scaffold out basic project for a [gulp](http://gulpjs.com) plugin.

**Example**

```sh
$ gen project:gulp-plugin
# also aliased as
$ gen project:gp
```

### [base-plugin](index.js#L83)

Scaffold out a basic project for a [base](https://github.com/node-base/base) plugin.

**Example**

```sh
$ gen project:base-plugin
# also aliased as
$ gen project:bp
```

### [minimal](index.js#L98)

Scaffold out a minimal code project,

**Example**

```sh
$ gen project:min
# also aliased as
$ gen project:minimal
```

### [docs](index.js#L112)

Scaffold out minimal code project, along with a [.verb.md](https://github.com/verbose/verb) readme template.

**Example**

```sh
$ gen project:docs
```

### [generator](index.js#L126)

Scaffold out a basic [generate](https://github.com/generate/generate) generator project.

**Example**

```sh
$ gen project:generator
# also aliased as
$ gen project:gen
```

### [index](index.js#L138)

Generate an `index.js` file. This task is used for composition with other tasks.

**Example**

```sh
$ gen project:index
```

### [default](index.js#L151)

Generate a basic node.js project, then prompt to install dependencies after files are written to the file system.

**Example**

```sh
$ gen project
```

Visit Generate's [documentation for tasks](https://github.com/generate/generate/blob/master/docs/tasks.md).

<br>
<br>

## Examples

### project:min

Example of running the [project:minimal](#minimal) task.

![generate-project minimal project example](https://raw.githubusercontent.com/generate/generate-project/master/docs/demo-gulp-plugin.gif)

### project:gulp-plugin

Example of running the [project:gulp-plugin](#gulp-plugin) task.

![generate-project gulp plugin project example](https://raw.githubusercontent.com/generate/generate-project/master/docs/demo-gulp-plugin.gif)

### Running multiple generators

Generate supports running multiple generators at once. Here are some examples of other generators that work well with `generate-project`.

#### generate-install

Run [generate-install](https://github.com/generate/generate-install) **after** this generator to prompt to install any `dependencies` or `devDependencies` necessary for the generated files.

**Example**

![generate-project generate-install example](https://raw.githubusercontent.com/generate/generate-project/master/docs/demo-install.gif)

#### generate-dest

Run [generate-dest](https://github.com/generate/generate-dest) **before** this generator to prompt for the destination directory to use for generated files.

**Example**

![generate-project generate-dest example](https://raw.githubusercontent.com/generate/generate-project/master/docs/demo-dest.gif)

## API usage

Use `generate-project` as a [plugin](https://github.com/generate/generate/blob/master/docs/plugins.md) in your own [generator](https://github.com/generate/generate/blob/master/docs/generators.md).

### Install locally

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save generate-project
```

### Register as a plugin

Inside your own [generator](https://github.com/generate/generate/blob/master/docs/generators.md):

```js
module.exports = function(app) {
  // register generate-project as a plugin
  app.use(require('generate-project'));
};
```

### Run tasks

Programmatically run tasks from `generate-project`:

```js
module.exports = function(app) {
  // register generate-project as a plugin
  app.use(require('generate-project'));

  // run the `default` task on generate-project
  app.task('foo', function(cb) {
    app.generate('generate-project', cb);
  });

  // or run a specific task on generate-project 
  // (where `foo` is the name of the task to run)
  app.task('bar', function(cb) {
    app.generate('generate-project:foo', cb);
  });
};
```

Visit the [generator docs](https://github.com/generate/generate/blob/master/docs/generators.md) to learn more about creating, installing, using and publishing generators.

<br>
<br>

## Customization

### Destination directory

To customize the destination directory, install [generate-dest](https://github.com/generate/generate-dest) globally, then in the command line prefix `dest` before any other generator names.

For example, the following will prompt you for the destination path to use, then pass the result to `generate-project`:

```sh
$ gen dest project
```

### Overriding templates

You can override any of the templates by adding a template of the same name to the `templates` directory in user home. For example, to override the `.editorconfig` template, add a template at the following path `~/templates/.editorconfig`.

<br>
<br>

## Customization

The following instructions can be used to override settings in `generate-project`. Visit the [Generate documentation](https://github.com/generate/generate/blob/master/docs/overriding-defaults.md) to learn about other ways to override defaults.

**Overriding the template**

You can override a template by adding a template of the same name to the `templates` directory in user home. For example, to override the `package.json` template, add a template at the following path `~/generate/generate-project/templates/package.json`, where `~/` is the user-home directory that `os.homedir()` resolves to on your system.

## About

### Related projects

You might also be interested in these projects:

* [generate-dest](https://www.npmjs.com/package/generate-dest): Generate`generator that prompts the user for the destination directory to use. Can be used… [more](https://github.com/generate/generate-dest) | [homepage](https://github.com/generate/generate-dest "`Generate` generator that prompts the user for the destination directory to use. Can be used as a sub-generator or plugin in your generator.")
* [generate-install](https://www.npmjs.com/package/generate-install): Generator that automatically detects the dependencies or devDependencies to install based on the templates or… [more](https://github.com/generate/generate-install) | [homepage](https://github.com/generate/generate-install "Generator that automatically detects the dependencies or devDependencies to install based on the templates or includes used. This can be used as a sub-generator or plugin in your own generator.")
* [generate-package](https://www.npmjs.com/package/generate-package): Generate a package.json for a project. This generator can be used as a plugin or… [more](https://github.com/generate/generate-package) | [homepage](https://github.com/generate/generate-package "Generate a package.json for a project. This generator can be used as a plugin or sub-generator in your own generator, as a component of a larger build workflow.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for avice on opening issues, pull requests, and coding standards.

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/generate/generate-project/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 07, 2016._