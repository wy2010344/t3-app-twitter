import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';


type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  user: {
    image: string | null;
    id: string;
    name: string | null;
  };
  likedByMe: boolean;
}
interface InfiniteTweetListProps {
  tweets?: Tweet[]
  isError: boolean
  isLoading?: boolean
  hasMore?: boolean
  fetchNewTweets(): Promise<unknown>
}

const InfiniteTweetList: FC<InfiniteTweetListProps> = ({
  tweets,
  isError,
  isLoading,
  hasMore = false,
  fetchNewTweets
}) => {
  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error...</h1>
  if (!tweets?.length) return <h2 className='my-4 text-center text-2xl text-gray-500'>No Tweets</h2>
  console.log(tweets)
  return (<ul >
    <InfiniteScroll dataLength={tweets.length}
      next={fetchNewTweets}
      hasMore={hasMore}
      loader={"Loading..."}>
      {tweets.map(tweet => {
        return <div key={tweet.id}>
          {tweet.content}
        </div>
      })}
    </InfiniteScroll>
  </ul>);
}

export default InfiniteTweetList;
