import Link from 'next/link';
import { env } from '~/env.mjs';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProfileImage from './ProfileImage';
import { useSession } from 'next-auth/react';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc'
import IconHoverEffect from './IconHoverEffect';
import { api } from '~/utils/api';
import LoadingSpinner from './LoadingSpinner';

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
  if (isLoading) return <LoadingSpinner />
  if (isError) return <h1>Error...</h1>
  if (tweets?.length) {
    return (<ul >
      <InfiniteScroll dataLength={tweets.length}
        next={fetchNewTweets}
        hasMore={hasMore}
        loader={"Loading..."}>
        {tweets.map(tweet => {
          return <TweetCard key={tweet.id} {...tweet} />
        })}
      </InfiniteScroll>
    </ul>);
  }
  return <h2 className='my-4 text-center text-2xl text-gray-500'>No Tweets</h2>
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short"
})
function TweetCard({
  id,
  user,
  createdAt,
  content,
  likedByMe,
  likeCount
}: Tweet) {

  const trpcUtils = api.useContext() //一般在我的方法,setValue会随value一起传递下来.
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess({ addedLike }, variables, context) {
      //导到全刷新
      // trpcUtils.tweet.infinitedFeed.invalidate()

      const updateData: Parameters<typeof trpcUtils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData) {
          const countModifier = addedLike ? 1 : -1
          return {
            ...oldData,
            page: oldData.pages.map(page => {
              return {
                ...page,
                tweets: page.tweets.map(tweet => {
                  console.log(tweet.id, id)
                  if (tweet.id == id) {
                    return {
                      ...tweet,
                      likeCount: tweet.likeCount + countModifier,
                      likedByMe: addedLike
                    }
                  }
                  return tweet
                })
              }
            })
          }
        }
        return undefined
      }
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData)
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      );
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId: user.id },
        updateData
      );
    },
  })

  function handleToggleLike() {
    toggleLike.mutate({
      id
    })
  }
  return <li className='flex gap-4 border-b px-4 py-4'>
    <Link href={`/profiles/${user.id}`}>
      <ProfileImage src={user.image} />
    </Link>
    <div className='flex flex-grow flex-col'>
      <div className="flex gap-1">

        <Link href={`/profiles/${user.id}`} className='font-bold hover:underline focus-visible:underline'>
          {user.name}
        </Link>
        <span className="text-gray-500">-</span>
        <span className="text-gray-500">
          {dateTimeFormatter.format(createdAt)}
        </span>
      </div>
      <p className='whitespace-pre-wrap'>{content}</p>
      <HeartButton onClick={handleToggleLike} isLoading={toggleLike.isLoading} likeCount={likeCount} likedByMe={likedByMe} />
    </div>
  </li>
}

function HeartButton({
  onClick,
  isLoading,
  likedByMe,
  likeCount
}: {
  onClick(): void
  isLoading?: boolean
  likedByMe?: boolean
  likeCount: number
}) {
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart
  const session = useSession()
  if (session.status != 'authenticated') {
    return <div className='mb-1 mt-1 flex items-center gap-3 self-start text-gray-500'>
      <HeartIcon />
      <span>{likeCount}</span>
    </div>
  }

  return <button
    disabled={isLoading}
    onClick={onClick}
    className={`group flex -ml-2 items-center gap-1 self-start transition-colors duration-200 ${likedByMe
      ? `text-red-500`
      : `text-gray-500 hover:text-red-500 focus-visible:text-red-500`
      }`}>
    <IconHoverEffect red>
      <HeartIcon className={`transition-colors duration-200 ${likedByMe
        ? `fill-red-500`
        : `fill-gray-500 group-hover:fill-red-500 group-focus-visible:fillred-500`
        }`} />
    </IconHoverEffect>
    <span>{likeCount}</span>
  </button>
}
export default InfiniteTweetList;
