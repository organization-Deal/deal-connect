export const onRequestGet = async ({request,env}:any) => {
  const url=new URL(request.url);const code=url.searchParams.get('code');const state=url.searchParams.get('state');
  const cookie=request.headers.get('Cookie')||'';const saved=cookie.match(/(?:^|;\s*)dc_oauth=([^;]+)/)?.[1]||'';
  const [savedState,savedNonce]=decodeURIComponent(saved).split('.');
  const clearOauth='dc_oauth=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/line; Max-Age=0';
  if(!code||!state||!savedState||state!==savedState||!env.LINE_CHANNEL_ID||!env.LINE_CHANNEL_SECRET||!env.DB||!env.APP_BASE_URL){
    return new Response('LINE Login verification failed. Please start again.',{status:400,headers:{'Set-Cookie':clearOauth}});
  }
  const callback=new URL('/api/auth/line/callback',env.APP_BASE_URL).toString();
  const tokenRes=await fetch('https://api.line.me/oauth2/v2.1/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:callback,client_id:env.LINE_CHANNEL_ID,client_secret:env.LINE_CHANNEL_SECRET})});
  if(!tokenRes.ok)return new Response('Could not exchange LINE authorization code.',{status:502,headers:{'Set-Cookie':clearOauth}});
  const token:any=await tokenRes.json();
  const verifyRes=await fetch('https://api.line.me/oauth2/v2.1/verify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({id_token:token.id_token,client_id:env.LINE_CHANNEL_ID})});
  if(!verifyRes.ok)return new Response('LINE ID token verification failed.',{status:401,headers:{'Set-Cookie':clearOauth}});
  const profile:any=await verifyRes.json();
  if(profile.nonce!==savedNonce||!profile.sub)return new Response('LINE nonce validation failed.',{status:401,headers:{'Set-Cookie':clearOauth}});
  const sessionId=crypto.randomUUID();const expires=new Date(Date.now()+7*24*60*60*1000).toISOString();
  let role='CUSTOMER';
  if(profile.email){const staff=await env.DB.prepare("SELECT staff_id FROM staff_users WHERE lower(email)=lower(?) AND status='ACTIVE'").bind(profile.email).first();if(staff)role='STAFF';}
  await env.DB.prepare('INSERT INTO sessions(session_id,provider,provider_user_id,display_name,email,role,expires_at) VALUES(?,?,?,?,?,?,?)').bind(sessionId,'LINE',profile.sub,profile.name||'',profile.email||null,role,expires).run();
  const sessionCookie=`dc_session=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7*24*60*60}`;
  const headers=new Headers({Location:new URL(role==='STAFF'?'/admin':'/connect',env.APP_BASE_URL).toString()});
  headers.append('Set-Cookie',clearOauth);headers.append('Set-Cookie',sessionCookie);
  return new Response(null,{status:302,headers});
};
