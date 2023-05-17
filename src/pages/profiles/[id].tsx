import { GetStaticPaths, GetStaticPathsContext, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import type { FC } from 'react';
import { ssgHelper } from '../../server/api/ssgHelper';
import { api } from '~/utils/api';
import Head from 'next/head';
import ErrorPage from 'next/error'
import Link from 'next/link';
import IconHoverEffect from '~/components/IconHoverEffect';
import { VscArrowLeft } from 'react-icons/vsc';
import ProfileImage from '~/components/ProfileImage';
import InfiniteTweetList from '~/components/InfiniteTweetList';
import { useSession } from 'next-auth/react';
import Button from '~/components/Button';

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id })

  const trpcUtils = api.useContext()
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess({ addedFollow }, variables, context) {
      trpcUtils.profile.getById.setData({ id }, oldData => {
        if (oldData) {
          const countModifier = addedFollow ? 1 : -1
          return {
            ...oldData,
            isFollowing: addedFollow,
            followersCount: oldData.followersCount + countModifier
          }
        }
      })
    },
  })
  if (profile) {
    return (<>
      <Head>
        <title>{`Twitter Clone ${profile?.name}`}</title>
      </Head>
      <header className='sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2'>
        <Link href={"/"} className='mr-2'>
          <IconHoverEffect>
            <VscArrowLeft className='w-6 h-6' />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className='flex-shrink-0' />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount}{" "}{getPlural(profile.tweetsCount, "Tweet", "Tweets")}
            {profile.followersCount}{" "}{getPlural(profile.followersCount, "Follower", "Followers")}
            {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          userId={profile.id}
          isLoading={toggleFollow.isLoading}
          onClick={() => {
            toggleFollow.mutate({
              userId: id
            })
          }}
        />
      </header>
      <main>
        <ProfileTweets userId={profile.id} />
      </main>
    </>);
  }

  return <ErrorPage statusCode={404} />
}


function FollowButton({
  isLoading,
  isFollowing,
  userId,
  onClick
}: {
  isLoading?: boolean
  isFollowing: boolean
  userId: string
  onClick(): void
}) {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
/**
 * 2- 21082  -22105   -488.53
 * 3 21196   -22140   -1412.43
 * 4 20307   -22140   -1631.95
 * @param param0 
 * @returns 
 */

function ProfileTweets({
  userId
}: {
  userId: string
}) {
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    {
      userId
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

export default Profile;

const pluralRules = new Intl.PluralRules()
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) == 'one' ? singular : plural
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export async function getStaticProps(context: GetStaticPropsContext<{
  id: string
}>) {
  const id = context.params?.id
  if (id) {
    const ssg = ssgHelper()
    ssg.profile.getById.prefetch({ id })
    return {
      props: {
        trpcState: ssg.dehydrate(),
        id
      }
    }
  }
  return {
    redirect: {
      destination: '/'
    }
  }
}