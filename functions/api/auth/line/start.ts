export const onRequestGet = async ({request,env}:any) => {
  if(!env.LINE_CHANNEL_ID||!env.APP_BASE_URL) return new Response('LINE Login is not configured.',{status:503});
  const state=crypto.randomUUID(); const nonce=crypto.randomUUID();
  const callback=new URL('/api/auth/line/callback',env.APP_BASE_URL).toString();
  const url=new URL('https://access.line.me/oauth2/v2.1/authorize');
  url.searchParams.set('response_type','code');url.searchParams.set('client_id',env.LINE_CHANNEL_ID);
  url.searchParams.set('redirect_uri',callback);url.searchParams.set('state',state);
  url.searchParams.set('scope','openid profile email');url.searchParams.set('nonce',nonce);
  const cookie=`dc_oauth=${state}.${nonce}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/line; Max-Age=600`;
  return new Response(null,{status:302,headers:{Location:url.toString(),'Set-Cookie':cookie}});
};
