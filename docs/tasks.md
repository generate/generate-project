## Options

### noskip

Generate looks for data in package.json and/or user environment to be used in templates. By default, this data is normally only used for hints, but this generator uses the data to render templates, and skips any related prompts.

You can disable this feature with the following command:

```sh
$ gen project --noskip
```

## Tasks

### Running tasks

In this generator, tasks are used for generating specific files. Some tasks generate a single file, some generate multiple files, and some tasks are just aliases for running "groups" of tasks. At least for this generator, the goal is to make it as easy as possible for you to create your own a-la-carte generator experience.

**Running tasks**

To run a task, just run `$ gen project:*`, where `*` is the name of the task to run. For example, the following command will run the `minimal` task:

```sh
$ gen project:minimal
```

### Available tasks
{%= increaseHeadings(apidocs("generator.js")) %}

## Files trees
{%= doc('trees.md') %}

[docs]: {%= platform.docs %}/
