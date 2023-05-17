import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import NewTweetForm from "~/components/NewTweetForm";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import { useState } from "react";

const TABS = ["Recent", "Following"] as const
const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>("Recent");
  const session = useSession()
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status == "authenticated" && (
          <div className="flex">
            {TABS.map(tab => {
              return <button key={tab} className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${tab == selectedTab
                ? `border-b-4 border-b-blue-500 font-bold`
                : ''
                }`} onClick={() => setSelectedTab(tab)}>
                {tab}
              </button>
            })}
          </div>
        )}
        <NewTweetForm />
        {selectedTab == "Recent" && <RecentTweets />}
        {selectedTab == "Following" && <FollowingTweets />}
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

function FollowingTweets() {
  const tweets = api.tweet.infinitedFeed.useInfiniteQuery(
    {
      onlyFollowing: true
    },
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
