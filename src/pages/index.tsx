import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import NewTweetForm from "~/components/NewTweetForm";
import InfiniteTweetList from "~/components/InfiniteTweetList";

const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        <NewTweetForm />
        <RecentTweets />
      </header>
    </>
  );
};


function RecentTweets() {
  const tweets = api.tweet.infinitedFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor
      }
    }
  )
  return <InfiniteTweetList tweets={tweets.data?.pages.flatMap(page => page.tweets)}
    isError={tweets.isError}
    isLoading={tweets.isLoading}
    hasMore={tweets.hasNextPage}
    fetchNewTweets={tweets.fetchNextPage}
  />
}
export default Home;
