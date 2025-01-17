import { NextRequest, NextResponse } from "next/server";

const getRefreshToken = async () => {
  try {
    const response = await fetch(
      `${process.env.INSTAGRAM_GRAPH_API_ENDPOINT}/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    const data = await response.json();
    NextRequest.access_token = data?.access_token;
    return data?.access_token ?? null;
  } catch (error) {
    return {};
  }
};

const makeGetRequest = async (apiUrl) => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data;
  } catch (err) {
    return {};
  }
};

export const GET = async (req) => {
  try {
    const fields = "id,caption,media_type,media_url,permalink,thumbnail_url";

    const accountData = await makeGetRequest(
      `${process.env?.INSTAGRAM_GRAPH_API_ENDPOINT}/v21.0/me?fields=username,name,profile_picture_url,biography,followers_count,follows_count,media_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    const mediaData = await makeGetRequest(
      `${process.env?.INSTAGRAM_GRAPH_API_ENDPOINT}/v21.0/${process.env.INSTAGRAM_USER_ID}/media?fields=${fields},timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    delete accountData?.id;
    delete mediaData?.paging;

    return NextResponse.json(
      {
        ...accountData,
        ...mediaData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(err?.message, { status: 500 });
  }
};
