# Twittilze - a Twitter analyzer

Analyzing tweets stream to find the top 10 words, users and hashtags.


# How To Run

To run the server yourself, follow the following steps:

    git clone https://github.com/ofridagan/twittilze.git
    cd twittilze
    npm install
    npm start
open your browser at [localhost:3000](http://localhost:3000/)

## Client App

The client app is a basic react application created with [create-react-app](https://github.com/facebook/create-react-app)
The steps above should be enough, as I added the compiled client files to the repository.
The client app is served by the web server from `client/build`.

If you want to work on the client app yourself:

    cd client
    npm install
and

    npm start
to start a development server
Or if you want to compile:

    npm run build

compiled files will be stored in `client/build`from which they are served.

## What Does The Service Do

The service exposes the following API:

 - GET /words - responds with the top 10 words in tweets.
 - GET /users - responds with the top 10 most tweeting users.
 - GET /hashtags - responds with the top 10 most used hashtags.
 - GET /tweets - responds with the current tweets-per-second frequency.

The service is required to analyze tweets which are constantly keep coming as new-line-delimited json stream.

The main requirements are:
 - Server should be stable (last a long time).
 - Requests should respond in no-time.

From the requirements it is clear we should **not** do any work while a request is performed. i.e. all the hard work should be done ahead of time.
Also, we should consider memory consumption and make sure the amount of work we do with each chunk of data we process does not increase over time.

> From now on, I'll refer to the 'words', 'users' and 'hashtags' simply
> by 'values', as they are all just strings for which we want to get the most
> frequent ones.

## The solution
The solution to this problem implemented here involves two main 'data-structures', for each of the required "Top 10 " list.
Both data-structures store 'entry' objects which looks like `{value, count}`

 - Plain javascript object (`values`) which stores all the values as keys and entries as values.
 - A Min-Heap of size 10 (configurable) which stores the TOP entries according to their 'count'.

Every new value is stored in `values` object - count is increased if the value was already there.
The updated entry is checked against the top of the heap and a pop and push is performed if needed.

This way, we constantly keep track of the top 10 values, and hence don't work hard while the user is waiting for a response.

## Big O

**Memory** - The values object can get pretty big, as it has one entry for every unique value we encounter (which with 'words' might just be every words in the english dictionary.. and more).
So I'd say memory consumption is O(#number_of_unique_words).
Memory consumption of the heap is O(1) (assuming '10' is small constant)

**Running Time** - Updating the `values` object is O(1) (using JS native object's hash).
Updating the min-heap, the most expensive heap operation is "pop" (removing the top node), and is O(n)... since in our case n=10, we can call it O(1).
Responding to requests involves fetching the nodes in the heap, and sorting them.. O(nlogn) but again.. n=10.