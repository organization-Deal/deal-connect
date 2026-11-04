export const onRequestPost = async ({request,env}:any) => {
 const id=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)dc_session=([^;]+)/)?.[1];
 if(id&&env.DB)await env.DB.prepare('DELETE FROM sessions WHERE session_id=?').bind(decodeURIComponent(id)).run();
 return Response.json({ok:true},{headers:{'Set-Cookie':'dc_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'}});
};
