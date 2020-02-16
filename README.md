[![Build Status](https://travis-ci.org/abbr/text2wav.node.js.svg?branch=master)](https://travis-ci.org/abbr/text2wav.node.js)

![](./text2wav.svg)
# text2wav.node.js
Self-contained multilingual TTS speech synthesizer for Node.js in pure js.

## Why
There are not many self-contained FOSS speech synthesizer npm modules. Most TTS npm modules are just a wrapper to an external online service or a separately installed host program. For those self-contained FOSS modules, they are either designed to run in browser to play out the speech rather than output the audio file, or lacking multilingual support.

*text2wav.node.js* is arguably the first, if not the only node.js module, to support all of following features

* convert text to wav
* support over 100 languages and accents out-of-the-box
* allow input to be UTF-8 encoded text in native languages
* self-contained FOSS, not even depending on other npm modules
* 100% Javascript/Typescript

## How
### Install

```
npm i -S text2wav
``` 
to use API or 
```
npm i -g text2wav
``` 
to use CLI.

### Use
Synopsis

* API
  * Javascript
  ```
  const text2wav = require('text2wav')
  let out = await text2wav(<text>[,<opts>])
  ```
  * Typescript
  ```
  import text2wav = require('text2wav')
  let out = await text2wav(<text>[,<opts>])
  ```
  
  where *\<text\>* is string and *\<opts\>* is a json object. Returns wav content of type *Uint8Array*.
  
* CLI
  
  ```
  text2wav <text> [<opts>]
  ```
  Ouputs wav content to *stdout*.

\<opts\> in API or CLI may contain following parts

| API | CLI | type | default | description |
|--------------|------------|-----------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| voice | -v | string | en | Use voice file of this name from [*/espeak-ng-data*](https://github.com/abbr/text2wav.node.js/tree/master/espeak-ng-data). A variant can be specified using \<voice\>+\<variant\>, such as af+m3. A list of variants can be found [here](https://github.com/abbr/text2wav.node.js/tree/master/espeak-ng-data/voices/!v). |
| amplitude | -a | integer | 100 | Amplitude, 0 to 200. |
| wordGap | -g | integer |  | Word gap. Pause between words, units of 10ms at the default speed. |
| capital | -k | integer |  | Indicate capital letters with: 1=sound, 2=the word "capitals", higher values = a pitch increase (try -k20). |
| lineLength | -l | integer |  | Line length. If not zero (which is the default), consider lines less than this length as end-of-clause. |
| pitch | -p | integer | 50 | Pitch adjustment, 0 to 99. |
| speed | -s | integer | 175 | Speed in words per minute. |
| encoding | -b | \<1\|2\|4\> | 1 | Input text encoding, 1=UTF8, 2=8 bit, 4=16 bit. |
| hasTags | -m | boolean | false | Indicates that the text contains SSML (Speech Synthesis Markup Language) tags or other XML tags. Those SSML tags which are supported are interpreted. Other tags, including HTML, are ignored, except that some HTML tags such as \<hr\> \<h2\> and \<li\> ensure a break in the speech. |
| noFinalPause | -z | boolean | false | No final sentence pause at the end of the text. |
| punct | --punct[=] | string or boolean | false | Speak the names of punctuation characters during speaking. If =\<string\> is omitted, all punctuations are spoken. |

#### Basice Usage Example

* API

  ```js
  (async () => {
    const text2wav = require('text2wav')
    let out = await text2wav('test')
    // out is of type Uint8Array
    const assert = require('assert')
    assert.equal(out[0], 82) //R
    assert.equal(out[1], 73) //I
    assert.equal(out[2], 70) //F
    assert.equal(out[3], 70) //F
  })()
  ```
* CLI

  ```
  text2wav test > test.wav
  ```
  outputs wav to file *test.wav*

#### More examples

  * API: `let out = await text2wav('测试', {voice: 'zh'})`
  * CLI: `text2wav '测试' -v zh > test.wav`
  
    TTS in chinese
  * API: `let out = await text2wav('test', {voice: 'en+whisper'})`
  * CLI: `text2wav test -v en+whisper > test.wav`
  
    use whisper variant
  * API: `let out = await text2wav('"test", I say.', {punct: '"'})`
  * CLI: `text2wav '"test", I say.' --punct='"' > test.wav`
  
    speak the punctuation "
    
## Under the hood
*text2wav.node.js* compiles [espeak-ng](https://github.com/espeak-ng/espeak-ng) into Javascript and [WebAssembly](https://webassembly.org/) libraries using [Emscripten](https://kripken.github.io/emscripten-site/). *text2wav.node.js* also includes compiled voice data from *espeak-ng*. The *text2wav.node.js* API or CLI takes the text and voice parameters as input, and generates the wav ouput.

### To compile

```
git clone https://github.com/espeak-ng/espeak-ng.git
cd espeak-ng
./autogen.sh
./configure --without-async --with-extdict-zh --with-extdict-zhy --with-extdict-ru
make
cd src/ucd-tools/
./autogen.sh
make clean
emconfigure ./configure
emmake make
cd ../..
emconfigure ./configure --without-async --without-mbrola --without-sonic --enable-shared=false
emmake make src/espeak-ng
mv src/espeak-ng src/espeak-ng.bc
emcc -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s MODULARIZE=1 -s 'EXPORT_NAME="EspeakNg"' -o espeak-ng.js src/espeak-ng.bc
echo // espeak-ng git hash `git rev-parse HEAD` >> espeak-ng.js
```
The above commands generate

* *espeak-ng.js* file
* *espeak-ng.wasm* file
* voice data files in *espeak-ng-data* folder

Copy *espeak-ng.js* and *espeak-ng.wasm* to *text2wav.node.js* */lib* folder and *espeak-ng-data* to */*. Insert the content of file [*/lib/post.js*](https://raw.githubusercontent.com/abbr/text2wav.node.js/master/lib/post.js) to */lib/espeak-ng.js* below the line `// {{MODULE_ADDITIONS}}`.

## Contribution
Contributions are welcome. All compiled code and data will be generated from *espeak-ng* by *text2wav.node.js* author. Please do not submit any PRs containing the compiled code or data, i.e. most files in */lib* or */espeak-ng-data* folder. To contribute to those files, submit PRs to *espeak-ng* instead. Once the PRs are accepted, notify *text2wav.node.js* author to recompile.

## License

The MIT License (MIT)

Copyright (c) 2018-Present, @abbr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
