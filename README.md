# npm-are-you-sleeping

A helpful script to restart npm if its hung in ci.

replace calls to npm install

```
npx npm-are-you-sleeping 
```

or if you want a particular number of timeouts

```
npx npm-are-you-sleeping 10000 5 install
```

this is a dependency free single js file so if you want to install it with curl....

```
curl ...todo npm cdn url.../npm-are-you-sleeping/index.js > sleeping.js && sleeping.js ....
```

## USE

`npm-are-you-sleeping <idle timeout in ms> <number of attempts> [npm command]` 

This runs npm. Waits for it to not output anything on stdout or stderr for timeout ms. If it has remaining attempts it'll signal the old process and try again.

if you have 100s of builds like we do these errors have really started stacking up lately. This seems to work for us so far =)

## SPECIAL MENTIONS

Inspired by Eddy cat who likes to check to see if @zkat is sleeping

![PICTURE OF EDDY CAT](https://github.com/soldair/npm-are-you-sleeping/raw/master/img/eddy-kat.png)

## NOTES

*This is not an official Google product.*


