import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { cookies, headers } from 'next/headers';

export default async function getSession() {
  try {

    return await getServerSession(authOptions)
  } catch (err) {
    /**
     * https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
     */
    const req = {
      headers: Object.fromEntries(headers() as Headers),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value]),
      ),
    };
    const res = { getHeader() { }, setCookie() { }, setHeader() { } };
    // @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works 
    const session = await getServerSession(req, res, authOptions);
    return session;
  }
}