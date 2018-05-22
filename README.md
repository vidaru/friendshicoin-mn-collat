# friendshipcoin-mn-collat
Creates an address for a new masternode collatoral without affecting previous masternodes. Useful when running the linux or macOS daemon.

Setup guides:


## macOS

First, install nodejs via homebrew if you do not already have it

```
$ brew install node
```

Then download this repository and install the dependencies

```
$ git clone https://github.com/vidaru/friendshipcoin-mn-collat.git
$ cd friendshipcoin-mn-collat
$ npm i
```

Finally run the script:

```
$ node index.js
```

## Ubuntu

First install node version 8 if you do not already have it.

```
$ curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt-get install nodejs -y
```

Then download this repository and install the dependencies

```
$ git clone https://github.com/vidaru/friendshipcoin-mn-collat.git
$ cd friendshipcoin-mn-collat
$ npm i
```

Finally run the script:

```
$ node index.js
```
