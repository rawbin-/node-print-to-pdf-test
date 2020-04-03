# node-print-to-pdf-test
print to pdf with node.js

# with puppeteer
- just run `node with-puppeteer.js`
- fails and with no support for `headless=true` 

# with chrome-debugging-client
- just run `node with-cdc.js`

# with chrome-remote-interface
- step on macOS
    - install chrome
    - config env
    ```
  alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
  alias chrome-canary="/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary"
    ```
  - install chrome-remote-interface global
  `npm i chrome-remote-interface -g`
  - start chrome on a terminal
  `chrome --headless --remote-debugging-port=9222`
  - run `node with-cri.js` on another terminal  
