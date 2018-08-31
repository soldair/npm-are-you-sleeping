#!/usr/bin/env node
/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let spawn = require('child_process').spawn;

//
//USE: ./index.js <ms npm can be idle> <number of attempts> [... NPM ARGS]
//

let timeout = process.argv[2] || 60000;
let attempts = process.argv[3] || 3;
let args = process.argv.slice(4);
if (args.length === 0) {
  args = ['install'];
}
args.push('--verbose');

(function npm() {
  let timer;
  let proc = spawn(process.env.SLEEPING_COMMAND||'npm', args);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.stdin.end();
  proc.stdout.on('data', () => {
    setTimer();
  });
  proc.stderr.on('data', () => {
    setTimer();
  });

  // side effect: this also restarts when npm exits with a bad code even if it
  // didn't timeout
  proc.on('close', (code, signal) => {
    clearTimeout(timer);
    if (code || signal) {
      console.log('[npm-are-you-sleeping] npm exited with code ' + (code||signal) + '');

      if (--attempts) {
        console.log('[npm-are-you-sleeping] restarting');
        npm();
      } else {
        console.log('[npm-are-you-sleeping] i tried lots of times. giving up.');
        throw new Error("npm install fails");
      }
    }
  });

  function setTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('[npm-are-you-sleeping] killing npm with SIGTERM');
      proc.kill('SIGTERM');
      // wait a couple seconds
      timer = setTimeout(() => {
        // its it's still not closed sigkill
        console.log('[npm-are-you-sleeping] killing npm with SIGKILL');
        proc.kill('SIGKILL');
      }, 2000);
    }, timeout);
  }
})();
