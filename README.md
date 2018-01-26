# ETH No Fee proxy

Redirect Claymore's 1-2% mining fee to your own wallet.

The method is from [JuicyPasta](https://github.com/JuicyPasta)'s [Python project](https://github.com/JuicyPasta/Claymore-No-Fee-Proxy/blob/master/README.md)
When I deployed his Python proxy on AWS, there is a performance issue. It eats up all my CPU ticket and RAM after running a few days.
I rewrite this in Node.js. Now it uses 0% CPU and 30MB RAM after running for 3 months with 3 mining machines connected.

## How it works?
This proxy is placed between Claymore and Internet in order to catch mining fee packet and substituting the devfee address with your wallet address. The redirection are done on the fly and do not require stoping or relaunching the mining software.

## RUN
### Prerequisite
I am using node.js 4.2.6. It should work with most version of node.

### Run
Usage: nodejs claymore.js [listening address] [listening port] [pool address] [pool port] [your ETH address]
For example:
```
nodejs claymore.js 0.0.0.0 8503 us2.ethermine.org 4444 0xB8B74585E5C2B42B013BF3de044a422D8919f516
```
## My test environment:
Proxy running on AWS EC2 free instance, Ubuntu 16.04
Pool: us2.ethermine.org. Trying ETH only and ETH+SC
Mining machine: Two Ubuntu 16.04 and one Win10. ~100 MH/s

## Donations
If you find my proxy useful, welcome to donate.
- My ETH address: 0xB8B74585E5C2B42B013BF3de044a422D8919f516
