**What will happen?**

Running `$ gen {%= alias %}` will run the generator's [default task](#default), which will:

1. prompt you for any information that's missing
1. render templates using your answers
1. generate [the resulting files](#generated-files) to the current working directory.

**Conflict detection**

In the case that a file already exists on the file system, you will be [prompted for feedback](https://github.com/node-base/base-fs-conflicts) _before overwrite any files_.

You can [set the destination][docs]{customization.md} to a new directory if you want to avoid the prompts, or avoid accidentally overwriting files with unintentional answers.
