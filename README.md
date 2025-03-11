# jsonresume-to-docx

This is a simple conversion tool that reads content from a jsonresume and writes out a docx file according to a template.

## Usage

Create a `resume.json` file according to [jsonresume](https://github.com/jsonresume/resume-schema) and `template.docx` file according to [docx-templates](https://github.com/guigrpa/docx-templates).

```shell
npm install
npm start
```

The output file uses the value of `basics.name`.
