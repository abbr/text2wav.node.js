# text2wav.node.js
A TTS speech synthesizer for Node.js, supporting 101 languages and accents.

## Why
There are not many self-contained FOSS speech synthesizer npm modules. Most TTS modules are just a wrapper to an external online service or a separately installed host program. For those self-contained FOSS modules, they are either designed to run in browser to play out the speech rather than output the audio file, or lacking multilingual support.

*text2wav.node.js* is arguably the first, if not the only node.js module, to support all of following features

* convert text to wav
* support 101 languages and accents out-of-the-box
* allow input to be UTF-8 encoded text in native languages
* self-contained FOSS
* 100% Javascript

## How
### Install
```
npm i -S text2wav
```

### API
Basic usage example
```js
(async () => {
  const text2wav = require('text2wav')
  let out = await text2wav('test')
  // out is of type Uint8Array
  const assert = require('assert').strict
  assert.equal(out[0], 82) //R
  assert.equal(out[1], 73) //I
  assert.equal(out[2], 70) //F
  assert.equal(out[3], 70) //F
})()
```

Async function `text2wav` above can take following order insignificant input parameters. All parameters are optional except for the first one

  * `<string>`:
    The text input.

  * `-v <voice name>`:
    Use voice file of this name from [*/espeak-ng-data*](https://github.com/abbr/text2wav.node.js/tree/master/espeak-ng-data). A variant can be
    specified using <voice>+<variant>, such as af+m3. A list of variants can be found [here](https://github.com/abbr/text2wav.node.js/tree/master/espeak-ng-data/voices/!v).

  * `-a <integer>`:
    Amplitude, 0 to 200, default is 100.

  * `-g <integer>`:
    Word gap. Pause between words, units of 10ms at the default speed.

  * `-k <integer>`:
    Indicate capital letters with: 1=sound, 2=the word "capitals", higher
    values = a pitch increase (try -k20).

  * `-l <integer>`:
    Line length. If not zero (which is the default), consider lines less than
    this length as end-of-clause.

  * `-p <integer>`:
    Pitch adjustment, 0 to 99, default is 50.

  * `-s <integer>`:
    Speed in words per minute, default is 175.

  * `-b`:
    Input text encoding, 1=UTF8, 2=8 bit, 4=16 bit.

  * `-m`:
    Indicates that the text contains SSML (Speech Synthesis Markup Language)
    tags or other XML tags. Those SSML tags which are supported are
    interpreted. Other tags, including HTML, are ignored, except that some HTML
    tags such as &lt;hr&gt; &lt;h2&gt; and &lt;li&gt; ensure a break in the
    speech.

  * `-z`:
    No final sentence pause at the end of the text.

  * `--punct="<characters>"`:
    Speak the names of punctuation characters during speaking. If
    =&lt;characters&gt; is omitted, all punctuation is spoken.

#### More examples

  * `let out = await text2wav('你好', '-v zh')`
  
    TTS in chinese language
  * `let out = await text2wav('test', '-v en+whisper')`
  
    use whisper variant
  * `let out = await text2wav('test', '-a 200')`
  
    set amplitude to 200
    
### CLI
From app root
```
node . test > test.wav
```

outputs wav to file *test.wav*. Acceptable input parameters are the same as API.


## Under the hood
*text2wav.node.js* compiles [espeak-ng](https://github.com/espeak-ng/espeak-ng) into Javascript and [WebAssembly](https://webassembly.org/) libraries using [Emscripten](https://kripken.github.io/emscripten-site/). *text2wav.node.js* also includes compiled language and voice data from *espeak-ng*. The *text2wav.node.js* API takes the text, language, and voice parameters as input, and generates the wav ouput.

### To compile

```
git clone https://github.com/espeak-ng/espeak-ng.git
cd espeak-ng
./autogen.sh
./configure --prefix=/usr --without-async --without-mbrola --without-sonic
make
cd src/ucd-tools/
./autogen.sh
make clean
emconfigure ./configure
emmake make
cd ../..
emconfigure ./configure --prefix=/usr --without-async --without-mbrola --without-sonic --enable-shared=false
emmake make src/espeak-ng
mv src/espeak-ng src/espeak-ng.bc
emcc -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s MODULARIZE=1 -s 'EXPORT_NAME="EspeakNg"' -o espeak-ng.js src/espeak-ng.bc
echo // espeak-ng git hash `git rev-parse HEAD` >> espeak-ng.js
```
The above commands generate

* *espeak-ng.js* file
* *espeak-ng.wasm* file
* language and voice data files in *espeak-ng-data* folder

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
